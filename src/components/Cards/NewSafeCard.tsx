import React from "react";
import { Button, Card } from "antd";

import "../../styles/NewSafeCard.css";

const NewSafeCard = ({ setIsStepsUI }: { setIsStepsUI: (bool: boolean) => void }) => {
	return (
		<Card title="Create Safe" className="new-safe-card">
			<p>
				Create a new Safe that is controlled by one or multiple owners. You will be required to pay a network
				fee for creating your new Safe.
			</p>
			<Button onClick={() => setIsStepsUI(true)}>+ Create new Safe</Button>
		</Card>
	);
};

export default NewSafeCard;
