import Button from "@mui/material/Button";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { DiscountTable } from "./components/discount/DiscountTable";
import { ArtTable } from "./components/discount/ArtTable";
import { FadeModal } from "../layouts/utils/FadeModal";
import  { DiscountForm } from "./components/discount/DiscountForm";
import RequireArtist from "./RequireArtist";
import { Box, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { endpointBE } from "../layouts/utils/Constant";



const DiscountManagement = () => {
	// Tạo ra biến để mỗi khi thao tác CRUD thì sẽ update lại table
	const [keyCountReload, setKeyCountReload] = useState(0);

	const [option, setOption] = useState(""); 
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);
	const [isAddingPainting, setIsAddingPainting] = useState(false);
	const [discountPercentage, setDiscountPercentage] = useState<number>(0);
const [startDate, setStartDate] = useState<string>("");
const [endDate, setEndDate] = useState<string>("");


	const [id, setId] = useState<number>(0);
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const token = localStorage.getItem("token");

const handleSelectedIdsChange = (ids: number[]) => {
  setSelectedIds(ids);
};

const handleApplyDiscount = async (selectedIds: number[], discountPercentage: number, startDate: string, endDate: string) => {
	// Kiểm tra các tham số đầu vào
	if (selectedIds.length === 0) {
	  toast.error("Vui lòng chọn ít nhất một tranh.");
	  return;
	}
	if (discountPercentage < 0 || discountPercentage > 100) {
	  toast.error("Phần trăm giảm giá phải từ 0 đến 100.");
	  return;
	}
	if (new Date(startDate) > new Date(endDate)) {
	  toast.error("Ngày kết thúc phải sau ngày bắt đầu.");
	  return;
	}
  
	try {
	  const request = {
		discountPercentage,
		startDate: new Date(startDate).toISOString(),
		endDate: new Date(endDate).toISOString(),
		artIds: selectedIds, // Mảng các id của tranh
	  };
	  console.log(request);
  
	  const response = await fetch(`${endpointBE}/discount/add-discount`, {  // Thay đổi endpoint nếu cần
		method: "POST",
		headers: {
		  Authorization: `Bearer ${token}`,
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	  });
  
	  if (!response.ok) {
		throw new Error("Lỗi khi áp dụng giảm giá cho các tranh.");
	  }
  
	  toast.success("Áp dụng giảm giá thành công cho tất cả tranh!");
	  setKeyCountReload(prev => prev + 1); // Reload dữ liệu bảng
	
	} catch (error) {
	  console.error("Error applying discount:", error);
	  toast.error("Đã có lỗi xảy ra khi áp dụng giảm giá.");
	}
  };
  
	  

	return (
		<div className='conatiner p-5'>
			<div className='shadow-4-strong rounded p-5'>
				<div className='mb-3'>
					{isAddingPainting ? (
						<></>
					) : (
<Button
						variant='contained'
						color='success'
						onClick={() => setIsAddingPainting(true)}
						startIcon={<AddIcon />}
					>
						Thêm giảm giá
					</Button>
					)}
				</div>
				<div>
				{isAddingPainting ? (
					<>
					<ArtTable
      keyCountReload={keyCountReload}
      setOption={setOption}
      setId={setId}
      handleOpenModal={handleOpenModal}
      setKeyCountReload={setKeyCountReload}
	  onSelectedIdsChange={handleSelectedIdsChange}
    />
	<div
  className="box"
  style={{
    width: "700px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",

  }}
>
  <div style={{ width: "100%" }}>
    <div
      className="row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        marginBottom: "20px",
      }}
    >
      <div className="col-3" style={{ flex: 1 }}>
	  <TextField
  required
  id="discount-percentage"
  label="Phần trăm giảm giá"
  type="number"
  size="small"
  style={{ width: "100%" }}
  value={discountPercentage || ""}
  onChange={(e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value <= 100) {
      setDiscountPercentage(value);
    }
  }}
  inputProps={{
    min: 1, 
    max: 100, 
  }}
/>

      </div>
      <div className="col-3" style={{ flex: 1 }}>
	  <TextField
  required
  id="start-date"
  label="Ngày bắt đầu"
  type="date"
  size="small"
  style={{ width: "100%" }}
  onChange={(e) => setStartDate(e.target.value)}
  InputLabelProps={{
    shrink: true, 
  }}
/>
      </div>
      <div className="col-3" style={{ flex: 1 }}>
	  <TextField
  required
  id="end-date"
  label="Ngày kết thúc"
  type="date"
  size="small"
  style={{ width: "100%" }}
  onChange={(e) => setEndDate(e.target.value)}
  InputLabelProps={{
    shrink: true, 
  }}
/>
      </div>
    </div>
    <div
      className="row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
      }}
    >
      <div className="col-2" style={{ flex: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => setIsAddingPainting(false)}
          startIcon={<AddIcon />}
          style={{ width: "100%" }}
        >
          Quay lại
        </Button>
      </div>
      <div className="col-2" style={{ flex: 1 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {handleApplyDiscount(selectedIds, discountPercentage, startDate, endDate)}}
          startIcon={<AddIcon />}
          style={{ width: "100%" }}
        >
          Thêm giảm giá
        </Button>
      </div>
    </div>
  </div>
</div>

					</>
    
  ) : (
    <DiscountTable
      keyCountReload={keyCountReload}
      setOption={setOption}
      setId={setId}
      handleOpenModal={handleOpenModal}
      setKeyCountReload={setKeyCountReload}
    />
  )}
					
				</div>
			</div>
			<FadeModal
							open={openModal}
							handleOpen={handleOpenModal}
							handleClose={handleCloseModal}
						>
							<DiscountForm
								option={option}
								id={id}
								handleCloseModal={handleCloseModal}
								setKeyCountReload={setKeyCountReload}
							/>
						</FadeModal>
		</div>
	);
};

const DiscountManagementPage = RequireArtist(DiscountManagement);
export default DiscountManagementPage;