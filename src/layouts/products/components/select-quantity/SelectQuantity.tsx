import React from "react";
import "./SelectQuantity.css";
import Icon from "@mui/material/Icon";
import CartItemModel from "../../../../model/CartItemModel";
import ArtModel from "../../../../model/ArtModel";
import { isToken } from "../../../utils/JwtService";
import { endpointBE } from "../../../utils/Constant";

interface SelectQuantityProps {
  max: number | undefined;
  setQuantity?: any;
  quantity?: number;
  add?: any;
  reduce?: any;
  art?: ArtModel;  // Đảm bảo là ArtModel
}

const SelectQuantity: React.FC<SelectQuantityProps> = (props) => {
  // Xử lý khi thay đổi input quantity bằng bàn phím
  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (
      !isNaN(newQuantity) &&
      newQuantity >= 1 &&
      newQuantity <= (props.max ? props.max : 1)
    ) {
      props.setQuantity(newQuantity);
      const cartData: string | null = localStorage.getItem("cart");
      const cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];

      // Lấy item nghệ thuật trong giỏ hàng
      let isExistArt = cart.find(
        (cartItem) => cartItem.art.idArt === props.art?.idArt // Dùng idArt của ArtModel
      );

      // Thêm 1 sản phẩm vào giỏ hàng
      if (isExistArt) {
        // nếu có rồi thì sẽ gán là số lượng mới
        isExistArt.quantity = newQuantity;

        // Cập nhật trong db
        if (isToken()) {
          const token = localStorage.getItem("token");
          fetch(endpointBE + `/cart-items/update-item`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              idCart: isExistArt.idCart,
              quantity: isExistArt.quantity,
            }),
          }).catch((err) => console.log(err));
        }
      }
      // Cập nhật lại giỏ hàng trong localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  };

  return (
    <div
      className="wrapper-select-quantity d-flex align-items-center rounded"
    >
      <button
        type="button"
        className="d-flex align-items-center justify-content-center"
        onClick={() => props.reduce()}
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
        }}
      >
        <Icon>remove</Icon>
      </button>
      <input
        type="number"
        className="inp-number p-0 m-0 d-flex align-items-center justify-content-center"
        value={props.quantity}
        onChange={handleQuantity}
        min={1}
        max={props.max}
        style={{color: '#333' }}
      />
      <button
        type="button"
        className="d-flex align-items-center justify-content-center"
        onClick={() => props.add()}
        style={{
          backgroundColor: "transparent",
          borderColor: "transparent",
        }}
      >
        <Icon>add</Icon>
      </button>
    </div>
  );
};

export default SelectQuantity;
