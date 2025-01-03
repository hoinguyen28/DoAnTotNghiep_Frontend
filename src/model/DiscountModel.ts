class DiscountModel {
    id?: any;
    idDiscount?: number;
    discountPercentage?: number;
    startDate?: Date;  
    endDate?: Date;  
    idArt?: number;
    thumbnail?:  string | null;
    nameArt?: string;
    price? : number;
    finalPrice? : number;
  
  
    constructor(
      idDiscount: number,
      discountPercentage: number,
      startDate: Date,
      endDate: Date,  
      idArt: number,
      thumbnail:  string,
      nameArt: string,
      price: number,
      finalPrice: number

    ) {
      this.idDiscount = idDiscount;
      this.discountPercentage = discountPercentage;
      this.startDate = new Date(startDate);  
      this.endDate = new Date(endDate);   
      this.idArt = idArt;
      this.thumbnail = thumbnail;
      this.nameArt = nameArt;
      this.price = price  
      this.finalPrice = finalPrice  
    }
  }
  
export default DiscountModel;