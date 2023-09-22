export class CategryModel{
  constructor(
    public id: number,
    public module_id: number,
    public name: string,
    public is_enabled: number,
    
  ) 

  {}
  static adapt(items: any): CategryModel {
    console.log("items",items)
    
    return items.rows.map(
      (item: any) =>
        new CategryModel(
          item.id,
          item.Category.module_id,
          item.Category.name,
          item.is_enabled,
        
        )
    );

  }
}
