import React from "react";
import ArtCartList from "../products/ArtCartList";
import useScrollToTop from "../../hooks/ScrollToTop";

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <ArtCartList />;
};

export default CartPage;
