import { ReactComponent as BluePackage } from "@assets/vendor/package/guarantee_blue.svg";

export class PlansModel {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public price: number,
    public interval: string,
    public frequency: number,
    public can_sell_deals: number,
    public can_sell_products: number,
    public can_deliver: number,
    public module_id: number,
    public paypal_product_id: number,
    public createdAt: string,
    public updatedAt: string
  ) {}
  static adapt(item: any): PlansModel {
    return item.map(
      (item: any) =>
        new PlansModel(
          item.id,

          item.title,
          item.description,
          item.price,
          item.interval,
          item.frequency,
          item.can_sell_deals,
          item.can_sell_products,
          item.can_deliver,
          item.module_id,
          item.paypal_product_id,
          item.createdAt,
          item.updatedAt
        )
    );
  }
}
