import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
import { ReactComponent as Email } from "@assets/vendor/icons/mail.svg";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import AddBlack from "@assets/vendor/icons/add_black.png";
import Apple from "@assets/vendor/icons/apple.png";
import TextArea from "@src/shared/textArea";
import * as Yup from "yup";
import {
  ErrorMessage,
  FastField,
  Field,
  FieldArray,
  Form,
  Formik,
} from "formik";
import { Link, useNavigate } from "react-router-dom";
import Input from "@src/shared/input";

import SeperatorLine from "@src/shared/seperator/seperatorLine";

import { Button, IconButton, Typography } from "@material-tailwind/react";
import { SetStorage } from "@src/shared/utils/authService";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "@src/shared/select/select";
import Checkbox from "@src/shared/checkbox/checkbox";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import {
  GetDealTypes,
  getAllCitiesByCountryId,
  getAllCountries,
  getCategoriesById,
  getSubCatById,
} from "@src/shared/apiService";
import { useEffect, useState } from "react";
import { MdRemoveCircleOutline } from "react-icons/md";
import Switch from "@mui/material/Switch";
import CustomCard from "@src/shared/cards/customCard";
import imageLogo from "@assets/icons/imageLogo.png";
import bg_image from "@assets/icons/bg_image.png";
import { styled } from "@mui/material/styles";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoLocation from "@src/shared/autoLocation";
export interface initialSchemaValues {
  categories: string | object;
  business_name: string;
  terms: boolean;
  shops: [
    {
      business_email: string;
      address: string;
      postal_code: number | undefined;
      city_id: string;
      country_id: string;
      business_phone: string;
      landline_number: string;
      tax_no: string;
    }
  ];
}
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    border: 0,
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));
const FormSchema = Yup.object().shape({
  // categories: Yup.array().required("categories type  is required"),
  categories: Yup.object()
    .label("categories")
    .required("categories  is required"),
  business_name: Yup.string().required("Business name is required"),
  // terms: Yup.boolean()
  //   .oneOf([true], "Please accept terms and conditions")
  //   .required(""),
  shops: Yup.array().of(
    Yup.object().shape({
      business_email: Yup.string()
        .email("Email must be valid")
        .required("Shop Email is required"),
      address: Yup.string().label("Address").required(),
      postal_code: Yup.number()
        .typeError("Postal Code must be a number")
        .label("")
        .required("Postal code is required"),

      city_id: Yup.string().required("City is required"),
      country_id: Yup.string().required("Country is required"),
      business_phone: Yup.string().required("Shop's phone is required"),
      landline_number: Yup.string()
        .min(10, "Phone number must be 11 characters!")
        .max(10, "Phone number must be 11 characters!")
        .required("LandLine number is Required"),
      tax_no: Yup.string().required("Tax number is required"),
    })
  ),
});

const AddShop = ({ handleNew, label }: any) => {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [alignment, setAlignment] = useState("left");
  const [formats, setFormats] = useState(() => ["italic"]);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };
  const initialValues: initialSchemaValues = {
    categories: "",
    business_name: "",
    terms: false,
    shops: [
      {
        business_email: "",
        address: "",
        postal_code: undefined,
        city_id: "",
        country_id: "",
        business_phone: "",
        landline_number: "",
        tax_no: "",
      },
    ],
  };

  const setShop = (values: any) => {
    console.log("values", values);
    var dataSet = { ...values };
    let arr: any = [];
    arr.push(values.categories.id);
    dataSet.categories = arr;
    backendCall({
      url: `/api/vendor/set_shops`,
      method: "POST",
      data: dataSet,
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        localStorage.setItem("onBoardingStatus", res?.data?.onBoardingStatus);
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  useEffect(() => {
    getCategories();
    getCountries();
  }, []);

  const getCountries = () => {
    getAllCountries().then((res) => {
      if (res && !res.error) {
        setCountryOptions(res.data);
        getCities(res.data[1].id);
      }
    });
  };

  const getCities = (id: any) => {
    getAllCitiesByCountryId(id).then((res) => {
      if (res && !res.error) {
        setCityOptions(res.data);
      }
    });
  };

  const getCategories = () => {
    // GetDealTypes().then((res) => {
    //   if (res && !res.error) {
    //     setCategoryOptions(res.data);
    //   } else {
    //   }

    getSubCatById().then((res) => {
      console.log("res", res);
      if (res && !res.error) {
        setCategoryOptions(res.data);
      }
    });
  };
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSubmit = (values: any) => {
    console.log("login ==", values);
    if (values) {
      setShop(values);
    }
  };

  const onChangeFields = (values: any, setValues: any, index?: number) => {
    // update dynamic form
    const shops = [...values.shops];
    if (index) {
      shops.splice(index, 1);
    } else {
      shops.push({
        business_email: "",
        address: "",
        postal_code: undefined,
        city_id: "",
        country_id: "",
        business_phone: "",
        landline_number: "",
        tax_no: "",
      });
    }
    setValues({ ...values, shops });
  };
  console.log("categoryOptions", categoryOptions);
  return (
    <>
      {" "}
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Shop Management</span>
            </p>

            <h5 className="font-normal">Shop Management</h5>
          </div>
          <div className="flex gap-4">
            <CustomButton
              handleButtonClick={() => {
                handleNew();
              }}
              type={"button"}
              label={label == "Update" ? "Update" : "Add New Branch"}
              styleClass="btn-black !rounded-md"
            />
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-4">
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={FormSchema}
            enableReinitialize
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
              setTouched,
              setFieldError,
            }) => (
              <Form className="space-y-6 mt-4 ">
                <FieldArray name="shops">
                  {() =>
                    values.shops.map((shopItem: any, i: any) => {
                      return (
                        <div className="space-y-10" key={i}>
                          <div className=" bg-[#d0d4fda5] p-2 rounded-t-xl flex">
                            <img src={imageLogo} className="h-14 w-14" />
                          </div>
                          <div className="space-y-2 w-full p-4 ">
                            <label
                              htmlFor="unit_id"
                              className="text-sm text-black-900"
                            >
                              Upload Image
                            </label>

                            <div className="w-full">
                              <ImagePicker
                                className="flex-1"
                                // error={errors.images as string}
                                // value={values.images}
                                resetValue={() => {
                                  setFieldValue("images", []);
                                }}
                                // removeImage={(index) => {
                                //   const temp_images: any = values.images;
                                //   temp_images.splice(index, 1);
                                //   setFieldValue("images", temp_images);
                                // }}
                                // onChange={(files) => {
                                //   setFieldTouched("images", true);
                                //   return uploadImage(files);
                                // }}
                                onSizeError={(error) => {
                                  handleToastMessage("error", "please select image of size less than 10mb");
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
                            <div className="flex justify-center">
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
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-black-100">Basic Information</p>
                            <div className="flex items-center">
                              <p className="text-black-100">Active</p>
                              <Switch
                                id="blue"
                                name="contain_variations"
                                checked={true}
                                // onChange={(e) => {
                                //   setIsVariantAdd(false);
                                //   setFieldValue(
                                //     "contain_variations",
                                //     e.target.checked ? 1 : 0
                                //   );
                                // }}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 text-left ">
                            <div>
                              <Input
                                id={`business_name`}
                                name={`business_name`}
                                label="Shop Name"
                                type="text"
                                variant="outline"
                                placeholder="Enter Shop Name"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                // value={shopItem.eCommerceShopEmail}
                                // error={
                                //   errors?.shops
                                //     ? errors?.shops[i]?.eCommerceShopEmail
                                //     : ""
                                // }
                                touched={
                                  touched?.shops &&
                                  touched?.shops[i]?.business_email
                                }
                              />
                              <ErrorMessage
                                name={`shops.${i}.business_email`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div>
                              <Input
                                id={`shops.${i}.business_email`}
                                name={`shops.${i}.business_email`}
                                label="Business Email"
                                type="text"
                                variant="outline"
                                placeholder="Enter Shop Email"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                // value={shopItem.eCommerceShopEmail}
                                // error={
                                //   errors?.shops
                                //     ? errors?.shops[i]?.eCommerceShopEmail
                                //     : ""
                                // }
                                touched={
                                  touched?.shops &&
                                  touched?.shops[i]?.business_email
                                }
                              />
                              <ErrorMessage
                                name={`shops.${i}.business_email`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="country"
                                className="text-sm text-black-900"
                              >
                                Phone Number *
                              </label>
                              <PhoneInput
                                isValidPhoneNumber={true}
                                defaultCountry="PK"
                                className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                                placeholder="Enter your 11 digits phone number"
                                onChange={(event) => {
                                  if (event) {
                                    setFieldValue(
                                      `shops.${i}.business_phone`,
                                      event
                                    );
                                  }
                                }}
                                touched={
                                  touched?.shops &&
                                  touched?.shops[i]?.business_phone
                                }
                                // value={shopItem.eCommerceShopPhone}
                              />
                              <ErrorMessage
                                name={`shops.${i}.business_phone`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <Input
                                // type="number"
                                id={`shops.${i}.landline_number`}
                                name={`shops.${i}.landline_number`}
                                label="Landline Number"
                                variant="outline"
                                placeholder="Enter your 11 digits phone number"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                // value={shopItem.eCommerceShopEmail}
                                // error={
                                //   errors?.shops
                                //     ? errors?.shops[i]?.eCommerceShopEmail
                                //     : ""
                                // }
                                touched={
                                  touched?.shops &&
                                  touched?.shops[i]?.landline_number
                                }
                              />

                              <ErrorMessage
                                name={`shops.${i}.landline_number`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>{" "}
                            <div>
                              <Input
                                id={`shops.${i}.address`}
                                name={`shops.${i}.address`}
                                label="Business Address"
                                type="text"
                                variant="outline"
                                placeholder="Enter business address"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                // value={shopItem.address}
                                // error={
                                //   errors?.shops
                                //     ? errors?.shops[i]?.address
                                //     : ""
                                // }
                                touched={
                                  touched?.shops && touched?.shops[i]?.address
                                }
                              />

                              {/* <AutoLocation
                                suburbSelect={async (value: any) => {
                                  console.log("async add ==", value);
                                  await setFieldValue(
                                    `shops.${i}.address`,
                                    value?.val
                                  );
                                  await setFieldValue(
                                    `shops.${i}.lat`,
                                    value?.lat
                                  );
                                  await setFieldValue(
                                    `shops.${i}.lng`,
                                    value?.lng
                                  );
                                }}
                                label="Business Address*"
                                selectedValue={values?.shops[i].address}
                              /> */}
                              <ErrorMessage
                                name={`shops.${i}.address`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div>
                              <Input
                                id={`shops.${i}.postal_code`}
                                name={`shops.${i}.postal_code`}
                                label="Business Postal Code"
                                type="text"
                                variant="outline"
                                placeholder="Enter Postal Code "
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                touched={
                                  touched?.shops &&
                                  touched?.shops[i]?.postal_code
                                }
                                // value={shopItem.postal_code}
                                // error={shopItem.postal_code}
                                // touched={shopItem.postal_code}
                              />
                              <ErrorMessage
                                name={`shops.${i}.postal_code`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="country_id"
                                className="text-sm text-black-900"
                              >
                                Country *
                              </label>
                              <Select
                                options={countryOptions}
                                id={`shops.${i}.country_id`}
                                name={`shops.${i}.country_id`}
                                placeholder="Select Your Country"
                                onChange={(value: any) => {
                                  console.log(value);
                                  setFieldTouched(
                                    `shops.${i}.country_id`,
                                    true
                                  );
                                  setFieldValue(
                                    `shops.${i}.country_id`,
                                    value.id
                                  );
                                  getCities(value.id);
                                }}
                                onBlur={handleBlur}
                                // onFocus={() => {
                                //   setFieldTouched("businessType", true);
                                // }}
                              />

                              <ErrorMessage
                                name={`shops.${i}.country`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <label
                                htmlFor="city_id"
                                className="text-sm text-black-900"
                              >
                                City *
                              </label>
                              <Select
                                options={cityOptions}
                                id={`shops.${i}.city_id`}
                                name={`shops.${i}.city_id`}
                                placeholder="Select Your City"
                                onChange={(value: any) => {
                                  setFieldTouched(`shops.${i}.city_id`, true);
                                  setFieldValue(`shops.${i}.city_id`, value.id);
                                  // getCities(value.id);
                                }}
                                onBlur={handleBlur}
                                // onFocus={() => {
                                //   setFieldTouched("businessType", true);
                                // }}
                              />

                              <ErrorMessage
                                name={`shops.${i}.city`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            {/* <div className="space-y-2">
                            <label
                              htmlFor="country"
                              className="text-sm text-black-900"
                            >
                              Phone Number *
                            </label>
                            <PhoneInput
                              isValidPhoneNumber={true}
                              defaultCountry="PK"
                              className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                              placeholder="Enter your 11 digits phone number"
                              onChange={(event) => {
                                if (event) {
                                  setFieldValue(
                                    `shops.${i}.business_phone`,
                                    event
                                  );
                                }
                              }}
                              touched={
                                touched?.shops &&
                                touched?.shops[i]?.business_phone
                              }
                              // value={shopItem.eCommerceShopPhone}
                            />
                            <ErrorMessage
                              name={`shops.${i}.business_phone`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <Input
                              id={`shops.${i}.landline_number`}
                              name={`shops.${i}.landline_number`}
                              label="Landline Number *"
                              variant="outline"
                              placeholder="Enter your 11 digits phone number"
                              handldChange={handleChange}
                              onBlur={handleBlur}
                              // value={shopItem.eCommerceShopEmail}
                              // error={
                              //   errors?.shops
                              //     ? errors?.shops[i]?.eCommerceShopEmail
                              //     : ""
                              // }
                              touched={
                                touched?.shops &&
                                touched?.shops[i]?.landline_number
                              }
                            />

                            <ErrorMessage
                              name={`shops.${i}.landline_number`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                          </div> */}
                            <div>
                              <Input
                                id={`shops.${i}.tax_no`}
                                name={`shops.${i}.tax_no`}
                                label="Tax No"
                                type="text"
                                variant="outline"
                                placeholder="Enter Tax Number"
                                handldChange={handleChange}
                                onBlur={handleBlur}
                                // value={shopItem.address}
                                // error={
                                //   errors?.shops
                                //     ? errors?.shops[i]?.address
                                //     : ""
                                // }
                                touched={
                                  touched?.shops && touched?.shops[i]?.tax_no
                                }
                              />
                              <ErrorMessage
                                name={`shops.${i}.tax_no`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                          </div>
                          <div className="space-y-3 ">
                            <div className="flex text-left">
                              {" "}
                              {/* <TextArea
                    name="description"
                    className="w-[500px]"
                    id="description"
                    onChange={handleChange}
                    // placeholder="Enter your Reason Here"
                    // label="Add Qoute"
                    onBlur={handleBlur}
                    // value={values.description}
                  >
                    
                  </TextArea> */}
                              {/* {errors.description && touched.description && (
                    <p className="my-2 text-xs text-start text-red-600 font-bold">
                      *{errors.description}
                    </p>
                  )} */}
                            </div>
                            <div className="text-left flex-col gap-6">
                              <label
                                htmlFor="city_id"
                                className="text-sm text-black-900 text-left"
                              >
                                Add Qoute *
                              </label>
                              <Paper
                                elevation={0}
                                sx={{
                                  display: "flex",
                                  border: (theme) =>
                                    `1px solid ${theme.palette.divider}`,
                                  flexWrap: "wrap",
                                }}
                              >
                                <StyledToggleButtonGroup
                                  size="small"
                                  value={alignment}
                                  exclusive
                                  onChange={handleAlignment}
                                  aria-label="text alignment"
                                >
                                  <ToggleButton
                                    value="left"
                                    aria-label="left aligned"
                                  >
                                    <FormatAlignLeftIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="center"
                                    aria-label="centered"
                                  >
                                    <FormatAlignCenterIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="right"
                                    aria-label="right aligned"
                                  >
                                    <FormatAlignRightIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="justify"
                                    aria-label="justified"
                                    disabled
                                  >
                                    <FormatAlignJustifyIcon />
                                  </ToggleButton>
                                </StyledToggleButtonGroup>
                                <Divider
                                  flexItem
                                  orientation="vertical"
                                  sx={{ mx: 0.5, my: 1 }}
                                />
                                <StyledToggleButtonGroup
                                  size="small"
                                  value={formats}
                                  onChange={handleFormat}
                                  aria-label="text formatting"
                                >
                                  <ToggleButton value="bold" aria-label="bold">
                                    <FormatBoldIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="italic"
                                    aria-label="italic"
                                  >
                                    <FormatItalicIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="underlined"
                                    aria-label="underlined"
                                  >
                                    <FormatUnderlinedIcon />
                                  </ToggleButton>
                                  <ToggleButton
                                    value="color"
                                    aria-label="color"
                                    disabled
                                  >
                                    <FormatColorFillIcon />
                                    <ArrowDropDownIcon />
                                  </ToggleButton>
                                </StyledToggleButtonGroup>
                              </Paper>{" "}
                              <TextArea
                                name="description"
                                className="w-full"
                                id="description"
                                onChange={handleChange}
                                // placeholder="Enter your Reason Here"
                                // label="Add Qoute"
                                onBlur={handleBlur}
                                // value={values.description}
                              ></TextArea>
                            </div>
                          </div>
                          {/* <div className="flex justify-between items-start">
                            <Input
                              id={`qoute`}
                              name={`qoute`}
                              label="Add Qoute *"
                              type="text"
                              variant="outline"
                              //   placeholder="Enter Tax Number"
                              handldChange={handleChange}
                              onBlur={handleBlur}
                              // value={shopItem.address}
                              // error={
                              //   errors?.shops
                              //     ? errors?.shops[i]?.address
                              //     : ""
                              // }
                              //   touched={
                              //     touched?.shops && touched?.shops[i]?.tax_no
                              //   }
                            />
                            <ErrorMessage
                              name={`qoute`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                          </div> */}
                          {/* {i == 0 && (
                          <CustomButton
                            handleButtonClick={() =>
                              onChangeFields(values, setValues)
                            }
                            icon={<img className="w-6 h-6" src={AddBlack} />}
                            label="Switch to Another Branch"
                            labelClass="font-normal pl-2"
                            type={"button"}
                            styleClass="btn-white !bg-transparent !rounded-lg  mt-2 !border-[1px] w-1/4  md:w-full sm:w-full  text-left"
                          />
                        )}
                        {i >= 1 && (
                          <CustomButton
                            handleButtonClick={() =>
                              onChangeFields(values, setValues, i)
                            }
                            icon={<MdRemoveCircleOutline className="w-6 h-6" />}
                            label="Add New Branch"
                            labelClass="font-normal pl-2"
                            type={"button"}
                            styleClass="btn-white !bg-transparent !rounded-lg  mt-2 !border-[1px] w-1/3  md:w-full sm:w-full "
                          />
                        )} */}
                        </div>
                      );
                    })
                  }
                </FieldArray>

                <div className="w-full md:w-full sm:w-full flex items-end justify-end">
                  <CustomButton
                    label={label == "Update" ? "Update" : "Save"}
                    labelClass="font-semibold"
                    type={"submit"}
                    styleClass="btn-black !rounded-lg  mt-12"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </CustomCard>
    </>
  );
};

export default AddShop;
