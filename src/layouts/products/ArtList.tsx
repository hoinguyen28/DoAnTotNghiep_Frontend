/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ArtProps from "./components/ArtProps/ArtProps";
import ArtModel from "../../model/ArtModel";
import { getAllArt, searchArt, getArtsByReviewStatus } from "../../api/ArtApi";
import Pagination from "../utils/Pagination";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";

interface ArtListProps {
	paginable?: boolean;
	size?: number;
	keySearch?: string | undefined;
	idGenre?: number;
	filter?: number;
}

const ArtList: React.FC<ArtListProps> = (props) => {
	const [artList, setArtList] = useState<ArtModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// const [totalArt, setTotalArt] = useState(0);

	// Xử lý phân trang
	const handlePagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		window.scrollTo(0, 0);
	};

	// Chỗ này xử lý khi thực hiện chức năng hiện số sản phẩm
	const [totalPagesTemp, setTotalPagesTemp] = useState(totalPages);
	if (totalPagesTemp !== totalPages) {
		setCurrentPage(1);
		setTotalPagesTemp(totalPages);
	}

	useEffect(() => {
		// Mặc đinh sẽ gọi getAllArt
		if (
			(props.keySearch === "" &&
				props.idGenre === 0 &&
				props.filter === 0) ||
			props.keySearch === undefined
		) {
			// currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
			getArtsByReviewStatus("Đã duyệt", props.size, currentPage - 1) // size là (tổng sản phẩm được hiện)
				.then((response) => {
					setArtList(response.artList);
					setTotalPages(response.totalPage);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setErroring(error.message);
				});
		} else {
			// Khi có các param lọc
			searchArt(
				props.keySearch,
				props.idGenre,
				props.filter,
				props.size,
				currentPage - 1
			)
				.then((response) => {
					setArtList(response.artList);
					setTotalPages(response.totalPage);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setErroring(error.message);
				});
		}
	}, [currentPage, props.keySearch, props.idGenre, props.filter, props.size]);

	if (loading) {
		return (
			<div className='container-art container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Error: {erroring}</h1>
			</div>
		);
	}

	// Kiểm tra danh sách sách xem có phần tử nào không
	if (artList.length === 0) {
		return (
			<div className='container-art container mb-5 px-5 px-5 bg-light'>
				<h2 className='mt-4 px-3 py-3 mb-0'>
				No arts found! "{props.keySearch}"
				</h2>
			</div>
		);
	}

	return (
		<div className='container-art container mb-5 pb-5 px-5'>
			{!props.paginable && (
				<>
					<h3
  style={{
    textAlign: "center",
    color: "#000",
    fontFamily: "Essonnes-Headline, serif !important",
    fontWeight: '400 !important',
    margin: "0",
    fontSize: "clamp(2.5rem, 1rem + 5vw, 8rem)",
    marginTop: "1rem",
    padding: "1rem 0",
    marginBottom: "0",
  }}
>
  Kho tranh
</h3>
					<hr className='mt-0' />
				</>
			)}
			<div className='row'>
				{artList.map((art) => (
					<ArtProps key={art.idArt} art={art} />
				))}
			</div>
			{props.paginable ? (
				<>
					<hr className='mt-5' style={{ color: "#aaa" }} />
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						handlePagination={handlePagination}
					/>
				</>
			) : (
				<Link to={"/search"}>
					<div className='d-flex align-items-center justify-content-center'>
						<button
							className=' btn1 mt-5'
						>
							Xem thêm
						</button>
					</div>
				</Link>
			)}
		</div>
	);
};

export default ArtList;
