import React, { useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Spin, Typography } from "antd";
import { useWallet } from "./hooks/useWallet";
import { useSafeSdk } from "./hooks/useSafeSdk";
import Context from "./context/ContextProvider";

import Start from "./pages/Start";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const { Title } = Typography;

function App() {
	const navigate = useNavigate();
	const location = useLocation();

	const { isLoading: isWalletLoading } = useWallet();
	const { safeData, isWalletConnected, isNewSafe } = useContext(Context);
	const { connectToExistingSafe, safeSdk, isLoading: isSdkLoading } = useSafeSdk();

	useEffect(() => {
		if (isWalletConnected && localStorage.getItem("safe_address") && !safeSdk) connectToExistingSafe();
		if (isWalletConnected && safeData.safe_address && !isNewSafe) navigate(`/dashboard/${safeData.safe_address}`);
	}, [isWalletConnected, safeSdk, safeData, isNewSafe]);

	useEffect(() => {
		if ((!isWalletConnected || !localStorage.getItem("safe_address")) && location.pathname !== "/") navigate(`/`);
	}, [location.pathname, isWalletConnected]);

	return (
		<div className="App">
			<Spin tip="Loading..." spinning={isWalletLoading || isSdkLoading} size="large">
				<Title className="main-title">Welcome to Gnosis Safe.</Title>
				<Routes>
					<Route path="/" element={<Start />} />
					<Route path="/dashboard/:address" element={<Dashboard />} />
				</Routes>
			</Spin>
		</div>
	);
}

export default App;
