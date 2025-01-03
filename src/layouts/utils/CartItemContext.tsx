import React, { createContext, useContext, useEffect, useState } from "react";
import CartItemModel from "../../model/CartItemModel";

interface CartItemProps {
	children: React.ReactNode;
}

interface CartItemType {
	cartList: CartItemModel[];
	setCartList: React.Dispatch<React.SetStateAction<CartItemModel[]>>;
	totalCart: number;
	setTotalCart: React.Dispatch<React.SetStateAction<number>>;
}

const CartItem = createContext<CartItemType | undefined>(undefined);

export const CartItemProvider: React.FC<CartItemProps> = (props) => {
	const [cartList, setCartList] = useState<CartItemModel[]>([]);
	const [totalCart, setTotalCart] = useState<number>(0);

	useEffect(() => {
		const cartData: string | null = localStorage.getItem("cart");
		let cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];
		setCartList(cart);
		setTotalCart(cart.length);
	}, []);

	useEffect(() => {
		setTotalCart(cartList.length); // Cập nhật lại tổng số items mỗi khi cartList thay đổi
	}, [cartList]);

	return (
		<CartItem.Provider value={{ cartList, setCartList, totalCart, setTotalCart }}>
			{props.children}
		</CartItem.Provider>
	);
};

export const useCartItem = (): CartItemType => {
	const context = useContext(CartItem);
	if (!context) {
		throw new Error("Lỗi context: CartItemContext phải được bọc trong CartItemProvider");
	}
	return context;
};
