
import React, { useEffect, useState } from "react";
import ArtModel from "../../../../model/ArtModel";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import TextEllipsis from "../text-ellipsis/TextEllipsis";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import { endpointBE } from "../../../utils/Constant";
import { getIdUserByToken, isToken } from "../../../utils/JwtService";
import { useCartItem } from "../../../utils/CartItemContext";
import "./ArtProps.css";

interface ArtProps {
   art: ArtModel;
}

const ArtProps: React.FC<ArtProps> = ({ art }) => {
   const { setTotalCart, cartList } = useCartItem();
   const [isFavoriteArt, setIsFavoriteArt] = useState(false);
   const navigation = useNavigate();

   // Lấy tất cả tác phẩm yêu thích của người dùng đã đăng nhập
   useEffect(() => {
      if (isToken()) {
         fetch(endpointBE + `/favorite-art/get-favorite-art/${getIdUserByToken()}`)
            .then((response) => response.json())
            .then((data) => {
               if (data.includes(art.idArt)) {
                  setIsFavoriteArt(true);
               }
            })
            .catch((error) => {
               console.log(error);
            });
      }
   }, []);

   // Xử lý thêm tác phẩm vào giỏ hàng
   const handleAddProduct = async (newArt: ArtModel) => {

      // Kiểm tra xem tác phẩm đã có trong giỏ hàng chưa
      let isExistArt = cartList.find((cartItem) => cartItem.art.idArt === newArt.idArt);

      if (isExistArt) {
         // Tác phẩm đã tồn tại, không thể thêm vì số lượng chỉ có 1
         toast.warning("Tác phẩm này đã có trong giỏ hàng.");
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
         toast.success("Đã thêm vào giỏ hàng thành công");
         setTotalCart(cartList.length);
      }
   };

   // Xử lý chức năng yêu thích
   const handleFavoriteArt = async (newArt: ArtModel) => {
      if (!isToken()) {
         toast.info("Bạn phải đăng nhập để sử dụng chức năng này");
         navigation("/login");
         return;
      }
      if (!isFavoriteArt) {
         const token = localStorage.getItem("token");
         fetch(endpointBE + `/favorite-art/add-art`, {
            method: "POST",
            headers: {
               Authorization: `Bearer ${token}`,
               "content-type": "application/json",
            },
            body: JSON.stringify({
               idArt: art.idArt,
               idUser: getIdUserByToken(),
            }),
         }).catch((err) => console.log(err));
      } else {
         const token = localStorage.getItem("token");
         fetch(endpointBE + `/favorite-art/delete-art`, {
            method: "DELETE",
            headers: {
               Authorization: `Bearer ${token}`,
               "content-type": "application/json",
            },
            body: JSON.stringify({
               idArt: art.idArt,
               idUser: getIdUserByToken(),
            }),
         }).catch((err) => console.log(err));
      }
      setIsFavoriteArt(!isFavoriteArt);
   };

   return (
      <div className="col-md-6 col-lg-3 mt-4 mb-3">
         <div className="card position-relative">
            {art.quantity === 0 && (
               <h4
                  className="my-0 d-inline-block position-absolute end-0"
                  style={{ top: "15px" }}
               >
                  <span className="badge bg-danger">Hết hàng</span>
               </h4>
            )}
            {art.finalPrice !== art.price && art.quantity !== 0 && (
               <h4
                  className="my-0 d-inline-block position-absolute end-0"
                  style={{ top: "15px" }}
               >
                  <span className="badge bg-danger">Giảm giá</span>
               </h4>
            )}
            <Link to={`/art/${art.idArt}`}>
               <img
                  src={art.thumbnail}
                  className="card-img-top "
                  alt={art.nameArt}
                  style={{ height: "300px" }}
               />
            </Link>
            <div className="card-body">
               <Link to={`/art/${art.idArt}`} style={{ textDecoration: "none" }}>
                  <h5 className="card-title">
                     <Tooltip title={art.nameArt || ""} arrow>
                        <span>
                           <TextEllipsis text={art.nameArt || ""} limit={20} />
                        </span>
                     </Tooltip>
                  </h5>
               </Link>
               <div className="price mb-3">
                  <strong style={{fontSize: "22px" }}>
                     {art.finalPrice?.toLocaleString()}$
                  </strong>
                  {art.finalPrice !== art.price && (
                     <strong
                     style={{
                       paddingLeft: "8px",
                       textDecoration: "line-through",
                       fontSize: "22px",
                       color: "red"
                     }}
                   >
                     {art.price?.toLocaleString()}$
                   </strong>
               
            )}
                  

               </div>
               <div className="row mt-2" role="group">
                  <div className="col-6">
                     <Tooltip title="Favourite">
                        <IconButton
                           size="small"
                           color={isFavoriteArt ? "error" : "default"}
                           onClick={() => {
                              handleFavoriteArt(art);
                           }}
                        >
                           <FavoriteIcon />
                        </IconButton>
                     </Tooltip>
                  </div>
                  <div className="col-6">
                     {art.quantity !== 0 && (
                        <Tooltip title="Add to cart">
                           <button
                              className="btn1  btn-block"
                              onClick={() => handleAddProduct(art)}
                           >
                              <i className="fas fa-shopping-cart"></i>
                           </button>
                        </Tooltip>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ArtProps;
