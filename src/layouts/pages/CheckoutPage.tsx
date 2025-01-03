import {
	Button,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { ArtHorizontal } from "../products/components/ArtHorizontalProps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CartItemModel from "../../model/CartItemModel";
import { getUserbyId } from "../../api/UserApi";
import { getIdUserByToken } from "../utils/JwtService";
import UserModel from "../../model/UserModel";
import { checkPhoneNumber } from "../utils/Validation";
import { toast } from "react-toastify";
import { endpointBE } from "../utils/Constant";
import { CheckoutSuccess } from "./components/CheckoutSuccess";
import { useCartItem } from "../utils/CartItemContext";
import useScrollToTop from "../../hooks/ScrollToTop";
import { getAllDelivery } from '../../api/Delivery'; 
import { getFeeDeliveryById } from '../../api/Delivery'; 
import { clearScreenDown } from "readline";
interface CheckoutPageProps {
	setIsCheckout: any;
	cartList: CartItemModel[];
	totalPriceProduct: number;
	isBuyNow?: boolean;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = (props) => {
	useScrollToTop();

	const { setCartList, setTotalCart } = useCartItem();
	const [isSuccessPayment, setIsSuccessPayment] = useState(false);
	const [payment, setPayment] = React.useState(1); 
	const [fullName, setFullName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [deliveryAddress, setDeliveryAddress] = useState("");
	const [note, setNote] = useState("");
	const [errorPhoneNumber, setErrorPhoneNumber] = useState("");
	const handleChangePayment = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPayment(parseInt((event.target as HTMLInputElement).value));
	};

	const [deliveries, setDeliveries] = useState<any[]>([]); 
	const [idDelivery, setIdDelivery] = useState<number>(1); 
	const [delivery, setDelivery] = useState<number>(10); 
	
  
	useEffect(() => {
	  getAllDelivery()
		.then((data) => {
		  setDeliveries(data); 
		})
		.catch((error) => {
		  console.error('Lỗi khi chọn phương thức giao hàng:', error);
		});
	}, []);
	const handleChangeDelivery = async (event: React.ChangeEvent<HTMLInputElement>) => {
		// Lấy giá trị từ input (idDelivery)
		const value = Number((event.target as HTMLInputElement).value);
	  
		// Cập nhật idDelivery
		setIdDelivery(isNaN(value) ? 0 : value);
		
		try {
		  const fee = await getFeeDeliveryById(value); 
		  setDelivery(fee !== null ? fee : 0); 

		} catch (error) {
		  console.error("Lỗi khi chọn phương thức giao hàng:", error);
		  setDelivery(0); 
		}
	  };
	  
	  
	// Lấy dữ liệu của người dùng lên
	const [user, setUser] = useState<UserModel>();
	useEffect(() => {
		const idUser = getIdUserByToken();
		getUserbyId(idUser)
			.then((response) => {
				setUser(response);
				setFullName(response.firstName + " " + response.lastName);
				setPhoneNumber(response.phoneNumber);
				setDeliveryAddress(response.deliveryAddress);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const token = localStorage.getItem("token");
		const artsRequest: any[] = [];
		props.cartList.forEach((cartItem) => {
			artsRequest.push({
				art: cartItem.art,
				quantity: cartItem.quantity,
			});
		});

		const request = {
			idUser: getIdUserByToken(),
			idPayment: payment,
			idDelivery: idDelivery,
			totalPrice: props.totalPriceProduct + delivery,
			feeDelivery: delivery,
			fullName,
			phoneNumber,
			email: user?.email,
			deliveryAddress,
			totalPriceProduct: props.totalPriceProduct,
			art: artsRequest,
			note,
		};

		// Khi thanh toán bằng vnpay
		if (payment === 2) {
			try {
				const response = await fetch(
					endpointBE +
						"/vnpay/create-payment?amount=" +
						props.totalPriceProduct,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"content-type": "application/json",
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const paymentUrl = await response.text();

				// Lưu order vào csdl
				const isPayNow = true;
				handleSaveOrder(request, isPayNow);

				window.location.replace(paymentUrl);
			} catch (error) {
				console.log(error);
			}
		} else {
			// Khi nhận hàng mới thanh toán
			handleSaveOrder(request);

		}
	}

	const handleSaveOrder = (request: any, isPayNow?: boolean) => {
		const token = localStorage.getItem("token");
		fetch(endpointBE + "/order/add-order", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"content-type": "application/json",
			},
			body: JSON.stringify(request),
		})
			.then((response) => {
				localStorage.removeItem("cart");
				if (!isPayNow) {
					setIsSuccessPayment(true);
				}
				if (!props.isBuyNow) {
					setCartList([]);
					setTotalCart(0);
				}
				toast.success("Thanh toán thành công.");
			})
			.catch((error) => {
				console.log(error);
				toast.error("Thanh toán thất bại.");
			});
	};

	return (
		<>
			{!isSuccessPayment ? (
				<form onSubmit={handleSubmit}>
					<div className='container bg-light my-3 rounded-3 p-3'>
						<strong className='fs-6'>Thông tin đơn hàng</strong>
						<hr />
						<div className='row'>
							<div className='col-lg-6 col-md-6 col-sm-12'>
								<TextField
									required={true}
									fullWidth
									type='text'
									label="Tên người nhận"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									className='input-field'
								/>
								<TextField
									error={errorPhoneNumber.length > 0 ? true : false}
									helperText={errorPhoneNumber}
									required={true}
									fullWidth
									type='text'
									label='Số điện thoại'
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									onBlur={(e: any) => {
										checkPhoneNumber(
											setErrorPhoneNumber,
											e.target.value
										);
									}}
									className='input-field'
								/>
							</div>
							<div className='col-lg-6 col-md-6 col-sm-12'>
								<TextField
									required={true}
									fullWidth
									type='text'
									label='Email'
									value={user?.email}
									disabled
									className='input-field'
								/>
								<TextField
									required={true}
									fullWidth
									type='text'
									label='Địa chỉ giao hàng'
									value={deliveryAddress}
									onChange={(e) => setDeliveryAddress(e.target.value)}
									className='input-field'
								/>
							</div>
						</div>
					</div>
					<div className='container bg-light my-3 rounded-3 p-3'>
						<strong className='fs-6'>Phương thức thanh toán</strong>
						<hr />
						<FormControl>
							<RadioGroup
								aria-labelledby='demo-controlled-radio-buttons-group'
								name='controlled-radio-buttons-group'
								value={payment}
								onChange={handleChangePayment}
							>
								<FormControlLabel
									value={1}
									control={<Radio />}
									label={
										<div
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<img
												src='https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_cashondelivery.svg?q=10311'
												alt='Cash on Delivery'
												style={{
													width: "40px",
													marginRight: "10px",
												}}
											/>
											Thanh toán khi nhận hàng (COD)
										</div>
									}
								/>

								<FormControlLabel
									value={2}
									control={<Radio />}
									label={
										<div
											style={{
												display: "flex",
												alignItems: "center",
											}}
										>
											<img
												src='https://cdn0.fahasa.com/skin/frontend/base/default/images/payment_icon/ico_vnpay.svg?q=10311'
												alt='Cash on Delivery'
												style={{
													width: "40px",
													marginRight: "10px",
												}}
											/>
											Thanh toán với VNPAY
										</div>
									}
								/>
							</RadioGroup>
						</FormControl>
					</div>
	<div className='container bg-light my-3 rounded-3 p-3'>
      <strong className='fs-6'>Phương thức vận chuyển</strong>
      <hr />
      <FormControl>
        <RadioGroup
          aria-labelledby='demo-controlled-radio-buttons-group'
          name='controlled-radio-buttons-group'
          value={idDelivery}
          onChange={handleChangeDelivery}
		  
        >
          {/* Duyệt qua các phương thức vận chuyển */}
          {deliveries.map((deliveryData) => {
            // Xác định URL hình ảnh dựa trên tên phương thức vận chuyển
            const imageSrc = 
  deliveryData.nameDelivery === 'Regular delivery'
    ? 'https://www.shutterstock.com/image-vector/shipping-fast-delivery-man-riding-600nw-1202545720.jpg'
    : deliveryData.nameDelivery === 'Express delivery'
    ? 'https://static.vecteezy.com/system/resources/previews/005/261/209/non_2x/fast-delivery-icon-free-vector.jpg'
    : 'https://static.vecteezy.com/system/resources/previews/005/261/209/non_2x/fast-delivery-icon-free-vector.jpg'; 
            return (
              <FormControlLabel
                key={deliveryData.idDelivery}
                value={deliveryData.idDelivery}
                control={<Radio/>}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={imageSrc} 
                      alt={deliveryData.nameDelivery}
                      style={{ width: '40px', marginRight: '10px' }}
                    />
                    {deliveryData.nameDelivery} - Phí: {deliveryData.feeDelivery}$
                  </div>
                }
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    </div>

					<div className='container bg-light my-3 rounded-3 p-3'>
						<strong className='fs-6'>Ghi chú</strong>
						<hr />
						<TextField
							className='w-100'
							id='standard-basic'
							label='Ghi chú'
							variant='outlined'
							multiline
							minRows={3}
							maxRows={4}
							value={note}
							onChange={(e) => setNote(e.target.value)}
						/>
					</div>
					<div className='container bg-light my-3 rounded-3 p-3'>
						<strong className='fs-6'>Kiểm tra lại đơn hàng</strong>
						<hr />
						<div className='row my-3'>
							<div className='col'>
								<span className='ms-3'>Các sản phẩm</span>
							</div>
							<div className='col-2 text-center'>Số lượng</div>
							<div className='col-2 text-center'>Tổng tiền sản phẩm</div>
						</div>
						{props.cartList.map((cartItem) => (
							<ArtHorizontal
								key={cartItem.idCart}
								cartItem={cartItem}
							/>
						))}
					</div>
					<footer
						className='fixed-bottom bottom-0 shadow-4-strong bg-light'
						style={{ height: "200px" }}
					>
						<div className='container my-3'>
							<div className='row'>
								<div className='me-3 col text-end'>Tổng tiền</div>
								<div className='ms-3 col-2 text-end'>
									{props.totalPriceProduct.toLocaleString("en-US")} $
								</div>
							</div>
							<div className='row'>
								<div className='me-3 col text-end'>Phí giao hàng</div>
								<div className='ms-3 col-2 text-end'>{delivery}$</div>
							</div>
							<div className='row'>
								<div className='me-3 col text-end'>
									<strong>Tổng tiền thanh toán</strong>
								</div>
								<div className='ms-3 col-2 text-end text-danger fs-5'>
								<strong>
  {(props.totalPriceProduct + (delivery || 0)).toLocaleString("en-US")} $
</strong>
								</div>
							</div>
							<hr className='mt-3' />
							<div className='row  mb-5'>
								<div className='col d-flex align-items-center'>
									<span
										style={{ cursor: "pointer" }}
										onClick={() => props.setIsCheckout(false)}
									>
										<ArrowBackIcon />
										<strong className='ms-2'>
										Quay lại giỏ hàng</strong>
									</span>
								</div>
								<div className='col-4'>
									<Button
									className="btn1"
									sx={{
									  borderRadius: "5px",
									  color: "#fff",
									  cursor: "pointer",
									  fontFamily: "'Greycliff CF', sans-serif",
									  fontSize: "16px",
									  lineHeight: "1.5",
									  padding: "0.75rem 1.25rem",
									  textTransform: "uppercase",
									  textAlign: "center",
									  transition: "all 0.4s ease-in-out",
									  backgroundColor: "#000",
									  textDecoration: "none",
									  width: "100%",
									}}
										type='submit'
										variant='contained'
									>
										Xác nhận thanh toán
									</Button>
								</div>
							</div>
						</div>
					</footer>
				</form>
			) : (
				<CheckoutSuccess />
			)}
		</>
	);
};
