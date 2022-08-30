import React, { createContext, ReactNode, useState } from "react";

export type Owner = {
	name: string;
	address: string;
};

export type OwnerList = Owner[];

export type SafeData = {
	safe_address: string;
	safe_owners: string[];
	safe_threshold: number | null;
};

interface ContextType {
	threshold: number;
	setThreshold: (num: number) => void;
	ownersList: OwnerList;
	setOwnersList: (list: OwnerList) => void;
	safeData: SafeData;
	setSafeData: (data: SafeData) => void;
	isWalletConnected: boolean;
	setIsWalletConnected: (bool: boolean) => void;
	isNewSafe: boolean;
	setIsNewSafe: (bool: boolean) => void;
}

const Context = createContext({} as ContextType);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
	const [isNewSafe, setIsNewSafe] = useState(false);
	const [threshold, setThreshold] = useState(1);
	const [ownersList, setOwnersList] = useState<OwnerList>([]);
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const [safeData, setSafeData] = useState<SafeData>({ safe_address: "", safe_owners: [], safe_threshold: null });

	return (
		<Context.Provider
			value={{
				threshold,
				ownersList,
				setThreshold,
				setOwnersList,
				safeData,
				setSafeData,
				isWalletConnected,
				setIsWalletConnected,
				isNewSafe,
				setIsNewSafe,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default Context;
