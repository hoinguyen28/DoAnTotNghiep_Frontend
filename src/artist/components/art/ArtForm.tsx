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
import { jwtDecode } from "jwt-decode";


interface ArtFormProps {
	id: number;
	option: string;
	setKeyCountReload?: any;
	handleCloseModal: any;
}

export const ArtForm: React.FC<ArtFormProps> = (props) => {
	const token = localStorage.getItem("token");

    // Khai báo decodedToken
    let decodedToken: any = null;

    if (token) {
        decodedToken = jwtDecode(token);
    }
	const [art, setArt] = useState<ArtModel>({
		idArt: 0,
		nameArt: "",
		author: decodedToken.lastName,
		idAuthor: decodedToken.id,
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

	async function hanleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const token = localStorage.getItem("token");

		let artRequest: ArtModel = art;
		if (artRequest.discountPercentage === 0) {
			artRequest = { ...art, finalPrice: art.price };
		}
		setStatusBtn(true);

		const endpoint =
			props.option === "add"
				? endpointBE + "/art/add-art"
				: endpointBE + "/art/update-art";
		const method = props.option === "add" ? "POST" : "PUT";
		console.log("artRequest gửi đi:", JSON.stringify(artRequest, null, 2));
		toast.promise(
			fetch(endpoint, {
				method: method,
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
						props.option === "add"
							? toast.success("Thêm tranh thành công")
							: toast.success("Cập nhật tranh thành công");
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

	function handleThumnailImageUpload(
		event: React.ChangeEvent<HTMLInputElement>
	) {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement.files && inputElement.files.length > 0) {
			const selectedFile = inputElement.files[0];

			const reader = new FileReader();

			// Xử lý sự kiện khi tệp đã được đọc thành công
			reader.onload = (e: any) => {
				// e.target.result chính là chuỗi base64
				const thumnailBase64 = e.target?.result as string;

				setArt({ ...art, thumbnail: thumnailBase64 });

				setPreviewThumbnail(URL.createObjectURL(selectedFile));
			};

			// Đọc tệp dưới dạng chuỗi base64
			reader.readAsDataURL(selectedFile);
		}
	}

	function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
		const inputElement = event.target as HTMLInputElement;

		if (inputElement.files && inputElement.files.length > 0) {
			const newPreviewImages = [...previewRelatedImages];

			if (newPreviewImages.length + inputElement.files.length > 5) {
				toast.warning("Chỉ được tải lên tối đa 5 ảnh");
				return;
			}

			// Duyệt qua từng file đã chọn
			for (let i = 0; i < inputElement.files.length; i++) {
				const selectedFile = inputElement.files[i];

				const reader = new FileReader();

				// Xử lý sự kiện khi tệp đã được đọc thành công
				reader.onload = (e: any) => {
					// e.target.result chính là chuỗi base64
					const thumbnailBase64 = e.target?.result as string;

					setArt((prevArt) => ({
						...prevArt,
						relatedImg: [...(prevArt.relatedImg || []), thumbnailBase64],
					}));

					newPreviewImages.push(URL.createObjectURL(selectedFile));

					// Cập nhật trạng thái với mảng mới
					setPreviewRelatedImages(newPreviewImages);
				};

				// Đọc tệp dưới dạng chuỗi base64
				reader.readAsDataURL(selectedFile);
			}
		}
	}

	return (
		<div>
			<Typography className='text-center' variant='h4' component='h2'>
				{props.option === "add" ? "TẠO TRANH" : "SỬA TRANH"}
			</Typography>
			<hr />
			<div className='container px-5'>
				<form onSubmit={hanleSubmit} className='form'>
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
								/>

								<TextField
									required
									id='filled-required'
									label='Tên tác giả'
									style={{ width: "100%" }}
									value={decodedToken.lastName}
									onChange={(e: any) =>
										setArt({ ...art, author: e.target.value })
									}
									size='small'
								/>

								<TextField
									required
									id='filled-required'
									label='Giá niêm yết'
									style={{ width: "100%" }}
									type='number'
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
							<Button
								size='small'
								component='label'
								variant='outlined'
								startIcon={<CloudUpload />}
							>
								Tải ảnh thumbnail
								<input
									style={{ opacity: "0", width: "10px" }}
									required={props.option === "update" ? false : true}
									type='file'
									accept='image/*'
									onChange={handleThumnailImageUpload}
									alt=''
								/>
							</Button>
							<img src={previewThumbnail} alt='' width={100} />
						</div>
						<div className='d-flex align-items-center mt-3'>
							<Button
								size='small'
								component='label'
								variant='outlined'
								startIcon={<CloudUpload />}
							>
								Tải ảnh liên quan
								<input
									style={{ opacity: "0", width: "10px" }}
									// required
									type='file'
									accept='image/*'
									onChange={handleImageUpload}
									multiple
									alt=''
								/>
							</Button>
							{previewRelatedImages.map((imgURL) => (
								<img src={imgURL} alt='' width={100} />
							))}
							{previewRelatedImages.length > 0 && (
								<Button
									onClick={() => {
										setPreviewRelatedImages([]);
										setArt({ ...art, relatedImg: [] });
									}}
								>
									Xoá tất cả
								</Button>
							)}
						</div>
					</div>
					{props.option !== "view" && (
						<LoadingButton
							className='w-100 my-3'
							type='submit'
							loading={statusBtn}
							variant='outlined'
							sx={{ width: "25%", padding: "10px" }}
						>
							{props.option === "add" ? "Tạo tranh" : "Lưu tranh"}
						</LoadingButton>
					)}
				</form>
			</div>
		</div>
	);
};
