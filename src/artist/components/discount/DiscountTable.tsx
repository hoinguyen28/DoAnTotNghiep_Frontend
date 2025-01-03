import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../layouts/utils/DataTable";
import DiscountModel from "../../../model/DiscountModel";
import  {getAllDiscounts, getAllDiscounts1}  from "../../../api/DiscountApi";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { endpointBE } from "../../../layouts/utils/Constant";
import { getIdUserByToken } from "../../../layouts/utils/JwtService";

interface DiscountTableProps {
	setOption: any;
	handleOpenModal: any;
	setId: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
}

export const DiscountTable: React.FC<DiscountTableProps> = (props) => {
	const [loading, setLoading] = useState(true);
	// Tạo các biến của confirm dialog
	const confirm = useConfirm();

	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<DiscountModel[]>([]);
	useEffect(() => {
		const idArtist = getIdUserByToken();
		setLoading(true);
		getAllDiscounts1(idArtist)
		  .then((response) => {
			const discounts = response.map((discountData: any) => ({
			  id: discountData.idDiscount,
			  idDiscount: discountData.idDiscount,
			  discountPercentage: discountData.discountPercentage,
			  startDate: new Date(discountData.startDate),
			  endDate: new Date(discountData.endDate),
			  idArt: discountData.idArt || null,
			  nameArt: discountData.nameArt || "N/A",
			  price: discountData.price || null,
			  finalPrice: discountData.finalPrice || null,
			  thumbnail: discountData.thumbnail || null,
			}));
	
			setData(discounts);
		  })
		  .catch((error) => {
			console.error("Error fetching discounts:", error);
		  })
		  .finally(() => {
			setLoading(false);
		  });
	  }, [props.keyCountReload]);
console.log(data);
	const handleDeleteDiscount = (id: any) => {
		const token = localStorage.getItem("token");

		confirm({
			title: "Xoá giảm giá",
			description: `Bạn chắc chắn xoá giảm giá này chứ?`,
			confirmationText: ["Xoá"],
			cancellationText: ["Huỷ"],
		})
			.then(() => {
				fetch(endpointBE + `/discounts/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							toast.success("Xoá giảm giá thành công");
							props.setKeyCountReload(Math.random());
						} else {
							toast.error("Lỗi khi xoá giảm giá");
						}
					})
					.catch((error) => {
						toast.error("Lỗi khi xoá giảm giá");
						console.log(error);
					});
			})
			.catch(() => {});
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 80 },
		{ field: "idArt", headerName: "ID ART", width: 80 },
		{
			field: "thumbnail",
			headerName: "ẢNH",
			width: 100,
			renderCell: (params) => {
				return <img src={params.value} alt='' width={70} />;
			},
		},
		{ field: "nameArt", headerName: "TÊN TRANH", width: 250 },
		{
			field: "price",
			headerName: "GIÁ LIÊM YẾT",
			width: 120,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}$
					</span>
				);
			},
		},
		{
			field: "finalPrice",
			headerName: "GIÁ BÁN",
			width: 80,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}$
					</span>
				);
			},
		},
		{
			field: "discountPercentage",
			headerName: "GIẢM GIÁ",
			width: 120,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value)}%
					</span>
				);
			},
		},
		{ field: "startDate", headerName: "NGÀY BẮT ĐẦU ", width: 200 },
		{ field: "endDate", headerName: "NGÀY KẾT THÚC", width: 200 },

		{
			field: "action",
			headerName: "SỬA XÓA",
			width: 120,
			type: "actions",
			renderCell: (item) => {
				return (
					<div>
						<Tooltip title={"Chỉnh sửa"}>
							<IconButton
								color='primary'
								onClick={() => {
									props.setOption("update");
									props.setId(item.id);
									props.handleOpenModal();
								}}
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={"Xoá"}>
							<IconButton
								color='error'
								onClick={() => handleDeleteDiscount(item.id)}
							>
								<DeleteOutlineOutlined />
							</IconButton>
						</Tooltip>
					</div>
				);
			},
		},
	];

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return <DataTable columns={columns} rows={data} />;
};
