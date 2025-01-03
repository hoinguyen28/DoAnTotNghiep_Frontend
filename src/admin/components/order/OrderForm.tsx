import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import OrderModel from "../../../model/OrderModel";
import { endpointBE } from "../../../layouts/utils/Constant";
import { get1Orders } from "../../../api/OrderApi";
import { toast } from "react-toastify";
import { OrderDetail } from "../../../layouts/products/components/order-detail/OrderDetail";

interface OrderFormProps {
	id: any;
	option?: string;
	setKeyCountReload?: any;
	handleCloseModal?: any;
}

export const OrderForm: React.FC<OrderFormProps> = (props) => {
	const [order, setOrder] = useState<OrderModel>({
		idOrder: 0,
		deliveryAddress: "",
		totalPrice: 0,
		totalPriceProduct: 0,
		feeDelivery: 0,
		feePayment: 0,
		dateCreated: new Date(),
		status: "",
		note: "",
		payment: "",
	});

	// Step
	const [steps, setSteps] = useState<String[]>([]);
	const [activeStep, setActiveStep] = useState(0);

	// Lấy 1 đơn hàng khi cập nhật
	useEffect(() => {
		get1Orders(props.id)
			.then((response) => {
				setOrder(response);
				if (response.status === "Canceled") {
					setSteps(["Processing", "Canceled"]);
					setActiveStep(["Processing", "Canceled"].indexOf(response.status));
				} else {
					setSteps(["Processing", "Delivering", "Success"]);
					setActiveStep(
						["Processing", "Delivering", "Success"].indexOf(
							response.status
						)
					);
				}
			})
			.catch((error) => console.log(error));
	}, [props.option, props.id]);

	function hanleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const token = localStorage.getItem("token");

		fetch(endpointBE + "/order/update-order", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(order),
		})
			.then((response) => {
				if (response.ok) {
					props.setKeyCountReload(Math.random());
					toast.success("Order updated successfully");
					props.handleCloseModal();
				} else {
					toast.error("Error while updating orders");
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error("Error while updating orders");
			});
	}

	const handleCancleOrder = () => {
		const token = localStorage.getItem("token");

		fetch(endpointBE + "/order/update-order", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...order, status: "Canceled" }),
		})
			.then((response) => {
				if (response.ok) {
					props.setKeyCountReload(Math.random());
					toast.success("Order canceled successfully");
					props.handleCloseModal();
				} else {
					toast.error("Error while canceling order");
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error("Error while canceling order");
			});
	};

	return (
		<div>
			<Typography className='text-center' variant='h4' component='h2'>
				{props.option === "update"
					? "UPDATE ORDER"
					: "ORDER DETAILS"}
			</Typography>
			<hr />
			<div className='container px-5'>
				<form onSubmit={hanleSubmit} className='form'>
					<input type='hidden' value={order.idOrder} hidden />
					{props.option === "update" ? (
						<FormControl sx={{ m: 1 }} size='small' fullWidth>
							<InputLabel id='demo-simple-select-helper-label'>
							Order status
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={order.status}
								label='Order status'
								autoWidth
								onChange={(e) =>
									setOrder({ ...order, status: e.target.value })
								}
							>
								<MenuItem value='Processing'>Processing</MenuItem>
								<MenuItem value='Delivering'>
								Delivering
								</MenuItem>
								<MenuItem value='Success'>Success</MenuItem>
								<MenuItem value='Canceled'>Cancel</MenuItem>
							</Select>
						</FormControl>
					) : (
						<>
							{props.option === "view-customer" &&
								order.status === "Processing" && (
									<>
										<Button
											className='me-3'
											variant='contained'
											color='error'
											onClick={() => handleCancleOrder()}
										>
											cancel orders
										</Button>
									</>
								)}
							<OrderDetail
								order={order}
								steps={steps}
								activeStep={activeStep}
								handleCloseModal={props.handleCloseModal}
								type={props.option}
							/>
						</>
					)}
					{props.option !== "view-customer" && props.option !== "view" && (
						<button className='btn btn-primary w-100 my-3' type='submit'>
							Update orders
						</button>
					)}
				</form>
			</div>
		</div>
	);
};
