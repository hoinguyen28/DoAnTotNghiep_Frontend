import ArtModel from "./ArtModel";

class CartItemModel {
   idCart?: any;
   quantity: number;
   art: ArtModel;
   idUser?: number;
   review?: boolean;

   constructor(quantity: number, art: ArtModel) {
      this.quantity = quantity;
      this.art = art;
   }
}

export default CartItemModel;