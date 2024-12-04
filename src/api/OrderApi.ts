import { endpointBE } from "../layouts/utils/Constant";
import CartItemModel from "../model/CartItemModel";
import OrderModel from "../model/OrderModel";
import { request } from "./Request";

export async function getAllOrders(): Promise<OrderModel[]> {
    try {
       const endpoint: string = endpointBE + "/orders?sort=idOrder,desc&size=100000";
       const response = await request(endpoint);
 
       // Kiểm tra nếu không có dữ liệu đơn hàng
       if (!response._embedded?.orders) {
          return [];
       }
 
       const orders = await Promise.all(
          response._embedded.orders.map(async (data: any) => {
             const responsePayment = await request(`${endpointBE}/orders/${data.idOrder}/payment`);
 
             return new OrderModel(
                data.idOrder,
                data.deliveryAddress,
                data.totalPrice,
                data.totalPriceProduct,
                data.feeDelivery,
                data.feePayment,
                new Date(data.dateCreated),
                data._embedded?.user,
                data.status,
             );
          })
       );
 
       return orders.map((order) => ({
          ...order,
          fullName: order.user?.fullName,
          phoneNumber: order.user?.phoneNumber,
          note: order.note || "",
          payment: order.payment || "",
          cartItems: [], // Thêm cartItems nếu cần thiết
       }));
    } catch (error) {
       console.error("Error while fetching orders:", error);
       throw error;
    }
 }

 export async function getAllOrdersByIdUser(idUser: number): Promise<OrderModel[]> {
    try {
       const endpoint = `${endpointBE}/users/${idUser}/listOrders?sort=idOrder,desc`;
       const response = await request(endpoint);
 
       // Kiểm tra nếu không có dữ liệu đơn hàng
       if (!response._embedded?.orders) {
          return [];
       }
 
       const orders = await Promise.all(
          response._embedded.orders.map(async (data: any) => {
             const responsePayment = await request(`${endpointBE}/orders/${data.idOrder}/payment`);
 
             return new OrderModel(
                data.idOrder,
                data.deliveryAddress,
                data.totalPrice,
                data.totalPriceProduct,
                data.feeDelivery,
                data.feePayment,
                new Date(data.dateCreated),
                data._embedded?.user,
                data.status,
             );
          })
       );
 
       return orders.map((order) => ({
          ...order,
          fullName: order.user?.fullName,
          phoneNumber: order.user?.phoneNumber,
          note: order.note || "",
          payment: order.payment || "",
          cartItems: [], // Thêm cartItems nếu cần thiết
       }));
    } catch (error) {
       console.error("Error while fetching orders for user:", error);
       throw error;
    }
 }
 
 export async function getOrdersById(idOrder: number): Promise<OrderModel | null> {
    const endpoint: string = `${endpointBE}/orders/${idOrder}`;
    try {
       // Lấy thông tin đơn hàng
       const responseOrder = await request(endpoint);
       
       // Lấy thông tin thanh toán của đơn hàng
       const responsePayment = await request(`${endpointBE}/orders/${responseOrder.idOrder}/payment`);
       
       // Lấy danh sách chi tiết đơn hàng
       const responseOrderDetail = await request(`${endpointBE}/orders/${responseOrder.idOrder}/listOrderDetails`);
       
       let cartItems: CartItemModel[] = [];
 
       // Lấy thông tin sách cho mỗi chi tiết đơn hàng
       await Promise.all(responseOrderDetail._embedded.orderDetails.map(async (orderDetail: any) => {
          const responseBook = await request(`${endpointBE}/order-detail/${orderDetail.idOrderDetail}/book`);
          cartItems.push({
             book: responseBook, 
             quantity: orderDetail.quantity, 
             review: orderDetail.review || null, // Nếu không có đánh giá thì gán null
          });
       }));
 
       // Tạo đối tượng OrderModel và trả về
       const order: OrderModel = new OrderModel(
          responseOrder.idOrder,
          responseOrder.deliveryAddress,
          responseOrder.totalPrice,
          responseOrder.totalPriceProduct,
          responseOrder.feeDelivery,
          responseOrder.feePayment,
          new Date(responseOrder.dateCreated),
          responseOrder._embedded.user,
          responseOrder.status,
       );
 
       // Thêm các thuộc tính khác vào order
       return {
          ...order,
          fullName: responseOrder.fullName,
          phoneNumber: responseOrder.phoneNumber,
          note: responseOrder.note || "",
          payment: responsePayment.namePayment,
          cartItems: cartItems, // Thêm thông tin chi tiết giỏ hàng
       };
    } catch (error) {
       console.error("Error while fetching order details:", error);
       return null;
    }
 }
 