import React, { FormEvent, useEffect, useState } from "react";
import ArtModel from "../../../model/ArtModel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";
import GenreModel from "../../../model/GenreModel";
import { getAllGenres } from "../../../api/GenreApi";
import { SelectMultiple } from "../../../layouts/utils/SelectMultiple";
import { LoadingButton } from "@mui/lab";
import { getArtByIdAllInformation } from "../../../api/ArtApi";
import { endpointBE } from "../../../layouts/utils/Constant";

interface BrowseFormProps {
	id: number;
	option: string;
	setKeyCountReload?: any;
	handleCloseModal: any;
}

export const BrowseForm: React.FC<BrowseFormProps> = (props) => {
	const [art, setArt] = useState<ArtModel>({
		idArt: 0,
		nameArt: "",
		author: "",
		description: "",
		price: NaN,
		finalPrice: NaN,
		quantity: NaN,
		discountPercentage: 0,
		thumbnail: "",
		relatedImg: [],
		idGenres: [],
	});
	const [genresList, setGenresList] = useState<GenreModel[]>([]);
	const [genresListSelected, setGenresListSelected] = useState<number[]>([]);
	const [previewThumbnail, setPreviewThumbnail] = useState("");
	const [previewRelatedImages, setPreviewRelatedImages] = useState<string[]>(
		[]
	);
	// Giá trị khi đã chọn ở trong select multiple
	const [SelectedListName, setSelectedListName] = useState<any[]>([]);
	// Khi submit thì btn loading ...
	const [statusBtn, setStatusBtn] = useState(false);
	// Biến reload (cho selectMultiple)
	const [reloadCount, setReloadCount] = useState(0);

	// Lấy dữ liệu khi update
	useEffect(() => {
		if (props.option === "update") {
			getArtByIdAllInformation(props.id).then((response) => {
				console.log(response);
				setArt(response as ArtModel);
				setPreviewThumbnail(response?.thumbnail as string);
				setPreviewRelatedImages(response?.listImages as string[]);
				response?.listGenres ?.forEach((data) => {
					setSelectedListName((prev) => [...prev, data.nameGenre]);
					setArt((prevArt) => {
						return {
							...prevArt,
							idGenres: [...(prevArt.idGenres || []), data.idGenre],
						};
					});
				});
			});
		}
	}, [props.option, props.id]);

	// Khúc này lấy ra tất cả thể loại để cho vào select
	useEffect(() => {
		getAllGenres().then((response) => {
			setGenresList(response.genreList);
		});
	}, [props.option]);
	// Khúc này để lưu danh tranh thể loại của tranh
	useEffect(() => {
		setArt({ ...art, idGenres: genresListSelected });
	}, [genresListSelected]);

	async function handleSubmitReview(reviewStatusValue: number) {
        const token = localStorage.getItem("token");
    
        let artRequest: ArtModel = art;
        if (artRequest.discountPercentage === 0) {
            artRequest = { ...art, finalPrice: art.price };
        }
    
        // Cập nhật reviewStatus dựa vào tham số truyền vào
        const reviewStatus = reviewStatusValue === 1 ? "Đã duyệt" : "Không duyệt";
        artRequest = { ...artRequest, reviewStatus };
    
        setStatusBtn(true);
    
        // Chỉ sử dụng endpoint update
        const endpoint = endpointBE + "/art/update-art";
    
        console.log("artRequest gửi đi:", JSON.stringify(artRequest, null, 2));
    
        toast.promise(
            fetch(endpoint, {
                method: "PUT", // Chỉ sử dụng PUT cho cập nhật
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(artRequest),
            })
                .then((response) => {
                    if (response.ok) {
                        setArt({
                            idArt: 0,
                            nameArt: "",
                            author: "",
                            description: "",
                            price: NaN,
                            finalPrice: NaN,
                            quantity: NaN,
                            discountPercentage: 0,
                            thumbnail: "",
                            relatedImg: [],
                            idGenres: [],
                        });
                        setPreviewThumbnail("");
                        setPreviewRelatedImages([]);
                        setReloadCount(Math.random());
                        setStatusBtn(false);
                        props.setKeyCountReload(Math.random());
                        props.handleCloseModal();
                        toast.success(reviewStatusValue === 1 ? "Duyệt tranh thành công" : "Không duyệt tranh thành công");
                    } else {
                        toast.error("Gặp lỗi trong quá trình xử lý tranh");
                        setStatusBtn(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setStatusBtn(false);
                    toast.error("Gặp lỗi trong quá trình xử lý tranh");
                }),
            {
                pending: "Đang trong quá trình xử lý ...",
            }
        );
    }
	return (
		<div>
			<Typography className='text-center' variant='h4' component='h2'>
				{props.option === "add" ? "Xem chi tiết" : "Xem chi tiết"}
			</Typography>
			<hr />
			<div className='container px-5'>
				<form className='form'>
					<input type='hidden' id='idArt' value={art?.idArt} hidden />
					<div className='row'>
						<div
							className={props.option === "update" ? "col-4" : "col-6"}
						>
							<Box
								sx={{
									"& .MuiTextField-root": { mb: 3 },
								}}
							>
								<TextField
									required
									id='filled-required'
									label='Tên tranh'
									style={{ width: "100%" }}
									value={art.nameArt}
									onChange={(e: any) =>
										setArt({ ...art, nameArt: e.target.value })
									}
									size='small'
                                    InputProps={{
                                        readOnly: true, 
                                      }}
								/>

								<TextField
									required
									id='filled-required'
									label='Tên tác giả'
									style={{ width: "100%" }}
									value={art.author}
									onChange={(e: any) =>
										setArt({ ...art, author: e.target.value })
									}
									size='small'
                                    InputProps={{
                                        readOnly: true, 
                                      }}
								/>

								<TextField
									required
									id='filled-required'
									label='Giá niêm yết'
									style={{ width: "100%" }}
									type='number'
                                    InputProps={{
                                        readOnly: true, 
                                      }}
									value={
										Number.isNaN(art.price) ? "" : art.price
									}
									onChange={(e: any) =>
										setArt({
											...art,
											price: parseInt(e.target.value),
										})
									}
									size='small'
								/>
							</Box>
						</div>
						<div
							className={props.option === "update" ? "col-4" : "col-6"}
						>
							<Box
								sx={{
									"& .MuiTextField-root": { mb: 3 },
								}}
							>
								<TextField
									required
									id='filled-required'
									label='Số lượng'
									style={{ width: "100%" }}
									type='number'
									value={
										Number.isNaN(art.quantity) ? "" : art.quantity
									}
									onChange={(e: any) =>
										setArt({
											...art,
											quantity: parseInt(e.target.value),
										})
									}
									size='small'
                                    InputProps={{
                                        readOnly: true, 
                                      }}
								/>
								<SelectMultiple
									selectedList={genresListSelected}
									setSelectedList={setGenresListSelected}
									selectedListName={SelectedListName}
									setSelectedListName={setSelectedListName}
									values={genresList}
									setValue={setArt}
									key={reloadCount}
									required={true}
								/>
							</Box>
						</div>
						{props.option === "update" && (
							<div className='col-4'>
								<Box
									sx={{
										"& .MuiTextField-root": { mb: 3 },
									}}
								>
									<TextField
									required
									id='filled-required'
									label='Giá bán '
									style={{ width: "100%" }}
									type='number'
                                    InputProps={{
                                        readOnly: true, 
                                      }}
									value={
										Number.isNaN(art.finalPrice) ? "" : art.finalPrice
									}
									onChange={(e: any) =>
										setArt({
											...art,
											finalPrice: parseInt(e.target.value),
										})
									}
									size='small'
								/>
								</Box>
							</div>
						)}
						<div className='col-12'>
							<Box>
								<TextField
                                InputProps={{
                                    readOnly: true, 
                                  }}
									id='outlined-multiline-flexible'
									label='Mô tả tranh'
									style={{ width: "100%" }}
									multiline
									maxRows={5}
									value={art.description}
									onChange={(e: any) =>
										setArt({ ...art, description: e.target.value })
									}
									required
								/>
							</Box>
						</div>
						<div className='d-flex align-items-center mt-3'>
							<h5>Ảnh Chính</h5>
							<img src={previewThumbnail} alt='' width={100} />
						</div>
						<div className='d-flex align-items-center mt-3'>
                        <h5>Ảnh Liên quan</h5>
							
							{previewRelatedImages.map((imgURL) => (
								<img src={imgURL} alt='' width={100} />
							))}
						</div>
					</div>
					{props.option !== "view" && (
  <div className="d-flex justify-content-between">
    {/* Nút Duyệt */}
    <LoadingButton
      className="w-100 my-3"
      type="button"  // Chuyển từ "submit" thành "button" vì đây không phải là một form submit
      loading={statusBtn}
      variant="outlined"
      sx={{ width: "48%", padding: "10px" }}
      onClick={() => handleSubmitReview(1)}  // Truyền 1 để duyệt tranh
    >
      Duyệt tranh
    </LoadingButton>

    {/* Nút Không Duyệt */}
    <LoadingButton
      className="w-100 my-3"
      type="button"  // Chuyển từ "submit" thành "button" vì đây không phải là một form submit
      loading={statusBtn}
      variant="outlined"
      sx={{ width: "48%", padding: "10px" }}
      onClick={() => handleSubmitReview(0)}  // Truyền 0 để không duyệt tranh
    >
      Không duyệt
    </LoadingButton>
  </div>
)}

				</form>
			</div>
		</div>
	);
};
