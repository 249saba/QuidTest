export class ViewOrderModal {
    constructor(
      public user_name: string | null,
      public user_id: number | null,
      public user_email: string | null,
      public phone: string |number| null,
      public order_id: number,
      public order_code: string |number| null,
      public status: string | null,
      public date: string | null,
      public OrderLines: [] | null,
      public shipping_address: string | null,
      
    ) {}
    static adapt(item: any): ViewOrderModal {
      return new ViewOrderModal(
            item.User?.name,
            item.User?.id,
            item.User?.email,
            item.User?.phone,
            item.id,
            item.code,
            item.state,
            item.order_placed_at,
            item.OrderLines,
            item.shipping_address
            );
        }
      }
  