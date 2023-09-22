import { getUnit } from "@mui/material/styles/cssUtils";
import { GetTaxTypes, GetCategory } from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import { handleToastMessage } from "@src/shared/toastify";
import { Link, useNavigate } from "react-router-dom";
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
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import FormControlLabel from "@mui/material/FormControlLabel";
import * as Yup from "yup";
import isArray from "lodash/isArray";
import Resizer from "react-image-file-resizer";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import Radio from "@src/shared/radio/radio";
import { IconButton, Switch } from "@mui/material";
import Table from "rc-table";

import { ReactComponent as EditIcon } from "@assets/vendor/icons/pencil.svg";
import { ReactComponent as DeleteIcon } from "@assets/vendor/icons/delete.svg";
import { Breadcrumbs } from "@material-tailwind/react";

export interface initialSchemaValues {
  mandatoryTask: boolean;
  category_id: string;
}

const FormSchema = Yup.object().shape({
  category_id: Yup.string().label("Category Name").required(),

  // product_option_groups: Yup.string().label("product").required(),
});

const initialValues: initialSchemaValues = {
  mandatoryTask: false,
  category_id: "",
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

const CategoryAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const [isVariantAdd, setIsVariantAdd] = useState(false);
  const [formData, setFormData] = useState({
    category_id: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    GetCategory().then((res: any) => {
      if (res && !res.error) {
        setUnitOptions(res.data);
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
      product_variations.push({
        color: "",
        size: null,
        shape: "",
        price: null,
        images: [],
      });
    }
    setValues({ ...values, product_variations });
  };

  const getCompressImages = async (files: any) => {
    try {
      let promises = files.map(async (file: any) => {
        let _image = await getImage(file);
        return _image;
      });
      const results = await Promise.all(promises);
      return results;
    } catch (err) {}
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

  const columns = [
    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Color"}</span>
        </div>
      ),
      dataIndex: "color",
      key: "color",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-sm font-normal"> {name}</p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Size"}</span>
        </div>
      ),
      dataIndex: "size",
      key: "size",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-sm font-normal"> {name}</p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Shape"}</span>
        </div>
      ),
      dataIndex: "shape",
      key: "shape",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-sm font-normal"> {name}</p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Price"}</span>
        </div>
      ),
      dataIndex: "price",
      key: "price",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-sm font-normal"> {name}</p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Images"}</span>
        </div>
      ),
      dataIndex: "images",
      key: "images",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex gap-3 overflow-x-auto">
          {row.images.map((item: any) => (
            <img
              className="w-8 h-8 object-cover"
              src={URL.createObjectURL(item)}
              loading="lazy"
            />
          ))}
        </div>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-between items-center">
          <span>{"Actions"}</span>
        </div>
      ),
      dataIndex: "action",
      key: "action",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex gap-2 items-center">
          <IconButton
            onClick={() => {
              setIsVariantAdd(true);
            }}
            className="bg-transparent shadow-none"
          >
            <EditIcon className="w-4 h-4 cursor-pointer" />
          </IconButton>

          <DeleteIcon className="w-4 h-4 cursor-pointer" />
        </div>
      ),
    },
  ];

  const handleSubmit = (values: any) => {
    console.log("login ==", values);

    setIsLoading(true);
    backendCall({
      url: "/api/vendor/category_management/",
      method: "POST",
      data: values.mandatoryTask
        ? { category_id: formData.category_id, is_enabled: 1 }
        : { category_id: formData.category_id, is_enabled: 0 },
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        navigate("/categoriesList");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
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
          setValues,
        }) => {
          return (
            <Form className="mt-4 ">
              {!isVariantAdd && (
                <div className="space-y-6 ">
                  <CustomCard styleClass="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-left">
                        {/* <p className="text-gray-900 flex gap-1">
                          <span>Dashboard</span>/<span>Category</span>/
                          <span>Add Category</span>
                        </p> */}
                        <Breadcrumbs
                          aria-label="breadcrumb"
                          className="bg-inherit pl-0"
                        >
                          <Link to="/dashboard">
                            <p>Dashboard</p>
                          </Link>
                          <Link to="/categoriesList">
                            <p>Category</p>
                          </Link>
                          <Link to="" className="text-gray">
                            <p>{"Add Category"}</p>
                          </Link>
                        </Breadcrumbs>

                        <h5 className="font-normal">Add Category</h5>
                      </div>

                      <div className="flex gap-4">
                        <CustomButton
                          type={"button"}
                          label="Cancel"
                          styleClass="btn-gray-light !rounded-md"
                          handleButtonClick={() => {
                            navigate("/categoriesList");
                          }}
                        />
                        <CustomButton
                          type={"submit"}
                          label="Save Category"
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                    </div>
                  </CustomCard>
                  <CustomCard styleClass="p-4">
                    <div className="space-y-5 text-left pb-4">
                      <h6 className="font-medium "> Basic Information</h6>
                      <div className="space-y-2 ">
                        <label
                          htmlFor="category_id"
                          className="text-sm text-black-900"
                        >
                          Category Name <span className="text-red-100">*</span>
                        </label>
                        <Select
                          options={unitOptions}
                          id="category_id"
                          name="category_id"
                          placeholder="E-Commerce Category "
                          onChange={(value: any) => {
                            setFieldTouched("category_id", true);
                            console.log("category_id", value);
                            setFieldValue("category_id", value.label);
                            // setFieldValue("action", value.value.label);
                            setFormData({ ...formData, category_id: value.id });
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
                      <div className="flex items-center">
                        <h6 className="font-medium "> Status</h6>
                        <FormControlLabel
                          className="!text-gray-700 !font-normal pl-2"
                          control={
                            <Switch
                              id="mandatoryTask"
                              checked={values.mandatoryTask}
                              onChange={handleChange}
                              name="mandatoryTask"
                            />
                          }
                          label=""
                        />
                      </div>
                    </div>
                  </CustomCard>
                  {/* <CustomCard styleClass="p-4 ">
                    <div className="space-y-5 text-left pb-4">
                      <h6 className="font-medium "> Product Bio</h6>
                      <div className="flex sm:flex-col gap-5">
                        <Input
                          className="w-full"
                          id="name"
                          name="name"
                          label="Product Name *"
                          type="text"
                          variant="outline"
                          placeholder="Enter Product Name"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          error={errors.name}
                          touched={touched.name}
                        />
                        <Input
                          className="w-full"
                          id="sub_text"
                          name="sub_text"
                          label="Sub Text *"
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

                      <TextArea
                        id="description"
                        name="description"
                        label="Description *"
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
                    <div className="flex justify-between  items-center  pb-4">
                      <h6 className="font-medium "> Add product Variants</h6>
                      <Switch
                        id="blue"
                        name="contain_variations"
                        // value={values.contain_variations}
                        onChange={(e) => {
                          setFieldValue(
                            "contain_variations",
                            e.target.checked ? 1 : 0
                          );
                          setIsVariantAdd(e.target.checked);
                        }}
                      />
                    </div>

                    {values.product_variations.length &&
                      values.product_variations[0].color && (
                        <Table
                          tableLayout="fixed"
                          columns={columns as any}
                          emptyText={"No data found"}
                          data={values.product_variations}
                          rowKey="id"
                          scroll={{ x: 1000 }}
                          sticky={true}
                          className="matrix"
                          onHeaderRow={() => ({
                            className: "header-title",
                          })}
                        />
                      )}
                  </CustomCard>

                  <CustomCard styleClass="p-4 flex text-left flex-col gap-5 ">
                    <h6 className="font-medium"> Product Price & Stock</h6>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 justify-between  text-left">
                      <Input
                        id="price"
                        name="price"
                        label="Price *"
                        className="flex-grow"
                        type="text"
                        variant="outline"
                        placeholder="$"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.price}
                        error={errors.price}
                        touched={touched.price}
                      />
                      <div className="space-y-2 ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900"
                        >
                          Unit *
                        </label>
                        <Select
                          options={unitOptions}
                          id="unit_id"
                          name="unit_id"
                          placeholder="Select Your Unit type"
                          onChange={(value: any) => {
                            setFieldTouched("unit_id", true);
                            setFieldValue(
                              "unit_id",
                              value.map((res: any) => res.id)
                            );
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

                      <div className="space-y-2 ">
                        <label
                          htmlFor="unit_id"
                          className="text-sm text-black-900"
                        >
                          Tax Type *
                        </label>
                        <Select
                          options={taxTypeOptions}
                          id="tax_type_id"
                          name="tax_type_id"
                          placeholder="Select Your Tax type"
                          onChange={(value: any) => {
                            setFieldTouched("tax_type_id", true);
                            setFieldValue(
                              "tax_type_id",
                              value.map((res: any) => res.id)
                            );
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
                        label="Tax *"
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

                    <div className="flex sm:flex-col  gap-5 w-full pb-4">
                      <Input
                        id="discount"
                        className="w-full"
                        name="discount"
                        label="Discount *"
                        type="text"
                        variant="outline"
                        placeholder="0"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.discount}
                        error={errors.discount}
                        touched={touched.discount}
                      />

                      <div className="flex flex-col gap-2 w-full ">
                        <label
                          htmlFor="discount_type"
                          className="text-sm text-black-900"
                        >
                          Discount Type *
                        </label>
                        <Select
                          options={discountTypeOptions}
                          id="discountTypeOptions"
                          name="discountTypeOptions"
                          placeholder="Select Your Tax type"
                          onChange={(value: any) => {
                            setFieldTouched("discount_type", true);
                            setFieldValue(
                              "discount_type",
                              value.map((res: any) => res.id)
                            );
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
                        className="w-full"
                        id="stock"
                        name="stock"
                        label="Stock *"
                        type="text"
                        variant="outline"
                        placeholder="0"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.stock}
                        error={errors.stock}
                        touched={touched.stock}
                      />
                    </div>
                    <div className="space-y-2 w-full ">
                      <label
                        htmlFor="unit_id"
                        className="text-sm text-black-900"
                      >
                        Upload Image
                      </label>

                      <div className="w-1/2 sm:w-full">
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
                            console.log(error);
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
                        </ImagePicker>
                      </div>
                    </div>
                  </CustomCard> */}
                </div>
              )}
              {/* {isVariantAdd && (
                <div className="space-y-6 ">
                  <CustomCard styleClass="p-4 space-y-6">
                    <div className="flex flex-wrap justify-between  items-center">
                      <div className="text-left">
                        <p className="text-gray-900 flex gap-1">
                          <span>Products</span>/<span>Add Product</span>/
                          <span>Add Variants</span>
                        </p>

                        <h5 className="font-normal">Add Variants</h5>
                      </div>

                      <div className="flex gap-4 sm:ml-auto ">
                        <CustomButton
                          type={"button"}
                          label="Cancel"
                          styleClass="btn-gray-light !rounded-md"
                        />
                        <CustomButton
                          type={"submit"}
                          handleButtonClick={() => {
                            setFieldValue("contain_variations", 0);
                            setIsVariantAdd(false);
                          }}
                          label="Save Variants"
                          styleClass="btn-black !rounded-md"
                        />
                      </div>
                    </div>
                    <SeperatorLine className="!border-gray-800" />
                    <div className="space-y-5 text-left pb-4">
                      <div className="space-y-2 ">
                        <label
                          htmlFor="category_id"
                          className="text-sm text-black-900"
                        >
                          Product Variants
                        </label>
                        <Select
                          options={unitOptions}
                          id="category_id"
                          name="category_id"
                          placeholder="Select Attribute"
                          onChange={(value: any) => {
                            setFieldTouched("category_id", true);
                            setFieldValue(
                              "category_id",
                              value.map((res: any) => res.id)
                            );
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
                      <FieldArray name="product_variations">
                        {() =>
                          values.product_variations.map(
                            (variantItem: any, i: any) => {
                              const uploadVariantImage = async (files: any) => {
                                let _comressFiles: any =
                                  await getCompressImages(files);

                                _comressFiles.forEach(async (file: any) => {
                                  let _images: any = variantItem.images;

                                  _images.push(file);

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
                              return (
                                <div className="space-y-10" key={i}>
                                  <div className="flex  overflow-x-auto max-w-[1300px]">
                                    <div className="border  flex flex-col gap-3 py-3">
                                      <h6 className="text-center">Color</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4">
                                        <div>
                                          <Input
                                            className="w-[250px]"
                                            id={`product_variations.${i}.color`}
                                            name={`product_variations.${i}.color`}
                                            type="text"
                                            variant="outline"
                                            placeholder="Enter Product Name"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            touched={
                                              touched?.product_variations &&
                                              touched?.product_variations[i]
                                                ?.color
                                            }
                                          />
                                          <ErrorMessage
                                            name={`product_variations.${i}.color`}
                                            component={"span"}
                                            className="text-xs text-red-100 pt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border  flex flex-col gap-3 py-3">
                                      <h6 className="text-center">Size</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4">
                                        <div>
                                          <Input
                                            className="w-[250px]"
                                            id={`product_variations.${i}.size`}
                                            name={`product_variations.${i}.size`}
                                            type="text"
                                            variant="outline"
                                            placeholder="Enter Product Name"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.name}
                                            touched={
                                              touched?.product_variations &&
                                              touched?.product_variations[i]
                                                ?.size
                                            }
                                          />
                                          <ErrorMessage
                                            name={`product_variations.${i}.size`}
                                            component={"span"}
                                            className="text-xs text-red-100 pt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="border  flex flex-col gap-3 py-3">
                                      <h6 className="text-center">Shape</h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4">
                                        <div>
                                          <Input
                                            className="w-[250px]"
                                            id={`product_variations.${i}.shape`}
                                            name={`product_variations.${i}.shape`}
                                            type="text"
                                            variant="outline"
                                            placeholder="Enter Product Name"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.name}
                                            touched={
                                              touched?.product_variations &&
                                              touched?.product_variations[i]
                                                ?.shape
                                            }
                                          />
                                          <ErrorMessage
                                            name={`product_variations.${i}.shape`}
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
                                            type="text"
                                            variant="outline"
                                            placeholder="Enter Product Name"
                                            handldChange={handleChange}
                                            onBlur={handleBlur}
                                            // value={values.name}
                                            touched={
                                              touched?.product_variations &&
                                              touched?.product_variations[i]
                                                ?.price
                                            }
                                          />
                                          <ErrorMessage
                                            name={`product_variations.${i}.price`}
                                            component={"span"}
                                            className="text-xs text-red-100 pt-1"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="border  flex flex-col gap-3 py-3">
                                      <h6 className="text-center">
                                        Variant Images
                                      </h6>
                                      <SeperatorLine className="!mt-0 !border-gray-800" />
                                      <div className="px-4 overflow-x-auto w-[300px]">
                                        <ImagePicker
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
                                          onSizeError={(error) => {}}
                                          touched={true}
                                        >
                                          <div className="p-6 flex flex-col ">
                                            <CustomButton
                                              label="Upload file"
                                              type={"button"}
                                              styleClass="btn-gray !rounded-md"
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
                                  </div>
                                  {i == 0 && (
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
                                  )}
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
                    </div>
                  </CustomCard>
                </div>
              )} */}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default CategoryAdd;
