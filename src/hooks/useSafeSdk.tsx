import { useContext, useState } from "react";
import { ethers } from "ethers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe, { SafeFactory } from "@gnosis.pm/safe-core-sdk";
import { message } from "antd";

import Context from "../context/ContextProvider";
import { useWallet } from "./useWallet";
import SafeServiceClient from "@gnosis.pm/safe-service-client";

const RINKEBY_MULTI_SEND_ADDRESS = process.env.REACT_APP_RINKEBY_MULTI_SEND_ADDRESS;
const RINKEBY_GNOSIS_SAFE_ADDRESS = process.env.REACT_APP_RINKEBY_GNOSIS_SAFE_ADDRESS;
const RINKEBY_GNOSIS_SAFE_PROXY_FACTORY_ADDRESS = process.env.REACT_APP_RINKEBY_GNOSIS_SAFE_PROXY_FACTORY_ADDRESS;

const contracts = {
	multiSendAddress: RINKEBY_MULTI_SEND_ADDRESS as string,
	safeMasterCopyAddress: RINKEBY_GNOSIS_SAFE_ADDRESS as string,
	safeProxyFactoryAddress: RINKEBY_GNOSIS_SAFE_PROXY_FACTORY_ADDRESS as string,
};

export const useSafeSdk = () => {
	const { setSafeData, threshold, ownersList, safeData } = useContext(Context);
	const { currentAccountAddress, signer } = useWallet();

	const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const ownersAddressesList = ownersList.map((owner) => owner.address);

	const getEthAdapterAndContractNetworks = async () => {
		try {
			if (signer) {
				const ethAdapter = new EthersAdapter({ ethers, signer });
				const id = await ethAdapter.getChainId();

				const contractNetworks = {
					[id]: contracts,
				};

				return {
					ethAdapter,
					contractNetworks,
				};
			} else {
				message.error("No signer");
				throw new Error("No signer");
			}
		} catch (err) {
			throw new Error(err);
		}
	};

	const deployNewSafe = async () => {
		setIsLoading(true);

		try {
			const { ethAdapter, contractNetworks } = await getEthAdapterAndContractNetworks();

			const safeFactory = await SafeFactory.create({ ethAdapter, contractNetworks });
			const safeAccountConfig = { owners: ownersAddressesList, threshold };
			const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });

			const safe_address = safeSdk.getAddress();
			const safe_owners = await safeSdk.getOwners();
			const safe_threshold = await safeSdk.getThreshold();

			setSafeSdk(safeSdk);
			setSafeData({
				safe_address,
				safe_owners,
				safe_threshold,
			});

			localStorage.setItem("safe_owner", currentAccountAddress);
			localStorage.setItem("safe_address", safe_address);
			localStorage.setItem("safe_owners", JSON.stringify(safe_owners));
			localStorage.setItem("safe_threshold", JSON.stringify(safe_threshold));
			localStorage.setItem("safe_names_and_addresses", JSON.stringify(ownersList));
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const connectToExistingSafe = async () => {
		setIsLoading(true);
		try {
			const safe_address = localStorage.getItem("safe_address");
			if (!safe_address) throw new Error("No safe_address in local storage");

			const { ethAdapter, contractNetworks } = await getEthAdapterAndContractNetworks();

			const safeSdk = await Safe.create({ ethAdapter, safeAddress: safe_address, contractNetworks });

			const safe_owners = await safeSdk.getOwners();
			const safe_threshold = await safeSdk.getThreshold();

			setSafeSdk(safeSdk);
			setSafeData({
				safe_address,
				safe_owners,
				safe_threshold,
			});

			localStorage.setItem("safe_address", safe_address);
			localStorage.setItem("safe_owners", JSON.stringify(safe_owners));
			localStorage.setItem("safe_threshold", JSON.stringify(safe_threshold));

			return safeSdk;
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const changeThreshold = async (newThreshold: number) => {
		if (newThreshold < 1 || newThreshold > ownersList.length) {
			message.warning("Threshold needs to be greater than 0 and cannot exceed owner count");
			return;
		}
		setIsLoading(true);
		try {
			const safeSdk = await connectToExistingSafe();
			if (!safeSdk) throw new Error("no safeSdk");
			const safeTransaction = await safeSdk.getChangeThresholdTx(newThreshold);
			const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
			const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
			const { ethereum } = window as any;
			const provider = new ethers.providers.Web3Provider(ethereum);
			const signer = provider.getSigner();
			const ethAdapter = new EthersAdapter({ ethers, signer });
			const safeService = new SafeServiceClient({
				txServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
				ethAdapter,
			});
			await safeService.proposeTransaction({
				safeAddress: safeData.safe_address,
				safeTransactionData: safeTransaction.data,
				safeTxHash: safeTxHash,
				senderAddress: currentAccountAddress,
				senderSignature: senderSignature.data,
			});
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		deployNewSafe,
		connectToExistingSafe,
		isLoading,
		safeSdk,
		setSafeSdk,
		changeThreshold,
	};
};
