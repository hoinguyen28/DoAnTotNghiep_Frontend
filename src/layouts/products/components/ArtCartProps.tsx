/* eslint-disable @typescript-eslint/no-redeclare */
import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextEllipsis from "./text-ellipsis/TextEllipsis";
import SelectQuantity from "./select-quantity/SelectQuantity";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CartItemModel from "../../../model/CartItemModel";
import { getAllImageByArt } from "../../../api/ImageApi";
import ImageModel from "../../../model/ImageModel";
import { useConfirm } from "material-ui-confirm";
import { isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { useCartItem } from "../../utils/CartItemContext";
import { toast } from "react-toastify";

interface ArtCartProps {
	cartItem: CartItemModel;
	handleRemoveArt: any;
}

const ArtCartProps: React.FC<ArtCartProps> = (props) => {
	const { setCartList } = useCartItem();

	const confirm = useConfirm();

	// Tạo các biến
	const [quantity, setQuantity] = useState(
		props.cartItem.art.quantity !== undefined
			? props.cartItem.quantity > props.cartItem.art.quantity
				? props.cartItem.art.quantity
				: props.cartItem.quantity
			: props.cartItem.quantity
	);
	const [imageList, setImageList] = useState<ImageModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);

	function handleConfirm() {
		confirm({
			title: "Delete product",
			description: "Do you want to remove this product from your shopping cart?",
			confirmationText: "Delete",
			cancellationText: "Cancel",
		})
			.then(() => {
				props.handleRemoveArt(props.cartItem.art.idArt);
				if (isToken()) {
					const token = localStorage.getItem("token");
					fetch(endpointBE + `/cart-items/${props.cartItem.idCart}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"content-type": "application/json",
						},
					}).catch((err) => console.log(err));
				}
			})
			.catch(() => {});
	}

	// Lấy ảnh ra từ BE
	useEffect(() => {
		getAllImageByArt(props.cartItem.art.idArt)
			.then((response) => {
				setImageList(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, [props.cartItem.art.idArt]);

	// Loading ảnh thumbnail
let dataImage = props.cartItem.art.thumbnail;

// Kiểm tra xem imageList có ảnh thumbnail hay không
const thumbnailImage = imageList.find((image) => image.thumbnail);
if (thumbnailImage) {
  dataImage = thumbnailImage.urlImage; // Chỉ sử dụng urlImage
}


	// Xử lý tăng số lượng
	const add = () => {
		if (quantity) {
			if (
				quantity <
				(props.cartItem.art.quantity ? props.cartItem.art.quantity : 1)
			) {
				setQuantity(quantity + 1);
				handleModifiedQuantity(props.cartItem.art.idArt, 1);
			} else {
				toast.warning("Insufficient inventory");
			}
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (quantity) {
			// Nếu số lượng về không thì xoá sản phẩm đó
			if (quantity - 1 === 0) {
				handleConfirm();
			} else if (quantity > 1) {
				setQuantity(quantity - 1);
				handleModifiedQuantity(props.cartItem.art.idArt, -1);
			}
		}
	};

	// Xử lý cập nhật lại quantity trong localstorage / database
	function handleModifiedQuantity(idArt: number, quantity: number) {
		const cartData: string | null = localStorage.getItem("cart");
		const cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];
		// cái isExistArt này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistArt = cart.find(
			(cartItem) => cartItem.art.idArt === idArt
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistArt) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistArt.quantity += quantity;

			// Cập nhật trong db
			if (isToken()) {
				const token = localStorage.getItem("token");
				fetch(endpointBE + `/cart-item/update-item`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json",
					},
					body: JSON.stringify({
						idCart: props.cartItem.idCart,
						quantity: isExistArt.quantity,
					}),
				}).catch((err) => console.log(err));
			}
		}
		// Cập nhật lại
		localStorage.setItem("cart", JSON.stringify(cart));
		setCartList(cart);
	}

	if (loading) {
		return (
			<>
				<Skeleton className='my-3' variant='rectangular' />
			</>
		);
	}

	if (erroring) {
		return (
			<>
				<h4>Error ...</h4>
			</>
		);
	}
	return (
		<>
			<div className='col'>
				<div className='d-flex'>
					<Link to={`/art/${props.cartItem.art.idArt}`}>
						<img
							src={dataImage}
							className='card-img-top me-5'
							alt={props.cartItem.art.nameArt}
							style={{ width: "100px" }}
						/>
					</Link>
					<div className='d-flex flex-column pb-2'>
						<Link to={`/art/${props.cartItem.art.idArt}`}>
							<Tooltip title={props.cartItem.art.nameArt} arrow>
								<span className='d-inline'>
									<TextEllipsis
										text={props.cartItem.art.nameArt + " "}
										limit={38}
									/>
								</span>
							</Tooltip>
						</Link>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.art.finalPrice.toLocaleString()}$
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.art.price .toLocaleString()}$
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
				<SelectQuantity
					max={props.cartItem.art.quantity}
					setQuantity={setQuantity}
					quantity={props.cartItem.art.quantity}
					add={add}
					reduce={reduce}
					art={props.cartItem.art}
				/>
			</div>
			<div className='col-2 text-center my-auto'>
				<span className='text-danger'>
					<strong>
						{(quantity * props.cartItem.art.finalPrice).toLocaleString()}$
					</strong>
				</span>
			</div>
			<div className='col-2 text-center my-auto'>
				<Tooltip title={"Delete product"} arrow>
					<button
						style={{
							outline: 0,
							backgroundColor: "transparent",
							border: 0,
						}}
						onClick={() => handleConfirm()}
					>
						<DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} />
					</button>
				</Tooltip>
			</div>
			<hr className='my-3' />
		</>
	);
};

export default ArtCartProps;
