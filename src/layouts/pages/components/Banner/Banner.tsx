import React from "react";
import "./Banner.css";
import { Link } from "react-router-dom";

function Banner() {
	return (
			<div
  className='container-fluid pt-5 pb-4 text-dark d-flex justify-content-center align-items-center'
  style={{ backgroundColor: '#f2ece4', marginBottom: '22px' }}
>
			<div>
				<h3
					data-text='Art is the only way to run away without leaving home.'
					className='banner-text display-5 fw-bold'
				>
					Art is the only way to run away without leaving home.
				</h3>
				<p className=''>-- Twyla Tharp --</p>
				<Link to={"/search"}>
					<button className='btn1 btn-primary1 btn-lg text-white float-end'>
						Mua sắm ngay 
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Banner;
