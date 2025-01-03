import { endpointBE } from "../layouts/utils/Constant";
import DiscountModel from "../model/DiscountModel";
import { requestAdmin, requestArtist } from "./Request";
import { getAllImageByArt } from "./ImageApi";

export async function getAllDiscounts(idArtist?: number): Promise<DiscountModel[]> {
  const endpoint = endpointBE + "/discounts?sort=idDiscount,asc";
  const response = await requestAdmin(endpoint);

  let discounts: DiscountModel[] = [];
  if (response && response._embedded && response._embedded.discounts) {
    discounts = await Promise.all(
      response._embedded.discounts.map(async (discountData: any) => {
        let artDetails = null;
        let thumbnailUrl = null; // Đảm bảo khai báo bên ngoài try-catch

        // Lấy thông tin chi tiết từ API art
        if (discountData._links?.art?.href) {
          try {
            artDetails = await requestArtist(discountData._links.art.href);
            // Lấy danh sách ảnh và tìm thumbnail
            const responseImg = await getAllImageByArt(artDetails.idArt);
            console.log("Dữ liệu responseImg:", responseImg);
            // Tìm URL của thumbnail (nếu có)
            const thumbnail = responseImg.find((image: any) => image.thumbnail === true);
            thumbnailUrl = thumbnail?.urlImage || null; 
          } catch (error) {
            console.error("Error fetching art details or images:", error);
          }
        }

        return {
          idDiscount: discountData.idDiscount,
          discountPercentage: discountData.discountPercentage,
          startDate: new Date(discountData.startDate),
          endDate: new Date(discountData.endDate),
          idArt: artDetails?.idArt || null,
          nameArt: artDetails?.nameArt || null,
          price: artDetails?.price || null,
          finalPrice: artDetails?.finalPrice || null,
          thumbnail: thumbnailUrl, 
        };
      })
    );
  }

  return discounts;
}
export async function getAllDiscounts1(idArtist?: number): Promise<DiscountModel[]> {
  const endpoint = endpointBE + "/discounts?sort=idDiscount,asc";
  try {
    const response = await requestAdmin(endpoint);

    if (!response || !response._embedded || !response._embedded.discounts) {
      return []; // Trả về rỗng nếu không có dữ liệu
    }

    // Xử lý từng discount
    const discounts = await Promise.all(
      response._embedded.discounts.map(async (discountData: any) => {
        let artDetails = null;
        let thumbnailUrl = null;

        // Lấy thông tin chi tiết từ API art
        if (discountData._links?.art?.href) {
          try {
            artDetails = await requestArtist(discountData._links.art.href);

            // Kiểm tra id_author của artDetails với idArtist
            if (idArtist && artDetails.idAuthor !== idArtist) {
              return null; // Bỏ qua nếu không khớp id_author
            }

            // Lấy danh sách ảnh và tìm thumbnail
            const responseImg = await getAllImageByArt(artDetails.idArt);
            const thumbnail = responseImg.find((image: any) => image.thumbnail === true);
            thumbnailUrl = thumbnail?.urlImage || null;
          } catch (error) {
            console.error("Error fetching art details or images:", error);
            return null; // Bỏ qua nếu gặp lỗi
          }
        }

        // Trả về thông tin discount nếu hợp lệ
        return {
          idDiscount: discountData.idDiscount,
          discountPercentage: discountData.discountPercentage,
          startDate: new Date(discountData.startDate),
          endDate: new Date(discountData.endDate),
          idArt: artDetails?.idArt || null,
          nameArt: artDetails?.nameArt || null,
          price: artDetails?.price || null,
          finalPrice: artDetails?.finalPrice || null,
          thumbnail: thumbnailUrl,
        };
      })
    );

    // Loại bỏ các phần tử null
    return discounts.filter((discount) => discount !== null);
  } catch (error) {
    console.error("Error fetching discounts:", error);
    return []; // Trả về rỗng nếu gặp lỗi
  }
}


export async function getDiscountById(idDiscount: number): Promise<DiscountModel | null> {
  const endpoint = endpointBE + `/discounts/${idDiscount}`;
  const response = await requestAdmin(endpoint);

  let discount: DiscountModel | null = null;
  
  // Kiểm tra nếu có phản hồi hợp lệ từ API
  if (response) {
    let artDetails = null;
    let thumbnailUrl = null; // Khai báo biến thumbnailUrl

    // Lấy thông tin chi tiết từ API art
    if (response._links?.art?.href) {
      try {
        artDetails = await requestAdmin(response._links.art.href);
        // Lấy danh sách ảnh và tìm thumbnail
        const responseImg = await getAllImageByArt(artDetails.idArt);
        // Tìm URL của thumbnail (nếu có)
        const thumbnail = responseImg.find((image: any) => image.thumbnail === true);
        thumbnailUrl = thumbnail?.urlImage || "";
      } catch (error) {
        console.error("Error fetching art details or images:", error);
      }
    }

    // Trả về thông tin giảm giá cùng với thông tin tác phẩm nghệ thuật và thumbnail nếu có
    discount = {
      idDiscount: response.idDiscount,
      discountPercentage: response.discountPercentage,
      startDate: new Date(response.startDate),
      endDate: new Date(response.endDate),
      idArt: artDetails?.idArt || null,
      nameArt: artDetails?.nameArt || null,
      price: artDetails?.price || null,
      finalPrice: artDetails?.finalPrice || null,
      thumbnail: thumbnailUrl,
    };
  }

  // Trả về đối tượng DiscountModel hoặc null nếu không có phản hồi hợp lệ
  return discount;
}


  
  