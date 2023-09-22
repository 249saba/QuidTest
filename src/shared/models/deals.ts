export class DealsModel {
  constructor(
    public id: number,
    public vendor_id: string,
    public title: string,
    public start_time: string,
    public end_time: string,
    public discount: string,
    public deal_id: string,
    public createdAt: string,
    public updatedAt: string,
    public delivery_type: [],
    public Deal: any
  ) {}
  static adapt(item: any): DealsModel {
    return item?.rows?.map(
      (item: any) =>
        new DealsModel(
          item.id,
          item.vendor_id,
          item.title,
          item.start_time,
          item.end_time,
          item.discount,
          item.deal_id,
          item.createdAt,
          item.updatedAt,
          item.delivery_type,
          item.Deal
        )
    );
  }
}
