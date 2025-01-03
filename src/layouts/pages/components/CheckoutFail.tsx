import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const CheckoutFail = () => {
	return (
		<div className='container bg-light my-3 rounded-3 p-3'>
			<div className='d-flex align-items-center justify-content-center flex-column p-5'>
				<img
					src='https://cdn0.iconfinder.com/data/icons/shift-free/32/Error-512.png'
					alt='fail'
					width={150}
				/>
				<h2 className='my-3 text-danger'>
				Your order processing failed
				</h2>
				<Link to={"/"}>
					<Button variant='contained' className='my-3'>
					Continue shopping
					</Button>
				</Link>
			</div>
		</div>
	);
};
