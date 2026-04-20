import axios from "axios";

export interface WaitListData {
	fullName: string;
	phoneNumber: string;
	email: string;
	userType: string;
}

export default function waitList(data: WaitListData) {
	const requestPayload = {
		fullName: data.fullName,
		phoneNumber: data.phoneNumber,
		email: data.email,
		userType: data.userType,
	};

	return axios.post(
		`${import.meta.env.VITE_BASE_URL}/wait-list`,
		requestPayload,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
}
