import { Button, TextField } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

export const ForgotPassword: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigation("/");
		}
	});

	const [email, setEmail] = useState("");
	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		toast.promise(
			fetch(endpointBE + "/user/forgot-password", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			})
				.then((response) => {
					if (response.ok) {
						toast.success(
							"Sent successfully, please check your email to get the password"
						);
						setEmail("");
						navigation("/login");
					} else {
						toast.warning("Email does not exist!");
					}
				})
				.catch((error) => {
					toast.error("Sending failed");
					console.log(error);
				}),
			{ pending: "In process..." }
		);
	}

	return (
		<div
			className='container my-5 py-4 rounded-5 shadow-5 bg-light'
			style={{ width: "450px" }}
		>
			<h1 className='text-center'>FORGOT PASSWORD</h1>
			<form
				onSubmit={handleSubmit}
				className='form'
				style={{ padding: "0 20px" }}
			>
				<TextField
					fullWidth
					required={true}
					id='outlined-required'
					label='Email'
					placeholder='Enter email'
					value={email}
					onChange={(e: any) => setEmail(e.target.value)}
					className='input-field'
				/>
				<div className='text-center my-3'>
					<Button
						fullWidth
						variant='outlined'
						type='submit'
						sx={{ padding: "10px" }}
					>
						Recover password
					</Button>
				</div>
			</form>
		</div>
	);
};
