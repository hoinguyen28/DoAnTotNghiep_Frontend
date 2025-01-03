/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { endpointBE } from "../utils/Constant";
import { getIdUserByToken } from "../utils/JwtService";
import ArtModel from "../../model/ArtModel";
import ArtProps from "./components/ArtProps/ArtProps";
import { getArtById } from "../../api/ArtApi";
import { Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";

interface FavoriteArtsListProps {}

const FavoriteArtsList: React.FC<FavoriteArtsListProps> = (props) => {
	const [artList, setArtList] = useState<ArtModel[]>([]);
	const [loading, setLoading] = useState(true);
	const [reloadComponent] = useState(0);

	useEffect(() => {
		fetch(
			endpointBE + `/favorite-art/get-favorite-art/${getIdUserByToken()}`
		)
			.then((response) => response.json())
			.then((idArtList) => {
				const fetchArtPromises = idArtList.map(async (idArt: any) => {
					const response = await getArtById(idArt);
					return response;
				});

				// Sử dụng Promise.all để đợi tất cả các yêu cầu fetch hoàn thành
				return Promise.all(fetchArtPromises);
			})
			.then((arts) => {
				// Xử lý danh sách sách ở đây (mảng 'arts')
				setArtList(arts);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				console.log(error);
			});
	}, []);

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

	return (
		<div className='container-art container mb-5 pb-5 px-5 bg-light'>
			<h2 className='mt-4 px-3 py-3 mb-0'>Tranh yêu thích</h2>
			<hr className='mt-0' />
			<div className='row' key={reloadComponent}>
				{artList.length > 0 ? (
					artList.map((art) => (
						<ArtProps key={art.idArt} art={art} />
					))
				) : (
					<div className='d-flex align-items-center justify-content-center flex-column'>
						<h4 className='text-center'>
							Bạn chưa yêu thích bức tranh nào
						</h4>
						<Link to={"/search"}>
							<Button variant='contained' className='mt-3'>
								Kho Tranh
							</Button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default FavoriteArtsList;
