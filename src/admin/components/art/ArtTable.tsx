import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../layouts/utils/DataTable";
import ArtModel from "../../../model/ArtModel";
import { getAllArt } from "../../../api/ArtApi";
import { getAllImageByArt } from "../../../api/ImageApi";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { endpointBE } from "../../../layouts/utils/Constant";
import { getArtByIdAllInformation } from "../../../api/ArtApi";



interface ArtTableProps {
	setOption: any;
	handleOpenModal: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
	setId: any;
}

export const ArtTable: React.FC<ArtTableProps> = (props) => {
	const [loading, setLoading] = useState(true);

	// Tạo các biến của confirm dialog
	const confirm = useConfirm();
	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<ArtModel[]>([]);

	// Hàm để lấy tất cả các tranh render ra table
	useEffect(() => {
		const fetchData = async () => {
			try {
				const artResponse = await getAllArt(1000, 0);

				const promises = artResponse.artList.map(async (art) => {
					const imagesList = await getAllImageByArt(art.idArt);

					const thumbnail = imagesList.find((image) => image.thumbnail);

					return {
						...art,
						id: art.idArt,
						thumbnail: thumbnail?.urlImage || thumbnail?.dataImage,
					};
				});
				const arts = await Promise.all(promises);
				setData(arts);
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [props.keyCountReload]);
	console.log(data);

	// Xử lý xoá tranh
	const handleDeleteArt = (id: any) => {
		const token = localStorage.getItem("token");
		confirm({
			title: "Xoá tranh",
			description: `Bạn chắc chắn xoá tranh này chứ?`,
			confirmationText: ["Xoá"],
			cancellationText: ["Huỷ"],
		})
			.then(() => {
				fetch(endpointBE + `/arts/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							toast.success("Xoá tranh thành công");
							props.setKeyCountReload(Math.random());
						} else {
							toast.error("Lỗi khi xoá tranh");
						}
					})
					.catch((error) => {
						toast.error("Lỗi khi xoá tranh");
						console.log(error);
					});
			})
			.catch(() => {});
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "thumbnail",
			headerName: "ẢNH",
			width: 100,
			renderCell: (params) => {
				return <img src={params.value} alt='' width={70} />;
			},
		},
		{ field: "nameArt", headerName: "TÊN TRANH", width: 350 },
		{ field: "quantity", headerName: "SỐ LƯỢNG", width: 100 },
		{
			field: "price",
			headerName: "GIÁ BÁN",
			width: 120,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}đ
					</span>
				);
			},
		},
		{ field: "author", headerName: "TÁC GIẢ", width: 150 },
		{ field: "reviewStatus", headerName: "STATUS", width: 150 },

		{
			field: "action",
			headerName: "HÀNH ĐỘNG",
			width: 200,
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
								onClick={() => handleDeleteArt(item.id)}
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
