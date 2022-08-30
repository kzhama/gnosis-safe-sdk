import React, { FC } from "react";
import { Divider, List, Modal } from "antd";
import { Owner } from "../../context/ContextProvider";

interface ReviewDetailsModalProps {
	isReviewDetailsModalVisible: boolean;
	deployNewSafe: () => Promise<void>;
	isSdkLoading: boolean;
	handleCancelDeploymentClick: () => void;
	ownersList: Owner[];
	threshold: number;
}

const ReviewDetailsModal: FC<ReviewDetailsModalProps> = ({
	isReviewDetailsModalVisible,
	deployNewSafe,
	isSdkLoading,
	handleCancelDeploymentClick,
	ownersList,
	threshold,
}) => {
	return (
		<Modal
			title="Review Details"
			visible={isReviewDetailsModalVisible}
			onOk={deployNewSafe}
			okText={"Deploy"}
			confirmLoading={isSdkLoading}
			onCancel={handleCancelDeploymentClick}
		>
			<p>
				You're about to create a new Safe on Ethereum and will have to confirm a transaction with your currently
				connected wallet.{" "}
			</p>
			<Divider orientation="left">Safe Owners</Divider>
			<List
				size="small"
				bordered={false}
				dataSource={ownersList}
				renderItem={(item) => <List.Item>{item.address}</List.Item>}
			/>
			<Divider />
			<p>
				Any transaction requires the confirmation of: {threshold} out of {ownersList.length} owners
			</p>
		</Modal>
	);
};

export default ReviewDetailsModal;
