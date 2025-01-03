import { endpointBE } from "../layouts/utils/Constant";
import DeliveryModel from "../model/DeliveryModel";
import { requestAdmin } from "./Request";

export async function getAllDelivery(): Promise<DeliveryModel[]> {
   const endpoint = endpointBE + "/deliveries?sort=idDelivery,asc";
   const response = await requestAdmin(endpoint);

   let delivery: DeliveryModel[] = [];
  if (response && response._embedded && response._embedded.deliveries) {
    delivery = response._embedded.deliveries.map((deliveryData: any) => ({
      idDelivery: deliveryData.idDelivery,
      nameDelivery: deliveryData.nameDelivery,
      description: deliveryData.description,
      feeDelivery: deliveryData.feeDelivery,
    }));
  }
   return delivery;
}
export async function getFeeDeliveryById(idDelivery: number): Promise<number | null> {
    const endpoint = `${endpointBE}/deliveries/${idDelivery}`; // Endpoint cho phương thức vận chuyển
    const response = await requestAdmin(endpoint);
  
    if (response && typeof response.feeDelivery === "number") {
      return response.feeDelivery;
    }
  
    return null;
  }
  
  