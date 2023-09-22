export class SubCategoryModel {
    constructor(
      public id: number,
      public module_id: number,
      public name: string,
      public label: string,
      public value: string,
      public parent_id: number | null,
      public createdAt: string,
      public updatedAt: string
    ) {}
    static adapt(item: any): SubCategoryModel {
      console.log("item",item)
      return item.map(
        (item: any) =>
          new SubCategoryModel(
            item.id,
            item.module_id,
            item.name,
            item.name,
            item.name,
            item.parent_id,
            item.createdAt,
            item.updatedAt,
          )
      );
    }
  }
  
  