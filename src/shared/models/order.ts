export class OrderModel {
    constructor(
      public user_name: string | null,
      public id: number,
      public order_id: string | null,
      public items_count: number | null,
      public quantity: number | null,
      public price: number | null,
      public status: string | null,
      public date: string | null,

    ) {}
    static adapt(item: any): OrderModel {
      console.log("items", item);
      return item.rows.map(
        (item: any) =>
          new OrderModel(
            item.User?.name,
            item.id,
            item.code,
            item.items_count,
            item.quantity_count,
            item.grand_total,
            item.state,
            item.order_placed_at,
           
          )
      );

    }
  }
  