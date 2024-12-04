import GenreModel from "./GenreModel";

class ArtModel {
   id?: any;
   idArt: number;
   nameArt?: string; // Có thể NULL
   author?: string;
   description?: string;
   price: number;
   quantity?: number;
   thumbnail?:  string;;
   listGenres?: GenreModel[]; // Danh sách thể loại
   listImages?: string[]; // Danh sách hình ảnh, có thể là URL
   isFavorited?: boolean; // Trạng thái yêu thích (Có thể lấy từ danh sách yêu thích của người dùng)
   finalPrice: number; // Thêm thuộc tính finalPrice để nhận giá cuối từ backend

   constructor(
      idArt: number,
      nameArt: string,
      author: string,
      description: string,
      price: number,
      quantity: number,
      thumbnail: string,
      listGenres: GenreModel[] = [],
      listImages: string[] = [],
      isFavorited: boolean = false,
      finalPrice: number 
   ) {
      this.idArt = idArt;
      this.nameArt = nameArt;
      this.author = author;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
      this.thumbnail = thumbnail;
      this.listGenres = listGenres;
      this.listImages = listImages;
      this.isFavorited = isFavorited;
      this.finalPrice = finalPrice; // Lưu giá đã tính toán từ backend
   }
}

export default ArtModel;
