export class CountriesModel {
  constructor(
    public id: number,
    public name: string,
    public label: string,
    public value: string,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): CountriesModel {
    return item.map(
      (item: any) =>
        new CountriesModel(
          item.id,
          item.name,
          item.name,
          item.name,
          item.createdAt,
          item.updatedAt
        )
    );
  }
}
