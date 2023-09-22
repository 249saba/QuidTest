import { getUnit } from "@mui/material/styles/cssUtils";
import {
  GetDealTypes,
  GetProductByCategoryId,
  GetTaxTypes,
  GetUnits,
  getCategoriesById,
} from "@src/shared/apiService";
import CustomButton from "@src/shared/customButton";
import CustomCard from "@src/shared/cards/customCard";
import imageLogo from "@assets/icons/imageLogo.png";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { ReactComponent as DateIcon } from "@assets/vendor/icons/datepicker.svg";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { useNavigate } from "react-router";
import { date, object } from "yup";
import Multiselect from "multiselect-react-dropdown";
import DateTimePicker from "react-datetime-picker";
import { ReactComponent as Calender } from "@assets/vendor/icons/calendar.svg";
import SelectCategory from "./selectCategory";
import "@src/index.scss";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
import { ReactComponent as Email } from "@assets/vendor/icons/mail.svg";
import AddBlack from "@assets/vendor/icons/add_black.png";
import Apple from "@assets/vendor/icons/apple.png";

import * as Yup from "yup";
import Shop from "@assets/icons/Enable Shop.png";
import SeperatorLine from "@src/shared/seperator/seperatorLine";

import { Button, IconButton, Typography } from "@material-tailwind/react";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { SetStorage } from "@src/shared/utils/authService";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import Checkbox from "@src/shared/checkbox/checkbox";

import AutoLocation from "@src/shared/autoLocation";

import { MdRemoveCircleOutline } from "react-icons/md";

import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { json } from "node:stream/consumers";
import { Breadcrumbs } from "@material-tailwind/react";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import LazyImage from "@src/shared/lazyImage";
import CustomSelect from "@src/shared/select/customSelect";

export interface initialSchemaValues {
  title: string;
  deal_id: string | object;
  discount: number | undefined;
  deliveryType: [];
  start_time: Date | any;
  end_time: Date | any;
  categories: [];
  productimage: any;
  // products: [];
}

const FormSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  deal_id: Yup.object().label("deal_id").required("Deal type  is required"),
  start_time: Yup.date()
    .typeError("Start date is required and must be less than end date")
    .label("Start date")
    .required("Start date is required"),

  end_time: Yup.date()
    .typeError("End date is required and must be greater than start date")
    .nullable()
    .required("End date is required")
    .min(Yup.ref("start_time"), "End date can't be before start date")
    .when("start_time", (start_time, schema) => {
      return schema.test({
        name: "dateEquality",
        exclusive: true,
        message: "End date must not equal to the start date",
        test: function (endDate: any) {
          return endDate > start_time;
        },
      });
    })
    .notOneOf(
      [Yup.ref("start_time")],
      "Start time and Finish Time cannot be same"
    )
    .when("start_time", (start_time, schema) => {
      return schema.test({
        name: "dateEquality",
        exclusive: true,
        message: "End date must not equal to the start date",
        test: function (endDate: any) {
          return endDate > start_time;
        },
      });
    }),
  discount: Yup.number()
    .typeError("Must be a number")
    .nullable()
    .min(1)
    .max(100)
    .required("Discount is required"),
  deliveryType: Yup.array()
    .label("deliveryType")
    .required("Delivery Type is Required Field"),
  productimage: Yup.mixed().required("Product image is required"),
  // categories: Yup.array()
  //   .min(1, "Atleast one category required")
  //   .required("Category is required"),
  // categories: Yup.string().required("Category is required"),
});

const initialValues: initialSchemaValues = {
  title: "",
  deal_id: "",
  discount: undefined,
  deliveryType: [],
  start_time: "",
  end_time: "",
  categories: [],
  productimage: null,
  // products: [],
};

const DealsAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isHotDeal, setisHotDeal] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [dealTypeOptions, setDealTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCatProds, setSelectedCatProds] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [categoryData, setcategoryData] = useState([]);
  const location = useLocation();
  const options = [
    { value: "PICKUP", label: "PICKUP" },
    { value: "DELIVERY", label: "DELIVERY" },
  ];
  var prodData: any = [];
  var allProds: any = [];
  const navigate = useNavigate();

  useEffect(() => {
    getDealTypes();
    getCategories();
  }, []);

  const getDealTypes = () => {
    GetDealTypes().then((res) => {
      if (res && !res.error) {
        setDealTypeOptions(res.data);
      } else {
      }
    });
  };

  const getCategories = () => {
    getCategoriesById().then((res) => {
      if (res && !res.error) {
        // setCategoryOptions(res.data);
        const categData: [] = res.data;
        if (categData.length) {
          categData.map((res: any) => {
            setIsBusy(true);
            getProductByCategoryId(res);
          });
        }
      } else {
        setIsBusy(false);
      }
    });
  };

  const getProductByCategoryId = (categItem: any) => {
    GetProductByCategoryId({ id: categItem.id }).then((prodRes: any) => {
      if (prodRes && !prodRes.error) {
        let prodTem: [] = prodRes.data;
        if (prodTem.length) {
          allProds.push({ category_id: categItem.id, products: prodTem });
          prodTem.map((i: any) => {
            let formdata = { categoryName: categItem.name, ...i };
            prodData.push(formdata);
          });
          setProductOptions(prodData);
          setAllProducts(allProds);
          setIsBusy(false);
          // setProductOptions(prodData);
        }
      } else {
        setIsBusy(false);
      }
    });
  };
  console.log("selectedCat", selectedCat);

  const handleOpenDealCategory = () => {
    setisOpenModal(!isOpenModal);
  };
  const handleSelectCategory = (data: any) => {
    let _selectedCatarr = [...selectedCat];
    let _duplicate_selected = _selectedCatarr.findIndex(
      (catData: any) => catData.categoryName === data.categoryName
    );
    console.log("_selectedCatarr", _selectedCatarr);
    if (_duplicate_selected > -1) {
      _selectedCatarr.splice(_duplicate_selected, 1);
      console.log("_selectedCatarr", _selectedCatarr);
      setSelectedCat(_selectedCatarr);
    }
  };
  const handleModel = (event: any, data: any) => {
    

    if (data != "") {
      let id: any = localStorage.getItem("id");
      console.log("data", data);

      setCategoryOptions(data);
      let arr: any = [...selectedCat];

      let duplicate_index = arr.findIndex(
        (catData: any) => catData.categoryName === data.categoryName
      );
      if (duplicate_index > -1) {
        arr.splice(duplicate_index, 1, {
          cat_id: id,
          categoryName: data?.categoryName,
          all_products_selected: data?.all_products_selected,
        });
      } else {
        arr.push({
          cat_id: id,
          categoryName: data?.categoryName,
          all_products_selected: data?.all_products_selected,
        });
      }

      setSelectedCat(arr);

      let newarray: any = [...categoryData];
      console.log("newarray", newarray);

      let _index = newarray.findIndex(
        (catData: any) => catData.category_id === id
      );
      if (_index > -1) {
        if (data?.products) {
          newarray.splice(_index, 1, {
            category_id: id,
            all_products_selected: data?.all_products_selected,
            products: data?.products,
          });
        } else {
          newarray.splice(_index, 1, {
            category_id: id,
            all_products_selected: data?.all_products_selected,
          });
        }
      } else {
        if (data?.products) {
          newarray.push({
            category_id: id,
            all_products_selected: data?.all_products_selected,
            products: data?.products,
          });
        } else {
          newarray.push({
            category_id: id,
            all_products_selected: data?.all_products_selected,
          });
        }
      }

      setcategoryData(newarray);
    }
  };

  const handleDelete = (category: any) => {
    console.log("category", category);
    let arr = [...selectedCat];
    const index = arr.findIndex(
      (element: any) => element.categoryName == category?.categoryName
    );
    if (index > -1) {
      arr?.splice(index, 1);
      setSelectedCat(arr);
    }
    let categoryArr = [...categoryData];
    const cat_index = categoryArr.findIndex(
      (item: any) => item.category_id == category?.cat_id
    );
    if (cat_index > -1) {
      categoryArr?.splice(cat_index, 1);
      setcategoryData(categoryArr);
    }
  };

  const handleSubmit = (values: any) => {
    console.log("values", values);
    const formData = new FormData();
    if (!categoryData.length) {
      handleToastMessage("error", "please select at least one category");
    }
    if (!values?.deliveryType?.length) {
      handleToastMessage("error", "please select at least one Delivery type");
    }
    if (values.deal_id.label == "24 hour deal") {
      const date = new Date(values.start_time);
      const end = moment(values.start_time).add(1, "days");
      if (moment(values.end_time) > moment(values.start_time).add(1, "days")) {
        return handleToastMessage("error", "please select end time within 24 hour");
        
        console.log("date", values.end_time);
        console.log("date", String(moment(values.start_time).add(1, "days")));
      }
      // console.log("date", String(moment(values.start_time).add(1, "days")));
    }
    formData.append("title", values.title);
    formData.append("deal_id", values.deal_id.id);
    formData.append(
      "start_time",
      String(moment(values.start_time).format("yyyy-MM-DD hh:mm:ss"))
    );
    formData.append(
      "end_time",
      String(moment(values.end_time).format("yyyy-MM-DD hh:mm:ss"))
    );
    formData.append("discount", values.discount);
    formData.append("delivery_type", JSON.stringify(values.deliveryType));
    formData.append("categories", JSON.stringify(categoryData));
    formData.append("image", values.productimage);

    if (formData) {
      setIsLoading(true);
      backendCall({
        url: "/api/vendor/deals",
        method: "POST",
        data: formData,
        contentType: "multipart/form-data;",
      }).then((res) => {
        if (res && !res.error) {
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate("/promotions/dealsList");
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };
  console.log("categoryData", categoryData);
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
        }) => {
          const uploadImage = async (field: string, files: any) => {
            setFieldValue(field, files);
          };

          return (
            <Form className="space-y-6 mt-4 ">
              {isOpenModal ? (
                <SelectCategory
                  handleModel={handleModel}
                  handleOpenDealCategory={handleOpenDealCategory}
                  handleCategory={handleSelectCategory}
                  selectedCat={selectedCat}
                  categoryData={categoryData}
                />
              ) : (
                <>
                  <CustomCard styleClass="p-4">
                    <div className="flex flex-wrap justify-between  items-center">
                      <div className="text-left">
                        {/* <p className="text-gray-900 flex gap-1">
                        <span>Dashboard</span>/<span>Deals</span>/
                        <span>Add Deal</span>
                      </p> */}
                        <Breadcrumbs
                          aria-label="breadcrumb"
                          className="bg-inherit pl-0"
                        >
                          <Link to="/dashboard">
                            <p>Dashboard</p>
                          </Link>
                          <Link to="/promotions/dealsList">
                            <p>Deals</p>
                          </Link>
                          {/* <Link to="" className="text-gray"> */}
                          <p>{"Add Deal"}</p>
                          {/* </Link> */}
                        </Breadcrumbs>

                        <h5 className="font-normal">Deals</h5>
                      </div>

                      <div className="flex gap-4 sm:ml-auto">
                        <CustomButton
                          handleButtonClick={() => {
                            navigate("/promotions/dealsList");
                          }}
                          type={"button"}
                          label="Cancel"
                          styleClass="btn-gray-light !rounded-md"
                        />
                        <CustomButton
                          isLoading={isLoading}
                          type={"submit"}
                          label="Save"
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                    </div>
                  </CustomCard>

                  <CustomCard styleClass="p-4">
                    <div className="space-y-2 text-left ">
                      <Input
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        variant="outline"
                        placeholder="Enter Title"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                        error={errors.title}
                        touched={touched.title}
                      />
                      {/* <ErrorMessage
                        name={`title`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      /> */}
                    </div>
                    <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 text-left mt-3">
                      <div className="space-y-2 ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          Select Deal <span className="text-red-100">*</span>
                        </label>

                        <Select
                          options={dealTypeOptions}
                          id="deal_id"
                          name="deal_id"
                          placeholder="Select Deal type"
                          value={values.deal_id}
                          onChange={(value: any) => {
                            console.log("value", value);
                            console.log("deal_id", values);
                            setFieldTouched("deal_id", true);
                            setFieldValue("deal_id", value);
                            setisHotDeal(value.label);
                          }}
                          onBlur={handleBlur}
                          //  value={console.log("values",values.deal_id)}
                        />
                        <ErrorMessage
                          name={`deal_id`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="categories"
                          className="text-sm text-black-900 font-medium"
                        >
                          Select Category and Products{" "}
                          <span className="text-red-100">*</span>
                        </label>
                        {/* <Multiselect
                  options={productOptions}
                  displayValue="name"
                  groupBy="categoryName"
                  loading={isBusy}
                  className="multiselectContainer"
                  showCheckbox={true}
                  onSelect={handleModel}
                  // onClick={handleModel}
                  onRemove={onRemove}
                  style={style}
                /> */}
                        <div
                          className="flex  custom-input  flex-wrap items-center gap-4"
                          // onClick={handleModel}
                        >
                          {selectedCat?.length > 0 ? (
                            selectedCat?.map((cat: any) => (
                              <div className="flex items-center  text-gray-500 gap-2 bg-gray-300 rounded p-2 ml-2">
                                <label
                                  className="text-sm font-normal "
                                  onClick={(e) => {
                                    handleModel(e, "");
                                    // handleOpenDealCategory()
                                  }}
                                >
                                  {cat.categoryName}
                                </label>
                                <span
                                  className=" cursor-pointer"
                                  onClick={() => {
                                    handleDelete(cat);
                                  }}
                                >
                                  X
                                </span>{" "}
                              </div>
                            ))
                          ) : (
                            <> </>
                          )}
                          <Input
                            // className="w-[150px]"
                            id="name"
                            name="name"
                            // label="Product Name *"
                            onClick={(e) => {
                              // handleModel(e, "");
                              handleOpenDealCategory();
                            }}
                            type="text"
                            // variant="outline"
                            placeholder="Select Category or Product"
                            // error={errors.categories}
                            // touched={touched.categories}
                          />
                        </div>
                      </div>

                      <>
                        <div className="w-full space-y-2">
                          <label
                            htmlFor="start_time"
                            className="text-black-900 text-sm font-medium"
                          >
                            Start date <span className="text-red-100">*</span>
                          </label>
                          <div className="relative">
                            {/* <DatePicker
                    className={`focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-3`}
                    value={values.start_time}
                    minDate={new Date()}
                    dateFormat={"yyyy-MM-dd"}
                    placeholderText={"Start time"}
                    selected={values.start_time}
                    onChange={(e) => {
                      setFieldValue("start_time", e);
                    }}
                  />
                  <DateIcon className="absolute top-0 m-auto bottom-0 right-3" /> */}

                            <DateTimePicker
                              className={
                                " focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-2"
                              }
                              format={"y-MM-dd h:mm a "}
                              calendarIcon={<Calender className="w-5 h-5" />}
                              onChange={(e) => {
                                setFieldValue("start_time", e);
                              }}
                              value={values.start_time}
                              minDate={new Date()}
                            />
                          </div>
                          <ErrorMessage
                            name={`start_time`}
                            component={"span"}
                            className="text-xs capitalize text-red-100"
                          />
                        </div>{" "}
                        <div className="w-full space-y-2">
                          <label
                            htmlFor="end_time"
                            className="text-black-900 text-sm font-medium"
                          >
                            End date <span className="text-red-100">*</span>
                          </label>
                          <div className="relative">
                            {/* <DatePicker
                    className={`focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-3`}
                    value={values.end_time}
                    minDate={new Date()}
                    dateFormat={"yyyy-MM-dd"}
                    placeholderText={"End time"}
                    selected={values.end_time}
                    onChange={(e) => {
                      setFieldValue("end_time", e);
                    }}
                  />
                  <DateIcon className="absolute top-0 m-auto bottom-0 right-3" /> */}

                            <DateTimePicker
                              className={
                                " focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-2"
                              }
                              format={"y-MM-dd h:mm a "}
                              calendarIcon={<Calender className="w-5 h-5" />}
                              onChange={(e) => {
                                setFieldValue("end_time", e);
                              }}
                              value={values.end_time}
                              minDate={new Date()}
                            />
                          </div>
                          <ErrorMessage
                            name={`end_time`}
                            component={"span"}
                            className="text-xs capitalize text-red-100"
                          />
                        </div>
                      </>

                      {/* <div className="space-y-2">
                <label
                  htmlFor="categories"
                  className="text-sm text-black-900"
                >
                  Category *
                </label>

                <Select
                  options={categoryOptions}
                  id="categories"
                  name="categories"
                  isMulti
                  placeholder="Select Your Category"
                  onChange={(value: any) => {
                    setFieldTouched("categories", true);

                    setFieldValue(
                      "categories",
                      value.map((res: any) => {
                        getProductByCategoryId(res.id);
                        return res.id;
                      })
                    );
                  }}
                  onBlur={handleBlur}
               
                />

                <ErrorMessage
                  name={`categories`}
                  component={"span"}
                  className="text-xs capitalize text-red-100"
                />
              </div> */}
                      {/* 
              <div className="space-y-2">
                <label htmlFor="products" className="text-sm text-black-900">
                  Product *
                </label>

                <Select
                  options={productOptions}
                  id="products"
                  name="products"
                  isMulti
                  placeholder="Select Your Category"
                  onChange={(value: any) => {
                    setFieldTouched("products", true);
                    setFieldValue(
                      "products",
                      value.map((res: any) => res.id)
                    );
                  }}
                  onBlur={handleBlur}
         
                />

                <ErrorMessage
                  name={`products`}
                  component={"span"}
                  className="text-xs capitalize text-red-100"
                />
              </div> */}

                      <Input
                        id="discount"
                        name="discount"
                        label="Discount (%) "
                        type="text"
                        variant="outline"
                        placeholder="Discount"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.discount}
                        error={errors.discount}
                        touched={touched.discount}
                      />
                      <div className="space-y-2 ">
                        <label
                          htmlFor="deliveryType"
                          className="text-sm text-black-900 font-medium"
                        >
                          Delivery Type <span className="text-red-100">*</span>
                        </label>
                        <Field
                          className="custom-select !text-black-100"
                          name="deliveryType"
                          options={options}
                          component={CustomSelect}
                          placeholder="Select Delivery Type"
                          isMulti={true}
                        />
                        <ErrorMessage
                          name={`deliveryType`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                        {/* <Select
                          options={options}
                          id="deliveryType"
                          name="deliveryType"
                          placeholder="Select  type"
                          onChange={(value: any) => {
                            console.log("value", value);
                            console.log("deal_id", values);
                            setFieldTouched("deliveryType", true);
                            setFieldValue("deliveryType", value.label);
                          }}
                          onBlur={handleBlur}
                          //  value={console.log("values",values.deal_id)}
                        />
                        <ErrorMessage
                          name={`deliveryType`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        /> */}
                      </div>
                      {/* {selectedCat?.length < 0 ? (
                      <ErrorMessage
                        name={`name`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      />
                    ) : (
                      ""
                    )} */}
                    </div>
                  </CustomCard>
                  <CustomCard styleClass=" flex text-left flex-col gap-5 w-[100%] ">
                    {/* <div className=" bg-[#d0d4fda5] p-2 rounded-t-xl flex">
                        <img src={imageLogo} className="h-14 w-14" />
                        <p className="text-[#7580F2] ml-1">
                          Choose a high-quality image that accurately represents
                          your product and showcases its best features.
                        </p>
                      </div> */}
                    <div className="space-y-2 w-full p-4 ">
                      <label
                        htmlFor="unit_id"
                        className="text-sm text-black-900 font-medium"
                      >
                        Image
                      </label>

                      <div className="w-full">
                        <ImagePicker
                          className="flex-1"
                          resetValue={() => {
                            setFieldValue("productimage", null);
                          }}
                          onChange={(files) => {
                            setFieldTouched("productimage", true);
                            return uploadImage("productimage", files[0]);
                          }}
                          onSizeError={(error) => {
                            handleToastMessage(
                              "error",
                              "please select image of size less than 10mb"
                            );
                          }}
                          touched={true}
                        >
                          <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                            <p className="text-gray-900 font-normal text-sm">
                              Drop Your File Here, Or
                              <span className="text-blue-900 cursor-pointer pl-2">
                                Click to browse
                              </span>{" "}
                            </p>
                            <p className="text-gray-900 font-normal text-sm">
                              {" "}
                              1200 * 1600 (3:4) Recommended, Up To 10MB Each.
                            </p>
                          </div>
                          <div className="flex justify-center mt-4">
                        <CustomButton
                          type={"button"}
                          // handleButtonClick={(files: any) => {
                          //   setFieldTouched("images", true);
                          //   return uploadImage(files);
                          // }}
                          label="Upload Image"
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                        </ImagePicker>
                        {values.productimage && (
                          <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                            <div className="flex items-center gap-6 p-2">
                              <LazyImage
                                src={URL.createObjectURL(values.productimage)}
                                className="h-8 w-8 rounded"
                              />
                              {/* <div className="flex flex-col">
                            <p>
                              <span>ID Card (Front).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">200kb</span>
                            </p>
                          </div> */}
                            </div>
                          </div>
                        )}
                        <ErrorMessage
                          name={`productimage`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>
                     
                    </div>
                  </CustomCard>
                </>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default DealsAdd;
