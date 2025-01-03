import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const CheckoutSuccess = () => {
	return (
		<div className='container bg-light my-3 rounded-3 p-3'>
			<div className='d-flex align-items-center justify-content-center flex-column p-5'>
				<img
					src='https://cdn0.fahasa.com/skin/frontend/base/default/images/order_status/ico_successV2.svg?q=10311'
					alt='success'
				/>
				<h2 className='my-3 text-success'>
				Your order has been received
				</h2>
				<p className='mb-2'>Thank you for purchasing our products</p>
				<p className='mb-2'>
				You will soon receive an order confirmation email from us
				</p>
				<Link to={"/search"}>
					<Button
					 variant='contained' className='my-3'>
					Continue shopping
					</Button>
				</Link>
			</div>
		</div>
	);
};
