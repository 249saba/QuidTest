export class NearRestaurantsModel {
  constructor(
    public id: number,
    public icon: string,
    public bg_icon: string,
    public amount: number,
    public title: string
  ) {}
  static adapt(items: any): NearRestaurantsModel {
    return items.map(
      (item: any) =>
        new NearRestaurantsModel(
          item.id,
          item.icon,
          item.bg_icon,
          item.amount,
          item.title
        )
    );
  }
}
