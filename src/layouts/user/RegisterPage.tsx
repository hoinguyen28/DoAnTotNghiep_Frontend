import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Form.css";
import { Link, useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	checkExistEmail,
	checkExistUsername,
	checkPassword,
	checkPhoneNumber,
	checkRepeatPassword,
} from "../utils/Validation";
import { toast } from "react-toastify";
import { endpointBE } from "../utils/Constant";
import { useAuth } from "../utils/AuthContext";
import useScrollToTop from "../../hooks/ScrollToTop";

const RegisterPage: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useEffect(() => {
		if (isLoggedIn) {
			navigation("/");
		}
	});
	// Khai báo biến cần đăng ký
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");

	// Khai báo các biến lỗi
	const [errorUsername, setErrorUsername] = useState("");
	const [errorEmail, setErrorEmail] = useState("");
	const [errorPassword, setErrorPassword] = useState("");
	const [errorRepeatPassword, setErrorRepeatPassword] = useState("");
	const [errorPhoneNumber, setErrorPhoneNumber] = useState("");

	// Khai báo biến thông báo

	// Khi submit thì btn loading ...
	const [statusBtn, setStatusBtn] = useState(false);

	// hàm submit form
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setStatusBtn(true);

		setErrorUsername("");
		setErrorEmail("");
		setErrorPassword("");
		setErrorRepeatPassword("");

		const isUsernameValid = !(await checkExistUsername(
			setErrorUsername,
			username
		));
		const isEmailValid = !(await checkExistEmail(setErrorEmail, email));
		const isPassword = !checkPassword(setErrorPassword, password);
		const isRepeatPassword = !checkRepeatPassword(
			setErrorRepeatPassword,
			repeatPassword,
			password
		);
		const isPhoneNumberValid = !checkPhoneNumber(
			setErrorPhoneNumber,
			phoneNumber
		);

		if (
			isUsernameValid &&
			isEmailValid &&
			isPassword &&
			isRepeatPassword &&
			isPhoneNumberValid
		) {
			try {
				const endpoint = endpointBE + "/user/register";

				const response = await toast.promise(
					fetch(endpoint, {
						method: "POST",
						headers: {
							"Content-type": "application/json",
						},
						body: JSON.stringify({
							username,
							password,
							email,
							firstName,
							lastName,
							phoneNumber,
							gender: "M",
						}),
					}),
					{ pending: "In process..." }
				);

				if (response.ok) {
					toast.success("Account registration successful.");
					toast.info("Please check your email to activate your account");
					navigation("/login");
					setStatusBtn(false);
					return true;
				} else {
					toast.error("Account registration failed");
					setStatusBtn(false);
					return false;
				}
			} catch (error) {
				console.log(error);
				setStatusBtn(false);
				toast.error("Account registration failed");
			}
		} else {
			setStatusBtn(false);
		}
	};

	const handleUsernameChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setUserName(e.target.value);
		setErrorUsername("");
	};

	const handleEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		setErrorEmail("");
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		setErrorPassword("");
	};

	const handleRepeatPasswordChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setRepeatPassword(e.target.value);
		setErrorRepeatPassword("");
	};

	const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(e.target.value);
		setErrorPhoneNumber("");
	};

	return (
		<div className='container my-5 py-4 rounded-5 shadow-5 bg-light w-50'>
			<h1 className='text-center'>Register</h1>

			<form onSubmit={handleSubmit} className='form'>
				<div className='row px-2'>
					<div className='col-lg-6 col-md-12 col-12'>
						<TextField
							fullWidth
							error={errorUsername.length > 0 ? true : false}
							helperText={errorUsername}
							required={true}
							label='Login name'
							placeholder='Enter your login name'
							value={username}
							onChange={handleUsernameChange}
							onBlur={(e: any) => {
								checkExistUsername(setErrorUsername, e.target.value);
							}}
							className='input-field'
						/>

						<TextField
							error={errorPassword.length > 0 ? true : false}
							helperText={errorPassword}
							required={true}
							fullWidth
							type='password'
							label='Password'
							placeholder='Enter password'
							value={password}
							onChange={handlePasswordChange}
							onBlur={(e: any) => {
								checkPassword(setErrorPassword, e.target.value);
							}}
							className='input-field'
						/>

						<TextField
							error={errorRepeatPassword.length > 0 ? true : false}
							helperText={errorRepeatPassword}
							required={true}
							fullWidth
							type='password'
							label='Confirm password'
							placeholder='Confirm password'
							value={repeatPassword}
							onChange={handleRepeatPasswordChange}
							onBlur={(e: any) => {
								checkRepeatPassword(
									setErrorRepeatPassword,
									e.target.value,
									password
								);
							}}
							className='input-field'
						/>
					</div>
					<div className='col-lg-6 col-md-12 col-12'>
						<TextField
							fullWidth
							helperText={""}
							required={true}
							label='They buffer'
							placeholder='Enter the buffer'
							value={firstName}
							onChange={(e: any) => {
								setFirstName(e.target.value);
							}}
							className='input-field'
						/>
						<TextField
							fullWidth
							helperText={""}
							required={true}
							label='Name'
							placeholder='Enter Name'
							value={lastName}
							onChange={(e: any) => {
								setLastName(e.target.value);
							}}
							className='input-field'
						/>
						<TextField
							fullWidth
							error={errorPhoneNumber.length > 0 ? true : false}
							helperText={errorPhoneNumber}
							required={true}
							label='Phone number'
							placeholder='Enter phone number'
							value={phoneNumber}
							onChange={handlePhoneNumberChange}
							onBlur={(e: any) => {
								checkPhoneNumber(setErrorPhoneNumber, e.target.value);
							}}
							className='input-field'
						/>
					</div>
					<div>
						<TextField
							fullWidth
							error={errorEmail.length > 0 ? true : false}
							helperText={errorEmail}
							required={true}
							label='Email'
							placeholder='Enter email'
							type='email'
							value={email}
							onChange={handleEmailChange}
							onBlur={(e: any) => {
								checkExistEmail(setErrorEmail, e.target.value);
							}}
							className='input-field'
						/>
					</div>
				</div>
				<div className='d-flex justify-content-end mt-2 px-3'>
					<span>
					Do you have an account? <Link to={"/login"}>LogIn</Link>
					</span>
				</div>
				<div className='text-center my-3'>
					<LoadingButton
						type='submit'
						loading={statusBtn}
						variant='outlined'
						sx={{ width: "25%", padding: "10px" }}
					>
						
Register
					</LoadingButton>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
