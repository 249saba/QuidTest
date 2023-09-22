export class PromotionsModel {
  constructor(
    public id: number,
    public title: string,
    public code: string,
    public expiry_date: string,
    public start_date: string
  ) {}
  static adapt(item: any): PromotionsModel {
    console.log(item);
    let data = item.rows.map(
      (item: any) =>
        new PromotionsModel(
          item.id,
          item.title,
          item.code,
          item.expiry_date,
          item.start_date
        )
    );
    return { rows: data, count: item.count } as any;
  }
}
