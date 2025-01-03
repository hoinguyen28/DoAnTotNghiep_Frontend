import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import TextEllipsis from "./text-ellipsis/TextEllipsis";
import CartItemModel from "../../../model/CartItemModel";
import ImageModel from "../../../model/ImageModel";
import { getAllImageByArt } from "../../../api/ImageApi";
import { Button, Chip } from "@mui/material";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";

interface ArtHorizontalProps {
  cartItem: CartItemModel;
  type?: any;
  idOrder?: number;
  handleCloseModalOrderDetail?: any;
  statusOrder?: string;
}

export const ArtHorizontal: React.FC<ArtHorizontalProps> = (props) => {
  // Mở/Đóng modal
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [cartItem, setCartItem] = useState<CartItemModel>(props.cartItem);

  const [imageList, setImageList] = useState<ImageModel[]>([]);

  // Lấy ảnh từ backend
  useEffect(() => {
    getAllImageByArt(props.cartItem.art.idArt)
      .then((response) => {
        setImageList(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.cartItem.art.idArt]);

  // Loading ảnh thumbnail
  let dataImage = "";
  if (imageList.length > 0) {
    const thumbnail = imageList.find((i) => i.thumbnail);
    dataImage = thumbnail?.urlImage || "";
  }

  return (
    <div className="row">
      <div className="col">
        <div className="d-flex">
          <img
            src={dataImage}
            className="card-img-top"
            alt={props.cartItem.art.nameArt}
            style={{ width: "100px" }}
          />
          <div className="d-flex flex-column pb-2">
            <Tooltip title={props.cartItem.art.nameArt} arrow>
              <Link to={`/art/${props.cartItem.art.idArt}`} className="d-inline text-black">
                <TextEllipsis text={props.cartItem.art.nameArt + " "} limit={100} />
              </Link>
            </Tooltip>
            <div className="mt-auto">
              <span className="discounted-price text-danger">
                <strong style={{ fontSize: "22px" }}>
                  {props.cartItem.art.finalPrice.toLocaleString()}đ
                </strong>
              </span>
              <span className="original-price ms-3 small" style={{ color: "#000" }}>
                <del>{props.cartItem.art.price.toLocaleString()}đ</del>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-2 text-center">
        <strong>{props.cartItem.quantity}</strong>
      </div>
      <div className="col-2 text-center">
        <span className="text-danger">
          <strong>{(props.cartItem.quantity * props.cartItem.art.finalPrice).toLocaleString()}đ</strong>
        </span>
      </div>
      {props.type === "view-customer" && props.statusOrder === "Thành công" && (
        <div className="d-flex flex-row-reverse">
          {!props.cartItem.review ? (
            <Button
              variant="outlined"
              size="small"
              startIcon={<RateReviewRoundedIcon />}
              style={{ width: "150px" }}
              onClick={handleOpenModal}
            >
              Viết đánh giá
            </Button>
          ) : (
            <>
              <Button
                className="mx-3"
                variant="outlined"
                size="small"
                startIcon={<RateReviewRoundedIcon />}
                style={{ width: "150px" }}
                onClick={handleOpenModal}
              >
                Xem đánh giá
              </Button>
              <Chip color="primary" label="Bạn đã đánh giá sản phẩm này rồi" icon={<DoneIcon />} />
            </>
          )}
        </div>
      )}
      <hr className="mt-3" />
    </div>
  );
};
