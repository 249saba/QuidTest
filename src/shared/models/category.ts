export class CategoryModel {
  constructor(
    public id: number,
    public icon: string,
    public title: string,
    public rows: []
  ) {}

  static adapt(items: any): CategoryModel {
    return items.map(
      (item: any) =>
        new CategoryModel(item.id, item.icon, item.title, item.rows)
    );
  }
}
