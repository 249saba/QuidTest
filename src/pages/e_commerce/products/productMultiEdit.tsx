import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import { ErrorMessage, FieldArray, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import isArray from "lodash/isArray";
import Resizer from "./../../../shared/imageResizer";
import { Switch } from "@mui/material";
import { GetAttributes } from "@src/shared/apiService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleToastMessage } from "@src/shared/toastify";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import SelectAttribute from "@src/shared/selectAttribute";
import SeperatorLine from "@shared/seperator/seperatorLine";
import LazyImage from "@shared/lazyImage";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import CircleCross from "@assets/icons/ways.png";
import Popup from "@shared/popup/popup";
import HandleDynamicAttributes from "@src/shared/utils/handleDynamicAttributes";
import { Breadcrumbs } from "@material-tailwind/react";

type DataObject = {
  product_variations: {
    is_default: number;
    price: number;
    stock: number;
    options: {
      attribute_id: any; // Replace 'any' with the appropriate type
      option_id: any; // Replace 'any' with the appropriate type
    }[];
  }[];
  [key: string]: any; // Allow dynamic properties with any value type
};
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
}
export interface initialSchemaValues2 {
  price: number | undefined;
  in_stock: string;
  totalQuantity: number;
  images: [];
  cover_image: [];
}
export interface initialSchemaValues3 {
  contain_variations: number;
  product_variations: any;
  vendor_attributes: any;
}
const FormSchema2 = Yup.object().shape({
  price: Yup.number()
    .min(0)
    .label("Price")
    .required()
    .typeError("Enter Price in number"),
  in_stock: Yup.string().label("availibility").required(),
  totalQuantity: Yup.number()
    .min(0)
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
  // availbility: "",
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
};
const _initialValues2: initialSchemaValues2 = {
  price: 0,
  in_stock: "",
  totalQuantity: 0,
  images: [],
  cover_image: [],
};
const ProductMultiEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isVariantAdd, setIsVariantAdd] = useState(false);
  const [isAddAnother, setIsAddAnother] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isimage, setIsimage] = useState(false);
  const [iscover, setIscover] = useState(false);
  const [isEditMulti, setIsEditMulti] = useState(false);
  const [attributesOptions, setAttributesOptions] = useState([]);
  const [initialValues1, setInitialValues1] = useState<any>(_initialValues1);
  const [initialValues2, setInitialValues2] = useState<any>(_initialValues2);
  const [productsDetail, setProductsDetail] = useState<any>({});
  const [selectedValues1, setSelectedValues1] = useState<any>({});
  const [existingVariants, setExistingVariants] = useState<any>([]);
  const [isDefaultNewVariant, setisDefaultNewVariant] = useState<any>(0);
  const [newVariants, setNewVariants] = useState<any>({
    product_variations: [],
  });
  console.log("isVariantAdd", isVariantAdd);
  const initialValues3: initialSchemaValues3 = {
    contain_variations: 1,
    vendor_attributes: [],
    product_variations: [productItem],
  };
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState({
    is_opened: false,
    variant_id: null,
  });
  const formikRef = useRef(null);

  const [variantId, setVariantId] = useState<any>(0);
  const [isDefaultVariant, setIsDefaultVariant] = useState<any>({});
  // const [isDefaultVariant, setIsDefaultVariant] = useState<any>(0);
  const { id } = useParams();
  const paramsId = id;
  const [attributes, setAttributes] = useState<any>([]);

  const navigate = useNavigate();
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
  useEffect(() => {
    getAttribute();
  }, []);

  // useEffect(() => {
  //   const getProductDetail = async () => {
  //     await backendCall({
  //       url: `/api/vendor/product/${paramsId}`,
  //       method: "GET",
  //     }).then((res) => {
  //       console.log("product res ===", res);
  //       if (res && !res.error) {
  //         console.log(res);
  //         const {
  //           Category,
  //           name,
  //           sub_text,
  //           Unit,
  //           TaxType,
  //           tax,
  //           discount,
  //           discount_type,
  //           description,
  //           ProductVariants,
  //         } = res?.data;
  //         let initValues1 = {
  //           name,
  //           sub_text,
  //           description,
  //           category_id: Category?.id,
  //           unit_id: Unit?.id,
  //           tax_type_id: TaxType?.id,
  //           tax,
  //           discount,
  //           discount_type,
  //         };
  //         setSelectedValues1({
  //           category_id: Category?.name,
  //           unit_id: Unit?.name,
  //           tax_type_id: TaxType?.name,
  //         });
  //         setInitialValues1(initValues1);
  //         // ---------- For Individual Variant ------------

  //         let initValues2 = {
  //           price: ProductVariants?.[0]?.price,
  //           in_stock: ProductVariants?.[0]?.in_stock,
  //           totalQuantity: ProductVariants?.[0]?.stock,
  //           images: [ProductVariants?.[0]?.ProductImages?.image_url],
  //           cover_image: [ProductVariants?.cover_image],
  //         };
  //         console.log("initValues2 ==", initValues2);
  //         setVariantId(ProductVariants?.[0]?.id);
  //         setInitialValues2(initValues2);
  //         setProductsDetail(res.data);
  //         setIsLoading(false);
  //       } else {
  //         setIsLoading(false);
  //       }
  //     });
  //   };
  //   if (paramsId) {
  //     getProductDetail();
  //   }
  // }, []);
  const getAttribute = () => {
    GetAttributes().then((res) => {
      if (res && !res.error) {
        setAttributesOptions(res.data);
      } else {
      }
    });
  };
  useEffect(() => {
    const getProductDetail = async () => {
      await backendCall({
        url: `/api/vendor/product/${paramsId}`,
        method: "GET",
      }).then((res) => {
        console.log("product res ===", res);
        if (res && !res.error) {
          console.log(res);
          const { ProductAttributes, ProductVariants } = res?.data;

          let oldVariations = ProductVariants.map((item: any) => ({
            id: item.id,
            price: item.price,
            stock: item.stock,
            is_default: item.is_default,
            // availbility: item.in_stock,
            options: item.ProductOptions.map((option: any) => ({
              product_attribute_id: option?.ProductAttribute?.id,
              option_id: option?.AttributeOption?.id,
              vendor_attribute_id:
                option?.ProductAttribute?.VendorAttribute?.id,
              attribute_name: option?.ProductAttribute?.VendorAttribute?.name,
            })),
            product_images: item.ProductImages,
            cover_image: item.cover_image_url,
          }));

          if (ProductVariants.length > 0) {
            setIsDefaultVariant({
              variant_id: ProductVariants.find(
                (variant: any) => variant.is_default === 1
              )?.id,
              index_id: null,
            });
          } else {
            setIsDefaultVariant(0);
          }

          setExistingVariants(oldVariations);
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
  }, [isEdit]);

  const handleSubmitOutsideFormik = () => {
    if (formikRef.current) {
      // @ts-ignore
      formikRef.current.submitForm();
    }
  };
  console.log("existingvariant", existingVariants);

  const onChangeFields = (values: any, setValues: any, index: any) => {
    // update dynamic form
    const product_variations = [...values.product_variations];
    if (index > -1) {
      product_variations.splice(index, 1);
    } else {
      product_variations.push(productItem);
    }
    console.log({ product_variations });
    setValues({ ...values, product_variations });
  };
  // const onChangeFirstFields = (values: any, setValues: any, index: number) => {
  //   // update dynamic form
  //   const product_variations = [...values.product_variations];
  //   if (index > -1) {
  //     product_variations.splice(index, 1);
  //   } else {
  //     product_variations.push(productItem);
  //   }
  //   console.log({ product_variations });
  //   setValues({ ...values, product_variations });
  // };

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
  const handleNewSubmit3 = (values: any) => {
    let foundDefault = 0;

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
            options: item.options.map(({ attribute_id, option_id }: any) => ({
              attribute_id: attribute_id,
              option_id: option_id,
            })),
          };
        }
      ),
    };
    if (foundDefault === 0) {
      handleToastMessage("error", "Please select default variant");
      return;
    }

    const formData = new FormData();
    let image;
    values.product_variations.forEach((element: any, index: number) => {
      image = "";
      if (element.images.length <= 0) {
        let new_cover_image_index = index + 1;
        image = "Please select Variant Image for  variant";
        // image="Please select Variant image for"+index+1+"variant";
        // handleToastMessage("error","Please select order status");
        return;
      }
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
    if (image != "") {
      handleToastMessage("error", image);
      return;
    }
    let cover_image;
    values.product_variations.forEach((element: any, index: number) => {
      console.log("element ==", element);
      cover_image = "";
      if (element.cover_image.length <= 0) {
        let new_cover_image_index = index + 1;
        cover_image = "Please select Variant cover image for variant";
        // handleToastMessage("error","Please select order status");
        return;
      }
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
    if (cover_image != "") {
      handleToastMessage("error", cover_image);
      return;
    }
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
    submitForm3NewData(formData);
  };
  const submitForm3NewData = (values: any) => {
    setIsLoading(true);
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
  // @ts-ignore
  const handleSubmit3 = (values: any, { setValues }) => {
    console.log("values ==", values);

    let is_default = 0;
    if (
      isDefaultVariant.variant_id &&
      isDefaultVariant.variant_id === values.id
    ) {
      is_default = 1;
    }

    const formData = new FormData();
    formData.append("id", values.id);
    //   let arr: { product_attribute_id: any; option_id: any; }[]=[];
    // values.product_variations.forEach((option: any) => (
    //   arr.push(  {
    //     product_attribute_id: option.options[0].attribute_id,
    //     option_id: option.options[0].option_id,
    //   })
    // ))

    formData.append("is_default", is_default.toString());

    formData.append(
      "options",
      JSON.stringify(
        values.options.map((option: any) => ({
          product_attribute_id: option.product_attribute_id,
          option_id: option.option_id,
        }))
      )
    );
    formData.append("stock", values.stock);
    formData.append("price", values.price);
    // formData.append("in_stock", values.availbility);
    if (values.images && values.images.length > 0) {
      values.images.forEach((file: any) => {
        formData.append(`images`, file);
      });
    }
    if(isimage){
      formData.append(`images`, values.images);
    }

    if(iscover){
      formData.append(`cover_image`, values.cover_image);
    }
   
    if (
      typeof values.cover_image !== "string" &&
      values.cover_image?.[0] !== undefined
    ) {
      formData.append(`cover_image`, values?.cover_image[0]);
    }
    formData.append("contains_options", "1");

    for (var pair of formData.entries()) {
      console.log("--------------", pair[0] + ", " + pair[1]);
    }
    submitForm3Data(formData, values, setValues);
  };
  // const handleEditSubmit = (values: any, { setValues }: any) => {
  //   console.log("values ==", values);

  //   let is_default = 0;
  //   if (
  //     isDefaultVariant.variant_id &&
  //     isDefaultVariant.variant_id === values.id
  //   ) {
  //     is_default = 1;
  //   }

  //   const formData = new FormData();
  //   formData.append("id", values.id);
  //   formData.append("price", values.price);
  //   formData.append("stock", values.stock);
  //   formData.append("is_default", is_default.toString());

  //   formData.append(
  //     "options",
  //     JSON.stringify(
  //       values.product_variations.map((option: any) => ({
  //         product_attribute_id: option.attribute_id,
  //         option_id: option.option_id,
  //       }))
  //     )
  //   );
  //   if (values.images && values.images.length > 0) {
  //     values.images.forEach((file: any) => {
  //       formData.append(`images`, file);
  //     });
  //   }
  //   if (
  //     typeof values.cover_image !== "string" &&
  //     values.cover_image?.[0] !== undefined
  //   ) {
  //     formData.append(`cover_image`, values?.cover_image[0]);
  //   }
  //   formData.append("contains_options", "1");

  //   for (var pair of formData.entries()) {
  //     console.log("--------------", pair[0] + ", " + pair[1]);
  //   }
  //   submitForm3Data(formData, values, setValues);
  // };
  const handleNewVariations = (values: any) => {
    debugger;
    const formData = new FormData();
    if (values.product_variations.length === 0) {
      navigate("/products");
      return;
    }

    const product_variations = values.product_variations.map(
      (item: any, index: any) => {
        let is_default = 0;
        if (
          isDefaultVariant.index !== null &&
          isDefaultVariant.index === index
        ) {
          is_default = 1;
        }
        return {
          is_default: is_default,
          price: item.price,
          stock: item.stock,
          // in_stock:item.availbility,
          options: item.options.map(
            ({ product_attribute_id, option_id }: any) => ({
              product_attribute_id: product_attribute_id,
              option_id: option_id,
            })
          ),
        };
      }
    );

    formData.append("product_variations", JSON.stringify(product_variations));
    values.product_variations.forEach((element: any, index: number) => {
      element.cover_image.forEach((file: any) => {
        formData.append(`cover_image_${index}`, file);
      });
    });

    values.product_variations.forEach((element: any, index: number) => {
      if (
        typeof element.images !== "string" &&
        element.images?.[0] !== undefined
      ) {
        console.log("inside if to set image");
        element.images.forEach((file: any) => {
          formData.append(`variant_images_${index}`, file);
        });
      }
    });
    for (var pair of formData.entries()) {
      console.log("--------------", pair[0] + ", " + pair[1]);
    }
    submitNewVariants(formData);
  };

  const submitForm3Data = (data: any, values: any, setValues: any) => {
    setIsLoading(true);
    console.log("submitForm3Data ==", data);
    backendCall({
      url: `/api/vendor/product/update_variant/${values.id}`,
      method: "PUT",
      data: data,
      contentType: "multipart/form-data;",
    }).then((res) => {
      console.log("res ==", res);
      if (res && !res.error) {
        setIsLoading(false);
        setValues({ ...values, images: [] });
        handleToastMessage("success", res?.message);
        setIsimage(false);
        setIscover(false)
        setIsEdit(false);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
        setIsEdit(false);
      }
    });
  };
  const submitForm2Data = (values: any) => {
    setIsLoading(true);
    const formData = new FormData();
    // if (typeof values.images !== "string" && values.images?.[0] !== undefined) {
    //   values.images.forEach((file: any, index: number) => {
    //     formData.append("images", file);
    //   });
    //   formData.append("cover_image", values.cover_image[0]);
    // }
    // formData.append("in_stock", values.in_stock);
    // formData.append("price", values.price);
    // formData.append("stock", values.totalQuantity);

    // if (variantId) {
    //   formData.append("contains_options", "0");
    //   backendCall({
    //     url: `/api/vendor/product/update_variant/${variantId}`,
    //     method: "PUT",
    //     data: formData,
    //     contentType: "multipart/form-data;",
    //   }).then((res) => {
    //     console.log("res ==", res);
    //     if (res && !res.error) {
    //       setIsLoading(false);
    //       navigate(`/products`);
    //       handleToastMessage("success", res?.message);
    //     } else {
    //       setIsLoading(false);
    //       handleToastMessage("error", res?.message);
    //     }
    //   });
    // } else
    // formData.append("contain_variations", "0");
    let arr: any[] = [];
    values.vendor_attributes.forEach((attr: any) => {
      arr.push(attr.id);
    });
    formData.append("contain_variations", values.contain_variations);
    // formData.append("price", values.product_variations[0].price);
    formData.append("stock", values.product_variations[0].stock);
    formData.append("price", values.product_variations[0].price);
    formData.append("in_stock", values.product_variations[0].in_stock);
    formData.append(
      "product_variations",
      JSON.stringify(values.product_variations)
    );
    formData.append("vendor_attributes", JSON.stringify(arr));
    if (
      typeof values.product_variations[0].images !== "string" &&
      values.product_variations[0].images?.[0] !== undefined
    ) {
      values.product_variations[0].images.forEach(
        (file: any, index: number) => {
          formData.append("images", file);
        }
      );
      // formData.append("cover_image", values.cover_image[0]);
    }
    if (
      typeof values.product_variations[0].cover_image !== "string" &&
      values.product_variations[0].cover_image?.[0] !== undefined
    ) {
      values.product_variations[0].cover_image.forEach(
        (file: any, index: number) => {
          formData.append("cover_image", file);
        }
      );
      // formData.append("cover_image", values.cover_image[0]);
    }
    backendCall({
      url: `/api/vendor/product/${paramsId}/add_variants`,
      method: "POST",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        setIsUpdateLoading(false);
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        navigate(`/products`);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const handleSubmit2 = (values: any) => {
    console.log("handleSubmit2 ==", values);
    // setIsStep1(true);
    submitForm2Data(values);
    setIsUpdateLoading(true);
  };
  const submitNewVariants = (data: any) => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/product/${paramsId}/add_new_variants`,
      method: "POST",
      data: data,
      contentType: "multipart/form-data;",
    }).then((res) => {
      console.log("res ==", res);
      if (res && !res.error) {
        setIsLoading(false);

        handleToastMessage("success", res?.message);
        navigate("/products");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const deleteVariant = (id: any) => {
    backendCall({
      url: `/api/vendor/product/delete_variant/${id}`,
      method: "DELETE",
    }).then((res) => {
      console.log("res ==", res);
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        window.location.reload();
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const onEdit = (i: any) => {
    setIsimage(false);
    setIscover(false);
    setIsEdit(i);
  };

  return (
    <div className="flex flex-col gap-4">
      <Popup
        isOpen={isOpenDeletePopup.is_opened}
        handleClose={() =>
          setIsOpenDeletePopup({ is_opened: false, variant_id: null })
        }
        isShowHeader={true}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <h5 className="font-semibold mt-5">Delete Variants</h5>
          <div className="flex flex-col justify-center items-center">
            <p className="font-medium ">Are you sure,you want to delete?</p>
          </div>

          <div className="space-y-3 mt-8 flex justify-around w-4/5">
            <CustomButton
              handleButtonClick={() =>
                deleteVariant(isOpenDeletePopup.variant_id)
              }
              label={"Delete Variant"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"}
            />
          </div>
        </div>
      </Popup>
      {existingVariants.length > 0 ? (
        <div className={"mt-4 mb-2"}>
          <div className={"space-y-6"}>
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
                    type="button"
                    handleButtonClick={() => navigate("/products")}
                    //   handleButtonClick={() => navigate("/products")}
                    label="Back"
                    styleClass="btn-black !rounded-md"
                  />
                  {/* <CustomButton
                  // handleButtonClick={() => navigate("/products")}
                  type={"submit"}
                  label="Update"
                  styleClass="btn-gray-light !rounded-md"
                /> */}
                </div>
              </div>
            </CustomCard>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="space-y-6 ">
        <>
          {/* <div className="flex justify-between  items-center  pb-4">
            <h6 className="font-medium "> Add product Variants</h6>
          </div> */}
          {/* <SeperatorLine className="!border-gray-800" /> */}
          <div className="space-y-5 text-left pb-4">
            <div className="space-y-2 ">
              {/* <label
                htmlFor="vendor_attributes"
                className="text-sm text-black-900"
              >
                Product Variants
              </label> */}
            </div>
            <>
              {existingVariants.length > 0 ? (
                existingVariants?.map((variantItem: any, i: any) => {
                  console.log({ variantItem });

                  return (
                    <Formik
                      key={i}
                      initialValues={variantItem}
                      enableReinitialize={true}
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
                        const uploadVariantImage = async (files: any) => {
                          console.log({ index: i });
                          console.log({ files });
                          let _comressFiles: any = await getCompressImages(
                            files
                          );
                          console.log({ _comressFiles });

                          let _images: any = [];
                          _comressFiles.forEach(async (file: any) => {
                            _images.push(file);
                            console.log({ _images });
                            await setFieldValue(`images`, files[0]);
                            console.log("values",files[0]);
                            setFieldTouched(`images`, true);
                          });
                          setIsimage(true);
                        };
                        const uploadCoverImage = async (files: any) => {
                          console.log({ index: i });
                          console.log( "files",files[0]);
                          await setFieldValue(`cover_image`, files[0]);
                          let _comressFiles: any = await getCompressImages(
                            files
                          );
                          console.log({ _comressFiles });

                          let _images: any = [];
                          _comressFiles.forEach(async (file: any) => {
                            _images.push(file);
                            console.log({ _images });
                         
                            setFieldTouched(`cover_image`, true);
                          });
                        };
                        return (
                          <Form className="mt-4 ">
                            <CustomCard styleClass="p-4 space-y-6">
                              {" "}
                              <div className="space-y-10" key={i}>
                                <div className="flex">
                                  <input
                                    type="radio"
                                    disabled={
                                      isDefaultVariant.variant_id !==
                                        values.id && isEdit !== i
                                    }
                                    onClick={(event) => {
                                      setIsDefaultVariant({
                                        variant_id: values.id,
                                        index: null,
                                      });
                                    }}
                                    name="is_default"
                                    id={`is_default-${i}`}
                                    checked={
                                      isDefaultVariant.variant_id === values.id
                                    }
                                    value={i}
                                  />
                                  <label
                                    className="ml-2"
                                    style={{ color: "#000" }}
                                    htmlFor={`is_default-${i}`}
                                  >
                                    Select Default
                                  </label>
                                </div>
                                {isEdit !== i ? (
                                  <div className="flex  overflow-x-scroll w-full">
                                    {values.options.map(
                                      (item: any, index: number) => (
                                        <div className="border  flex flex-1 flex-col gap-3 py-3">
                                          <h6 className="text-center">
                                            {item?.attribute_name}
                                          </h6>
                                          <SeperatorLine className="!mt-0 !border-gray-800" />
                                          <div className="px-4">
                                            <div className="flex-1">
                                              <HandleDynamicAttributes
                                                attributeId={
                                                  item?.vendor_attribute_id
                                                }
                                                optionId={item?.option_id}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <div className="border flex-1  flex flex-col gap-3 py-3">
                                      <h6 className="text-center">Stocks</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4">
                                        <div>
                                          <p className="text-black-900 flex justify-center">
                                            {values?.stock}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border flex flex-1 flex-col gap-3 py-3">
                                      <h6 className="text-center">Price</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4">
                                        <div>
                                          <p className="text-black-900 flex justify-center">
                                            {values?.price}
                                          </p>
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
                                                  id={`availbility`}
                                                  name="availbility"
                                                  value={Stock.map(
                                                    (item: any) => {
                                                      if (
                                                        item?.id ===
                                                        values.availbility
                                                      ) {
                                                        console.log(
                                                          "item?.label",
                                                          item?.label
                                                        );
                                                        return {
                                                          label: item?.label,
                                                        };
                                                      }
                                                    }
                                                  )}
                                                  placeholder="Select  availbility"
                                                  onChange={(value: any) => {
                                                    console.log(
                                                      "value ==",
                                                      value
                                                    );
                                                    setFieldTouched(
                                                      `availbility`,
                                                      true
                                                    );
                                                    setFieldValue(
                                                      `availbility`,
                                                      value.id
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  onFocus={() => {
                                                    setFieldTouched(
                                                      `availbility`,
                                                      true
                                                    );
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name={`availbility`}
                                                  component={"span"}
                                                  className="text-xs text-red-100 pt-1"
                                                />
                                              </div>
                                            </div>
                                          </div> */}
                                    <div className="border flex flex-1 flex-col gap-3 py-3">
                                      <h6 className="text-center">
                                        Variant Image
                                      </h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="overflow-x-auto flex-1">
                                        <div className="flex justify-center">
                                          <LazyImage
                                            src={
                                              values?.product_images[
                                                values?.product_images?.length -
                                                  1
                                              ]?.image_url &&
                                              import.meta.env
                                                .VITE_REACT_API_URL +
                                                "/" +
                                                values?.product_images[
                                                  values?.product_images
                                                    ?.length - 1
                                                ]?.image_url
                                            }
                                            className="w-12 h-12 object-cover mx-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border flex flex-1 flex-col gap-3 py-3">
                                      <h6 className="text-center">
                                        Cover Image
                                      </h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="overflow-x-auto flex-1">
                                        <div className="flex justify-center">
                                          <LazyImage
                                            src={
                                              values?.cover_image &&
                                              import.meta.env
                                                .VITE_REACT_API_URL +
                                                "/" +
                                                values?.cover_image
                                            }
                                            className="w-12 h-12 object-cover mx-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border flex flex-1 flex-col gap-3 py-3">
                                      <h6 className="text-center">Action</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div>
                                        <div className="flex justify-center">
                                          <PencilIcon
                                            className={"cursor-pointer mx-2"}
                                            onClick={() => onEdit(i)}
                                          />
                                          <DeleteIcon
                                            className={"cursor-pointer mx-2"}
                                            onClick={() =>
                                              setIsOpenDeletePopup({
                                                is_opened: true,
                                                variant_id: values.id,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex  overflow-x-scroll w-full">
                                      {values.options.map(
                                        (item: any, index: number) => (
                                          <div className="border  flex flex-1 flex-col gap-3 py-3">
                                            <h6 className="text-center">
                                              {item?.attribute_name}
                                            </h6>
                                            <SeperatorLine className="!mt-0 !border-gray-800" />
                                            <div className="px-4">
                                              <div>
                                                <SelectAttribute
                                                  attributeId={
                                                    item?.vendor_attribute_id
                                                  }
                                                  value={item?.option_id}
                                                  id={`options.${index}.option_id`}
                                                  name={`options.${index}.option_id`}
                                                  placeholder={`Select ${item?.attribute_name} `}
                                                  handleChange={(
                                                    value: any
                                                  ) => {
                                                    setFieldTouched(
                                                      `options.${index}.option_id`,
                                                      true
                                                    );
                                                    setFieldValue(
                                                      `options.${index}.option_id`,
                                                      value.id
                                                    );
                                                    setFieldTouched(
                                                      `options.${index}.product_attribute_id`,
                                                      true
                                                    );
                                                    setFieldValue(
                                                      `options.${index}.product_attribute_id`,
                                                      item?.product_attribute_id
                                                    );
                                                  }}
                                                  onBlur={handleBlur}
                                                  onFocus={() => {
                                                    setFieldTouched(
                                                      `options.${index}.option_id`,
                                                      true
                                                    );
                                                  }}
                                                />
                                                <ErrorMessage
                                                  name={`options.${index}.option_id`}
                                                  component={"span"}
                                                  className="text-xs text-red-100 pt-1"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}

                                      <div className="border flex-1 flex flex-col gap-3 py-3">
                                        <h6 className="text-center">Stock</h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="px-4">
                                          <div>
                                            <Input
                                              id={`product_variations.${i}.stock`}
                                              name={`stock`}
                                              type="number"
                                              variant="outline"
                                              placeholder="Enter Product Name"
                                              handldChange={handleChange}
                                              onBlur={handleBlur}
                                              value={values.stock}
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

                                      <div className="border flex-1 flex flex-col gap-3 py-3">
                                        <h6 className="text-center">Price</h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="px-4">
                                          <div>
                                            <Input
                                              id={`product_variations.${i}.price`}
                                              name={`price`}
                                              type="text"
                                              variant="outline"
                                              placeholder="Enter Product Name"
                                              handldChange={handleChange}
                                              onBlur={handleBlur}
                                              value={values.price}
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
                                              id={`availbility`}
                                              name="availbility"
                                              value={Stock.map((item: any) => {
                                                console.log("sss",item.id,values)
                                                if (
                                                  item?.id ===
                                                  values?.availbility
                                                ) {
                                                  console.log(
                                                    "item?.label",
                                                    item?.label
                                                  );
                                                  return {
                                                    label: item?.label,
                                                  };
                                                }
                                              })}
                                              placeholder="Select  availbility"
                                              onChange={(value: any) => {
                                                console.log("value ==", value);
                                                setFieldTouched(
                                                  `availbility`,
                                                  true
                                                );
                                                setFieldValue(
                                                  `availbility`,
                                                  value.id
                                                );
                                              }}
                                              onBlur={handleBlur}
                                              onFocus={() => {
                                                setFieldTouched(
                                                  `availbility`,
                                                  true
                                                );
                                              }}
                                            />
                                            <ErrorMessage
                                              name={`availbility`}
                                              component={"span"}
                                              className="text-xs text-red-100 pt-1"
                                            />
                                          </div>
                                        </div>
                                      </div> */}
                                      <div className="border flex-1 flex flex-col gap-3 py-3">
                                        <h6 className="text-center">
                                          Variant Image
                                        </h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="flex-1">
                                          {/* <div className="flex">
                                      {values?.product_images.map(
                                        (image: any) => (
                                          <LazyImage
                                            src={
                                              image?.image_url &&
                                              import.meta.env
                                                .VITE_REACT_API_URL +
                                                "/" +
                                                image.image_url
                                            }
                                            className="w-12 h-12 object-cover mx-1"
                                          />
                                        )
                                      )}
                                    </div> */}
                                          <ImagePicker
                                            index={i}
                                            className="flex-1"
                                  
                                            value={values.images}
                                            resetValue={() => {
                                              setFieldValue(`images`, []);
                                            }}
                                            removeImage={(index) => {
                                              const temp_images: any =
                                                variantItem.images;
                                              temp_images.splice(index, 1);
                                              setFieldValue(
                                                `images`,
                                                temp_images
                                              );
                                            }}
                                            onChange={(files) => {
                                              setFieldTouched(`images`, true);
                                             
                                              return uploadVariantImage(files);
                                            }}
                                            onSizeError={(error) => {
                                              handleToastMessage(
                                                "error",
                                                "please select image of size less than 10mb"
                                              );
                                            }}
                                           
                                          >
                                            <div className="flex flex-col items-center">
                                              
                                              <LazyImage
                                                src={
                                                  isimage
                                                    ?
                                                    // import.meta.env
                                                    //     .VITE_REACT_API_URL +
                                                    //   "/" +
                                                    //   values?.product_images[
                                                    //     values?.product_images?.length -
                                                    //       1
                                                    //   ]?.image_url
                                                  
                                                    URL.createObjectURL(
                                                      values?.images
                                                    )
                                                  
                                                      
                                                    : import.meta.env
                                                        .VITE_REACT_API_URL +
                                                      "/" +
                                                      values?.product_images[
                                                        values?.product_images?.length -
                                                          1
                                                      ]?.image_url
                                                }
                                                className="w-12 h-12 object-cover mx-1"
                                              />
                                              <CustomButton
                                                label="Upload file"
                                                type={"button"}
                                                styleClass="btn-gray !rounded-md w-[90%]"
                                              />

                                              <ErrorMessage
                                                name={`images`}
                                                component={"span"}
                                                className="text-xs text-red-100 pt-1"
                                              />
                                            </div>
                                          </ImagePicker>
                                      
                                        </div>
                                      </div>
                                      <div className="border flex-1 flex flex-col gap-3 py-3">
                                        <h6 className="text-center">
                                          Cover Image
                                        </h6>
                                        <SeperatorLine className="!mt-0 !border-gray-800" />
                                        <div className="flex-1">
                                          {/* <div className="flex">
                                      {values?.product_images.map(
                                        (image: any) => (
                                          <LazyImage
                                            src={
                                              image?.image_url &&
                                              import.meta.env
                                                .VITE_REACT_API_URL +
                                                "/" +
                                                image.image_url
                                            }
                                            className="w-12 h-12 object-cover mx-1"
                                          />
                                        )
                                      )}
                                    </div> */}
                                          <ImagePicker
                                            index={i}
                                            className="flex-1"
                                            value={values.cover_image}
                                            resetValue={() => {
                                              setFieldValue(`cover_image`, []);
                                            }}
                                            removeImage={(index) => {
                                              const temp_images: any =
                                                variantItem.cover_image;
                                              temp_images.splice(index, 1);
                                              setFieldValue(
                                                `cover_image`,
                                                temp_images
                                              );
                                            }}
                                            onChange={(files) => {
                                              setIscover(true);
                                              {console.log("images", values?.images)}
                                              setFieldTouched(
                                                `cover_image`,
                                                true
                                              );
                                              setIscover(true);
                                              return uploadCoverImage(files);
                                            }}
                                            onSizeError={(error) => {}}
                                            touched={true}
                                          >
                                            <div className="flex flex-col items-center">
                                            <LazyImage
                                                src={
                                                  iscover
                                                    ?
                                                    URL.createObjectURL(
                                                      values?.cover_image
                                                    )
                                                  //   import.meta.env
                                                  //   .VITE_REACT_API_URL +
                                                  // "/" +
                                                  // values?.cover_image
                                                      
                                                    : import.meta.env
                                                        .VITE_REACT_API_URL +
                                                      "/" +
                                                      values?.cover_image
                                                }
                                                className="w-12 h-12 object-cover mx-1"
                                              />
                                              <CustomButton
                                                label="Upload file"
                                                type={"button"}
                                                styleClass="btn-gray !rounded-md w-[90%]"
                                              />
                                              <ErrorMessage
                                                name={`cover_image`}
                                                component={"span"}
                                                className="text-xs text-red-100 pt-1"
                                              />
                                            </div>
                                          </ImagePicker>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end mt-8">
                                      <CustomButton
                                        type={"submit"}
                                        label={"Update"}
                                        styleClass="btn-black !rounded-md"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </CustomCard>
                          </Form>
                        );
                      }}
                    </Formik>
                  );
                })
              ) : (
                <Formik
                  initialValues={initialValues3}
                  enableReinitialize
                  // validationSchema={FormSchema2}
                  onSubmit={handleNewSubmit3}
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
                                    <p>
                                      {variantId
                                        ? "Edit Product"
                                        : "Add Product"}
                                    </p>
                                  </Link>
                                </Breadcrumbs>

                                <h5 className="font-normal">
                                  {variantId ? "Edit Product" : "Add Product"}
                                </h5>
                              </div>

                              <div className="flex gap-4">
                                <CustomButton
                                  handleButtonClick={() =>
                                    navigate("/products")
                                  }
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
                              <h6 className="font-medium ">
                                {" "}
                                Add product Variant
                              </h6>
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
                                    setIsAddAnother(true);
                                    setFieldTouched("vendor_attributes", true);
                                    setFieldTouched("product_variations", true);
                                    await setFieldValue(
                                      "vendor_attributes",
                                      value
                                    );
                                    let _product_variation =
                                      values.product_variations;
                                    _product_variation.forEach(
                                      (element: any) => {
                                        element.options = value.map(
                                          (item: any) => ({
                                            attribute_id: item?.id,
                                            attribute_name: item?.name,
                                            option_id: element.options.find(
                                              (option: any) =>
                                                option.attribute_id === item.id
                                            )?.option_id,
                                          })
                                        );
                                      }
                                    );
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
                                        console.log(
                                          "isDefaultVariant",
                                          isDefaultVariant,
                                          i
                                        );
                                        const uploadVariantImage = async (
                                          files: any
                                        ) => {
                                          console.log({ index: i });
                                          console.log({ files });
                                          let _comressFiles: any =
                                            await getCompressImages(files);
                                          console.log({ _comressFiles });

                                          let _images: any = [];
                                          _comressFiles.forEach(
                                            async (file: any) => {
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
                                            }
                                          );
                                        };
                                        const uploadCoverImage = async (
                                          files: any
                                        ) => {
                                          console.log({ index: i });
                                          console.log({ files });
                                          let _comressFiles: any =
                                            await getCompressImages(files);
                                          console.log({ _comressFiles });

                                          let _images: any = [];
                                          _comressFiles.forEach(
                                            async (file: any) => {
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
                                            }
                                          );
                                        };
                                        return (
                                          <div className="space-y-10" key={i}>
                                            <div className="flex justify-end">
                                              <input
                                                type="radio"
                                                onClick={(event) => {
                                                  setIsDefaultVariant(i);
                                                }}
                                                // onClick={(event) => {
                                                //   setIsDefaultVariant({
                                                //     variant_id: null,
                                                //     index: i,
                                                //   });
                                                // }}
                                                name="is_default"
                                                id={`is_default_${i}`}
                                                // defaultChecked={true}
                                                checked={isDefaultVariant === i}
                                                // checked={isDefaultNewVariant === i}
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
                                                            values
                                                              .product_variations[
                                                              i
                                                            ].options[index]
                                                              ?.attribute_id
                                                          }
                                                          id={`product_variations.${i}.product_variations.${i}.options.${index}`}
                                                          name={`product_variations.${i}.attribute_id`}
                                                          value={
                                                            variantItem
                                                              ?.options[index]
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
                                                <h6 className="text-center">
                                                  Stock
                                                </h6>
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
                                                      handldChange={
                                                        handleChange
                                                      }
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
                                                <h6 className="text-center">
                                                  Price
                                                </h6>
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
                                                      handldChange={
                                                        handleChange
                                                      }
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
                                              </div>{" "}
                                              {/* <div className="border  flex flex-col gap-3 py-3 w-[60]">
                                                <h6 className="text-center">
                                                  Availbilityssg
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
                                                            item?.id ===
                                                            values
                                                              ?.product_variations?.[
                                                              i
                                                            ].availbility
                                                          ) {
                                                            console.log(
                                                              "item?.label",
                                                              item?.label
                                                            );
                                                            return {
                                                              label:
                                                                item?.label,
                                                            };
                                                          }
                                                        }
                                                      )}
                                                      placeholder="Select  availbility"
                                                      onChange={(
                                                        value: any
                                                      ) => {
                                                        console.log(
                                                          "value ==",
                                                          value
                                                        );
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
                                                  Variant Image
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
                                                      temp_images.splice(
                                                        index,
                                                        1
                                                      );
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
                                                      return uploadVariantImage(
                                                        files
                                                      );
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
                                                      {values
                                                        .product_variations[i]
                                                        .images[0] && (
                                                        <LazyImage
                                                          src={
                                                            URL.createObjectURL(
                                                              values
                                                                .product_variations[
                                                                i
                                                              ].images[0]
                                                            )

                                                            // import.meta.env
                                                            //   .VITE_REACT_API_URL +
                                                            // "/" +
                                                            // values
                                                            //   .product_variations[
                                                            //   i
                                                            // ].images[0]
                                                          }
                                                          className="w-8 h-8"
                                                        />
                                                      )}
                                                      <CustomButton
                                                        label="Uploads file"
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
                                                      temp_images.splice(
                                                        index,
                                                        1
                                                      );
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
                                                      return uploadCoverImage(
                                                        files
                                                      );
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
                                                      {values
                                                        .product_variations[i]
                                                        .cover_image[0] && (
                                                        <LazyImage
                                                          src={
                                                            URL.createObjectURL(
                                                              values
                                                                .product_variations[
                                                                i
                                                              ].cover_image[0]
                                                            )

                                                            // import.meta.env
                                                            //   .VITE_REACT_API_URL +
                                                            // "/" +
                                                            // values
                                                            //   .product_variations[
                                                            //   i
                                                            // ].images[0]
                                                          }
                                                          className="w-8 h-8"
                                                        />
                                                      )}
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

                                            <>
                                              {" "}
                                              <div className="text-left"></div>
                                              <div className="text-left">
                                                <CustomButton
                                                  handleButtonClick={() =>
                                                    onChangeFields(
                                                      values,
                                                      setValues,
                                                      i
                                                    )
                                                  }
                                                  type={"button"}
                                                  label="Remove Variant"
                                                  styleClass="btn-white !rounded-md"
                                                />
                                              </div>
                                            </>
                                          </div>
                                        );
                                      }
                                    )
                                  }
                                </FieldArray>
                              )}
                              {isAddAnother ? (
                                <CustomButton
                                  handleButtonClick={() =>
                                    onChangeFields(values, setValues, -1)
                                  }
                                  type={"button"}
                                  label="Add Another Variant"
                                  styleClass="btn-white !rounded-md"
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </CustomCard>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              )}
              {existingVariants.length > 0 ? (
                <Formik
                  innerRef={formikRef}
                  initialValues={newVariants}
                  enableReinitialize
                  // validationSchema={FormSchema2}
                  onSubmit={handleNewVariations}
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
                      <CustomCard styleClass="p-4 space-y-6">
                        <Form className="mt-4 " id="new_variation_form">
                          <div className="space-y-5 text-left pb-4">
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
                                      _comressFiles.forEach(
                                        async (file: any) => {
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
                                        }
                                      );
                                    };
                                    const uploadCoverImage = async (
                                      files: any
                                    ) => {
                                      console.log({ index: i });
                                      console.log({ files });
                                      let _comressFiles: any =
                                        await getCompressImages(files);
                                      console.log({ _comressFiles });

                                      let _images: any = [];
                                      _comressFiles.forEach(
                                        async (file: any) => {
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
                                        }
                                      );
                                    };
                                    return (
                                      <div className="space-y-10" key={i}>
                                        <div className="flex">
                                          <input
                                            type="radio"
                                            disabled={false}
                                            onClick={(event) => {
                                              setIsDefaultVariant({
                                                variant_id: null,
                                                index: i,
                                              });
                                            }}
                                            name="is_default"
                                            id={`is_default_${i}`}
                                            checked={
                                              isDefaultVariant.index === i
                                            }
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
                                          {productsDetail?.ProductAttributes?.map(
                                            (item: any, index: number) => (
                                              <div className="border  flex flex-col gap-3 py-3">
                                                <h6 className="text-center">
                                                  {item?.VendorAttribute?.name}
                                                </h6>
                                                <SeperatorLine className="!mt-0 !border-gray-800" />
                                                <div className="px-4">
                                                  <div className="w-[250px]">
                                                    <SelectAttribute
                                                      attributeId={
                                                        item?.VendorAttribute
                                                          ?.id
                                                      }
                                                      id={`product_variations.${i}.options.${index}.option_id`}
                                                      name={`product_variations.${i}.options.${index}.option_id`}
                                                      placeholder={`Select ${item?.VendorAttribute?.name} `}
                                                      value={
                                                        variantItem?.options[
                                                          index
                                                        ]?.option_id
                                                      }
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
                                                        setFieldTouched(
                                                          `product_variations.${i}.options.${index}.product_attribute_id`,
                                                          true
                                                        );
                                                        setFieldValue(
                                                          `product_variations.${i}.options.${index}.product_attribute_id`,
                                                          item?.id
                                                        );
                                                        return value.id;
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
                                            <h6 className="text-center">
                                              Stock
                                            </h6>
                                            <SeperatorLine className="!mt-0 !border-gray-800" />
                                            <div className="px-4">
                                              <div>
                                                <Input
                                                  className="w-[150px]"
                                                  id={`product_variations.${i}.stock`}
                                                  name={`product_variations.${i}.stock`}
                                                  type="text"
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
                                            <h6 className="text-center">
                                              Price
                                            </h6>
                                            <SeperatorLine className="!mt-0 !border-gray-800" />
                                            <div className="px-4">
                                              <div>
                                                <Input
                                                  className="w-[150px]"
                                                  id={`product_variations.${i}.price`}
                                                  name={`product_variations.${i}.price`}
                                                  type="text"
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
                                                        item?.id ===
                                                        values
                                                          ?.product_variations?.[
                                                          i
                                                        ].availbility
                                                      ) {
                                                        console.log(
                                                          "item?.label",
                                                          item?.label
                                                        );
                                                        return {
                                                          label: item?.label,
                                                        };
                                                      }
                                                    }
                                                  )}
                                                  placeholder="Select  availbility"
                                                  onChange={(value: any) => {
                                                    console.log(
                                                      "value ==",
                                                      value
                                                    );
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
                                              Variant Image
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
                                                  return uploadVariantImage(
                                                    files
                                                  );
                                                }}
                                                onSizeError={(error) => {}}
                                                touched={true}
                                              >
                                                <div className="flex flex-col items-center">
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
                                          <div className="border flex-1 flex flex-col gap-3 py-3">
                                            <h6 className="text-center">
                                              Cover Image
                                            </h6>
                                            <SeperatorLine className="!mt-0 !border-gray-800" />
                                            <div className="flex-1 w-[370px]">
                                              <ImagePicker
                                                index={i}
                                                className="flex-1"
                                                value={values.cover_image}
                                                resetValue={() => {
                                                  setFieldValue(
                                                    `product_variations.${i}.cover_image`,
                                                    []
                                                  );
                                                }}
                                                removeImage={(index) => {
                                                  const temp_images: any =
                                                    variantItem.cover_image;
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
                                                  return uploadCoverImage(
                                                    files
                                                  );
                                                }}
                                                onSizeError={(error) => {}}
                                                touched={true}
                                              >
                                                <div className="flex flex-col items-center">
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
                                        <div className="flex justify-end">
                                          <CustomButton
                                            // handleButtonClick={() => navigate("/products")}
                                            type={"submit"}
                                            label="Update"
                                            styleClass="btn-black !rounded-md"
                                          />
                                        </div>

                                        <div className="text-left">
                                          <CustomButton
                                            handleButtonClick={() =>
                                              onChangeFields(
                                                values,
                                                setValues,
                                                i
                                              )
                                            }
                                            type={"button"}
                                            label="Remove Variant"
                                            styleClass="btn-white !rounded-md"
                                          />
                                        </div>
                                      </div>
                                    );
                                  }
                                )
                              }
                            </FieldArray>
                            {existingVariants.length > 0 ? (
                              <div className="text-left">
                                <CustomButton
                                  handleButtonClick={() =>
                                    onChangeFields(values, setValues, -1)
                                  }
                                  type={"button"}
                                  label="Add Another Variant"
                                  styleClass="btn-white !rounded-md"
                                />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </Form>
                      </CustomCard>
                    );
                  }}
                </Formik>
              ) : (
                ""
              )}
            </>
          </div>
        </>
      </div>
    </div>
  );
};

export default ProductMultiEdit;
