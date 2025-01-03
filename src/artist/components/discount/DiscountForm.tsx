import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { getDiscountById } from "../../../api/DiscountApi";
import { endpointBE } from "../../../layouts/utils/Constant";
import DiscountModel from "../../../model/DiscountModel";

interface DiscountFormProps {
  option: string;
  id: number;
  handleCloseModal: () => void;
  setKeyCountReload: React.Dispatch<React.SetStateAction<number>>;
}

export const DiscountForm: React.FC<DiscountFormProps> = (props) => {
  const [Data, setData] = useState<DiscountModel | null>(null);
  const [statusBtn, setStatusBtn] = useState(false);

  useEffect(() => {
    if (props.option === "update") {
      getDiscountById(props.id).then((response) => {
        if (response) {
          setData({
            id: response.idDiscount,
            idDiscount: response.idDiscount,
            discountPercentage: response.discountPercentage,
            startDate: response.startDate ? new Date(response.startDate) : new Date(),
            endDate: response.endDate ? new Date(response.endDate) : new Date(),
            idArt: response.idArt || undefined,
            nameArt: response.nameArt || "N/A",
            price: response.price || undefined,
            finalPrice: response.finalPrice || undefined,
            thumbnail: response.thumbnail || null,
          });
        }
      });
    }
  }, [props.option, props.id]);

  const handleDateChange = (
    field: "startDate" | "endDate",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDate = new Date(event.target.value);
    setData((prev) => (prev ? { ...prev, [field]: updatedDate } : prev));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Data) return;

    const token = localStorage.getItem("token");
    const artRequest = {
      idDiscount: Data?.idDiscount,
      idArt: Data?.idArt,
      discountPercentage: Data?.discountPercentage,
      startDate: Data?.startDate ? Data.startDate.toISOString() : new Date().toISOString(),
      endDate: Data?.endDate ? Data.endDate.toISOString() : new Date().toISOString(),
    };
console.log(artRequest);
    setStatusBtn(true);

    const endpoint = `${endpointBE}/discounts/${Data?.idDiscount}`;
    const method = "PUT";

    toast.promise(
      fetch(endpoint, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artRequest),
      })
        .then((response) => {
          if (response.ok) {
            setData(null); // Reset trạng thái
            setStatusBtn(false);
            props.handleCloseModal();
            props.setKeyCountReload((prev) => prev + 1);
            toast.success("Cập nhật giảm giá thành công");
          } else {
            toast.error("Gặp lỗi trong quá trình xử lý giảm giá");
            setStatusBtn(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setStatusBtn(false);
          toast.error("Gặp lỗi trong quá trình xử lý giảm giá");
        }),
      {
        pending: "Đang trong quá trình xử lý ...",
      }
    );
  };

  return (
    <div>
      <Typography className="text-center" variant="h4" component="h2">
        {"SỬA GIẢM GIÁ"}
      </Typography>
      <hr />
      <div className="container px-5">
        <form onSubmit={handleSubmit} className="form">
          <input type="hidden" id="idDiscount" value={Data?.idDiscount || 0} hidden />
          <div className="row w-100">
            {/* Thông tin bên trái */}
            <div className="col-12 col-md-6">
              <Box sx={{ "& .MuiTextField-root": { mb: 3 } }}>
                <TextField
                  required
                  id="filled-required"
                  label="ID Tranh"
                  fullWidth
                  type="number"
                  value={Data?.idArt || ""}
                  size="small"
                />
                <TextField
                  required
                  id="filled-required"
                  label="Tên Tranh"
                  fullWidth
                  type="text"
                  value={Data?.nameArt || ""}
                  size="small"
                />
                <div className="row">
                  <div className="col-6">
                    <TextField
                      required
                      id="filled-required"
                      label="Giá liêm yết"
                      fullWidth
                      type="number"
                      value={Data?.price || ""}
                      size="small"
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      required
                      id="filled-required"
                      label="Giá bán"
                      fullWidth
                      type="number"
                      value={Data?.finalPrice || ""}
                      size="small"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <TextField
                      required
                      id="filled-required"
                      label="Ngày bắt đầu"
                      type="date"
                      value={Data?.startDate ? Data.startDate.toISOString().split("T")[0] : ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange("startDate", e)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                    />
                  </div>
                  <div className="col-6">
                    <TextField
                      required
                      id="filled-required"
                      label="Ngày kết thúc"
                      type="date"
                      value={Data?.endDate ? Data.endDate.toISOString().split("T")[0] : ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange("endDate", e)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size="small"
                    />
                  </div>
                </div>
                <div className="row">
            <div className="col-12">
                <TextField
                  id="outlined-multiline-flexible"
                  label="Phần trăm giảm giá"
                  style={{ width: "100%" }}
                  multiline
                  maxRows={5}
                  value={Data?.discountPercentage || ""}
                  onChange={(e) =>
                    setData((prev) =>
                      prev ? { ...prev, discountPercentage: parseInt(e.target.value) } : prev
                    )
                  }
                  required
                  type="number"
                />
            </div>
          </div>
              </Box>
            </div>

            {/* Hình ảnh bên phải */}
            <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
              <img
                src={Data?.thumbnail || ""}
                alt=""
                style={{
                  width: "100%", 
                  maxWidth: "300px", 
                  height: "auto", 
                  display: "block", 
                  margin: "0 auto"
                }}
              />
            </div>
          </div>

          <LoadingButton
            className="w-100 my-3"
            type="submit"
            loading={statusBtn}
            variant="outlined"
            sx={{ width: "25%", padding: "10px" }}
          >
            {"Lưu giảm giá"}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};
