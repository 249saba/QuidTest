export class UnitsModel {
  constructor(
    public id: number,
    public name: string,
    public label: string,
    public value: string,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): UnitsModel {
    return item.map(
      (item: any) =>
        new UnitsModel(
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
