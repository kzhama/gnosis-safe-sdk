import React, { useContext, useEffect, useState } from "react";
import { Button, Divider, Input, List, message, Modal, PageHeader } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Context, { OwnerList } from "../context/ContextProvider";
import { useSafeSdk } from "../hooks/useSafeSdk";

const Dashboard = () => {
	const {
		ownersList,
		threshold,
		setOwnersList,
		safeData: { safe_address },
	} = useContext(Context);

	const { changeThreshold } = useSafeSdk();

	const [isModalVisible, setIsModalVisible] = useState(false);

	const [editName, setEditName] = useState("");
	const [editAddress, setEditAddress] = useState("");

	const onCancel = () => {
		setIsModalVisible(false);
	};

	const onConfirm = () => {
		const getResult = localStorage.getItem("safe_names_and_addresses");
		if (!getResult) return message.error("Couldn't find data in local storage");
		const ownersListFromLocalStorage: OwnerList = JSON.parse(getResult);
		const newOwnersList = ownersListFromLocalStorage.map((owner) => {
			if (owner.address === editAddress) return { ...owner, name: editName };
			return owner;
		});

		setOwnersList(newOwnersList);
		localStorage.setItem("safe_names_and_addresses", JSON.stringify(newOwnersList));
		message.success("Owner name edited successfully ! 😎");
		setIsModalVisible(false);
	};

	const editOwnerName = (name: string, address: string) => {
		setIsModalVisible(true);
		setEditName(name);
		setEditAddress(address);
	};

	const handleRemoveOwner = (address: string) => {};

	useEffect(() => {
		if (!ownersList.length) {
			const getOwnerListFromLocalStorage = localStorage.getItem("safe_names_and_addresses");
			if (getOwnerListFromLocalStorage) {
				const ownersListFromLocalStorage: OwnerList = JSON.parse(getOwnerListFromLocalStorage);
				if (ownersListFromLocalStorage.length) setOwnersList(ownersListFromLocalStorage);
			}
		}
	}, [ownersList]);

	return (
		<div className="dashboard-container">
			<Modal title="Edit Owner name" visible={isModalVisible} onOk={onConfirm} onCancel={onCancel}>
				<p>Owner names are only stored locally and never shared with Gnosis or any third parties</p>
				<Input value={editName} onChange={(e) => setEditName(e.currentTarget.value)} />
			</Modal>
			<PageHeader className="site-page-header" title="Safe contract address" subTitle={safe_address} />
			<Divider orientation="left">Safe Owners</Divider>
			<p>
				Add, remove owners or rename existing owners. Owner names are only stored locally and never shared with
				Gnosis or any third parties.
			</p>
			<List
				itemLayout="horizontal"
				dataSource={ownersList}
				renderItem={({ name, address }) => (
					<List.Item
						actions={[
							<DeleteOutlined style={{ cursor: "pointer" }} onClick={() => handleRemoveOwner(address)} />,
						]}
					>
						<List.Item.Meta
							title={
								<>
									{name || "unknown"}
									<EditOutlined
										style={{ cursor: "pointer", marginLeft: "20px" }}
										onClick={() => editOwnerName(name || "uknown", address)}
									/>
								</>
							}
							description={address}
						/>
					</List.Item>
				)}
			/>
			<br />
			<Button type="dashed" onClick={() => null}>
				+ Add Owner
			</Button>
			<br />
			<br />
			<p>
				Any transaction requires the confirmation of: {threshold} out of {ownersList.length} owners
			</p>
			<Button onClick={() => changeThreshold(2)}>Change Threshold</Button>
		</div>
	);
};

export default Dashboard;
