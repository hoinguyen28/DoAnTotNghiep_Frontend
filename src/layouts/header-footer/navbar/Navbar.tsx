/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import GenreModel from "../../../model/GenreModel";
import { getAllGenres } from "../../../api/GenreApi";
import { AdminEnpoint } from "../../../admin/AdminEnpoint";
import { ArtistEnpoint } from "../../../artist/ArtistEnpoint";

import logo from '../../../logo.svg';
import './navbar.css';
import {
	getAvatarByToken,
	getLastNameByToken,
	getRoleByToken,
	isToken,
	logout,
} from "../../utils/JwtService";
import { Avatar, Button } from "@mui/material";
import { useAuth } from "../../utils/AuthContext";
import { useCartItem } from "../../utils/CartItemContext";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props) => {
	const { totalCart, setTotalCart, setCartList } = useCartItem();
	const { setLoggedIn } = useAuth();
	const navigate = useNavigate();

	// Lấy tất cả thể loại
	const [genreList, setGenreList] = useState<GenreModel[]>([]);
	const [erroring, setErroring] = useState(null);

	useEffect(() => {
		getAllGenres()
			.then((response) => {
				setGenreList(response.genreList);
			})
			.catch((error) => {
				setErroring(error.message);
			});
	}, []);

	if (erroring) {
		console.error(erroring);
	}

	const location = useLocation();
	const adminEnpoint = AdminEnpoint; // Thêm các path bạn muốn ẩn Navbar vào đây
	const artistEnpoint = ArtistEnpoint; // Thêm các path bạn muốn ẩn Navbar vào đây

	if (adminEnpoint.includes(location.pathname)) {
		return null; // Nếu location.pathname nằm trong danh sách ẩn, trả về null để ẩn Navbar
	}
	if (artistEnpoint.includes(location.pathname)) {
		return null; // Nếu location.pathname nằm trong danh sách ẩn, trả về null để ẩn Navbar
	}

	return (
		<>
		<div
    className="header-banner"
    style={{ backgroundColor: "rgb(27, 27, 27)", color: "rgb(255, 255, 255)" }}
>
    <div className="metafield-rich_text_field">
        <p>Season of Savings | Up to 30% Off Sitewide*</p>
    </div>
</div>
{/* <!-- Navbar brand --> */}
<div className="navbar-brand">
<Link className='' to='/'>
<img style={{ transform: 'scale(1.2)' }} src={logo} alt="Society6" />

					</Link>
</div>

		<nav
			className='navbar-container navbar-expand-lg navbar-light bg-light sticky-top'
			style={{ zIndex: 2 }}
		>
			

			{/* <!-- Container wrapper --> */}
			<div className=' navbar-grap'>
				{/* <!-- Toggle button --> */}
				<div className="navbar-toggler">
				<button
					className=''
					type='button'
					data-mdb-toggle='collapse'
					data-mdb-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<i className='fas fa-bars'></i>
				</button>
				</div>
				
				{/* <!-- Collapsible wrapper --> */}
				
				<div
					className='align-items-center collapse navbar-collapse'
					id='navbarSupportedContent'
				>
					
					{/* <!-- Left links --> */}
					<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/'>
								Trang chủ
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/about'>
								Giới thiệu
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/search'>
								Kho tranh
							</NavLink>
						</li>
						<li className='nav-item dropdown dropdown-hover'>
							<a
								className='nav-link dropdown-toggle'
								href='#'
								role='button'
								data-bs-toggle='dropdown'
								aria-expanded='false'
							>
								Thể loại
							</a>
							<ul className='dropdown-menu'>
								{genreList.map((genre, index) => {
									return (
										<li key={index}>
											<Link
												className='dropdown-item'
												to={`/search/${genre.idGenre}`}
											>
												{genre.nameGenre}
											</Link>
										</li>
									);
								})}
							</ul>
						</li>
						<li className='nav-item'>
							<Link className='nav-link' to={"/policy"}>
							Chính sách
							</Link>
						</li>
						{/* {isToken() && (
							<li className='nav-item'>
								<NavLink className='nav-link' to={"/feedback"}>
									Feedback
								</NavLink>
							</li>
						)} */}
					</ul>
					{/* <!-- Left links --> */}
				</div>
				{/* <!-- Collapsible wrapper --> */}
				{/* <!-- Right elements --> */}
				<div className='d-flex align-items-center'>
					{/* <!-- Shopping Cart --> */}
					<Link className='text-reset me-3' to='/search'>
					<i className="fas fa-search fa-2x"></i> 
					</Link>
					<Link className='text-reset me-3' to='/cart'>
						<i className='fas fa-shopping-cart'></i>
						<span className='badge rounded-pill badge-notification bg-danger'>
							{totalCart ? totalCart : ""}
						</span>
					</Link>
					{!isToken() && (
						<div>
							<Link to={"/login"}>
								<Button>Đăng nhập</Button>
							</Link>
							<Link to={"/register"}>
								<Button>Đăng ký</Button>
							</Link>
						</div>
					)}
					


					{isToken() && (
						<>
							{/* <!-- Notifications --> */}
							<div className='dropdown'>
								<a
									className='text-reset me-3 dropdown-toggle hidden-arrow'
									href='#'
									id='navbarDropdownMenuLink'
									role='button'
									data-mdb-toggle='dropdown'
									aria-expanded='false'
								>
									<i className='fas fa-bell'></i>
									<span className='badge rounded-pill badge-notification bg-danger'>
										1
									</span>
								</a>
								<ul
									className='dropdown-menu dropdown-menu-end'
									aria-labelledby='navbarDropdownMenuLink'
								>
									<li>
										<a className='dropdown-item' href='#'>
											Some news
										</a>
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Another news
										</a>
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Something else here
										</a>
									</li>
								</ul>
							</div>
							{/* <!-- Avatar --> */}
							<div className='dropdown'>
								<a
									className='dropdown-toggle d-flex align-items-center hidden-arrow'
									href='#'
									id='navbarDropdownMenuAvatar'
									role='button'
									data-mdb-toggle='dropdown'
									aria-expanded='false'
								>
									<Avatar
										style={{ fontSize: "14px" }}
										alt={getLastNameByToken()?.toUpperCase()}
										src={getAvatarByToken()}
										sx={{ width: 40, height: 40 }}
									/>
								</a>
								<ul
									className='dropdown-menu dropdown-menu-end'
									aria-labelledby='navbarDropdownMenuAvatar'
								>
									<li>
										<Link to={"/profile"} className='dropdown-item'>
										Thông tin cá nhân
										</Link>
									</li>
									<li>
										<Link
											className='dropdown-item'
											to='/my-favorite-arts'
										>
											Tranh yêu thích
										</Link>
									</li>
									{getRoleByToken() === "ADMIN" && (
										<li>
											<Link
												className='dropdown-item'
												to='/admin/dashboard'
											>
												Quán lý cho ADMIN
											</Link>
										</li>
									)}
									{getRoleByToken() === "ARTIST" && (
										<li>
											<Link
												className='dropdown-item'
												to='/artist/art'
											>
												Quản lý cho họa sỹ
											</Link>
										</li>
									)}
									<li>
										<a
											className='dropdown-item'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setTotalCart(0);
												logout(navigate);
												setLoggedIn(false);
												setCartList([]);
											}}
										>
											Đăng xuất	
										</a>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>
				{/* <!-- Right elements --> */}
			</div>
			{/* <!-- Container wrapper --> */}
		</nav>
		</>
	);
};

export default Navbar;
