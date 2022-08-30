import { useCallback, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import Context from "../context/ContextProvider";

export const useWallet = () => {
	const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
	const [currentAccountAddress, setCurrentAccountAddress] = useState("");
	const [balanceInEthers, setBalanceInEthers] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const { setIsWalletConnected } = useContext(Context);

	const resetStates = () => {
		setBalanceInEthers("");
		setCurrentAccountAddress("");
	};

	const checkIfWalletIsConnected = useCallback(async () => {
		try {
			const { ethereum } = window as any;

			if (!ethereum) {
				resetStates();
				return;
			}

			const provider = new ethers.providers.Web3Provider(ethereum);
			const getSignerResult = provider.getSigner();
			setSigner(getSignerResult);

			const accounts = await ethereum.request({ method: "eth_accounts" });

			if (accounts.length !== 0) {
				const account = accounts[0];
				setCurrentAccountAddress(account);
			} else {
				resetStates();
			}
		} catch (err) {
			resetStates();
			setIsLoading(false);
			console.error(err);
		}
	}, []);

	const connectWallet = async () => {
		try {
			setIsLoading(true);

			const { ethereum } = window as any;
			if (!ethereum) {
				alert("Get MetaMask :)!");
				return;
			}

			const provider = new ethers.providers.Web3Provider(ethereum);
			const getSignerResult = provider.getSigner();
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});

			setCurrentAccountAddress(accounts[0]);
			setSigner(getSignerResult);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		checkIfWalletIsConnected();
	}, [checkIfWalletIsConnected]);

	useEffect(() => {
		if (!!currentAccountAddress) {
			setIsWalletConnected(true);
		} else {
			setIsWalletConnected(false);
		}
	}, [currentAccountAddress]);

	return {
		connectWallet,
		currentAccountAddress,
		balanceInEthers,
		isLoading,
		signer,
	};
};
