export class DealTypesModel {
  constructor(
    public id: number,
    public name: string,
    public label: string,
    public value: string,
    public image_url: string,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): DealTypesModel {
    return item.map(
      (item: any) =>
        new DealTypesModel(
          item.id,
          item.name,
          item.name,
          item.name,
          item.image_url,
          item.createdAt,
          item.updatedAt
        )
    );
  }
}
