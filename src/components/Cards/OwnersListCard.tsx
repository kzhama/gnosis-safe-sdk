import React, { useContext, FC, useEffect } from "react";
import { Button, Card, Col, Input, InputNumber, Row, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Context from "../../context/ContextProvider";

interface OwnersListCardProps {
	ownerAddress: string;
	onConfirm: () => void;
}

const OwnersListCard: FC<OwnersListCardProps> = ({ ownerAddress, onConfirm }) => {
	const { threshold, setThreshold, ownersList, setOwnersList } = useContext(Context);

	const handleOnChange = ({ event, index }: { event: React.FormEvent<HTMLInputElement>; index: number }) => {
		const { name, value } = event.currentTarget;

		const newOwnersList = [...ownersList];
		newOwnersList[index] = { ...ownersList[index], [name]: value };
		setOwnersList([...newOwnersList]);
	};

	const addEmptyOwnerDataRow = () => {
		const newOwnersList = [...ownersList];
		newOwnersList.push({ name: "", address: "" });

		setOwnersList([...newOwnersList]);
	};

	const removeOwnerDataRow = (index: number) => {
		const newOwnersList = [...ownersList];
		newOwnersList.splice(index, 1);

		setOwnersList([...newOwnersList]);
	};

	useEffect(() => {
		if (!!ownerAddress) {
			const newOwnersList = [...ownersList];
			newOwnersList[0] = { ...ownersList[0], address: ownerAddress };
			setOwnersList([...newOwnersList]);
		}
	}, []);

	useEffect(() => {
		if (threshold > ownersList.length) setThreshold(ownersList.length);
	}, [ownersList.length]);

	return (
		<Card style={{ width: 600, borderRadius: "10px" }}>
			<p>
				Your Safe will have one or more owners. We have prefilled the first owner with your connected wallet
				details, but you are free to change this to a different owner. Add additional owners (e.g. wallets of
				your teammates) and specify how many of them have to confirm a transaction before it gets executed. In
				general, the more confirmations required, the more secure your Safe is.
			</p>
			<Input.Group>
				{ownersList.map((owner, index) => {
					return (
						<Row gutter={10} key={index} align="middle" style={{ marginBottom: "10px" }}>
							<Col span={6}>
								<Input
									placeholder="Owner Name"
									name={"name"}
									onChange={(event) => handleOnChange({ event, index })}
									value={owner.name}
								/>
							</Col>
							<Col span={16}>
								<Input
									placeholder="Owner Address"
									name={"address"}
									onChange={(event) => handleOnChange({ event, index })}
									value={owner.address}
								/>
							</Col>
							{index !== 0 && (
								<Col span={1}>
									<Tooltip title="Remove Owner">
										<DeleteOutlined
											onClick={() => removeOwnerDataRow(index)}
											style={{ cursor: "pointer" }}
										/>
									</Tooltip>
								</Col>
							)}
						</Row>
					);
				})}
			</Input.Group>

			<br />
			<Row justify="end">
				<Button type="dashed" onClick={addEmptyOwnerDataRow}>
					+ Add Owner
				</Button>
			</Row>
			<p>Any transaction requires the confirmation of:</p>
			<InputNumber
				addonAfter={`out of ${ownersList.length} owner(s)`}
				min={1}
				max={ownersList.length}
				defaultValue={1}
				onChange={(value: number) => setThreshold(value)}
				value={threshold}
			/>
			<br />
			<br />
			<Button onClick={onConfirm}>Confirm</Button>
		</Card>
	);
};

export default OwnersListCard;
