/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { endpointBE } from "../utils/Constant";
import { useAuth } from "../utils/AuthContext";
import useScrollToTop from "../../hooks/ScrollToTop";
import { Button } from "@mui/material";

const ActiveAccount: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigation("/");
		}
	}, []);

	const [enabled, setEnabled] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState("");
	const { email } = useParams();
	const { activationCode } = useParams();

	useEffect(() => {
		if (email && activationCode) {
			handleActiveAccount();
		}
	}, []);

	const handleActiveAccount = async () => {
		try {
			const url =
				endpointBE + `/user/active-account?email=${email}&activationCode=${activationCode}`;
			const response = await fetch(url, { method: "GET" });
	
			if (response.ok) {
				setEnabled(true);
				setLoading(true);
			} else {
				const errorText = await response.text(); // Đọc lỗi từ API
				setNotifications(errorText); // Lưu lỗi vào trạng thái
				setLoading(true);
			}
		} catch (error) {
			console.log("Lỗi kích hoạt: " + error);
			setEnabled(false);
			setLoading(true);
		}
	};
	

	if (isLoading) {
		return (
			<div>
				<div className='container bg-light my-3 rounded-3 p-4'>
					<h1 className='text-center text-black'>ACCOUNT ACTIVATION</h1>
					<div className='d-flex align-items-center justify-content-center flex-column p-5'>
						{enabled ? (
							<>
								<img
									src='https://cdn0.fahasa.com/skin/frontend/base/default/images/order_status/ico_successV2.svg?q=10311'
									alt='success'
								/>
								<h2 className='my-3 text-success'>
								Account activated successfully
								</h2>
								<Link to={"/login"}>
									<Button variant='contained' className='my-3'>
									Login to continue
									</Button>
								</Link>
							</>
						) : (
							<>
								<img
									src='https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png'
									alt='fail'
									width={150}
								/>
								<h2 className='my-3 text-danger'>
								Account activation failed. Error: {notifications}
								</h2>
							</>
						)}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className='container bg-light my-3 rounded-3 p-4'>
					<h1 className='text-center text-black'>ACCOUNT ACTIVATION</h1>
					<div className='d-flex align-items-center justify-content-center flex-column p-5'></div>
				</div>
			</div>
		);
	}
};

export default ActiveAccount;
