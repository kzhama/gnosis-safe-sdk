import React, { FC } from "react";
import { Button, Card, Space } from "antd";

import "../../styles/ConnectWalletCard.css";

interface ConnectWalletCardProps {
	setIsStepsUI: (bool: boolean) => void;
	connectWallet: () => void;
	walletLoading: boolean;
	isWalletConnected: boolean;
}

const ConnectWalletCard: FC<ConnectWalletCardProps> = ({
	connectWallet,
	isWalletConnected,
	walletLoading,
	setIsStepsUI,
}) => {
	return (
		<Card className="connect-wallet-card">
			<p>In order to create your Safe, you need to connect a wallet</p>
			<Space size={"large"}>
				<Button onClick={() => setIsStepsUI(false)}>Cancel</Button>
				<Button onClick={connectWallet} loading={walletLoading} disabled={isWalletConnected}>
					{isWalletConnected ? "Wallet Connected" : "Connect Wallet"}
				</Button>
			</Space>
		</Card>
	);
};

export default ConnectWalletCard;
