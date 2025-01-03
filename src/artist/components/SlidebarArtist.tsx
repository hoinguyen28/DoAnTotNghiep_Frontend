/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BrushIcon from '@mui/icons-material/Brush';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { logout } from "../../layouts/utils/JwtService";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../layouts/utils/AuthContext";
import { useCartItem } from "../../layouts/utils/CartItemContext";
import logo from '../../logo.svg';

interface SlidebarArtistProps {}

export const SlidebarArtist: React.FC<SlidebarArtistProps> = (props) => {
	const { setCartList } = useCartItem();
	const { setLoggedIn } = useAuth();
	const navigate = useNavigate();
	return (
		<div
			className='position-fixed bg-f d-flex flex-column justify-content-between min-vh-100'
			style={{ zIndex: "100" }}
		>
			<div className='px-3 '>
				<a
					className='mt-5 text-decoration-none d-flex align-items-center text-white d-none d-sm-flex align-items-sm-center justify-content-center'
					href='/'
				>
					<img
						src={logo}
						alt=''
						width={100}
					/>
				</a>
				<hr className='text- white d-none d-sm-block d-md-block' />
				<ul className='nav nav-pills flex-column' id='parentM'>
					<li className='nav-item'>
						<NavLink
							to={"/artist/dashboard"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<DashboardIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								Dashboard
							</span>
						</NavLink>
					</li>
					<li className='nav-item'>
						<NavLink
							to={"/artist/art"}
							className={`nav-link d-flex align-items-center justify-content-center`}
						>
							<BrushIcon fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
								QUẢN LÝ TRANH
							</span>
						</NavLink>
					</li>
					<li className='nav-item '>
						<NavLink
							to={"/artist/discount"}
							className={`nav-link d-flex align-items-center justify-content-center `}
						>
							 <LocalOfferIcon  fontSize='small' />
							<span className='ms-2 d-none d-sm-inline d-md-inline'>
							GIẢM GIÁ
							</span>
						</NavLink>
					</li>
				</ul>
			</div>
			<div className='dropdown open text-center'>
				<a
					className='my-3 btn border-0 dropdown-toggle text-white d-inline-flex align-items-center justify-content-center'
					type='button'
					id='triggerId'
					data-bs-toggle='dropdown'
					aria-haspopup='true'
					aria-expanded='false'
				>
					<PersonIcon fontSize='small' />
					<span className='ms-2'>Họa Sỹ</span>
				</a>
				<div className='dropdown-menu' aria-labelledby='triggerId'>
					<Link
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						to={"/profile"}
					>
						Thông tin cá nhân
					</Link>
					<a
						className='dropdown-item'
						style={{ cursor: "pointer" }}
						onClick={() => {
							setLoggedIn(false);
							setCartList([]);
							logout(navigate);
						}}
					>
						Đăng xuất
					</a>
				</div>
			</div>
		</div>
	);
};