import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import Input from "@src/shared/input";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import isArray from "lodash/isArray";
import Radio from "@src/shared/radio/radio";

import imageLogo from "@assets/icons/imageLogo.png";
import { Link, useNavigate, useParams } from "react-router-dom";

import { handleToastMessage } from "@src/shared/toastify";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { Breadcrumbs } from "@material-tailwind/react";
import LazyImage from "@src/shared/lazyImage";

export interface initialSchemaValues2 {
  price: number | undefined | any;
  in_stock: string;
  totalQuantity: number | undefined | any;
  images: [];
  cover_image: [];
}

const FormSchema2 = Yup.object().shape({
  price: Yup.number()

    .min(1)
    .label("Price")
    .required()
    .typeError("Enter Price in number"),
  in_stock: Yup.string().label("availibility").required(),
  totalQuantity: Yup.number()

    .min(1)
    .max(100)
    .label("Total Quantity")
    .required()
    .typeError("Enter Quantity in number"),
  images: Yup.array().test({
    message: "Atleast One Image is required",
    test: (val) => (isArray(val) ? val.length > 0 && val.length <= 5 : false),
  }),
  cover_image: Yup.array().required(),
});

const _initialValues2: initialSchemaValues2 = {
  price: "",
  in_stock: "",
  totalQuantity: "",
  images: [],
  cover_image: [],
};

const ProductSingleEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCover, setIsCover] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [productsDetail, setProductsDetail] = useState({});
  const [initialValues2, setInitialValues2] = useState<any>(_initialValues2);
  const [variantId, setVariantId] = useState<any>(0);
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

          // ---------- For Individual Variant ------------
          let arr =[];
          const len=ProductVariants?.[0]?.ProductImages.length;
           arr= ProductVariants?.[0]?.ProductImages?.[
            len - 1
            ];
            console.log("arr",len)
          let initValues2 = {
            price: ProductVariants?.[0]?.price,
            in_stock: ProductVariants?.[0]?.in_stock,
            totalQuantity: ProductVariants?.[0]?.stock,
            // images: [ProductVariants?.[0]?.ProductImages[0]?.image_url],
            images: [arr.image_url],
            cover_image: [ProductVariants?.[0]?.cover_image_url],
          };
          console.log("initValues2 ==", initValues2);
          setVariantId(ProductVariants?.[0]?.id);
          // if (!ProductVariants?.[0]?.id) {
          //   handleToastMessage("error", "Variant not found");
          //   navigate({ search: `?state=AddVariant`, pathname: "/products/addProduct" });
          //   // navigate(`/products/addProduct/?status="AddVariant"`);
          // }
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

  const handleSubmit2 = (values: any) => {
    // setIsStep1(true);
    submitForm2Data(values);
    console.log("handleSubmit2 ==", values);
  };

  const submitForm2Data = (values: any) => {
    console.log("values", values);
    setIsLoading(true);
    const formData = new FormData();
    if (isCover) {
      if (
        typeof values.cover_image !== "string" &&
        values.cover_image?.[0] !== undefined
      ) {
        formData.append("cover_image", values?.cover_image[0]);
      }
    }
    if (isImage) {
      if (
        typeof values.images !== "string" &&
        values.images?.[0] !== undefined
      ) {
        formData.append("images", values?.images[0]);
        // values.images.forEach((file: any, index: number) => {
        //   formData.append("images", file);
        // });
      }
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

  return (
    <div className="flex flex-col gap-4">
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
                            {"Edit Product" }
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
                          <p>{"Edit Product"}</p>
                        </Link>
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
                        label={"Update"}
                        styleClass="btn-black !rounded-md"
                      />
                    </div>
                  </div>
                </CustomCard>

                <CustomCard styleClass="p-4 flex text-left flex-col gap-5 w-full mr-6">
                  <h6 className="font-medium"> Product Price & Stock</h6>
                  <div className="flex sm:flex-col  gap-5 w-full pb-4">
                    <Input
                      id="price"
                      name="price"
                      label="Price "
                      className="flex-grow"
                      type="number"
                      variant="outline"
                      placeholder="€"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      error={errors.price}
                      touched={touched.price}
                    />
                  </div>

                  <div className="flex sm:flex-col  gap-5 w-full pb-4">
                    <Input
                      id="totalQuantity"
                      className="w-full"
                      name="totalQuantity"
                      label="Total Quantity "
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
                            setIsImage(true);
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
                                // src={URL.createObjectURL(values.cover_image[0])}
                                src={
                                  isImage
                                    ? URL.createObjectURL(values.images[0])
                                    : import.meta.env.VITE_REACT_API_URL +
                                      "/" +
                                      values.images[0]
                                }
                                className=" rounded  h-20 w-96"
                              />
                            </div>
                          )}
                          <div className="flex justify-center mt-10">
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
                      </div>
                    </div>
                  </CustomCard>
                  <CustomCard styleClass=" flex text-left flex-col gap-5 w-[49%] ">
                    {/* <div className=" bg-[#d0d4fda5] p-2 rounded-t-xl flex">
                        <img src={imageLogo} className="h-14 w-14" />
                        <p className="text-[#7580F2] ml-1">
                          Choose a high-quality image that accurately represents
                          your product and showcases its best features.
                        </p>
                      </div> */}
                    <div className="space-y-2 w-full p-4  h-[340px] flex justify-between flex-col">
                      <label
                        htmlFor="unit_id"
                        className="text-sm text-black-900 font-semibold"
                      >
                        Upload Cover Image
                      </label>

                      <div className="w-full pt-[110px]">
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
                            setIsCover(true);
                            setFieldTouched("cover_image", true);
                            return uploadCoverImage(files);
                          }}
                          onSizeError={(error) => {
                            handleToastMessage(
                              "error",
                              "please select Cover image of size less than 10mb"
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
                                // src={URL.createObjectURL(values.cover_image[0])}
                                src={
                                  isCover
                                    ? URL.createObjectURL(values.cover_image[0])
                                    : import.meta.env.VITE_REACT_API_URL +
                                      "/" +
                                      values.cover_image[0]
                                }
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
                </div>
                <CustomCard styleClass="p-4 flex text-left flex-col gap-5">
                  <h6 className="font-medium"> Availability</h6>
                  <div className=" gap-5 w-full pb-4">
                    {Stock.map((res: any) => (
                      <Radio
                        id={String(res.id)}
                        name={res.value}
                        label={res.lable}
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
    </div>
  );
};

export default ProductSingleEdit;
