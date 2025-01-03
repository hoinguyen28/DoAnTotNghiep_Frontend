import React from "react";
import OrderModel from "../../../../model/OrderModel";
import { Chip } from "@mui/material";
import { StepperComponent } from "../../../utils/StepperComponent";
import { ArtHorizontal } from "../ArtHorizontalProps";
import { format } from "date-fns";

interface OrderDetailProps {
	order: OrderModel;
	activeStep: number;
	steps: String[];
	handleCloseModal: any;
	type?: string;
}

export const OrderDetail: React.FC<OrderDetailProps> = (props) => {
	return (
		<>
			<Chip
				label={props.order.status}
				sx={{ width: "auto-fit" }}
				color={
					props.order.status === "Success"
						? "success"
						: props.order.status === "Processing"
						? "info"
						: props.order.status === "Delivering"
						? "warning"
						: "error"
				}
				variant='outlined'
			/>
			<div className='row'>
				<div className='col-lg-3 col-md-6 col-sm-12'>
					<p className='mt-2'>
					Order code:{" "}
						<strong className='ms-2'>{props.order.idOrder}</strong>
					</p>
					<p>
					Date of purchase:
						<strong className='ms-2'>
							{format(new Date(props.order.dateCreated), "dd/MM/yyyy")}
						</strong>
					</p>
					<p>
					Total amount:
						<strong className='ms-2'>
							{props.order.totalPrice.toLocaleString("vi-vn")} $
						</strong>
					</p>
					<p>
					Payment method:
						<strong className='ms-2'>{props.order.payment}</strong>
					</p>
				</div>
				<div className='col-lg-4 col-md-6 col-sm-12'>
					<p>
					Full name:
						<strong className='ms-2'>{props.order.fullName}</strong>
					</p>
					<p>
					Delivery address:
						<strong className='ms-2'>
							{props.order.deliveryAddress}
						</strong>
					</p>
					<p>
					Phone number:
						<strong className='ms-2'>{props.order.phoneNumber}</strong>
					</p>
					<p>
					Fee Delivery
						<strong className='ms-2'>{props.order.feeDelivery}</strong>
					</p>
				</div>
				<div className='col'>
					<StepperComponent
						steps={props.steps}
						activeStep={props.activeStep}
					/>
				</div>
			</div>
			<hr className='mt-3' />
			<p>
				<strong className='text-warning'>Note:</strong>
				<span className='ms-2'>{props.order.note}</span>
			</p>
			<hr className='mt-3' />
			{props.order.cartItems?.map((cartItem, index) => (
				<ArtHorizontal
					cartItem={cartItem}
					key={index}
					type={props.type}
					idOrder={props.order.idOrder}
					handleCloseModalOrderDetail={props.handleCloseModal}
					statusOrder={props.order.status}
				/>
			))}
		</>
	);
};
