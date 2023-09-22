export class AttributesModel {
  constructor(
    public id: number,
    public name: string,
    public is_enabled: string,
    public createdAt: string
  ) {}
  static adapt(item: any): AttributesModel {
    console.log("items", item);
    let data = item.rows.map(
      (item: any) =>
        new AttributesModel(item.id, item.name, item.is_enabled, item.createdAt)
    );

    return { rows: data, count: item.count } as any;
  }
}
