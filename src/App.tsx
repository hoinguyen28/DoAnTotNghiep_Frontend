import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from "./layouts/header-footer/navbar/Navbar";
import Footer from "./layouts/header-footer/footer/Footer";
import { Error404Page } from "./layouts/pages/404Page";
import { Error403Page } from "./layouts/pages/403Page";
import MyFavoriteArtsPage  from "./layouts/pages/MyFavoriteArtsPage";
import HomePage from "./layouts/pages/HomePage";
import { ToastContainer } from "react-toastify";
import { ConfirmProvider } from "material-ui-confirm";
import ActiveAccount from "./layouts/user/ActiveAccount";
import { AuthProvider } from "./layouts/utils/AuthContext";
import FilterPage from "./layouts/pages/FilterPage";
import CartPage from "./layouts/pages/CartPage";
import About from "./layouts/about/About";
import { CartItemProvider } from "./layouts/utils/CartItemContext";
import ArtDetail from "./layouts/products/ArtDetail";
import PolicyPage from "./layouts/pages/PolicyPage";
import {FeedbackCustomerPage} from "./layouts/pages/FeedbackCustomerPage";
import LoginPage from "./layouts/user/LoginPage";
import RegisterPage from "./layouts/user/RegisterPage";
import { ForgotPassword } from "./layouts/user/ForgotPassword";
import  ProfilePage  from "./layouts/user/ProfilePage";
import  {Slidebar}  from "./admin/components/Slidebar";
import  DashboardPage from "./admin/Dashboard";
import  DashboardPage1 from "./artist/Dashboard";
import  ArtManagementPage from "./artist/ArtManagement";
import  GenreManagementPage from "./admin/GenreManagement";
import  DiscountManagementPage from "./artist/DiscountManagement";
import  UserManagementPage from "./admin/UserManagement";
import  OrderManagementPage from "./admin/OrderManagement";
import  BrowseManagementPage from "./admin/BrowseManagement";
import  ArtistPage from "./artist/ArtisrPage";
import  FeedbackPage from "./admin/FeedbackManagement";
import { SlidebarArtist } from './artist/components/SlidebarArtist';

const MyRoutes = () => {
	const [reloadAvatar, setReloadAvatar] = useState(0);

	const location = useLocation();
	const isAdminPath = location.pathname.startsWith("/admin");
	const isArtistPath = location.pathname.startsWith("/artist");
	console.log("isArtistPath:", isArtistPath);
console.log("Current pathname:", location.pathname);


	return (
		<AuthProvider>
			<CartItemProvider>
			<ConfirmProvider>
				{/* Customer */}
				{!isAdminPath && !isArtistPath && <Navbar key={reloadAvatar} />}

				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/art/:idArt' element={<ArtDetail />} />
					<Route path='/author/:idArtist' element={<ArtistPage />} />
					<Route path='/about' element={<About />} />
					<Route path='/search' element={<FilterPage />} />
					<Route
							path='/my-favorite-Arts'
							element={<MyFavoriteArtsPage />}
						/>
					<Route path='/login' element={<LoginPage />} />
					<Route
							path='/search/:idGenreParam'
							element={<FilterPage />}
						/>
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/forgot-password' element={<ForgotPassword />} />
					<Route path='/active/:email/:activationCode' element={<ActiveAccount />} />
					<Route path='/policy' element={<PolicyPage />} />
					<Route path='/feedback' element={<FeedbackCustomerPage />} />
					<Route path='/cart' element={<CartPage />} />
					<Route
							path='/profile'
							element={<ProfilePage setReloadAvatar={setReloadAvatar} />}
						/>
					<Route path='/error-403' element={<Error403Page />} />
						
					{!isAdminPath && !isArtistPath && (
							<Route path='*' element={<Error404Page />} />
						)}
				</Routes>
				{!isAdminPath && !isArtistPath &&  <Footer />}
				{/* Admin */}
				{isAdminPath && (
						<div className='row overflow-hidden w-100'>
							<div className='col-2 col-md-3 col-lg-2'>
								<Slidebar />
							</div>
							<div className='col-10 col-md-9 col-lg-10'>
								<Routes>
									<Route path='/admin' element={<DashboardPage />} />
									<Route
										path='/admin/dashboard'
										element={<DashboardPage />}
									/>
									<Route
										path='/admin/genre'
										element={<GenreManagementPage />}
									/>
									<Route
										path='/admin/user'
										element={<UserManagementPage />}
									/>
									<Route
										path='/admin/order'
										element={<OrderManagementPage />}
									/>
									<Route
										path='/admin/feedback'
										element={<FeedbackPage />}
									/>
									<Route
										path='/admin/browse'
										element={<BrowseManagementPage />}
									/>
									{/* <Route
										path='/admin/art'
										element={<ArtManagementPage />}
									/> */}
									{/* <Route
										path='/admin/discount'
										element={<DiscountManagementPage />}
									/> */}
									{isAdminPath && (
										<Route path='*' element={<Error404Page />} />
									)}
								</Routes>
							</div>
						</div>
					)}
				{isArtistPath && (
						<div className='row overflow-hidden w-100'>
							<div className='col-2 col-md-3 col-lg-2'>
								<SlidebarArtist />
							</div>
							<div className='col-10 col-md-9 col-lg-10'>
								<Routes>
									
									<Route
										path='/artist/art'
										element={<ArtManagementPage />}
									/>
									<Route
										path='/artist/discount'
										element={<DiscountManagementPage />}
									/>
									{isArtistPath && (
										<Route path='*' element={<Error404Page />} />
									)}
								</Routes>
							</div>
						</div>
					)}
				<ToastContainer
				position='bottom-center'
				autoClose={3000}
				pauseOnFocusLoss={false}
					/>
				</ConfirmProvider>
				</CartItemProvider>
		</AuthProvider>
	);
};
function App() {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
}

export default App;
