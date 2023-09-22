export class CitiesModel {
  constructor(
    public id: number,
    public name: string,
    public label: string,
    public value: string,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): CitiesModel {
    return item.map(
      (item: any) =>
        new CitiesModel(
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
