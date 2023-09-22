export class CartItemsModel {
  constructor(
    public id: number,
    public title: string,
    public items: ItemsModel[]
  ) {}
  static adapt(item: any): CartItemsModel {
    return item.map(
      (item: any) =>
        new CartItemsModel(
          item.id,
          item.title,
          item.items.map((item: any) => ItemsModel.adapt(item))
        )
    );
  }
}

class ItemsModel {
  constructor(
    public id: number,
    public title: string,
    public itemImage: string,
    public pickupType: string,
    public dealType: string,
    public restaurantName: string,
    public items: number,
    public brandIcon: string,
    public location: string,
    public price: number
  ) {}
  static adapt(item: any): ItemsModel {
    return new ItemsModel(
      item.id,
      item.title,
      item.itemImage,
      item.pickupType,
      item.dealType,
      item.restaurantName,
      item.items,
      item.brandIcon,
      item.location,
      item.price
    );
  }
}
