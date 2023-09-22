export class ShortsModel {
    constructor(
      public id: number,
      public title: string,
      public image_url: string,
      public video_url: string,
   
    ) {}
    static adapt(item: any): ShortsModel {
      console.log("items", item);
      let data = item.rows.map(
        (item: any) =>
          new ShortsModel(item?.id,item?.title, item?.image_url, item?.video_url)
      );
  
      return { rows: data, count: item.count } as any;
    }
  }
  