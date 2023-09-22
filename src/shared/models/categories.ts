export class CategoriesModel {
  constructor(
    public id: number,
    public module_id: number,
    public name: string,
    public value: string,
    public label: string,
    public parent_id: number | null,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): CategoriesModel {
   
    return item.rows.map(
      (item: any) =>
        new CategoriesModel(
          item.id,
          item.module_id,
          item.name,
          item.name,
          item.name,
          item.parent_id,
          item.createdAt,
          item.updatedAt
        )
    );
  }
}

