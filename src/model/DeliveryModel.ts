class DeliveryModel {
    id?: any;
    idDelivery?: number;
    description?: string;
    nameDelivery?: string;
    feeDelivery?: number;
 
    constructor(
    idDelivery: number,
    description: string,
    nameDelivery: string,
    feeDelivery: number,
     ) {
        this.idDelivery = idDelivery;
        this.description = description;
        this.nameDelivery = nameDelivery;
        this.feeDelivery = feeDelivery;
 }
}
export default DeliveryModel;