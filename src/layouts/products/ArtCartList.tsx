import React, { useEffect, useState } from "react";
import ArtCartProps from "./components/ArtCartProps";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckoutPage } from "../pages/CheckoutPage";
import { isToken } from "../utils/JwtService";
import { useCartItem } from "../utils/CartItemContext";

interface ArtCartListProps {}

const ArtCartList: React.FC<ArtCartListProps> = () => {
	const { setTotalCart, cartList, setCartList } = useCartItem();
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);

	useEffect(() => {
		const total = cartList.reduce((totalPrice, cartItem) => {
			return totalPrice + cartItem.quantity * cartItem.art.finalPrice ;
		}, 0);
		setTotalPriceProduct(total);
		setTotalCart(cartList.length);
	}, [cartList, setTotalCart]); // Khúc này đang bị overloading

	const navigation = useNavigate();
	// Xử lý xoá tranh
	function handleRemoveArt(idArt: number) {
		const newCartList = cartList.filter(
			(cartItem) => cartItem.art.idArt !== idArt
		);
		localStorage.setItem("cart", JSON.stringify(newCartList));
		setCartList(newCartList);
		setTotalCart(newCartList.length);
		toast.success("Product deletion successful");
	}

	// Thanh toán
	const [isCheckout, setIsCheckout] = useState(false);

	return (
		<>
			{!isCheckout ? (
				<div style={{ overflow: "hidden" }}>
					{cartList.length === 0 && (
						<div className=' d-flex align-items-center justify-content-center flex-column position-relative'>
							<img
								src='https://newnet.vn/themes/newnet/assets/img/empty-cart.png'
								alt=''
								width='55%'
							/>
							<Link
								to={"/search"}
								className='position-absolute'
								style={{ bottom: "100px" }}
							>
								<a className="btn1">Mua sắm ngay</a>
							</Link>
						</div>
					)}
					<div
						className='row my-4 pb-5 px-5'
						style={
							cartList.length === 0
								? { display: "none" }
								: { display: "flex" }
						}
					>
						{/* Bên trái */}
						<h2 className='mt-2 px-3 py-3 mb-0'>
						Giỏ hàng <span>({cartList.length} sản phẩm)</span>
						</h2>
						<div className='col-lg-8 col-md-12 col-sm-12 '>
							<div className='container-art bg-light '>
								<div className='row px-4 py-3'>
									<div className='col'>sản phẩm</div>
									<div className='col-3 text-center'>Số lượng</div>
									<div className='col-2 text-center'>Giá tiền</div>
									<div className='col-2 text-center'>Xóa sản phẩm</div>
								</div>
							</div>
							<div className='container-art bg-light mt-3 px-3'>
								<div className='row px-4 py-3'>
									{cartList.map((cartItem) => {
										return (
											<ArtCartProps
												cartItem={cartItem}
												handleRemoveArt={handleRemoveArt}
												key={cartItem.art.idArt}
											/>
										);
									})}
								</div>
							</div>
						</div>

						{/* Bên phải */}
						<div
							className='container-art bg-light col-lg col-md-12 col-sm-12 px-5 pb-4 mt-lg-0 mt-md-3 mt-sm-3'
							style={{ height: "fit-content" }}
						>
							<div className='d-flex align-items-center justify-content-between mt-3'>
								<span>Tổng tiền:</span>
								<span>
									<strong>
										{totalPriceProduct.toLocaleString()} $
									</strong>
								</span>
							</div>
							<hr className='my-2' />
							<div className='d-flex align-items-center justify-content-between'>
								<span>
									<strong>Tổng thanh toán (đã tính VAT):</strong>
								</span>
								<span className='text-danger fs-5'>
									<strong>
										{totalPriceProduct.toLocaleString()} $
									</strong>
								</span>
							</div>

							<Button
  className="btn1"
  sx={{
    border: "1px solid #fff",
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
    marginTop: "30px",
  }}
  onClick={() => {
    if (isToken()) {
      setIsCheckout(true);
    } else {
      toast.warning("You need to log in to perform this function");
      navigation("/login");
    }
  }}
>
Thanh toán
</Button>

						</div>
					</div>
				</div>
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={cartList}
					totalPriceProduct={totalPriceProduct}
				/>
			)}
		</>
	);
};

export default ArtCartList;
