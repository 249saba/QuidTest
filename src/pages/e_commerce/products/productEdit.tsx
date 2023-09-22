import {
  GetAttributes,
  GetProductCategory,
  GetTaxTypes,
  GetUnits,
} from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import CircleCross from "@assets/icons/ways.png";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import { ErrorMessage, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import Popup from "@src/shared/popup/popup";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleToastMessage } from "@src/shared/toastify";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { Breadcrumbs } from "@material-tailwind/react";
import LazyImage from "@src/shared/lazyImage";

export interface initialSchemaValues1 {
  name: string;
  sub_text: string;
  description: string;
  category_id: string;
  unit_id: string | any;
  tax_type_id: string;
  tax: string;
  discount: string;
  discount_type: string;
  vendor_shop_id:number|any
}

const FormSchema1 = Yup.object().shape({
  name: Yup.string().label("Name").required(),
  // sub_text: Yup.string().label("Sub text").required(),
  // description: Yup.string().label("Description").required(),
  category_id: Yup.string().label("Category").required(),
  unit_id: Yup.string().label("Unit").required(),
  tax_type_id: Yup.string().label("Tax type").required(),
  tax: Yup.number().label("Tax").required().typeError("Enter Tax in number"),
  // discount: Yup.number()
  //   .min(0)
  //   .max(100)
  //   .label("Discount")
  //   .required()
  //   .typeError("Enter Discount in number"),
  discount_type: Yup.string().label("Discount type").required(),
  discount: Yup.number()
  .min(0)
  .max(100)
  .label("Discount")
  .required()
  .typeError("Enter Discount in number").when('discount_type', {
    is: 'FIXED',
    then: Yup.number()
    .min(0)
    .max(1000)
    .label("Discount")
    .required()
    .typeError("Enter Discount in number"),

  })
});

const _initialValues1: initialSchemaValues1 = {
  name: "",
  sub_text: "",
  description: "",
  category_id: "",
  unit_id: "",
  tax_type_id: "",
  tax: "",
  discount: "",
  discount_type: "",
  vendor_shop_id:""
};

const discountTypeOptions = [
  {
    label: "PERCENTAGE",
    value: "PERCENTAGE",
  },
  {
    label: "FIXED",
    value: "FIXED",
  },
];

const ProductEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [attributesOptions, setAttributesOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const [isVariantAdd, setIsVariantAdd] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [shops, setShops] = useState<any>([]);
  const [isStep1, setIsStep1] = useState(true);
  const [isStep2, setIsStep2] = useState(false);
  const [firstFormValues, setFirstFormValues] = useState({});
  const [productsDetail, setProductsDetail] = useState<any>({});
  const [initialValues1, setInitialValues1] = useState(_initialValues1);
  const [selectedValues1, setSelectedValues1] = useState<any>({});
  const [variantId, setVariantId] = useState<any>(0);
  const [isDefaultVariant, setIsDefaultVariant] = useState<any>(0);
  const { id } = useParams();
  const paramsId = id;
  const Stock = [
    {
      id: 1,
      lable: "In stock",
      value: "in_stock",
    },
    {
      id: 0,
      lable: "Out of stock",
      value: "in_stock",
    },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    getUnits();
    getTaxTypes();
    getCategory();
    getAttribute();
    getShops()
  }, []);

  useEffect(() => {
    const getProductDetail = async () => {
      await backendCall({
        url: `/api/vendor/product/${paramsId}`,
        method: "GET",
      }).then((res) => {
        
        if (res && !res.error) {
          console.log(res);
          const {
            Category,
            name,
            sub_text,
            Unit,
            TaxType,
            tax,
            discount,
            discount_type,
            description,
            ProductVariants,
            vendor_shop_id
          } = res?.data;
          let initValues1 = {
            name,
            sub_text,
            description,
            category_id: Category?.id,
            unit_id: Unit?.id,
            tax_type_id: TaxType?.id,
            tax,
            discount,
            discount_type,
            vendor_shop_id
          };
          console.log("vendor_shop_id",vendor_shop_id)
          setSelectedValues1({
            category_id: Category?.name,
            unit_id: Unit?.name,
            tax_type_id: TaxType?.name,
          });
          setInitialValues1(initValues1);
          // ---------- For Individual Variant ------------

          setProductsDetail(res.data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      });
    };
    if (paramsId) {
      getProductDetail();
    }
  }, []);
  console.log("initialValues1", initialValues1);
  const getUnits = () => {
    GetUnits().then((res) => {
      if (res && !res.error) {
        setUnitOptions(res.data);
      } else {
      }
    });
  };
  const getCategory = () => {
    GetProductCategory().then((res) => {
      if (res && !res.error) {
        setCategoryOptions(res.data);
      } else {
      }
    });
  };
  const getAttribute = () => {
    GetAttributes().then((res) => {
      if (res && !res.error) {
        setAttributesOptions(res.data);
      } else {
      }
    });
  };

  const getTaxTypes = () => {
    GetTaxTypes().then((res) => {
      if (res && !res.error) {
        setTaxTypeOptions(res.data);
      } else {
      }
    });
  };
  const getShops = () => {
    backendCall({
      url: `/api/vendor/shops`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        let arr: any = [];
        const data = res.data;

        res?.data?.map((item: any, index: number) => {
          arr.push({
            label: item.business_email,
            value: item.business_email,
            id: item.id,
          });
        });
        setShops(arr);
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };
  const handleSubmit1 = (values: any) => {
    setFirstFormValues(values);
    submitForm1Data(values);
  };

  const submitForm1Data = (values: any) => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/product/${paramsId}`,
      method: "PUT",
      data: values,
    }).then((res) => {
      console.log("res ==", res);
      if (res && !res.error) {
        setIsLoading(false);
        console.log("contain_variations", productsDetail?.ProductVariants);
        if (productsDetail?.ProductVariants?.length == 0) {
          setIsOpenDeletePopup(true);
        } else {
          if (productsDetail.contain_variations === 0) {
            navigate(`/products/editSingleVariant/${paramsId}`);
          } else {
            navigate(`/products/editMultiVariant/${paramsId}`);
          }
        }

        handleToastMessage("success", res?.message);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const handleVariant = (setFieldValue: any) => {
    setFieldValue("contain_variations", 1);
    setFirstFormValues({ ...firstFormValues, contain_variations: 1 });
    setIsVariantAdd(true);
    setIsOpenDeletePopup(false);
    submitFormData("multi_contain_variations");
    navigate(`/products/editMultiVariant/${paramsId}`);
    setIsStep1(false);

    // submitFormData();
    console.log("Delete item ID ==");
  };
  const handleIndividual = () => {
    setIsOpenDeletePopup(false);
    navigate(`/products/editSingleVariant/${paramsId}`);
    setIsStep1(false);
    setIsStep2(true);
    submitFormData("");
    console.log("Delete item ID ==");
  };

  const submitFormData = (contain_variations: any) => {
    let _obj = {
      ...firstFormValues,
    };
    // if (contain_variations === "multi") {
    //   _obj = {
    //     ...firstFormValues,
    //     contain_variations: 1,
    //   };
    // }
    setIsLoading(true);
    if (paramsId) {
      backendCall({
        url: `/api/vendor/product/${paramsId}`,
        method: "PUT",
        data: _obj,
      }).then((res) => {
        console.log("res ==", res);
        if (res && !res.error) {
          setIsLoading(false);
          // navigate(`/products/addProduct/${paramsId}`);
          handleToastMessage("success", res?.message);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    } else {
      backendCall({
        url: "/api/vendor/product/add_product",
        method: "POST",
        data: firstFormValues,
      }).then((res) => {
        console.log("res ==", res);
        if (res && !res.error) {
          setIsLoading(false);
          // navigate(`/products/addProduct/${res?.data?.id}`);
          handleToastMessage("success", res?.message);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <Formik
        initialValues={initialValues1}
        enableReinitialize
        validationSchema={FormSchema1}
        onSubmit={handleSubmit1}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          touched,
          values,
          setFieldTouched,
          setFieldValue,
          setValues,
        }) => {
          return (
            <Form className="mt-4 ">
              <Popup
                isOpen={isOpenDeletePopup}
                handleClose={() => setIsOpenDeletePopup(false)}
                isShowHeader={true}
              >
                <div className="flex flex-col justify-center items-center gap-3">
                  <LazyImage src={CircleCross} className="h-[220px] mt-6" />
                  <h5 className="font-semibold mt-5">Add Variants</h5>
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-medium ">
                      Do You Like To Add More Variants
                    </p>
                    <p className="font-semibold ">Or Not?</p>
                  </div>

                  <div className="space-y-3 mt-8 flex justify-around w-4/5">
                    <CustomButton
                      handleButtonClick={handleIndividual}
                      label={"Keep It Individual"}
                      type={"button"}
                      variant={"outlined"}
                      styleClass={
                        "btn-gray-light w-full  !rounded-xl !font-medium mr-2 "
                      }
                    />
                    <CustomButton
                      handleButtonClick={() => handleVariant(setFieldValue)}
                      label={"Add Variants"}
                      type={"button"}
                      variant={"outlined"}
                      styleClass={
                        "btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"
                      }
                    />
                  </div>
                </div>
              </Popup>
              <div className="space-y-6 ">
                <CustomCard styleClass="p-4">
                  <div className="flex justify-between items-center">
                    <div className="text-left">
                      {/* <p className="text-gray-900 flex gap-1">
                        <span>Dashboard</span>/<span>Products</span>/
                        <span>{"Edit Product"}</span>
                      </p> */}
                      <Breadcrumbs
                        aria-label="breadcrumb"
                        className="bg-inherit pl-0"
                      >
                        <Link to="/dashboard">
                          <p>Dashboard</p>
                        </Link>
                        <Link to="/products">
                          <p>Products</p>
                        </Link>
                        {/* <Link to="" className="text-gray"> */}
                        <p>{"Edit Product"}</p>
                        {/* </Link> */}
                      </Breadcrumbs>

                      <h5 className="font-normal">{"Edit Product"}</h5>
                    </div>

                    <div className="flex gap-4">
                      <CustomButton
                        handleButtonClick={() => navigate("/products")}
                        type={"button"}
                        label="Cancel"
                        styleClass="btn-gray-light !rounded-md"
                      />
                      <CustomButton
                        type={"submit"}
                        label={"Update & continue"}
                        styleClass="btn-black !rounded-md"
                      />
                    </div>
                  </div>
                </CustomCard>

                <CustomCard styleClass="p-4">
                  <div className="space-y-5 text-left pb-4">
                    <h6 className="font-medium "> General Info</h6>
                    <div className="space-y-2 ">
                      <label
                        htmlFor="category_id"
                        className="text-sm text-black-900 font-medium"
                      >
                        Product Category <span className="text-red-100">*</span>
                      </label>
                      <Select
                        options={categoryOptions}
                        id="category_id"
                        name="category_id"
                        value={categoryOptions.map((item: any) => {
                          if (item?.id === values?.category_id) {
                            return { label: item?.label };
                          }
                        })}
                        placeholder="E-Commerce Category *"
                        onChange={(value: any) => {
                          setFieldTouched("category_id", true);
                          setFieldValue("category_id", value.id);
                        }}
                        onBlur={handleBlur}
                        onFocus={() => {
                          setFieldTouched("category_id", true);
                        }}
                      />
                      <ErrorMessage
                        name={`category_id`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      />
                    </div>
                  </div>
                </CustomCard>
                <CustomCard styleClass="p-4 ">
                  <div className="space-y-5 text-left pb-4">
                    <h6 className="font-medium "> Product Bio</h6>
                    <div className="flex sm:flex-col gap-5">
                      <Input
                        className="w-full"
                        id="name"
                        name="name"
                        label="Product Name "
                        type="text"
                        variant="outline"
                        placeholder="Enter Product Name"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={errors.name}
                        touched={touched.name}
                      />
                      {/* <Input
                        className="w-full"
                        id="sub_text"
                        name="sub_text"
                        label="Sub Text "
                        type="text"
                        variant="outline"
                        placeholder="Enter SubText"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sub_text}
                        error={errors.sub_text}
                        touched={touched.sub_text}
                      /> */}
                        <div className="flex flex-col w-full gap-2">
                        <label
                          htmlFor="category_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          Sub Text 
                        </label>
                        <Input
                          className="w-full"
                          id="sub_text"
                          name="sub_text"
                          // label="Sub Text "
                          type="text"
                          variant="outline"
                          placeholder="Enter SubText"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.sub_text}
                          error={errors.sub_text}
                          touched={touched.sub_text}
                        />
                        </div>
                      <div className="flex flex-col gap-2 w-full ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          Unit <span className="text-red-100">*</span>
                        </label>
                        <Select
                          options={unitOptions}
                          id="unit_id"
                          name="unit_id"
                          value={unitOptions.map((item: any) => {
                            if (item?.id === values?.unit_id) {
                              return { label: item?.label };
                            }
                          })}
                          placeholder="Select Your Unit type"
                          onChange={(value: any) => {
                            console.log("value ==", value);
                            setFieldTouched("unit_id", true);
                            setFieldValue("unit_id", value.id);
                          }}
                          onBlur={handleBlur}
                          onFocus={() => {
                            setFieldTouched("unit_id", true);
                          }}
                        />
                        <ErrorMessage
                          name={`unit_id`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 justify-between  text-left">
                      <div className="space-y-2 ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          Tax Type <span className="text-red-100">*</span>
                        </label>
                        <Select
                          options={taxTypeOptions}
                          id="tax_type_id"
                          name="tax_type_id"
                          placeholder="Select Your Tax type"
                          value={taxTypeOptions.map((item: any) => {
                            if (item?.id === values?.tax_type_id) {
                              return { label: item?.label };
                            }
                          })}
                          onChange={(value: any) => {
                            setFieldTouched("tax_type_id", true);
                            setFieldValue("tax_type_id", value.id);
                          }}
                          onBlur={handleBlur}
                          onFocus={() => {
                            setFieldTouched("tax_type_id", true);
                          }}
                        />
                        <ErrorMessage
                          name={`tax_type_id`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>

                      <Input
                        id="tax"
                        name="tax"
                        label="Tax "
                        className="flex-grow"
                        type="text"
                        variant="outline"
                        placeholder="0"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tax}
                        error={errors.tax}
                        touched={touched.tax}
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 justify-between  text-left">
                      <div className="flex flex-col gap-2 w-full ">
                        <label
                          htmlFor="discount_type"
                          className="text-sm text-black-900 font-medium"
                        >
                          Discount Type <span className="text-red-100">*</span>
                        </label>
                        <Select
                          options={discountTypeOptions}
                          id="discount_type"
                          name="discount_type"
                          value={{ label: values?.discount_type }}
                          placeholder="Select Your Tax type"
                          onChange={(value: any) => {
                            setFieldTouched("discount_type", true);
                            setFieldValue("discount_type", value.value);
                          }}
                          onBlur={handleBlur}
                          onFocus={() => {
                            setFieldTouched("discount_type", true);
                          }}
                        />
                        <ErrorMessage
                          name={`discount_type`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>
                      <Input
                        id="discount"
                        className="w-full"
                        name="discount"
                        label="Discount "
                        type="text"
                        variant="outline"
                        placeholder="0"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.discount}
                        error={errors.discount}
                        touched={touched.discount}
                      />
                    </div>
                    <TextArea
                      id="description"
                      name="description"
                      label="Description"
                      type="text"
                      variant="outline"
                      placeholder="Enter Description"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      error={errors.description}
                      touched={touched.description}
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full mt-5 items-start">
                      <label
                        htmlFor="discount_type"
                        className="text-sm text-black-900 font-medium text-left"
                      >
                        Select Branch{" "}
                        {/* <span className="text-red-100">*</span> */}
                      </label>
                      <Select
                      className="w-full text-left"
                        options={shops}
                        id="vendor_shop_id"
                        name="vendor_shop_id"
                        value={shops.map((item: any) => {
                          console.log("shops",shops)
                          if (item?.id === values?.vendor_shop_id) {
                            console.log("item",item?.label)
                            return { label: item?.label };
                          }
                        })}
                        // value={{ label: values?.vendor_shop_id }}
                        placeholder="Select Your Branch"
                        onChange={(value: any) => {
                          setFieldTouched("vendor_shop_id", true);
                          setFieldValue("vendor_shop_id", value.id);
                        }}
                        onBlur={handleBlur}
                        onFocus={() => {
                          setFieldTouched("vendor_shop_id", true);
                        }}
                      />
                      <ErrorMessage
                        name={`vendor_shop_id`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      />
                    </div>
                </CustomCard>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProductEdit;
