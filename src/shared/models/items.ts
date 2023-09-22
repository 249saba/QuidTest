export class ItemsModel {
  constructor(public id: number, public icon: string, public title: string) {}
  static adapt(item: any): ItemsModel {
    return new ItemsModel(item.id, item.icon, item.title);
  }
}
