import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { DataTable } from "../../../layouts/utils/DataTable";
import ArtModel from "../../../model/ArtModel";
import { getAllArtArtist1 } from "../../../api/ArtApi";
import { getAllImageByArt } from "../../../api/ImageApi";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import { endpointBE } from "../../../layouts/utils/Constant";
import { getIdUserByToken } from "../../../layouts/utils/JwtService";
import Checkbox from '@mui/material/Checkbox';



interface ArtTableProps {
	setOption: any;
	handleOpenModal: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
	setId: any;
  onSelectedIdsChange: (selectedIds: number[]) => void;
  
}

export const ArtTable: React.FC<ArtTableProps> = (props) => {
	const [loading, setLoading] = useState(true);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

	// Tạo các biến của confirm dialog
	const confirm = useConfirm();
	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<ArtModel[]>([]);

	// Hàm để lấy tất cả các tranh render ra table
	useEffect(() => {
		const idArtist = getIdUserByToken();
		const fetchData = async () => {
			try {
				const artResponse = await getAllArtArtist1(idArtist);
	
				// Lọc các art có discountPercentage === 0
				const filteredArtList = artResponse.artList.filter(
					(art) => art.discountPercentage === 0
				);
	
				// Xử lý thêm thông tin cho mỗi art
				const promises = filteredArtList.map(async (art) => {
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
	
    const handleCheckboxChange = (id: number, isChecked: boolean) => {
      setSelectedProductIds((prev) => {
        const updatedList = isChecked
          ? [...prev, id]
          : prev.filter((productId) => productId !== id);
        
        // Gửi danh sách đã cập nhật về component cha
        props.onSelectedIdsChange(updatedList);
        return updatedList;
      });
    };

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
  { field: "reviewStatus", headerName: "TRẠNG THÁI", width: 150 },
  {
    field: "action",
    headerName: "THÊM XÓA",
    width: 200,
    type: "actions",
    renderCell: (item) => {
      return (
        <div>
          <Checkbox
            checked={selectedProductIds.includes(item.row.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange(item.row.id, e.target.checked)
            }
          />
          <Tooltip title={"Xoá"}>
            <IconButton
              color='error'
              onClick={() => handleDeleteArt(item.row.id)}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
        </div>
      );
    },
  },
];

// Kiểm tra trạng thái tải
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

// Hiển thị bảng
return <DataTable columns={columns} rows={data} />;
};
