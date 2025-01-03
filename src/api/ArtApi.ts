import { endpointBE } from "../layouts/utils/Constant";
import ArtModel from "../model/ArtModel";
import GenreModel from "../model/GenreModel";
import { request, requestAdmin } from "./Request";
import { getGenreByIdArt } from "./GenreApi";
import { getAllImageByArt } from "./ImageApi";

interface ResultInterface {
  artList: ArtModel[];
  totalPage: number;
  size: number;
}
export async function getArt1(endpoint: string): Promise<ResultInterface> {
   // Gọi phương thức request để lấy dữ liệu từ API
   const response = await request(endpoint);

   // Kiểm tra sự tồn tại của _embedded và arts trong response
   if (!response._embedded || !response._embedded.arts) {
      throw new Error("No arts found in response");
   }

   console.log("Response từ API:", response);

   // Lấy thông tin trang từ response
   const totalPage: number = response.page.totalPages;
   const size: number = response.page.totalElements;


   // Lấy danh sách nghệ thuật từ _embedded.arts
   const ArtList: ArtModel[] = response._embedded.arts.map((ArtData: ArtModel) => ({
      ...ArtData,
   }));
   // Lấy ảnh thumbnail của từng nghệ thuật
   const ArtList1 = await Promise.all(
      ArtList.map(async (Art: ArtModel) => {
         const responseImg = await getAllImageByArt(Art.idArt);
         console.log(`Hình ảnh cho Art ID ${Art.idArt}:`, responseImg);

         const thumbnail = responseImg.filter(image => image.thumbnail);

         // Nếu không có thumbnail, gán giá trị mặc định là một URL placeholder hoặc null
         const thumbnailUrl = thumbnail.length > 0 ? thumbnail[0].urlImage : "https://society6.com/cdn/shop/files/WallArt_Hero_3.jpg?v=1727132245&width=1980&height=1320&crop=center";

         return {
            ...Art,
            thumbnail: thumbnailUrl,  // Chắc chắn là một chuỗi, không phải null
         };
      })
   );
   // Trả về dữ liệu sau khi xử lý
   return { artList: ArtList1, totalPage: totalPage, size: size };
}

async function getArt(endpoint: string): Promise<ResultInterface> {
   // Gọi phương thức request để lấy dữ liệu từ API
   const response = await request(endpoint);

   // Kiểm tra sự tồn tại của _embedded và arts trong response
   if (!response._embedded || !response._embedded.arts) {
      throw new Error("No arts found in response");
   }

   // Lấy thông tin trang từ response
   const totalPage: number = response.page.totalPages;
   const size: number = response.page.totalElements;

   // Lấy danh sách nghệ thuật từ _embedded.arts
   const ArtList: ArtModel[] = response._embedded.arts.map((ArtData: ArtModel) => ({
      ...ArtData,
   }));

   // Lấy ảnh thumbnail của từng nghệ thuật
   const ArtList1 = await Promise.all(
      ArtList.map(async (Art: ArtModel) => {
         const responseImg = await getAllImageByArt(Art.idArt);
         const thumbnail = responseImg.filter(image => image.thumbnail);

         // Nếu không có thumbnail, gán giá trị mặc định là một URL placeholder hoặc null
         const thumbnailUrl = thumbnail.length > 0 ? thumbnail[0].urlImage : "https://society6.com/cdn/shop/files/WallArt_Hero_3.jpg?v=1727132245&width=1980&height=1320&crop=center";

         return {
            ...Art,
            thumbnail: thumbnailUrl,  // Chắc chắn là một chuỗi, không phải null
         };
      })
   );

   // Trả về dữ liệu sau khi xử lý
   return { artList: ArtList1, totalPage: totalPage, size: size };
}

export async function getAllArt(size?: number, page?: number): Promise<ResultInterface> {
   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Xác định endpoint
   const endpoint: string = endpointBE + `/arts?sort=idArt,desc&size=${size}&page=${page}`;

   return getArt(endpoint);
}

export async function getArtsByReviewStatus(status: string, size?: number, page?: number): Promise<ResultInterface> {
   // Xác định endpoint
   if (!size) {
      size = 8;
   }
   const endpoint = `${endpointBE}/arts/search/findByReviewStatus?reviewStatus=${status}`;

   return getArt(endpoint); // Tái sử dụng hàm getArt để thực hiện HTTP request
}

export async function getAllArtArtist(idArtist?: number): Promise<ResultInterface> {
   // Kiểm tra nếu idArtist không tồn tại
   if (!idArtist) {
       throw new Error("idArtist is required");
   }

   // Xác định endpoint
   const endpoint = `${endpointBE}/arts/search/findByIdAuthor?idAuthor=${idArtist}`;
   
   return getArt(endpoint);
}


export async function getNewArt(): Promise<ResultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/arts?sort=idArt,desc&size=4";

   return getArt(endpoint);
}
export async function getRecommenArt(): Promise<ResultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/arts?sort=idArt,desc&size=4";

   return getArt(endpoint);
}

export async function searchArt(
   keySearch?: string,
   idGenre?: number,
   filter?: number,
   size: number = 10,
   page: number = 0
): Promise<ResultInterface> {
   if (keySearch) {
       keySearch = keySearch.trim();
   }

   const optionsShow = `size=${size}&page=${page}`;
   let endpoint: string = `${endpointBE}/arts?${optionsShow}`;
   let filterEndpoint = "";

   // Lọc theo các tiêu chí
   switch (filter) {
       case 1:
           filterEndpoint = "sort=nameArt";
           break;
       case 2:
           filterEndpoint = "sort=nameArt,desc";
           break;
       case 3:
           filterEndpoint = "sort=price";
           break;
       case 4:
           filterEndpoint = "sort=price,desc";
           break;
       case 5:
           filterEndpoint = "sort=quantity,desc";
           break;
   }

   // Xây dựng endpoint dựa trên các tham số
   if (keySearch && (!idGenre || idGenre === 0)) {
       // Trường hợp chỉ có `keySearch`
       endpoint = `${endpointBE}/arts/search/findByNameArtContaining?nameArt=${keySearch}&${optionsShow}&${filterEndpoint}`;
   } else if (idGenre && idGenre > 0) {
       // Trường hợp có `idGenre` và có thể có `keySearch`
       if (keySearch) {
           endpoint = `${endpointBE}/arts/search/findByNameArtContainingAndListGenres_idGenre?nameArt=${keySearch}&idGenre=${idGenre}&${optionsShow}&${filterEndpoint}`;
       } else {
           endpoint = `${endpointBE}/arts/search/findByListGenres_idGenre?idGenre=${idGenre}&${optionsShow}&${filterEndpoint}`;
       }
   } else {
       // Trường hợp không có `keySearch` và `idGenre`
       endpoint = `${endpointBE}/arts?${optionsShow}&${filterEndpoint}`;
   }

   try {
       const response = await request(endpoint);

       // Chuyển đổi dữ liệu nhận được từ API thành `ArtModel`
       const artList: ArtModel[] = response._embedded.arts.map((art: any) => ({
           idArt: art.idArt,
           nameArt: art.nameArt,
           author: art.author,
           description: art.description,
           price: art.price,
           quantity: art.quantity,
           thumbnail: null, // Bạn sẽ lấy thumbnail sau
           listGenres: [], // Cần gọi API `listGenres` nếu muốn lấy thông tin thể loại
           listImages: [], // Lưu mảng các URL hình ảnh
           isFavorited: false, // Mặc định
           finalPrice: art.finalPrice,
       }));

       // Lấy ảnh thumbnail của từng nghệ thuật
       const artListWithImages = await Promise.all(
           artList.map(async (art: ArtModel) => {
               // Lấy ảnh từ API theo idArt
               const responseImg = await getAllImageByArt(art.idArt);
               
               // Lọc các URL hình ảnh
               const listImages: string[] = responseImg.map((image: any) => image.urlImage);

               // Lấy thumbnail (nếu có)
               const thumbnail = responseImg.filter(image => image.thumbnail);
               const thumbnailUrl = thumbnail.length > 0
                   ? thumbnail[0].urlImage
                   : "https://society6.com/cdn/shop/files/WallArt_Hero_3.jpg?v=1727132245&width=1980&height=1320&crop=center";

               return {
                   ...art,
                   thumbnail: thumbnailUrl, // Cập nhật thumbnail
                   listImages: listImages, // Cập nhật danh sách URL hình ảnh
               };
           })
       );

       const totalPage = response.page.totalPages;
       const sizeResult = response.page.size;

       return { artList: artListWithImages, totalPage, size: sizeResult };
   } catch (error) {
       console.error("Error fetching art data:", error);
       throw new Error("Không thể truy cập dữ liệu. Vui lòng thử lại.");
   }
}



export async function getArtById(idArt: number): Promise<ArtModel | null> {
   let artResponse: ArtModel = {
      idArt: 0,
      nameArt: "",
      idAuthor: 0,
      author: "",
      description: "",
      price: 0,
      quantity: 0,
      thumbnail: "",
      listGenres: [],
      listImages: [],
      isFavorited: false,
      finalPrice: 0,
   };

   const endpoint = endpointBE + `/arts/${idArt}`;
   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         artResponse = response;

         // Gọi API để lấy danh sách ảnh của Art
         const responseImg = await getAllImageByArt(response.idArt);

         // Lọc ảnh thumbnail từ danh sách ảnh
         const thumbnail = responseImg.find(image => image.thumbnail);

         // Trả về đối tượng Art với thông tin đầy đủ
         return {
            ...artResponse,
            thumbnail: thumbnail ? thumbnail.urlImage : "", // Gán URL ảnh thumbnail nếu có
            listImages: responseImg
               .map(image => image.urlImage)
               .filter((url): url is string => url !== undefined), // Lọc giá trị undefined
         };
      } else {
         throw new Error("Tranh không tồn tại");
      }
   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

export async function getArtByIdCartItem(idCart: number): Promise<ArtModel | null> {
   const endpoint = endpointBE + `/cart-items/${idCart}/art`;

   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         // Trả về đối tượng Art
         return {
            idArt: response.idArt,
            nameArt: response.nameArt || "",
            author: response.author || "",
            description: response.description || "",
            price: response.price || 0,
            quantity: response.quantity || 0,
            thumbnail: response.thumbnail || "",
            listGenres: response.listGenres || [],
            listImages: response.listImages || [],
            isFavorited: response.isFavorited || false,
            finalPrice: response.finalPrice || 0,
         };
      } else {
         throw new Error("Tranh không tồn tại");
      }
   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

export async function getTotalNumberOfArts(): Promise<number> {
   const endpoint = endpointBE + `/art/get-total`;
   try {
      // Gọi phương thức request()
      const response = await requestAdmin(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         // Trả về tổng số lượng tranh
         return response;
      }
   } catch (error) {
      throw new Error("Lỗi không gọi được endpoint lấy tổng số lượng tranh\n" + error);
   }

   // Nếu không có dữ liệu, trả về 0
   return 0;
}

export async function getArtByIdAllInformation(idArt: number): Promise<ArtModel | null> {
   let artResponse: ArtModel = {
      idArt: 0,
      nameArt: "",
      author: "",
      description: "",
      price: NaN,
      quantity: NaN,
      thumbnail: "",
      listGenres: [],
      listImages: [],
      isFavorited: false,
      finalPrice: NaN,
   };

   try {
      // Gọi phương thức lấy thông tin tranh
      const response = await getArtById(idArt);

      // Kiểm tra xem dữ liệu endpoint trả về có tồn tại không
      if (response) {
         // Lưu thông tin tranh
         artResponse = response;

         // Lấy tất cả hình ảnh của tranh
         const imagesList = await getAllImageByArt(response.idArt);
         const thumbnail = imagesList.find((image) => image.thumbnail);
         const relatedImg = imagesList
            .map((image) => (!image.thumbnail ? image.urlImage : null))
            .filter(Boolean); // Loại bỏ các giá trị null

         artResponse = {
            ...artResponse,
            listImages: relatedImg as string[],
            thumbnail: thumbnail?.urlImage || "",
         };

         // Lấy tất cả thể loại của tranh
         const genresList = await getGenreByIdArt(response.idArt);
         genresList.genreList.forEach((genre) => {
            const dataGenre: GenreModel = {
               idGenre: genre.idGenre,
               nameGenre: genre.nameGenre,
            };
            artResponse = {
               ...artResponse,
               listGenres: [...(artResponse.listGenres || []), dataGenre],
            };
         });

         return artResponse;
      } else {
         throw new Error("Tranh không tồn tại");
      }
   } catch (error) {
      console.error("Error: ", error);
      return null;
   }
}


