class ItemImagesModel {
  constructor(public id: number, public src: string) {}
  static adapt(item: any): ItemImagesModel {
    return new ItemImagesModel(item.id, item.src);
  }
}

export class ItemDetailModel {
  constructor(
    public id: number,
    public ItemImages: ItemImagesModel[],
    public title: string,
    public rating: number,
    public totalRatings: number,
    public brandIcon: string,
    public location: string,
    public price: number,
    public sizes: Number[],
    public colors: String[],
    public description: string
  ) {}
  static adapt(item: any): ItemDetailModel {
    return new ItemDetailModel(
      item.id,
      item.itemImages.map((item: any) => ItemImagesModel.adapt(item)),
      item.title,
      item.rating,
      item.totalRatings,
      item.brandIcon,
      item.location,
      item.price,
      item.sizes,
      item.colors,
      item.description
    );
  }
}
