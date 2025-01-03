/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArtById } from "../../api/ArtApi";
import ArtModel from "../../model/ArtModel";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@mui/material/Button";
import { ShoppingCartOutlined } from "@mui/icons-material";
import TextEllipsis from "./components/text-ellipsis/TextEllipsis";
import { getGenreByIdArt } from "../../api/GenreApi";
import GenreModel from "../../model/GenreModel";
import { getAllImageByArt } from "../../api/ImageApi";
import ImageModel from "../../model/ImageModel";
import React from "react";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import { toast } from "react-toastify";
import { endpointBE } from "../utils/Constant";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { useCartItem } from "../utils/CartItemContext";
import { Skeleton } from "@mui/material";
import CartItemModel from "../../model/CartItemModel";
import { CheckoutPage } from "../pages/CheckoutPage";
import useScrollToTop from "../../hooks/ScrollToTop";
import ArtistDetails from "../../artist/components/artist/ArtistProps"; 


interface ArtDetailProps {}

const ArtDetail: React.FC<ArtDetailProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	const { setTotalCart, cartList } = useCartItem();

	// Lấy mã Tranh từ url
	const { idArt } = useParams();
	let idArtNumber: number = 0;

	// Ép kiểu về number
	try {
		idArtNumber = parseInt(idArt + "");
		if (Number.isNaN(idArtNumber)) {
			idArtNumber = 0;
		}
	} catch (error) {
		console.error("Error: " + error);
	}

	// Khai báo biến
	const [art, setArt] = useState<ArtModel | null>(null);
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	// Lấy Tranh ra
	useEffect(() => {
		getArtById(idArtNumber)
			.then((response) => {
				setArt(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);
console.log(art);

	const [genres, setGenres] = useState<GenreModel[] | null>(null);

useEffect(() => {
  getGenreByIdArt(idArtNumber).then((response) => {
    setGenres(response.genreList);  // Lưu danh sách genres vào state
  }).catch((error) => {
    console.error("Error fetching genres:", error);
  });
}, [idArtNumber]);



	// Lấy ra hình ảnh của Tranh
	const [images, setImages] = useState<ImageModel[] | null>(null);
	useEffect(() => {
		getAllImageByArt(idArtNumber)
			.then((response) => {
				setImages(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const [quantity, setQuantity] = useState(1);
	// Xử lý tăng số lượng
	const add = () => {
		if (quantity < (art?.quantity ? art?.quantity : 1)) {
			setQuantity(quantity + 1);
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	// Xử lý thêm tác phẩm vào giỏ hàng
   const handleAddProduct = async (newArt: ArtModel) => {
      // Kiểm tra xem tác phẩm đã có trong giỏ hàng chưa
      let isExistArt = cartList.find((cartItem) => cartItem.art.idArt === newArt.idArt);
      if (isExistArt) {
         // Tác phẩm đã tồn tại, không thể thêm vì số lượng chỉ có 1
         toast.warning("This product is already in the cart.");
      } else {
         // Lưu vào db
         if (isToken()) {
            try {
               const request = [
                  {
                     quantity: 1,
                     art: newArt,
                     idUser: getIdUserByToken(),
                  },
               ];
               const token = localStorage.getItem("token");
               const response = await fetch(endpointBE + "/cart-item/add-item", {
                  method: "POST",
                  headers: {
                     Authorization: `Bearer ${token}`,
                     "content-type": "application/json",
                  },
                  body: JSON.stringify(request),
               });

               if (response.ok) {
                  const idCart = await response.json();
                  cartList.push({
                     idCart: idCart,
                     quantity: 1,
                     art: newArt,
                  });
               }
            } catch (error) {
               console.log(error);
            }
         } else {
            cartList.push({
               quantity: 1,
               art: newArt,
            });
         }
         // Lưu vào localStorage
         localStorage.setItem("cart", JSON.stringify(cartList));
         // Thông báo thành công
         toast.success("Added to cart successfully");
         setTotalCart(cartList.length);
      }
   };
  

	// Viewer hình ảnh
const [currentImage, setCurrentImage] = useState(0);
const [isViewerOpen, setIsViewerOpen] = useState(false);

let imageList: string[] = [];
if (images && images.length > 0) {
  imageList = images
    .map((image) => image.urlImage)
    .filter((url): url is string => !!url);
}

	const openImageViewer = useCallback((index: number) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const [isCheckout, setIsCheckout] = useState(false);
	const [cartItem, setCartItem] = useState<CartItemModel[]>([]);
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);
	function handleBuyNow(newArt: ArtModel) {
		setCartItem([{ quantity, art: newArt }]);
		setIsCheckout(!isCheckout);
		setTotalPriceProduct(newArt.finalPrice * quantity);
	}

	if (loading) {
		return (
			<div className='container-art container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-4'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-8 px-5'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={100}
						/>
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Error: {erroring}</h1>
			</div>
		);
	}

	if (art === null) {
		return (
			<div>
				<h1>Bức tranh không tồn tại </h1>
			</div>
		);
	}

	return (
		<>
			{!isCheckout ? (
				<>
					<div className='container p-2 bg-white my-3 rounded'>
						<div className='row mt-4 mb-4'>
							<div className='col-lg-4 col-md-4 col-sm-12'>
								<Carousel
									emulateTouch={true}
									swipeable={true}
									showIndicators={false}
								>
									{images?.map((image, index) => (
										<div
											key={index}
											onClick={() => openImageViewer(index)}
											style={{
												width: "100%",
												height: "400px",
												objectFit: "cover",
											}}
										>
											<img
  alt=''
  src={image.urlImage || ""}
/>

										</div>
									))}
								</Carousel>
								{isViewerOpen && (
									<ReactSimpleImageViewer
										src={imageList}
										currentIndex={currentImage}
										disableScroll={true}
										closeOnClickOutside={true}
										onClose={closeImageViewer}
										backgroundStyle={{
											backgroundColor: "rgba(0,0,0,0.7)",
										}}
									/>
								)}
							</div>
							<div className='col-lg-8 col-md-8 col-sm-12 px-5'>
								<h2>{art.nameArt}</h2>
								<div className=''>
									<p className='me-5'>
									Thể loại:{" "}
										<strong>
											{genres?.map((genre) => genre.nameGenre + ", ")}
										</strong>
									</p>
									<p className=''>
									Tác giả: <strong>{art.author}</strong>
									</p>
								</div>
								<div className='d-flex align-items-center'>
									<div className='d-flex align-items-center'>
										<span className='mx-3 mb-1 text-secondary'>
											|
										</span>
									</div>
								</div>
								<div className='price'>
									<span className='discounted-price text-danger me-3'>
										<strong style={{ fontSize: "32px" }}>
											{art.finalPrice ?.toLocaleString()}$
										</strong>
									</span>
									{art.finalPrice ?.toLocaleString() !== art.price?.toLocaleString()  && (<>
										<span className='original-price small me-3'>
										<strong>
											<del>{art.price?.toLocaleString()}$</del>
										</strong>
									</span>
									<p style={{fontSize:"20px"}} className='my-0 d-inline-block'>
										<span className='badge bg-danger'>
											SALE {art.discountPercentage}%
										</span>
									</p>
									</>)}
								</div>
								<div className='mt-3'>
									
									<div className='d-flex align-items-center mt-3'>
										<img
											src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/d9e992985b18d96aab90969636ebfd0e.png'
											height='20'
											alt='free ship'
										/>
										<span className='ms-3'>Miễn phí ship</span>
									</div>
								</div>
								<div className='d-flex align-items-center mt-3'>
									<strong className='me-5'>Số lương còn lại: {art.quantity} </strong>
									{/* <SelectQuantity
										max={art.quantity}
										quantity={art.quantity}
										setQuantity={setQuantity}
										add={add}
										reduce={reduce}
									/> */}
									<span className='ms-4'>
										
									</span>
								</div>
								<div className='mt-4 d-flex align-items-center'>
									{art.quantity === 0 ? (
										<Button
											variant='outlined'
											size='large'
											className='me-3'
											color='error'
										>
											Hết hàng
										</Button>
									) : (
										<>
											<Button
												variant='outlined'
												size='large'
												startIcon={<ShoppingCartOutlined />}
												className='me-3'
												onClick={() => handleAddProduct(art)}
											>
												Thêm vào giỏ hàng
											</Button>
											<Button
												variant='contained'
												size='large'
												className='ms-3 btn1'
												onClick={() => handleBuyNow(art)}
											>
												Mua ngay
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='container p-4 bg-white my-3 rounded mb-5'>
						<h3 className='my-3'>Mô tả tranh</h3>
						<hr />
						<p>{art.description}</p>
					</div>
					<ArtistDetails idUser={art.idAuthor ?? 0} />

				</>
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={cartItem}
					totalPriceProduct={totalPriceProduct}
					isBuyNow={true}
				/>
			)}
		</>
	);
};

export default ArtDetail;
