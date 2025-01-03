import React, { useEffect, useState } from "react";
import ArtModel from "../../model/ArtModel";
import { getNewArt } from "../../api/ArtApi";
import ArtProps from "./components/ArtProps/ArtProps";
import { useCartItem } from "../utils/CartItemContext";
import { Skeleton } from "@mui/material";

interface NewArtListProps {}

const NewArtList: React.FC<NewArtListProps> = (props) => {
	const [artList, setArtList] = useState<ArtModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);

	useEffect(() => {
		getNewArt()
			.then((response) => {
				setArtList(response.artList);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
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

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}
	return (
		<div className='container-art container mb-5 pb-5 px-5 '>
			<h3
  style={{
    textAlign: "center",
    color: "#000",
    fontFamily: "Essonnes-Headline, serif !important",
    fontWeight: '400 !important',
    margin: "0",
    fontSize: "clamp(3.75rem, 1.55rem + 9.39vw, 8rem)",
    marginTop: "1rem",
    padding: "1rem 0",
    marginBottom: "0",
  }}
>
  Gợi ý cho bạn
</h3>

			<hr className='mt-0' />
			<div className='row'>
				{artList.map((art) => (
					<ArtProps key={art.idArt} art={art} />
				))}
			</div>
		</div>
	);
};

export default NewArtList;
