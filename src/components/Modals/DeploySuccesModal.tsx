import React, { FC, useContext } from "react";
import { Modal, Result } from "antd";
import Context from "../../context/ContextProvider";

const RINKEBY_ETHERSCAN_URL = "https://rinkeby.etherscan.io/address/";

interface DeploySuccesModalProps {
	isDeploySuccesModalVisible: boolean;
	setIsDeploySuccesModalVisible: (bool: boolean) => void;
	safeAddress: string;
}

const DeploySuccesModal: FC<DeploySuccesModalProps> = ({
	isDeploySuccesModalVisible,
	setIsDeploySuccesModalVisible,
	safeAddress,
}) => {
	const { setIsNewSafe } = useContext(Context);

	const onOkClick = () => {
		setIsNewSafe(false);
		setIsDeploySuccesModalVisible(false);
	};

	return (
		<Modal
			visible={isDeploySuccesModalVisible}
			onOk={onOkClick}
			okText={"Go To Dashboard"}
			cancelButtonProps={{ style: { display: "none" } }}
			closable={false}
		>
			<Result
				status={"success"}
				title="Your Safe was created successfully!"
				subTitle={
					<span>
						Contract Address:{" "}
						<a target="_blank" rel="noreferrer noopener" href={`${RINKEBY_ETHERSCAN_URL}${safeAddress}`}>
							{safeAddress}
						</a>
					</span>
				}
			/>
		</Modal>
	);
};

export default DeploySuccesModal;
