import { json } from "stream/consumers";
import {
  CategoriesModel,
  CitiesModel,
  CountriesModel,
  DealTypesModel,
  PlansModel,
  ProductByCategoryModel,
  ProductsModel,
  QuestionAnswersModel,
  TaxTypesModel,
  UnitsModel,
} from "./models";
import { GetStorage } from "./utils/authService";
import { backendCall } from "./utils/backendService/backendCall";
import { SubCategoryModel } from "./models/subCatmodel";

const getCategoriesById = (): Promise<any> => {
  let moduleId = localStorage.getItem("moduleId");
  // let moduleId = Number(sessionStorage.getItem("moduleId"));
  console.log("moduleId:", moduleId);
  if (!moduleId) {
    console.log("moduleId:", moduleId);
    let storage: any = GetStorage();
    moduleId = storage?.module_id;
    console.log("moduleId:", moduleId);
  }
  return backendCall({
    url: `/api/vendor/categories/${moduleId}`,
    method: "GET",
    dataModel: CategoriesModel,
  }).then((res) => res);
};
const getSubCatById = (): Promise<any> => {
  let moduleId = localStorage.getItem("moduleId");
  // let moduleId = Number(sessionStorage.getItem("moduleId"));
  console.log("moduleId:", moduleId);
  if (!moduleId) {
    console.log("moduleId:", moduleId);
    let storage: any = GetStorage();
    moduleId = storage?.module_id;
    console.log("moduleId:", moduleId);
  }
  return backendCall({
    url: `/api/vendor/categories/${moduleId}`,
    method: "GET",
    dataModel: SubCategoryModel,
  }).then((res) => res );
};

const GetPlansByModuleId = (): Promise<any> => {
  let moduleId = localStorage.getItem("moduleId");
  return backendCall({
    url: `/api/vendor/plans/${moduleId}`,
    method: "GET",
    dataModel: PlansModel,
  }).then((res) => res);
};

const GetProductByCategoryId = ({ id }: any) => {
  return backendCall({
    url: `/api/vendor/product/products_by_category/${id}`,
    method: "GET",
    dataModel: ProductByCategoryModel,
  }).then((res) => res);
};

const GetQuestionAnswers = (): Promise<any> => {
  let storedJSON: any = localStorage.getItem("FRANKZONE_VENDOR");
  let m = JSON.parse(storedJSON)
  // let moduleId = Number(sessionStorage.getItem("moduleId"));
  // let moduleId = localStorage.getItem("moduleId");
return backendCall({
    url: `/api/vendor/questions/${m?.module_id}`,
    method: "GET",
    dataModel: QuestionAnswersModel,
  }).then((res) => res);
  // else{
  //   return backendCall({
  //     url: `/api/vendor/questions/${m?.id}`,
  //     method: "GET",
  //     dataModel: QuestionAnswersModel,
  //   }).then((res) => res);
  // }

};

const getAllCountries = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/countries`,
    method: "GET",
    dataModel: CountriesModel,
  }).then((res) => res);
};

const getAllCitiesByCountryId = (id: any): Promise<any> => {
  return backendCall({
    url: `/api/vendor/cities/${id}`,
    method: "GET",
    dataModel: CitiesModel,
  }).then((res) => res);
};

const GetUnits = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/units`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetProductCategory = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/categories`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetProductbyCategory = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/categories`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetAttributes = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/attributes`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetDynamicAttribute = (id:any): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/attributes/${id}`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetCategory = (): Promise<any> => {
   let storedJSON: any = localStorage.getItem("FRANKZONE_VENDOR");
   let m = JSON.parse(storedJSON)
console.log("storedJSON",m?.module_id)
  return backendCall({
    url: `/api/vendor/category_management/${m?.module_id}`,
    method: "GET",
    dataModel: UnitsModel,
  }).then((res) => res);
};
const GetTaxTypes = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/product/tax_types`,
    method: "GET",
    dataModel: TaxTypesModel,
  }).then((res) => res);
};

const GetDealTypes = (): Promise<any> => {
  return backendCall({
    url: `/api/vendor/deals/types`,
    method: "GET",
    dataModel: DealTypesModel,
  }).then((res) => res);
};

export {
  getCategoriesById,
  getAllCountries,
  getAllCitiesByCountryId,
  GetQuestionAnswers,
  GetPlansByModuleId,
  GetUnits,
  GetProductCategory,
  GetAttributes,
  GetDynamicAttribute,
  GetTaxTypes,
  GetCategory,
  GetDealTypes,
  GetProductByCategoryId,
  getSubCatById
};
