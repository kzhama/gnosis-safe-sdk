import React, { useContext, useEffect, useState } from "react";
import { Typography, Space, Divider } from "antd";

import Context from "../context/ContextProvider";
import { useWallet } from "../hooks/useWallet";
import { useSafeSdk } from "../hooks/useSafeSdk";

import OwnersListCard from "../components/Cards/OwnersListCard";
import ReviewDetailsModal from "../components/Modals/ReviewDetailsModal";
import DeploySuccesModal from "../components/Modals/DeploySuccesModal";
import NewSafeCard from "../components/Cards/NewSafeCard";
import ConnectWalletCard from "../components/Cards/ConnectWalletCard";

const { Title } = Typography;

const Start = () => {
	const { threshold, ownersList, setOwnersList, safeData, isWalletConnected, setIsNewSafe } = useContext(Context);
	const { connectWallet, isLoading: isWalletLoading, currentAccountAddress } = useWallet();
	const { deployNewSafe, isLoading: isSdkLoading, safeSdk } = useSafeSdk();

	const [isStepsUI, setIsStepsUI] = useState(false);

	const [isReviewDetailsModalVisible, setIsReviewDetailsModalVisible] = useState(false);
	const [isDeploySuccesModalVisible, setIsDeploySuccesModalVisible] = useState(false);

	const handleCancelDeploymentClick = () => {
		setIsReviewDetailsModalVisible(false);
	};

	const onConfirm = () => {
		setIsNewSafe(true);
		const newOwnersList = ownersList.filter((owner) => !!owner.address);
		if (newOwnersList.length !== ownersList.length) setOwnersList([...newOwnersList]);
		setIsReviewDetailsModalVisible(true);
	};

	useEffect(() => {
		if (safeSdk) {
			setIsReviewDetailsModalVisible(false);
			setIsDeploySuccesModalVisible(true);
		}
	}, [safeSdk]);

	return (
		<>
			<DeploySuccesModal
				{...{ isDeploySuccesModalVisible, setIsDeploySuccesModalVisible, safeAddress: safeData.safe_address }}
			/>
			<ReviewDetailsModal
				{...{
					isReviewDetailsModalVisible,
					deployNewSafe,
					isSdkLoading,
					handleCancelDeploymentClick,
					ownersList,
					threshold,
				}}
			/>
			<Divider />
			<Title level={5} className="sub-title">
				Gnosis Safe is the most trusted platform to manage digital assets. Here is how to get started:
			</Title>
			<Space size={"large"} direction="vertical">
				{!isStepsUI ? (
					<NewSafeCard setIsStepsUI={setIsStepsUI} />
				) : (
					<ConnectWalletCard
						{...{ connectWallet, isWalletConnected, walletLoading: isWalletLoading, setIsStepsUI }}
					/>
				)}
				{isStepsUI && isWalletConnected && (
					<OwnersListCard ownerAddress={currentAccountAddress} onConfirm={onConfirm} />
				)}
			</Space>
		</>
	);
};

export default Start;
