import React, { FormEvent, useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { getDiscountById } from "../../../api/DiscountApi";
import { endpointBE } from "../../../layouts/utils/Constant";

interface DiscountFormProps {
	option: string;
	id: number;
	handleCloseModal: () => void;
	setKeyCountReload: React.Dispatch<React.SetStateAction<number>>;
  }
  
export const DiscountForm: React.FC<DiscountFormProps> = (props) => {
  const [discountData, setDiscountData] = useState({
    idDiscount: 0,
    idArt: 0,
    startDate: new Date(), // Khởi tạo với giá trị mặc định là ngày hiện tại
    endDate: new Date(), // Khởi tạo với giá trị mặc định là ngày hiện tại
    discountPercentage: 0,
  });

  const [statusBtn, setStatusBtn] = useState(false);

  useEffect(() => {
    if (props.option === "update") {
      getDiscountById(props.id).then((response) => {
        if (response) {
          setDiscountData({
            idDiscount: response.idDiscount ?? 0,
            idArt: response.idArt ?? 0,
            startDate: new Date(response.startDate || ""),
            endDate: new Date(response.endDate || ""),
			discountPercentage: Number(response.discountPercentage) || 0,
          });
        }
      });
    }
  }, [props.option, props.id]);

  const handleDateChange = (field: 'startDate' | 'endDate', event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDate = new Date(event.target.value);
    setDiscountData({ ...discountData, [field]: updatedDate });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const artRequest = {
      idDiscount: discountData.idDiscount,
      idArt: discountData.idArt,
      startDate: discountData.startDate.toISOString(), // Chuyển thành ISO string
      endDate: discountData.endDate.toISOString(), // Chuyển thành ISO string
    };

    setStatusBtn(true);

    const endpoint =
      props.option === "add"
        ? endpointBE + "/discount/add-discount"
        : endpointBE + "/discount/update-discount";
    const method = props.option === "add" ? "POST" : "PUT";

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
            setDiscountData({
              idDiscount: 0,
              idArt: 0,
              startDate: new Date(),
              endDate: new Date(),
              discountPercentage: 0,
            });
            setStatusBtn(false);
            props.handleCloseModal();
            toast.success(
              props.option === "add" ? "Thêm giảm giá thành công" : "Cập nhật giảm giá thành công"
            );
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
        {props.option === "add" ? "TẠO GIẢM GIÁ" : "SỬA GIẢM GIÁ"}
      </Typography>
      <hr />
      <div className="container px-5">
        <form onSubmit={handleSubmit} className="form">
          <input type="hidden" id="idDiscount" value={discountData.idDiscount} hidden />
          <div className="row">
            <div className={props.option === "update" ? "col-4" : "col-6"}>
              <Box
                sx={{
                  "& .MuiTextField-root": { mb: 3 },
                }}
              >
                <TextField
                  required
                  id="filled-required"
                  label="ID Art"
                  style={{ width: "100%" }}
                  type="number"
                  value={discountData.idArt}
                  onChange={(e: any) =>
                    setDiscountData({ ...discountData, idArt: parseInt(e.target.value) })
                  }
                  size="small"
                />
                <TextField
                  required
                  id="filled-required"
                  label="Ngày bắt đầu"
                  type="date"
                  value={discountData.startDate.toISOString().split("T")[0]} // Chuyển đổi thành định dạng "YYYY-MM-DD"
                  onChange={(e: any) => handleDateChange('startDate', e)} // Sử dụng hàm handleDateChange
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
                <TextField
                  required
                  id="filled-required"
                  label="Ngày kết thúc"
                  type="date"
                  value={discountData.endDate.toISOString().split("T")[0]} // Chuyển đổi thành định dạng "YYYY-MM-DD"
                  onChange={(e: any) => handleDateChange('endDate', e)} // Sử dụng hàm handleDateChange
                  InputLabelProps={{
                    shrink: true,
                  }}
                  size="small"
                />
              </Box>
            </div>
            <div className="col-12">
              <Box>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Mô tả giảm giá"
                  style={{ width: "100%" }}
                  multiline
                  maxRows={5}
                  value={discountData.discountPercentage}
                  onChange={(e: any) =>
                    setDiscountData({
                      ...discountData,
                      discountPercentage: parseInt(e.target.value),
                    })
                  }
                  required
                  type="number"
                />
              </Box>
            </div>
          </div>
          <LoadingButton
            className="w-100 my-3"
            type="submit"
            loading={statusBtn}
            variant="outlined"
            sx={{ width: "25%", padding: "10px" }}
          >
            {props.option === "add" ? "Tạo giảm giá" : "Lưu giảm giá"}
          </LoadingButton>
        </form>
      </div>
    </div>
  );
};
