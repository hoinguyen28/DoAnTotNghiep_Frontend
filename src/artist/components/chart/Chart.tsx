import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import {
	BY_LASTEST_15_DAYS,
	BY_LASTEST_30_DAYS,
	BY_LASTEST_3_DAYS,
	BY_LASTEST_7_DAYS,
	BY_MONTH,
	BY_YEAR,
	formatDate,
} from "./Labels";
import OrderModel from "../../../model/OrderModel";
import { PieChart } from "@mui/x-charts";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Biểu đồ thống kê",
		},
	},
};

interface ChartProps {
	dataTotalPriceOrderByMonth?: number[];
	dataNumberOfOrderOrderByMonth?: number[];
	orders?: OrderModel[];
}

export const Chart: React.FC<ChartProps> = (props) => {
	const [orderByStatistics, setOrderByStatistics] = useState("monthly");
	const [orderByMonthlyOfYear, setOrderByMonthlyOfYear] = useState(
		new Date().getFullYear() + ""
	);
	const [orderByLatestDate, setOrderByLatestDate] = useState("3");
	const [labels, setLabels] = useState(BY_MONTH);
	function handleChangeOrderByStatistics(
		event: SelectChangeEvent<string>
	): void {
		setOrderByStatistics(event.target.value);
		if (event.target.value === "yearly") {
			setLabels(BY_YEAR);
			updateData(event.target.value);
		}
		if (event.target.value === "monthly") {
			setLabels(BY_MONTH);
			updateData(event.target.value, new Date().getFullYear() + "");
		}
		if (event.target.value === "daily") {
			setLabels(BY_LASTEST_3_DAYS);
			setOrderByLatestDate("3");
			updateData(
				event.target.value,
				new Date().getFullYear() + "",
				BY_LASTEST_3_DAYS
			);
		}
	}

	function handleChangeOrderByLastestDate(
		event: SelectChangeEvent<string>
	): void {
		setOrderByLatestDate(event.target.value);
		switch (event.target.value) {
			case "3":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_3_DAYS
				);
				setLabels(BY_LASTEST_3_DAYS);
				break;
			case "7":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_7_DAYS
				);
				setLabels(BY_LASTEST_7_DAYS);
				break;
			case "15":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_15_DAYS
				);
				setLabels(BY_LASTEST_15_DAYS);
				break;
			case "30":
				updateData(
					orderByStatistics,
					new Date().getFullYear() + "",
					BY_LASTEST_30_DAYS
				);
				setLabels(BY_LASTEST_30_DAYS);

				break;
			default:
				break;
		}
	}

	function handleChangeOrderByMonthlyOfYear(
		event: SelectChangeEvent<string>
	): void {
		setOrderByMonthlyOfYear(event.target.value);
		updateData(orderByStatistics, event.target.value);
	}

	const dataNumberOfOrder = useRef(new Array(12).fill(0));
	const dataTotalPrice = useRef(new Array(12).fill(0));

	const updateData = useMemo(
		() => (option: string, year?: string, latestDays?: string[]) => {
			switch (option) {
				case "yearly":
					const newDataNumberOfOrder_Yearly = new Array(
						BY_YEAR.length
					).fill(0);
					const newDataTotalPrice_Yearly = new Array(BY_YEAR.length).fill(
						0
					);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						if (order.status === "Thành công") {
							const year = orderDate.getFullYear() + "";

							newDataNumberOfOrder_Yearly[BY_YEAR.indexOf(year)] += 1;
							newDataTotalPrice_Yearly[BY_YEAR.indexOf(year)] +=
								order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Yearly;
					dataTotalPrice.current = newDataTotalPrice_Yearly;
					break;
				case "monthly":
					const newDataNumberOfOrder_Monthly = new Array(12).fill(0);
					const newDataTotalPrice_Monthly = new Array(12).fill(0);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						if (
							order.status === "Success" &&
							orderDate.getFullYear() === parseInt(year + "")
						) {
							const month = orderDate.getMonth();

							newDataNumberOfOrder_Monthly[month] += 1;
							newDataTotalPrice_Monthly[month] += order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Monthly;
					dataTotalPrice.current = newDataTotalPrice_Monthly;
					break;
				case "daily":
					console.log(latestDays);

					const newDataNumberOfOrder_Daily = new Array(
						latestDays?.length
					).fill(0);
					const newDataTotalPrice_Daily = new Array(
						latestDays?.length
					).fill(0);
					props.orders?.forEach((order) => {
						const orderDate = new Date(order.dateCreated);
						const orderDateFormatted = formatDate(orderDate);

						if (
							order.status === "Success" &&
							latestDays?.includes(orderDateFormatted)
						) {
							newDataNumberOfOrder_Daily[
								latestDays.indexOf(orderDateFormatted)
							] += 1;
							newDataTotalPrice_Daily[
								latestDays.indexOf(orderDateFormatted)
							] += order.totalPrice;
						}
					});
					dataNumberOfOrder.current = newDataNumberOfOrder_Daily;
					dataTotalPrice.current = newDataTotalPrice_Daily;

					break;
				default:
					break;
			}
		},
		[props.orders]
	);

	useEffect(() => {
		updateData(orderByStatistics, orderByMonthlyOfYear);
	}, [orderByMonthlyOfYear, orderByStatistics, updateData]);

	const data = {
		labels,
		datasets: [
			{
				label: "Total number of orders (Success)",
				data: dataNumberOfOrder.current,
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
			{
				label: "Total amount (Success)",
				data: dataTotalPrice.current,
				borderColor: "rgb(12, 99, 132)",
				backgroundColor: "rgba(12, 99, 132, 0.5)",
			},
		],
	};

	// Xử lý data trạng thái order (tính tỉ lệ % cho biểu đồ)
	const [orderSuccessful, setOrderSuccessful] = useState(0);
	const [orderProcessing, setOrderProcessing] = useState(0);
	const [orderFailure, setOrderFailure] = useState(0);
	const [orderDelivering, setOrderDelivering] = useState(0);

	// Lấy dữ liệu trạng thái đơn hàng
	useEffect(() => {
		const orderTotal = props.orders?.length ? props.orders.length : 0;
		let orderSuccessfulTotal = 0;
		let orderProcessingTotal = 0;
		let orderFailureTotal = 0;
		let orderDeliveringTotal = 0;
		props.orders?.forEach((order) => {
			if (order.status === "Success") {
				orderSuccessfulTotal++;
			} else if (order.status === "Processing") {
				orderProcessingTotal++;
			} else if (order.status === "Canceled") {
				orderFailureTotal++;
			} else if (order.status === "Delivering") {
				orderDeliveringTotal++;
			}
		});
		setOrderSuccessful((orderSuccessfulTotal / orderTotal) * 100); // Tính %
		setOrderProcessing((orderProcessingTotal / orderTotal) * 100);
		setOrderFailure((orderFailureTotal / orderTotal) * 100);
		setOrderDelivering((orderDeliveringTotal / orderTotal) * 100);
	}, [props.orders]);

	return (
		<div className='conatiner p-4 '>
			<div className='row'>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='shadow-4 rounded py-5 mb-5 bg-light'>
						<h4 className='text-black text-center mb-3 pb-3'>
						Order status statistics chart
							<hr />
						</h4>
						<PieChart
							series={[
								{
									data: [
										{
											value: orderSuccessful,
											label: "Application successful",
											color: "#4db44d",
										},
										{
											value: orderFailure,
											label: "Application is cancelled",
											color: "#e03c3c",
										},
										{
											value: orderProcessing,
											label: "Application is being processed",
											color: "#4e4ee6",
										},
										{
											value: orderDelivering,
											label: "Application is being delivered",
											color: "#e1e13d",
										},
									],
									highlightScope: {
										faded: "global",
										highlighted: "item",
									},
									faded: {
										innerRadius: 30,
										additionalRadius: -30,
										color: "gray",
									},
									arcLabel: (item) => `${item.value.toFixed(0)}%`,
								},
							]}
							width={500}
							height={250}
						/>
					</div>
				</div>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='shadow-4 rounded p-5 mb-5 bg-light'>
						<h4 className='text-black text-center mb-3'>
						Top 3 most liked arts
							<hr />
						</h4>
					</div>
				</div>
			</div>
			<div className='shadow-4 rounded p-5 d-flex align-items-end flex-column bg-light'>
				<div className='d-flex'>
					<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
						<InputLabel id='demo-select-small-label'>
						Statistics follow
						</InputLabel>
						<Select
							labelId='demo-select-small-label'
							id='demo-select-small'
							value={orderByStatistics}
							label='Statistics follow'
							onChange={handleChangeOrderByStatistics}
						>
							<MenuItem value={"yearly"}>Annual</MenuItem>
							<MenuItem value={"monthly"}>Monthly</MenuItem>
							<MenuItem value={"daily"}>Daily</MenuItem>
						</Select>
					</FormControl>
					{orderByStatistics === "daily" && (
						<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
							<InputLabel id='demo-select-small-label'>
								Lọc theo
							</InputLabel>
							<Select
								labelId='demo-select-small-label'
								id='demo-select-small'
								value={orderByLatestDate}
								label='Lọc theo'
								onChange={handleChangeOrderByLastestDate}
							>
								<MenuItem value={"3"}>The last 3 days</MenuItem>
								<MenuItem value={"7"}>Last 7 days</MenuItem>
								<MenuItem value={"15"}>The last 15 days</MenuItem>
								<MenuItem value={"30"}>Last 30 days</MenuItem>
							</Select>
						</FormControl>
					)}
					{orderByStatistics === "monthly" && (
						<FormControl sx={{ m: 1, minWidth: 170 }} size='small'>
							<InputLabel id='demo-select-small-label'>Year</InputLabel>
							<Select
								labelId='demo-select-small-label'
								id='demo-select-small'
								value={orderByMonthlyOfYear}
								label='Year'
								onChange={handleChangeOrderByMonthlyOfYear}
							>
								{BY_YEAR.map((year) => (
									<MenuItem key={year} value={`${year}`}>
										{year}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</div>
				<Line options={options} data={data} />
			</div>
		</div>
	);
};