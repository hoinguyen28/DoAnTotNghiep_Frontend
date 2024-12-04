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
async function getArt(endpoint: string): Promise<ResultInterface > {
   // Gọi phương thức request()
   const response = await request(endpoint);

   // Lấy ra thông tin trang
   const totalPage: number = response.page.totalPages;
   const size: number = response.page.totalElements;

   // Lấy ra danh sách quyển sách
   const ArtList: ArtModel[] = response._embedded.Arts.map((ArtData: ArtModel) => ({
      ...ArtData,
   }))

   // Lấy ra ảnh của từng quyển sách
   const ArtList1 = await Promise.all(
      ArtList.map(async (Art: ArtModel) => {
         const responseImg = await getAllImageByArt(Art.idArt);
         const thumbnail = responseImg.filter(image => image.thumbnail);
         return {
            ...Art,
            thumbnail: thumbnail[0].urlImage,
         };
      })
   );

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

export async function getNewArt(): Promise<ResultInterface> {
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

    if (keySearch && idGenre === undefined) {
        endpoint = `${endpointBE}/arts/search/findByNameArtContaining?nameArt=${keySearch}&${optionsShow}&${filterEndpoint}`;
    } else if (idGenre !== undefined) {
        if (keySearch) {
            endpoint = `${endpointBE}/arts/search/findByNameArtContainingAndListGenres_idGenre?nameArt=${keySearch}&idGenre=${idGenre}&${optionsShow}&${filterEndpoint}`;
        } else {
            endpoint = `${endpointBE}/arts/search/findByListGenres_idGenre?idGenre=${idGenre}&${optionsShow}&${filterEndpoint}`;
        }
    }

    const response = await request(endpoint);

    // Chuyển đổi dữ liệu nhận được từ API thành `ArtModel`
    const artList: ArtModel[] = response._embedded.arts.map((art: any) => ({
        idArt: art.idArt,
        nameArt: art.nameArt,
        author: art.author,
        description: art.description,
        price: art.price,
        quantity: art.quantity,
        thumbnail: null, // Nếu cần, bạn có thể gọi API `listImages` để lấy ảnh
        listGenres: [], // Cần gọi API `listGenres` nếu muốn lấy thông tin thể loại
        listImages: [], // Cần gọi API `listImages` nếu muốn lấy hình ảnh
        isFavorited: false, // Mặc định
        finalPrice: art.finalPrice,
    }));

    const totalPage = response.page.totalPages;
    const sizeResult = response.page.size;

    return { artList, totalPage, size: sizeResult };
}

export async function getArtById(idArt: number): Promise<ArtModel | null> {
   let artResponse: ArtModel = {
      idArt: 0,
      nameArt: "",
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


