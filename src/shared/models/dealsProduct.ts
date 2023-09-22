export class DealsProductModel {
    constructor(
      public id: number,
      public name: string,
      public price: number,
      public cover_image_url: string,
 
    ) {}
    static adapt(item: any): DealsProductModel {
      return item?.rows?.map(
        (item: any) =>
          new DealsProductModel(
            item?.id,
            item?.Product?.name,
            item?.Product?.DefaultVariant?.price,
            item?.Product?.DefaultVariant?.cover_image_url,
       
          )
      );
    }
  }
  