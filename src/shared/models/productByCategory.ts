export class ProductByCategoryModel {
  constructor(
    public id: number,
    public name: string,
    public label: string,
    public value: string,
    public sub_text: string,
    public description: string,
    public contain_variations: number | null,
    public is_enabled: number | null,
    public vendor_id: number | null,
    public unit_id: number | null,
    public tax_type_id: number | null,
    public tax: number | null,
    public discount: number | null,
    public discount_type: string,
    public createdAt: string,
    public updatedAt: string,
    public category_id: number | null,
    public Category: object,
    public ProductImages: [],
    public ProductVariants: [],
    public stock: number,
    public price: number
  ) {}
  static adapt(item: any): ProductByCategoryModel {
    return item.map(
      (item: any) =>
        new ProductByCategoryModel(
          item.id,
          item.name,
          item.name,
          item.name,
          item.sub_text,
          item.description,
          item.contain_variations,
          item.is_enabled,
          item.vendor_id,
          item.unit_id,
          item.tax_type_id,
          item.tax,
          item.discount,
          item.discount_type,
          item.createdAt,
          item.updatedAt,
          item.category_id,
          item.Category,
          item.ProductImages,
          item.ProductVariants,
          item.ProductVariants.reduce(
            (total: any, item: any) => total.stock + item.stock
          ),
          item.ProductVariants.reduce(
            (total: any, item: any) => total.price + item.price
          )
        )
    );
  }
}
