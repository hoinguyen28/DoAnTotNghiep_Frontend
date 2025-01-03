import React, { useEffect } from "react";
import FavoriteArtsList from "../products/FavoriteArtsList";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";

interface MyFavoriteArtsPageProps {}

const MyFavoriteArtsPage: React.FC<MyFavoriteArtsPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const { isLoggedIn } = useAuth();
	const navigation = useNavigate();

	useEffect(() => {
		if (!isLoggedIn) {
			navigation("/login");
		}
	});

	if (!isLoggedIn) {
		return null;
	}

	return (
		<>
			<FavoriteArtsList />
		</>
	);
};

export default MyFavoriteArtsPage;
