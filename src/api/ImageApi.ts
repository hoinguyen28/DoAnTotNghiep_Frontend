import { endpointBE } from "../layouts/utils/Constant";
import ImageModel from "../model/ImageModel";
import { request } from "./Request";

async function getArtImage(endpoint: string): Promise<ImageModel[]> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   return response._embedded.images.map((imageData: any) => ({
      ...imageData,
   }));
}

export async function getAllImageByArt(idArt: number): Promise<ImageModel[]> {
   // Xác định endpoint
   const endpoint: string = endpointBE + `/arts/${idArt}/listImages`;

   return getArtImage(endpoint);
}