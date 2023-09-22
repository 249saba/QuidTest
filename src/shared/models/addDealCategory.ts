export class AddDealCategory {
    constructor(
      public id: number,
   
      public name: string,
      public category_id: number,
      public Category_name: string,
      public module_id:number,
    
      public price:number | null,
      public image_url:string,
   
    ) {}
    static adapt(item: any): AddDealCategory {
        console.log("item",item)
      return item.map(
        (item: any) =>
          new AddDealCategory(
            item.id,
            item.name,
            item.category_id,
            item.Category.name,
            item.Category.module_id,
            item.DefaultVariant?.price?item.DefaultVariant?.price:null,
            item.DefaultVariant?.cover_image_url,
          )
      );
    }
  }