import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { VisibilityOutlined } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../layouts/utils/DataTable";
import ArtModel from "../../../model/ArtModel";
import { getArtsByReviewStatus } from "../../../api/ArtApi";
import { getAllImageByArt } from "../../../api/ImageApi";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { endpointBE } from "../../../layouts/utils/Constant";



interface BrowseTableProps {
	setOption: any;
	handleOpenModal: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
	setId: any;
}

export const BrowseTable: React.FC<BrowseTableProps> = (props) => {
	const [loading, setLoading] = useState(true);

	// Tạo các biến của confirm dialog
	const confirm = useConfirm();
	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<ArtModel[]>([]);

	// Hàm để lấy tất cả các tranh render ra table
	useEffect(() => {
		const fetchData = async () => {
			try {
				const artResponse = await getArtsByReviewStatus("Chờ duyệt", 1000, 0);

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
			headerName: "Xem Tranh",
			width: 200,
			type: "actions",
			renderCell: (item) => {
				return (
					<div>
						<Tooltip title={"Xem chi tiết"}>
							<IconButton
								color='primary'
								onClick={() => {
									props.setOption("update");
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
