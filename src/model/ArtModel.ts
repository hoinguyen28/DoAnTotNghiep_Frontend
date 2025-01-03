import GenreModel from "./GenreModel";

class ArtModel {
   id?: any;
   idArt: number;
   nameArt?: string; 
   author?: string;
   idAuthor?:number;
   description?: string;
   price: number;
   quantity?: number;
   thumbnail?:  string;
   listGenres?: GenreModel[]; // Danh sách thể loại
   listImages?: string[]; // Danh sách hình ảnh, có thể là URL
   relatedImg?: string[]; 
   idGenres?: number[];
   discountPercentage?: number;
   isFavorited?: boolean; // Trạng thái yêu thích (Có thể lấy từ danh sách yêu thích của người dùng)
   finalPrice: number; // Thêm thuộc tính finalPrice để nhận giá cuối từ backend
   genresList?: GenreModel[];
   reviewStatus?: string;

   constructor(
      idArt: number,
      nameArt: string,
      author: string,
      idAuthor:number,
      description: string,
      price: number,
      quantity: number,
      thumbnail: string,
      listGenres: GenreModel[] = [],
      listImages: string[] = [],
      relatedImg: string[] = [],
      discountPercentage: number,
      isFavorited: boolean = false,
      finalPrice: number ,
      reviewStatus: string
   ) {
      this.idArt = idArt;
      this.nameArt = nameArt;
      this.author = author;
      this.idAuthor = idAuthor;
      this.description = description;
      this.price = price;
      this.quantity = quantity;
      this.thumbnail = thumbnail;
      this.listGenres = listGenres;
      this.listImages = listImages;
      this.relatedImg = relatedImg;
      this.discountPercentage = discountPercentage;
      this.isFavorited = isFavorited;
      this.finalPrice = finalPrice; 
      this.reviewStatus = reviewStatus;
   }
}

export default ArtModel;
