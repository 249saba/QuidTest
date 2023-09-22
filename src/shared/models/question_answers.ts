export class QuestionAnswersModel {
  constructor(
    public id: number,
    public question: string,
    public is_required: number,
    public module_id: string,
    public createdAt: string,
    public updatedAt: number | null,
    public answersModel: AnswersModel[]
  ) {}
  static adapt(item: any): QuestionAnswersModel {
    return item.map(
      (item: any) =>
        new QuestionAnswersModel(
          item.id,
          item.question,
          item.is_required,
          item.module_id,
          item.createdAt,
          item.updatedAt,
          item.QuestionOptions.map((item: any) => AnswersModel.adapt(item))
        )
    );
  }
}

class AnswersModel {
  constructor(
    public id: number,
    public option: string,
    public question_id: number,
    public createdAt: string,
    public updatedAt: number | null
  ) {}
  static adapt(item: any): AnswersModel {
    return new AnswersModel(
      item.id,
      item.option,
      item.question_id,
      item.createdAt,
      item.updatedAt
    );
  }
}
