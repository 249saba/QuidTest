export class ModulesModel {
  constructor(
    public id: number,
    public bg_icon: string,
    public title: string,
    public routerLink: string
  ) {}
  static adapt(item: any): ModulesModel {
    return item.map(
      (item: any) =>
        new ModulesModel(item.id, item.image, item.name, "/selectPackage")
    );
  }
}
