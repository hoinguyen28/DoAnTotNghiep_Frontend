import { ParameterDigital } from "./components/ParameterDigital";
import { Chart } from "./components/chart/Chart";
import RequireAdmin from "./RequireAdmin";
import { useEffect, useState } from "react";
import { getAllUserRole } from "../api/UserApi";
import { getAllOrders } from "../api/OrderApi";
import OrderModel from "../model/OrderModel";
import { getTotalNumberOfArts } from "../api/ArtApi";
import { getTotalNumberOfFeedbacks } from "../api/FeedbackApi";

const Dashboard = () => {
	const [totalPrice, setTotalPrice] = useState(0);
	const [numberOfAccount, setNumberOfAccount] = useState(0);
	const [numberOfOrder, setNumberOfOrder] = useState(0);
	const [totalNumberOfArts, setTotalNumberOfArts] = useState(0);
	const [totalNumberOfFeedbacks, setTotalNumberOfFeedbacks] = useState(0);
	const [orders, setOrders] = useState<OrderModel[]>([]);

	// Lấy tổng số account
	useEffect(() => {
		getAllUserRole()
			.then((response) => {
				setNumberOfAccount(response.flat().length);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số hoá đơn và tổng tiền kiếm được
	useEffect(() => {
		getAllOrders()
			.then((response) => {
				setOrders(response);
				const numberOfOrders = response.length;
				setNumberOfOrder(numberOfOrders);
				const totalPriceResponse = response.reduce((prevValue, order) => {
					if (order.status === "Thành công") {
						return prevValue + order.totalPrice;
					}
					return prevValue;
				}, 0);
				setTotalPrice(totalPriceResponse);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số sách
	useEffect(() => {
		getTotalNumberOfArts()
			.then((response) => {
				setTotalNumberOfArts(response);
			})
			.catch((error) => console.log(error));
	}, []);

	// Lấy tổng số feedback
	useEffect(() => {
		getTotalNumberOfFeedbacks()
			.then((response) => {
				setTotalNumberOfFeedbacks(response);
			})
			.catch((error) => console.log(error));
	}, []);
	return (
		<div>
			<ParameterDigital
				totalPrice={totalPrice}
				numberOfAccount={numberOfAccount}
				numberOfOrder={numberOfOrder}
				totalNumberOfArts={totalNumberOfArts}
				totalNumberOfFeedbacks={totalNumberOfFeedbacks}
			/>
			<Chart orders={orders} />
		</div>
	);
};

const DashboardPage = RequireAdmin(Dashboard);
export default DashboardPage;
