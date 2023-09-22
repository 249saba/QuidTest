import { ItemsModel } from "./items";

export class CategoryItemsModel {
  constructor(
    public id: number,
    public title: string,
    public rows: ItemsModel[]
  ) {}

  static adapt(items: any): CategoryItemsModel {
    return items.map(
      (item: any) =>
        new CategoryItemsModel(
          item.id,
          item.title,
          item.rows.map((item: any) => ItemsModel.adapt(item))
        )
    );
  }
}
