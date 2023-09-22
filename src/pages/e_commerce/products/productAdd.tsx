import { getUnit } from "@mui/material/styles/cssUtils";
import {
  GetAttributes,
  GetDynamicAttribute,
  GetProductCategory,
  GetTaxTypes,
  GetUnits,
} from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import Input from "@src/shared/input";
import CircleCross from "@assets/icons/ways.png";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import {
  ErrorMessage,
  FastField,
  Field,
  FieldArray,
  Form,
  Formik,
} from "formik";
import { useEffect, useRef, useState } from "react";
import CiCircleAlert from "@assets/icons/Info_icon.png";
import * as Yup from "yup";
import isArray from "lodash/isArray";
import Resizer from "./../../../shared/imageResizer";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import Radio from "@src/shared/radio/radio";
import { IconButton, Switch } from "@mui/material";
import Table from "rc-table";

import { ReactComponent as EditIcon } from "@assets/vendor/icons/pencil.svg";
import { ReactComponent as DeleteIcon } from "@assets/vendor/icons/delete.svg";
import imageLogo from "@assets/icons/imageLogo.png";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import LazyImage from "@src/shared/lazyImage";
import Popup from "@src/shared/popup/popup";
import { handleToastMessage } from "@src/shared/toastify";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import SelectAttribute from "@src/shared/selectAttribute";
import { Breadcrumbs } from "@material-tailwind/react";

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
export interface initialSchemaValues2 {
  price: number | undefined | any;
  in_stock: string;
  totalQuantity: number | any;
  images: [];
  cover_image: [];
}
export interface initialSchemaValues3 {
  contain_variations: number;
  product_variations: any;
  vendor_attributes: any;
}

type DataObject = {
  contain_variations: number;
  vendor_attributes: any[]; // Replace 'any' with the appropriate type
  product_variations: {
    is_default: boolean;
    price: number;
    stock: number;
    options: {
      attribute_id: any; // Replace 'any' with the appropriate type
      option_id: any; // Replace 'any' with the appropriate type
    }[];
  }[];
  [key: string]: any; // Allow dynamic properties with any value type
};

const FormSchema1 = Yup.object().shape({
  name: Yup.string().label("Name").required(),
  // sub_text: Yup.string().label("Sub text").required(),
  // description: Yup.string().label("Description").required(),
  category_id: Yup.string().label("Category").required(),
  unit_id: Yup.string().label("Unit").required(),
  tax_type_id: Yup.string().label("Tax type").required(),
  tax: Yup.number().label("Tax").required().typeError("Enter Tax in number"),

  discount_type: Yup.string().label("Discount type").required(),
  discount: Yup.number()
    .min(0)
    .max(100)
    .label("Discount")
    .required()
    .typeError("Enter Discount in number")
    .when("discount_type", {
      is: "FIXED",
      then: Yup.number()
        .min(0)
        .max(1000)
        .label("Discount")
        .required()
        .typeError("Enter Discount in number"),
    }),
});

const FormSchema2 = Yup.object().shape({
  price: Yup.number()
    .min(1)
    .label("Price")
    .required()
    .typeError("Enter Price in number"),
  in_stock: Yup.string().label("availibility").required(),
  totalQuantity: Yup.number()
    .min(1)
    .label("Total Quantity")
    .required()
    .typeError("Enter Quantity in number"),
  images: Yup.array().test({
    message: "Atleast One Image is required",
    test: (val) => (isArray(val) ? val.length > 0 && val.length <= 5 : false),
  }),
  cover_image: Yup.array().test({
    message: "Atleast One Image is required",
    test: (val) => (isArray(val) ? val.length > 0 && val.length <= 5 : false),
  }),
});

const productItem = {
  price: "",
  stock: "",
  is_default: 1,
  options: [],
  images: [],
  cover_image: [],
  // availbility:""
};

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
const _initialValues2: initialSchemaValues2 = {
  price: "",
  in_stock: "",
  totalQuantity: "",
  images: [],
  cover_image: [],
};
const initialValues3: initialSchemaValues3 = {
  contain_variations: 1,
  vendor_attributes: [],
  product_variations: [productItem],
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

const ProductAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [attributesOptions, setAttributesOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const [isVariantAdd, setIsVariantAdd] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [isStep1, setIsStep1] = useState(true);
  const [isStep2, setIsStep2] = useState(false);
  const [firstFormValues, setFirstFormValues] = useState({});
  const [productsDetail, setProductsDetail] = useState({});
  const [shops, setShops] = useState<any>([]);
  const [initialValues1, setInitialValues1] = useState<any>(_initialValues1);
  const [initialValues2, setInitialValues2] = useState<any>(_initialValues2);
  const [selectedValues1, setSelectedValues1] = useState<any>({});
  const [variantId, setVariantId] = useState<any>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDefaultVariant, setIsDefaultVariant] = useState<any>(0);
  const { id } = useParams();
  console.log("id", id);
  const paramsId = id;
  const Stock = [
    {
      id: 1,
      label: "In stock",
      value: "in_stock",
    },
    {
      id: 0,
      label: "Out of stock",
      value: "in_stock",
    },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    getUnits();
    getTaxTypes();
    getCategory();
    getAttribute();
    getShops();
  }, []);
  let state = searchParams.get("state");
  useEffect(() => {
    if (state == "AddVariant") {
      handlePopup();
    }
  }, [state]);
  useEffect(() => {
    const getProductDetail = async () => {
      await backendCall({
        url: `/api/vendor/product/${paramsId}`,
        method: "GET",
      }).then((res) => {
        console.log("product res ===", res);
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
          };
          setSelectedValues1({
            category_id: Category?.name,
            unit_id: Unit?.name,
            tax_type_id: TaxType?.name,
          });
          setInitialValues1(initValues1);
          // ---------- For Individual Variant ------------

          let initValues2 = {
            price: ProductVariants?.[0]?.price,
            in_stock: ProductVariants?.[0]?.in_stock,
            totalQuantity: ProductVariants?.[0]?.stock,
            images: [ProductVariants?.[0]?.ProductImages?.image_url],
            cover_image: [ProductVariants?.cover_image],
          };
          console.log("initValues2 ==", initValues2);
          setVariantId(ProductVariants?.[0]?.id);
          setInitialValues2(initValues2);
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

  const getUnits = () => {
    GetUnits().then((res) => {
      if (res && !res.error) {
        setUnitOptions(res.data);
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
  // const getDynamicAttribute = async (id: any) => {
  //   const data = await GetDynamicAttribute(id);
  //   return data?.data || [];
  // };

  const getTaxTypes = () => {
    GetTaxTypes().then((res) => {
      if (res && !res.error) {
        setTaxTypeOptions(res.data);
      } else {
      }
    });
  };

  const onChangeFields = (values: any, setValues: any, index?: number) => {
    // update dynamic form
    const product_variations = [...values.product_variations];
    if (index) {
      product_variations.splice(index, 1);
    } else {
      product_variations.push(productItem);
    }
    setValues({ ...values, product_variations });
  };

  const getCompressImages = async (files: any) => {
    try {
      const results = await Promise.all(
        files.map((file: any) => getImage(file))
      );
      console.log({ results });
      return results;
    } catch (err) {
      console.log({ compressImageError: err });
    }
  };

  const getImage = async (file: any) => {
    const _image = await new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1500,
        1500,
        "JPEG",
        90,
        0,
        (uri: any) => {
          resolve(uri);
        },
        "file",
        400,
        400
      );
    });
    return _image;
  };

  // const columns = [
  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Color"}</span>
  //       </div>
  //     ),
  //     dataIndex: "color",
  //     key: "color",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <p className="text-sm font-normal"> {name}</p>
  //     ),
  //   },

  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Size"}</span>
  //       </div>
  //     ),
  //     dataIndex: "size",
  //     key: "size",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <p className="text-sm font-normal"> {name}</p>
  //     ),
  //   },

  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Shape"}</span>
  //       </div>
  //     ),
  //     dataIndex: "shape",
  //     key: "shape",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <p className="text-sm font-normal"> {name}</p>
  //     ),
  //   },

  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Price"}</span>
  //       </div>
  //     ),
  //     dataIndex: "price",
  //     key: "price",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <p className="text-sm font-normal"> {name}</p>
  //     ),
  //   },

  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Images"}</span>
  //       </div>
  //     ),
  //     dataIndex: "images",
  //     key: "images",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <div className="flex gap-3 overflow-x-auto">
  //         {row.images.map((item: any) => (
  //           <img
  //             className="w-8 h-8 object-cover"
  //             src={URL.createObjectURL(item)}
  //             loading="lazy"
  //           />
  //         ))}
  //       </div>
  //     ),
  //   },

  //   {
  //     title: (
  //       <div className="pl-1 flex justify-between items-center">
  //         <span>{"Actions"}</span>
  //       </div>
  //     ),
  //     dataIndex: "action",
  //     key: "action",
  //     width: 200,
  //     render: (name: string, row: any) => (
  //       <div className="flex gap-2 items-center">
  //         <IconButton
  //           onClick={() => {
  //             setIsVariantAdd(true);
  //           }}
  //           className="bg-transparent shadow-none"
  //         >
  //           <EditIcon className="w-4 h-4 cursor-pointer" />
  //         </IconButton>

  //         <DeleteIcon className="w-4 h-4 cursor-pointer" />
  //       </div>
  //     ),
  //   },
  // ];

  const handleSubmit1 = (values: any) => {
    handlePopup();
    setFirstFormValues(values);
    console.log("values ==", values);
  };
  const handleSubmit2 = (values: any) => {
    // setIsStep1(true);
    submitForm2Data(values);
    console.log("handleSubmit2 ==", values);
  };
  const handleSubmit3 = (values: any) => {
    let foundDefault = 0;
    console.log("add_new_variants", values);

    values.product_variations.forEach((product: any) => {
      if (!product.options[0].option_id) {
        handleToastMessage("error", "Please select attribute");
        return;
      }
    });

    let data: DataObject = {
      contain_variations: 1,

      vendor_attributes: values.vendor_attributes.map((item: any) => item.id),
      product_variations: values.product_variations.map(
        (item: any, index: any) => {
          if (isDefaultVariant === index) {
            foundDefault = 1;
          }
          return {
            is_default: isDefaultVariant === index ? 1 : 0,
            price: item.price,
            stock: item.stock,
            // in_stock:item.availbility,
            options: item.options.map(({ attribute_id, option_id }: any) => ({
              attribute_id: attribute_id,
              option_id: option_id,
            })),
          };
        }
      ),
    };
    console.log(
      "add_new_variants",
      data?.product_variations[0].options[0].option_id
    );
    if (foundDefault === 0) {
      handleToastMessage("error", "Please select default variant");
      return;
    }

    const formData = new FormData();
    values.product_variations.forEach((element: any, index: number) => {
      data[`variant_images_${index}`] = element.images;
      if (
        typeof element.images !== "string" &&
        element.images?.[0] !== undefined
      ) {
        console.log("inside if to set image");
        data[`variant_images_${index}`].forEach((file: any) => {
          formData.append(`variant_images_${index}`, file);
        });
      }
    });
    values.product_variations.forEach((element: any, index: number) => {
      console.log("element ==", element);
      data[`cover_image_${index}`] = element.cover_image;
      if (
        typeof element.cover_image !== "string" &&
        element.cover_image?.[0] !== undefined
      ) {
        console.log("inside if to set image");
        data[`cover_image_${index}`].forEach((file: any) => {
          formData.append(`cover_image_${index}`, file);
        });
      }
    });
    formData.append(
      "vendor_attributes",
      JSON.stringify(data?.vendor_attributes)
    );
    formData.append(
      "product_variations",
      JSON.stringify(data?.product_variations)
    );
    formData.append("contain_variations", "1");
    console.log("data ==", data);
    // for (var pair of formData.entries()) {
    //   console.log("--------------", pair[0] + ", " + pair[1]);
    // }

    submitForm3Data(formData);
  };

  const handlePopup = () => {
    setIsOpenDeletePopup(true);
    console.log("delete Clicked ==");
  };
  const handleVariant = (setFieldValue: any) => {
    setFieldValue("contain_variations", 1);
    setIsVariantAdd(true);
    setIsOpenDeletePopup(false);
    setIsStep1(false);
    submitForm1Data();
    console.log("Delete item ID ==");
  };
  const handleIndividual = () => {
    setIsOpenDeletePopup(false);
    setIsStep1(false);
    setIsStep2(true);
    submitForm1Data();
    console.log("Delete item ID ==");
  };

  const submitForm1Data = () => {
    console.log("submitForm1Data");
    setIsLoading(true);
    if (paramsId) {
      backendCall({
        url: `/api/vendor/product/${paramsId}`,
        method: "PUT",
        data: firstFormValues,
      }).then((res) => {
        console.log("res ==", res);
        if (res && !res.error) {
          setIsLoading(false);
          navigate(`/products/addProduct/${paramsId}`);
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
          navigate(`/products/addProduct/${res?.data?.id}`);
          handleToastMessage("success", res?.message);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };
  const submitForm2Data = (values: any) => {
    setIsLoading(true);
    const formData = new FormData();
    if (typeof values.images !== "string" && values.images?.[0] !== undefined) {
      values.images.forEach((file: any, index: number) => {
        formData.append("images", file);
      });
      formData.append("cover_image", values.cover_image[0]);
    }
    formData.append("in_stock", values.in_stock);
    formData.append("price", values.price);
    formData.append("stock", values.totalQuantity);

    if (variantId) {
      formData.append("contains_options", "0");
      backendCall({
        url: `/api/vendor/product/update_variant/${variantId}`,
        method: "PUT",
        data: formData,
        contentType: "multipart/form-data;",
      }).then((res) => {
        console.log("res ==", res);
        if (res && !res.error) {
          setIsLoading(false);
          navigate(`/products`);
          handleToastMessage("success", res?.message);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    } else {
      formData.append("contain_variations", "0");
      backendCall({
        url: `/api/vendor/product/${paramsId}/add_variants`,
        method: "POST",
        data: formData,
        contentType: "multipart/form-data;",
      }).then((res) => {
        if (res && !res.error) {
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate(`/products`);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };
  const submitForm3Data = (values: any) => {
    setIsAddLoading(true);

    console.log("submitForm3Data ==", values);
    const formData = new FormData();
    if (false) {
      formData.append("contains_options", "0");
      backendCall({
        url: `/api/vendor/product/update_variant/${variantId}`,
        method: "PUT",
        data: formData,
        contentType: "multipart/form-data;",
      }).then((res) => {
        console.log("res ==", res);
        if (res && !res.error) {
          setIsLoading(false);
          navigate(`/products`);
          handleToastMessage("success", res?.message);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    } else {
      backendCall({
        url: `/api/vendor/product/${paramsId}/add_variants`,
        method: "POST",
        data: values,
        contentType: "multipart/form-data;",
      }).then((res) => {
        if (res && !res.error) {
          setIsAddLoading(false);
          handleToastMessage("success", res?.message);
          navigate(`/products`);
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isStep1 && (
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
                          <span>
                            {paramsId ? "Edit Product" : "Add Product"}
                          </span>
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
                          <Link to="/products/addProduct" className="text-gray">
                            <p>{variantId ? "Edit Product" : "Add Product"}</p>
                          </Link>
                        </Breadcrumbs>

                        <h5 className="font-normal">
                          {paramsId ? "Edit Product" : "Add Product"}
                        </h5>
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
                          label={
                            paramsId ? "Update & continue" : "Save & Continue"
                          }
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
                          className="text-sm text-black-900"
                        >
                          Product Category{" "}
                          <span className="text-red-100">*</span>
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
                          placeholder="E-Commerce Category "
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
                            Discount Type{" "}
                            <span className="text-red-100">*</span>
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
                  </CustomCard>
                  <CustomCard styleClass="p-4 ">
                    <div className="bg-blue-700 bg-opacity-50 py-2 px-6 rounded-md   flex w-full gap-2 items-center sm:items-start">
                      <div className="flex flex-col w-full  justify-center">
                        <div className="flex items-center  gap-3">
                          <LazyImage
                            className="h-9  w-9 text-blue-900"
                            src={CiCircleAlert}
                          />
                          <p className="text-blue-900  font-medium ">
                            Do you want to add this product to another branch
                          </p>
                        </div>
                      </div>
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
                          if (item?.id === values?.vendor_shop_id) {
                            return { label: item?.label };
                          }
                        })}
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
      )}

      {isStep2 && (
        <Formik
          initialValues={initialValues2}
          enableReinitialize
          validationSchema={FormSchema2}
          onSubmit={handleSubmit2}
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
            const uploadImage = async (files: any) => {
              console.log("files ==", files);
              // let _comressFiles: any = await getCompressImages(files);
              // _comressFiles &&
              //   _comressFiles.forEach(async (file: any) => {
              //     let _images: any = values.images;

              //     _images.push(file);

              //     await setFieldValue("images", _images);
              //     console.log("_images ==", _images);
              //     console.log("values.images ==", values.images);

              //     setFieldTouched("images", true);
              //   });
              setFieldValue("images", files);
            };
            const uploadCoverImage = async (files: any) => {
              console.log("files cover_image ==", files);
              setFieldValue("cover_image", files);
            };
            return (
              <Form className="mt-4 ">
                <div className="space-y-6 ">
                  <CustomCard styleClass="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        {/* <p className="text-gray-900 flex gap-1">
                          <span>Dashboard</span>/<span>Products</span>/
                          <span>
                            {variantId ? "Edit Product" : "Add Product"}
                          </span>
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
                          <Link to="/products/addProduct" className="text-gray">
                            <p>{variantId ? "Edit Product" : "Add Product"}</p>
                          </Link>
                        </Breadcrumbs>

                        <h5 className="font-normal">
                          {variantId ? "Edit Product" : "Add Product"}
                        </h5>
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
                          label={variantId ? "Update" : "Save"}
                          isLoading={isAddLoading}
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                    </div>
                  </CustomCard>

                  <CustomCard styleClass="p-4 flex text-left flex-col gap-5 w-full mr-6">
                    <h6 className="font-medium"> Product Price & Stock</h6>
                    <div className="flex flex-col sm:flex-col  gap-3 w-full pb-4">
                      <div className="flex">
                        <label
                          htmlFor="price"
                          className="text-sm text-black-900 font-semibold"
                        >
                          Price
                        </label>
                        <span className="text-red-100">*</span>
                      </div>
                      <Input
                        id="price"
                        name="price"
                        // label="Price *"
                        className="flex-grow"
                        type="number"
                        variant="outline"
                        placeholder="$"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.price}
                        error={errors.price}
                        touched={touched.price}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-col  gap-3 w-full pb-4">
                      <div className="flex">
                        <label
                          htmlFor="totalQuantity"
                          className="text-sm text-black-900 font-semibold"
                        >
                          Total Quantity
                        </label>
                        <span className="text-red-100">*</span>
                      </div>

                      <Input
                        id="totalQuantity"
                        className="w-full"
                        name="totalQuantity"
                        // label="Total Quantity *"
                        type="number"
                        variant="outline"
                        placeholder="0"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.totalQuantity}
                        error={errors.totalQuantity}
                        touched={touched.totalQuantity}
                      />
                    </div>
                  </CustomCard>
                  <div className="flex justify-between">
                    <CustomCard styleClass=" flex text-left flex-col gap-5 w-[49%] ">
                      <div className=" bg-[#d0d4fda5] p-2 rounded-t-xl flex">
                        <img src={imageLogo} className="h-14 w-14" />
                        <p className="text-[#7580F2] ml-1">
                          Choose a high-quality image that accurately represents
                          your product and showcases its best features.
                        </p>
                      </div>
                      <div className="space-y-2 w-full p-4 ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900 font-semibold"
                        >
                          Upload Image
                        </label>

                        <div className="w-full">
                          <ImagePicker
                            className="flex-1"
                            error={errors.images as string}
                            value={values.images}
                            resetValue={() => {
                              setFieldValue("images", []);
                            }}
                            removeImage={(index) => {
                              const temp_images: any = values.images;
                              temp_images.splice(index, 1);
                              setFieldValue("images", temp_images);
                            }}
                            onChange={(files) => {
                              setFieldTouched("images", true);
                              return uploadImage(files);
                            }}
                            onSizeError={(error) => {
                              handleToastMessage(
                                "error",
                                "please select image of size less than 10mb"
                              );
                            }}
                            touched={true}
                          >
                            <div className="p-6 border-[2px] border-dashed">
                              <p className="text-gray-900 font-normal text-sm">
                                Drop your images here, Or{" "}
                                <span className="text-blue-900 cursor-pointer">
                                  Click to browse
                                </span>{" "}
                                1200*600 (3:4) Recommended, Up to 10MB Each
                              </p>
                            </div>
                            {values.images[0] && (
                              <div className="flex items-center gap-6 p-2 justify-center">
                                <LazyImage
                                  src={URL.createObjectURL(values.images[0])}
                                  // src={import.meta.env.VITE_REACT_API_URL +
                                  // "/" +
                                  // values.images[0]}

                                  className=" rounded  h-20 w-96"
                                />
                              </div>
                            )}
                            <div className="flex justify-center mt-10">
                              <CustomButton
                                type={"button"}
                                label="Upload Image"
                                styleClass="btn-black !rounded-md"
                              />
                            </div>
                          </ImagePicker>
                        </div>
                      </div>
                    </CustomCard>
                    <CustomCard styleClass=" flex items-center justify-between  text-left flex-col gap-5 w-[49%] ">
                      {/* <div className=" bg-[#d0d4fda5] p-2 rounded-t-xl flex">
                        <img src={imageLogo} className="h-14 w-14" />
                        <p className="text-[#7580F2] ml-1">
                          Choose a high-quality image that accurately represents
                          your product and showcases its best features.
                        </p>
                      </div> */}
                      <div className="space-y-2 w-full p-4 flex   flex-col">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900 font-semibold"
                        >
                          Upload Cover Image
                        </label>

                        <div className="w-full pt-[110px] ">
                          <ImagePicker
                            className="flex-1"
                            error={errors.cover_image as string}
                            value={values.cover_image}
                            resetValue={() => {
                              setFieldValue("cover_image", []);
                            }}
                            removeImage={(index) => {
                              const temp_images: any = values.cover_image;
                              temp_images.splice(index, 1);
                              setFieldValue("cover_image", temp_images);
                            }}
                            onChange={(files) => {
                              setFieldTouched("cover_image", true);
                              return uploadCoverImage(files);
                            }}
                            onSizeError={(error) => {
                              handleToastMessage(
                                "error",
                                "please select image of size less than 10mb"
                              );
                            }}
                            touched={true}
                          >
                            <div className="p-6 border-[2px] border-dashed">
                              <p className="text-gray-900 font-normal text-sm">
                                Drop your images here, Or{" "}
                                <span className="text-blue-900 cursor-pointer">
                                  Click to browse
                                </span>{" "}
                                1200*600 (3:4) Recommended, Up to 10MB Each
                              </p>
                            </div>
                            {values.cover_image[0] && (
                              <div className="flex items-center gap-6 p-2 justify-center">
                                <LazyImage
                                  src={URL.createObjectURL(
                                    values.cover_image[0]
                                  )}
                                  // src={import.meta.env.VITE_REACT_API_URL +
                                  // "/" +
                                  // values.cover_image[0]}

                                  className=" rounded  h-20 w-96"
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
                            )}
                            <div className="flex justify-center mt-10">
                              <CustomButton
                                type={"button"}
                                label="Upload Image"
                                styleClass="btn-black !rounded-md"
                              />
                            </div>
                          </ImagePicker>
                        </div>
                      </div>
                    </CustomCard>
                  </div>
                  <CustomCard styleClass="p-4 flex text-left flex-col gap-5">
                    <h6 className="font-medium"> Availability</h6>
                    <div className=" gap-5 w-full pb-4">
                      {Stock.map((res: any) => (
                        <Radio
                          id={String(res.id)}
                          name={res.value}
                          label={res.label}
                          checked={res.id === values?.in_stock}
                          onChange={(value) => {
                            setFieldValue(res.value, res.id);
                          }}
                          value={res.lable}
                        />
                      ))}
                    </div>
                  </CustomCard>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
      {isVariantAdd && (
        <Formik
          initialValues={initialValues3}
          enableReinitialize
          // validationSchema={FormSchema2}
          onSubmit={handleSubmit3}
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
                <div className="space-y-6 ">
                  <CustomCard styleClass="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        {/* <p className="text-gray-900 flex gap-1">
                          <span>Dashboard</span>/<span>Products</span>/
                          <span>
                            {variantId ? "Edit Product" : "Add Product"}
                          </span>
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
                          <Link to="" className="text-gray">
                            <p>{variantId ? "Edit Product" : "Add Product"}</p>
                          </Link>
                        </Breadcrumbs>

                        <h5 className="font-normal">
                          {variantId ? "Edit Product" : "Add Product"}
                        </h5>
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
                          label={variantId ? "Update" : "Save"}
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                    </div>
                  </CustomCard>

                  <CustomCard styleClass="p-4 space-y-6">
                    <div className="flex justify-between  items-center  pb-4">
                      <h6 className="font-medium "> Add product Variants</h6>
                      <Switch
                        id="blue"
                        name="contain_variations"
                        defaultChecked={isVariantAdd}
                        onChange={(e) => {
                          setIsVariantAdd(false);
                          setFieldValue(
                            "contain_variations",
                            e.target.checked ? 1 : 0
                          );
                        }}
                      />
                    </div>
                    <SeperatorLine className="!border-gray-800" />
                    <div className="space-y-5 text-left pb-4 w-[75vw]">
                      <div className="space-y-2 ">
                        <label
                          htmlFor="vendor_attributes"
                          className="text-sm text-black-900"
                        >
                          Product Variants
                        </label>
                        <Select
                          options={attributesOptions}
                          id="vendor_attributes"
                          name="vendor_attributes"
                          placeholder="Select Attribute"
                          isMulti
                          isClearable
                          defaultValue={values?.vendor_attributes}
                          onChange={async (value: any) => {
                            setFieldTouched("vendor_attributes", true);
                            setFieldTouched("product_variations", true);
                            await setFieldValue("vendor_attributes", value);
                            let _product_variation = values.product_variations;
                            _product_variation.forEach((element: any) => {
                              element.options = value.map((item: any) => ({
                                attribute_id: item?.id,
                                attribute_name: item?.name,
                                option_id: element.options.find(
                                  (option: any) =>
                                    option.attribute_id === item.id
                                )?.option_id,
                              }));
                            });
                            setFieldValue(
                              "product_variations",
                              _product_variation
                            );
                          }}
                          // options: [
                          //       { attribute_id: 11, option_id: 10 },
                          //       { attribute_id: 2, option_id: 12 },
                          //     ],
                          onBlur={handleBlur}
                          onFocus={() => {
                            setFieldTouched("vendor_attributes", true);
                          }}
                        />

                        <ErrorMessage
                          name={`vendor_attributes`}
                          component={"span"}
                          className="text-xs capitalize text-red-100"
                        />
                      </div>
                      {values.vendor_attributes.length > 0 && (
                        <FieldArray name="product_variations">
                          {() =>
                            values.product_variations.map(
                              (variantItem: any, i: any) => {
                                const uploadVariantImage = async (
                                  files: any
                                ) => {
                                  console.log({ index: i });
                                  console.log({ files });
                                  let _comressFiles: any =
                                    await getCompressImages(files);
                                  console.log({ _comressFiles });

                                  let _images: any = [];
                                  _comressFiles.forEach(async (file: any) => {
                                    _images.push(file);
                                    console.log({ _images });
                                    await setFieldValue(
                                      `product_variations.${i}.images`,
                                      _images
                                    );
                                    setFieldTouched(
                                      `product_variations.${i}.images`,
                                      true
                                    );
                                  });
                                };
                                const uploadCoverImage = async (files: any) => {
                                  console.log({ index: i });
                                  console.log({ files });
                                  let _comressFiles: any =
                                    await getCompressImages(files);
                                  console.log({ _comressFiles });

                                  let _images: any = [];
                                  _comressFiles.forEach(async (file: any) => {
                                    _images.push(file);
                                    console.log({ _images });
                                    await setFieldValue(
                                      `product_variations.${i}.cover_image`,
                                      _images
                                    );
                                    setFieldTouched(
                                      `product_variations.${i}.cover_image`,
                                      true
                                    );
                                  });
                                };
                                return (
                                  <div className="space-y-10" key={i}>
                                    <div className="flex justify-end">
                                      <input
                                        type="radio"
                                        onClick={(event) => {
                                          setIsDefaultVariant(i);
                                        }}
                                        name="is_default"
                                        id={`is_default_${i}`}
                                        checked={isDefaultVariant === i}
                                        value={i}
                                      />
                                      <label
                                        className="ml-2"
                                        style={{ color: "#000" }}
                                        htmlFor={`is_default_${i}`}
                                      >
                                        Select Default
                                      </label>
                                    </div>
                                    <div className="flex  overflow-x-auto max-w-[1300px]">
                                      {variantItem.options.map(
                                        (item: any, index: number) => (
                                          <div className="border  flex flex-col gap-3 py-3">
                                            <h6 className="text-center">
                                              {item.attribute_name}
                                            </h6>
                                            <SeperatorLine className="!mt-0 !border-gray-800" />
                                            <div className="px-4">
                                              <div className="w-[250px]">
                                                <SelectAttribute
                                                  attributeId={
                                                    values.product_variations[i]
                                                      .options[index]
                                                      ?.attribute_id
                                                  }
                                                  id={`product_variations.${i}.product_variations.${i}.options.${index}`}
                                                  name={`product_variations.${i}.attribute_id`}
                                                  value={
                                                    variantItem?.options[index]
                                                      ?.option_id
                                                  }
                                                  placeholder={`Select ${item.attribute_name} `}
                                                  handleChange={(
                                                    value: any
                                                  ) => {
                                                    setFieldTouched(
                                                      `product_variations.${i}.options.${index}.option_id`,
                                                      true
                                                    );
                                                    setFieldValue(
                                                      `product_variations.${i}.options.${index}.option_id`,
                                                      value.id
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  onFocus={() => {
                                                    setFieldTouched(
                                                      `product_variations.${i}.options.${index}.option_id`,
                                                      true
                                                    );
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name={`product_variations.${i}.options.${index}.option_id`}
                                                  component={"span"}
                                                  className="text-xs text-red-100 pt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}

                                      <div className="border  flex flex-col gap-3 py-3">
                                        <h6 className="text-center">Stock</h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="px-4">
                                          <div>
                                            <Input
                                              className="w-[250px]"
                                              id={`product_variations.${i}.stock`}
                                              name={`product_variations.${i}.stock`}
                                              type="number"
                                              variant="outline"
                                              placeholder="Enter Stock"
                                              handldChange={handleChange}
                                              onBlur={handleBlur}
                                              // value={values.name}
                                              // touched={
                                              //   touched?.product_variations &&
                                              //   touched?.product_variations[i]
                                              //     ?.stock
                                              // }
                                            />
                                            <ErrorMessage
                                              name={`product_variations.${i}.stock`}
                                              component={"span"}
                                              className="text-xs text-red-100 pt-1"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="border  flex flex-col gap-3 py-3">
                                        <h6 className="text-center">Price</h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="px-4">
                                          <div>
                                            <Input
                                              className="w-[250px]"
                                              id={`product_variations.${i}.price`}
                                              name={`product_variations.${i}.price`}
                                              type="number"
                                              variant="outline"
                                              placeholder="Enter Price"
                                              handldChange={handleChange}
                                              onBlur={handleBlur}
                                              // value={values.name}
                                              // touched={
                                              //   touched?.product_variations &&
                                              //   touched?.product_variations[i]
                                              //     ?.price
                                              // }
                                            />
                                            <ErrorMessage
                                              name={`product_variations.${i}.price`}
                                              component={"span"}
                                              className="text-xs text-red-100 pt-1"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      {/* <div className="border  flex flex-col gap-3 py-3 w-[60]">
                                        <h6 className="text-center">
                                          Availbility
                                        </h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="w-40">
                                          <div>
                                            <Select
                                              options={Stock}
                                              id={`product_variations.${i}.availbility`}
                                              name="availbility"
                                              value={Stock.map(
                                                (item: any) => {
                                                
                                                  if (
                                                    item?.id === values?.product_variations?.[i].availbility
                                                  ) {
                                                    console.log("item?.label",item?.label)
                                                    return {
                                                   
                                                      label: item?.label,
                                                    };
                                                  }
                                                }
                                              )}
                                              placeholder="Select  availbility"
                                              onChange={(value: any) => {
                                                console.log("value ==", value);
                                                setFieldTouched(
                                                  `product_variations.${i}.availbility`,
                                                  true
                                                );
                                                setFieldValue(
                                                  `product_variations.${i}.availbility`,
                                                  value.id
                                                );
                                              }}
                                              onBlur={handleBlur}
                                              onFocus={() => {
                                                setFieldTouched(
                                                  `product_variations.${i}.availbility`,
                                                  true
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name={`product_variations.${i}.availbility`}
                                              component={"span"}
                                              className="text-xs text-red-100 pt-1"
                                            />
                                          </div>
                                        </div>
                                      </div> */}
                                      <div className="border  flex flex-col gap-3 py-3">
                                        <h6 className="text-center">
                                          Variant Images
                                        </h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="overflow-x-auto w-[370px]">
                                          <ImagePicker
                                            index={i}
                                            className="flex-1"
                                            value={variantItem.images}
                                            resetValue={() => {
                                              setFieldValue(
                                                `product_variations.${i}.images`,
                                                []
                                              );
                                            }}
                                            removeImage={(index) => {
                                              const temp_images: any =
                                                variantItem.images;
                                              temp_images.splice(index, 1);
                                              setFieldValue(
                                                `product_variations.${i}.images`,
                                                temp_images
                                              );
                                            }}
                                            onChange={(files) => {
                                              setFieldTouched(
                                                `product_variations.${i}.images`,
                                                true
                                              );
                                              return uploadVariantImage(files);
                                            }}
                                            onSizeError={(error) => {
                                              handleToastMessage(
                                                "error",
                                                "please select image of size less than 10mb"
                                              );
                                            }}
                                            touched={true}
                                          >
                                            <div className=" flex flex-col items-center">
                                              <CustomButton
                                                label="Upload file"
                                                type={"button"}
                                                styleClass="btn-gray !rounded-md w-[90%]"
                                              />
                                              <ErrorMessage
                                                name={`product_variations.${i}.images`}
                                                component={"span"}
                                                className="text-xs text-red-100 pt-1"
                                              />
                                            </div>
                                          </ImagePicker>
                                        </div>
                                      </div>
                                      <div className="border  flex flex-col gap-3 py-3">
                                        <h6 className="text-center">
                                          Cover Image
                                        </h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="overflow-x-auto w-[370px]">
                                          <ImagePicker
                                            index={i}
                                            className="flex-1"
                                            value={variantItem.images}
                                            resetValue={() => {
                                              setFieldValue(
                                                `product_variations.${i}.cover_image`,
                                                []
                                              );
                                            }}
                                            removeImage={(index) => {
                                              const temp_images: any =
                                                variantItem.images;
                                              temp_images.splice(index, 1);
                                              setFieldValue(
                                                `product_variations.${i}.cover_image`,
                                                temp_images
                                              );
                                            }}
                                            onChange={(files) => {
                                              setFieldTouched(
                                                `product_variations.${i}.cover_image`,
                                                true
                                              );
                                              return uploadCoverImage(files);
                                            }}
                                            onSizeError={(error) => {
                                              handleToastMessage(
                                                "error",
                                                "please select image of size less than 10mb"
                                              );
                                            }}
                                            touched={true}
                                          >
                                            <div className=" flex flex-col items-center">
                                              <CustomButton
                                                label="Upload file"
                                                type={"button"}
                                                styleClass="btn-gray !rounded-md w-[90%]"
                                              />
                                              <ErrorMessage
                                                name={`product_variations.${i}.cover_image`}
                                                component={"span"}
                                                className="text-xs text-red-100 pt-1"
                                              />
                                            </div>
                                          </ImagePicker>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="text-left">
                                      <CustomButton
                                        handleButtonClick={() =>
                                          onChangeFields(values, setValues)
                                        }
                                        type={"button"}
                                        label="Add Another Variant"
                                        styleClass="btn-white !rounded-md"
                                      />
                                    </div>

                                    {i >= 1 && (
                                      <div className="text-left">
                                        <CustomButton
                                          handleButtonClick={() =>
                                            onChangeFields(values, setValues, i)
                                          }
                                          type={"button"}
                                          label="Remove Variant"
                                          styleClass="btn-white !rounded-md"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                            )
                          }
                        </FieldArray>
                      )}
                      {/* <div className="text-left">
                        <CustomButton
                          handleButtonClick={() =>
                            onChangeFields(values, setValues)
                          }
                          type={"button"}
                          label="Add Another Variant"
                          styleClass="btn-white !rounded-md"
                        />
                      </div> */}

                      {/* <div className="text-left">
                                  <CustomButton
                                    handleButtonClick={() =>
                                      onChangeFields(values, setValues)
                                    }
                                    type={"button"}
                                    label="Add Another Variant"
                                    styleClass="btn-white !rounded-md"
                                  />
                                </div>
                              
                             
                                <div className="text-left">
                                  <CustomButton
                                    handleButtonClick={() =>
                                      onChangeFields(values, setValues, i)
                                    }
                                    type={"button"}
                                    label="Remove Variant"
                                    styleClass="btn-white !rounded-md"
                                  />
                                </div> */}
                    </div>
                  </CustomCard>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </div>
  );
};

export default ProductAdd;

// vendor_attributes : [2,11]
// product_variations:
// [
//   {
//     price: 150,
//     stock: 30,
//     is_default: 1,
//     options: [
//       { attribute_id: 11, option_id: 10 },
//       { attribute_id: 2, option_id: 12 },
//     ],
//   },
//   {
//     price: 170,
//     stock: 35,
//     is_default: 0,
//     options: [
//       { attribute_id: 11, option_id: 11 },
//       { attribute_id: 2, option_id: 13 },
//     ],
//   },
// ];

// variant_images_0

// variant_images_1
