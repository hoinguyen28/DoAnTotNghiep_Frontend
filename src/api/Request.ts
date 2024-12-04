import { isTokenExpired } from "../layouts/utils/JwtService";

export async function request(endpoint: string) {
   // Truy cập đến đường dẫn
   const response = await fetch(endpoint);

   // Thất bại
   if (!response.ok) {
      throw new Error(`Không thể truy cập ${endpoint}`);
   }

   // Thành công
   return response.json();
}

export async function requestAdmin(endpoint: string) {
   const token = localStorage.getItem("token");

   if (!token) {
      return;
   }
   if (!isTokenExpired(token)) {
      return;
   }
   // Truy cập đến đường dẫn
   const response = await fetch(endpoint, {
      method: "GET",
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   // Thất bại
   if (!response.ok) {
      throw new Error(`Không thể truy cập ${endpoint}`);
   }

   // Thành công
   return response.json();
}
export async function requestAuthor(endpoint: string) {
   const token = localStorage.getItem("token");

   if (!token) {
      throw new Error("Token không tồn tại.");
   }

   if (!isTokenExpired(token)) {
      throw new Error("Token đã hết hạn.");
   }

   // Gửi yêu cầu với quyền tác giả
   const response = await fetch(endpoint, {
      method: "GET", 
      headers: {
         Authorization: `Bearer ${token}`,
         Role: "author"  
      },
   });

   if (!response.ok) {
      throw new Error(`Không thể truy cập ${endpoint}`);
   }

   return response.json();
}
