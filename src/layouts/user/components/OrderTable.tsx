import { VisibilityOutlined } from "@mui/icons-material";
import {
	Box,
	Chip,
	CircularProgress,
	IconButton,
	Tooltip,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../utils/DataTable";
import { getAllOrdersByIdUser } from "../../../api/OrderApi";
import OrderModel from "../../../model/OrderModel";
import { getIdUserByToken } from "../../utils/JwtService";

interface OrderTableProps {
	keyCountReload: any;
	setKeyCountReload: any;
	handleOpenModal: any;
	setId: any;
}

const OrderTable: React.FC<OrderTableProps> = (props) => {
	const [loading, setLoading] = useState(true);
	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<OrderModel[]>([]);
	useEffect(() => {
		const idUser = getIdUserByToken();
		getAllOrdersByIdUser(idUser)
			.then((response) => {
				const orders = response.map((order) => ({
					...order,
					id: order.idOrder,
					nameCustomer: order.fullName,
				}));

				const ordersSort = orders.sort(
					(order1, order2) => order2.idOrder - order1.idOrder
				);

				setData(ordersSort);
				setLoading(false);
			})
			.catch((error) => console.log(error));
	}, [props.keyCountReload]);

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 80 },
		{ field: "dateCreated", headerName: "NGÀY TẠO", width: 280 },
		{
			field: "totalPrice",
			headerName: "TỔNG TIỀN",
			width: 150,
			renderCell: (params) => {
				return (
					<>{Number.parseInt(params.value).toLocaleString("vi-vn")} $</>
				);
			},
		},
		{
			field: "status",
			headerName: "TRẠNG THÁI",
			width: 180,
			renderCell: (params) => {
				return (
					<Chip
						label={params.value}
						color={
							params.value === "Thành công"
								? "success"
								: params.value === "Đang xử lý"
								? "info"
								: params.value === "Đang giao hàng"
								? "warning"
								: "error"
						}
						variant='outlined'
					/>
				);
			},
		},
		{
			field: "action",
			headerName: "CHI TIẾT",
			width: 170,
			type: "actions",
			renderCell: (item) => {
				return (
					<div>
						<Tooltip title={"Xem chi tiết"}>
							<IconButton
								color='secondary'
								onClick={() => {
									props.setId(item.id);
									props.handleOpenModal();
								}}
							>
								<VisibilityOutlined />
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

export default OrderTable;
