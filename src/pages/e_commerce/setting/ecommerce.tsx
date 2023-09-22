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

import {
  Breadcrumbs,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
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
import { ReactComponent as Dummy } from "@assets/icons/dummy_icon.svg";
import bg_image from "@assets/icons/bg_image.png";
import { styled } from "@mui/material/styles";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";

import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AutoLocation from "@src/shared/autoLocation";
import TestImg from "@assets/images/Food.png";
import LazyImage from "@src/shared/lazyImage";
export interface initialSchemaValues {
  business_name: string;
  business_email: string;
  address: string;
  lat: string;
  lng: string;
  postal_code: number | undefined;
  city_id: string;
  country_id: string;
  business_phone: string;
  landline_number: string;
  tax_no: string;
  image_url: string;
  cover_url: string;
  quotes: string;
}

const _initialValues: initialSchemaValues = {
  business_name: "",
  business_email: "",
  address: "",
  lat: "",
  lng: "",
  postal_code: undefined,
  city_id: "",
  country_id: "",
  business_phone: "",
  landline_number: "",
  tax_no: "",
  image_url: "",
  cover_url: "",
  quotes: "",
};

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
  business_name: Yup.string().required("Business name is required"),
  business_email: Yup.string()
    .email("Email must be valid")
    .required("Shop Email is required"),
  address: Yup.string().label("Address").required(),
  lat: Yup.string().label("lat").required(),
  lng: Yup.string().label("lng").required(),
  postal_code: Yup.number()
    .typeError("Postal Code must be a number")
    .label("")
    .required("Postal code is required"),

  city_id: Yup.string().required("City is required"),
  country_id: Yup.string().required("Country is required"),
  business_phone: Yup.string()
  .min(13, "Phone no must be min 13 characters!")
  .max(15, "Phone no must be less than or equal 15 characters!")
  .required("phone no is required"),
  landline_number: Yup.string()
  .min(11, "Landline number must be min 11 characters!")
  .max(13, "Landline number must be less than or eequal 13 characters!")
  .required("LandLine number is Required"),
  tax_no: Yup.string().required("Tax number is required"),
});

const Ecommerce = ({ handleNew, label }: any) => {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [alignment, setAlignment] = useState("left");
  const [formats, setFormats] = useState(["italic"]);
  const [defaultShop, setDefaultShop] = useState<any>(_initialValues);
  const [shopId, setShopId] = useState(null);
  const [isImage, setisImage] = useState(true);
  const [isCoverImage, setIsCoverImage] = useState(true);
  const [isEnabled, setIsEnabled] = useState(0);

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

  const setShop = (values: any) => {
    console.log("values", values);
    let formData = new FormData();
    formData.append("business_name", values.business_name);
    formData.append("business_email", values.business_email);
    formData.append("business_phone", values.business_phone);
    formData.append("address", values.address);
    formData.append("lat", values.lat);
    formData.append("lng", values.lng);
    formData.append("postal_code", values.postal_code);
    formData.append("city_id", values.city_id);
    formData.append("country_id", values.country_id);
    formData.append("landline_number", values.landline_number);
    formData.append("tax_no", values.tax_no);
    formData.append("quotes", values.quotes);
    formData.append("is_enabled", isEnabled.toString());
    // formData.append("image", values.image_url);

    if (isImage == false) {
      formData.append("image", values.image_url);
    }
    if (isCoverImage == false) {
      formData.append("cover", values.cover_url);
    }
    // if (typeof values.image_url !== "string" && values.image_url !== undefined) {
    //   values.image_url.forEach((file: any, index: number) => {
    //     formData.append("image", file);
    //   });
    // }
    // if (typeof values.cover_url !== "string" && values.cover_url !== undefined) {
    //   values.cover_url.forEach((file: any, index: number) => {
    //     formData.append("cover", file);
    //   });
    // }

    // formData.append("image", values.image_url);
    // formData.append("cover", values.cover_url);
    // if (values.image_url && values.image_url !== "") {
    //   values.image_url.forEach((file: any, index: number) => {
    //     formData.append("image", file);
    //   });
    // }
    // if (values.cover_url && values.cover_url !== "") {
    //   values.cover_url.forEach((file: any, index: number) => {
    //     formData.append("cover", file);
    //   });
    // }
    backendCall({
      url: `/api/vendor/shops/${shopId}`,
      method: "PUT",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        handleNew();
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  useEffect(() => {
    getCategories();
    getCountries();
    getDefaultShop();
    getVendor();
  }, []);

  const getVendor = () => {
    backendCall({
      url: `/api/vendor/profile`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        const data = res.data;
        setDefaultShop((prevState: any) => ({
          ...prevState,
          business_name: data.business_name,
        }));
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  const getDefaultShop = () => {
    backendCall({
      url: `/api/vendor/default_shop`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        const data = res.data;

        setDefaultShop((prevState: any) => ({
          ...prevState,
          business_email: data.business_email,
          address: data.address,
          lat: data.lat,
          lng: data.lng,
          postal_code: data.postal_code,
          city_id: data.city_id,
          country_id: data.country_id,
          business_phone: data.business_phone,
          landline_number: data.landline_number,
          tax_no: data.tax_no,
          image_url: data.image_url,
          cover_url: data.cover_url,
          quotes: data.quotes,
        }));
        setShopId(data.id);
        setIsEnabled(data.is_enabled);
        getAllCitiesByCountryId(data.city_id).then((res) => {
          if (res && !res.error) {
            setCityOptions(res.data);
          }
        });
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  const getCountries = () => {
    getAllCountries().then((res) => {
      if (res && !res.error) {
        setCountryOptions(res.data);
        // getCities(res.data[0].id);
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
    getSubCatById().then((res) => {
      console.log("res", res);
      if (res && !res.error) {
        setCategoryOptions(res.data);
      }
    });
  };
  const handleSubmit = (values: any) => {
    console.log("login ==", values);
    if (values) {
      setShop(values);
    }
  };
  const handleSwitchChange = (event: any) => {
    const newValue = event.target.checked ? 1 : 0;
    setIsEnabled(newValue);
  };
  console.log("cityOptions", cityOptions);

  return (
    <>
      {" "}
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Shop Management</span>/<span>E-commerce SetUp</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p
                onClick={() => {
                  handleNew();
                }}
              >
                {"Shop Management"}
              </p>
              {/* </Link> */}
            </Breadcrumbs>
            <h5 className="font-normal">E-commerce SetUp</h5>
          </div>
          {/* <div className="flex gap-4">
            <CustomButton
              // handleButtonClick={() => {
              //   handleNew();
              // }}
              type={"submit"}
              label="Update"
              styleClass="btn-black !rounded-md"
            />
          </div> */}
        </div>
      </CustomCard>
      <CustomCard styleClass="p-4">
        <div>
          <Formik
            initialValues={defaultShop}
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
            }) => {
              const uploadImage = async (field: string, files: any) => {
                setFieldValue(field, files);
              };

              console.log({ values });
              return (
                <Form className="space-y-6 mt-4 ">
                  <div className="space-y-10">
                    <div className=" bg-[#dcdde2a5]   w-full   !p-0 h-52">
                      <ImagePicker
                        className="  flex h-52 w-full "
                        resetValue={() => {
                          setFieldValue("cover_url", "");
                        }}
                        onSizeError={(error) => {
                          handleToastMessage(
                            "error",
                            "please select image of size less than 10mb"
                          );
                        }}
                        onChange={(files) => {
                          setFieldTouched("cover_url", true);
                          setIsCoverImage(false);
                          return uploadImage("cover_url", files[0]);
                        }}
                        touched={true}
                      >
                        <img
                          src={
                            defaultShop.cover_url
                              ? import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                defaultShop.cover_url
                              : TestImg
                          }
                          className="h-52 w-[1500px] "
                        />
                      </ImagePicker>

                      <div className="absolute left-[50%]  top-[15%] ">
                        <ImagePicker
                          className="flex rounded-full h-24 w-24   border-[2px] items-center justify-center"
                          resetValue={() => {
                            setFieldValue("image_url", "");
                          }}
                          onSizeError={(error) => {
                            handleToastMessage(
                              "error",
                              "please select image of size less than 10mb"
                            );
                          }}
                          onChange={(files) => {
                            setFieldTouched("image_url", true);
                            setisImage(false);
                            return uploadImage("image_url", files[0]);
                          }}
                          touched={true}
                        >
                          <div className="">
                            <img
                              src={
                                defaultShop.image_url
                                  ? import.meta.env.VITE_REACT_API_URL +
                                    "/" +
                                    defaultShop.image_url
                                  : TestImg
                              }
                              className="rounded-full h-24 w-24"
                            />
                            <div className="w-8 h-8 rounded-full bg-white absolute right-[-10px]  bottom-5 z-50 p-2">
                              {" "}
                              <PencilIcon
                                className={
                                  "cursor-pointer w-4 h-4 flex items-center justify-center"
                                }
                                // onClick={() => {
                                //   handleBankInfo();
                                // }}
                              />
                            </div>
                          </div>
                        </ImagePicker>
                      </div>
                      {/* <div className="absolute right-[10%] top-[15%] "></div> */}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-black-100 font-semibold ">
                        Basic Information
                      </p>
                      <div className="flex items-center">
                        <p className="text-black-100">Active</p>
                        <Switch
                          id="blue"
                          name="is_enabled"
                          onChange={handleSwitchChange}
                          checked={isEnabled === 1 ? true : false}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 text-left ">
                      <div>
                        <Input
                          id={`business_name`}
                          name={`business_name`}
                          label="Business Name "
                          type="text"
                          variant="outline"
                          placeholder="Enter Shop name"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.business_name}
                          error={errors.business_name}
                          touched={touched.business_name}
                        />
                        <ErrorMessage
                          name={`business_name`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div>
                        <Input
                          id={`business_email`}
                          name={`business_email`}
                          label="Business Email "
                          type="text"
                          variant="outline"
                          placeholder="Enter Shop Email"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.business_email}
                          touched={touched.business_email}
                        />
                        <ErrorMessage
                          name={`business_email`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="country"
                          className="text-sm text-black-900 font-medium"
                        >
                          Phone Number <span className="!text-red-100">*</span>
                        </label>

                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          isValidPhoneNumber={true}
                          defaultCountry="PK"
                          className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                          placeholder="Enter your 15 digits phone number"
                          onChange={(event) => {
                            if (event) {
                              setFieldValue(`business_phone`, event);
                            }
                          }}
                          value={values.business_phone}
                          touched={touched.business_phone}
                        />
                        <ErrorMessage
                          name={`business_phone`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="country"
                          className="text-sm text-black-900 font-medium"
                        >
                          LandLine Number
                          <span className="!text-red-100">*</span>
                        </label>
                        <PhoneInput
                          international
                          countryCallingCodeEditable={false}
                          isValidPhoneNumber={true}
                          // defaultCountry="PK"
                          className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                          placeholder="Enter your 11 digits phone number"
                          onChange={(event) => {
                            if (event) {
                              setFieldValue(`landline_number`, event);
                            }
                          }}
                          value={values.landline_number}
                          touched={touched.landline_number}
                          // value={shopItem.eCommerceShopPhone}
                        />
                        {/* <Input
                        international
                              countryCallingCodeEditable={false}
                              isValidPhoneNumber={true}
                          // type="number"
                          id={`landline_number`}
                          name={`landline_number`}
                          label="Landline Number "
                          variant="outline"
                          placeholder="Enter your 11 digits phone number"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.landline_number}
                          touched={touched.landline_number}
                        /> */}

                        <ErrorMessage
                          name={`landline_number`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>{" "}
                      <div>
                        {/* <Input
                          id={`address`}
                          name={`address`}
                          label="Business Address *"
                          type="text"
                          variant="outline"
                          placeholder="Enter business address"
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address}
                          touched={touched.address}
                        />
                        <ErrorMessage
                          name={`address`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        /> */}
                        <AutoLocation
                          suburbSelect={async (value: any) => {
                            await setFieldValue(`address`, value?.val);
                            await setFieldValue(`lat`, value?.lat);
                            await setFieldValue(`lng`, value?.lng);
                          }}
                          label="Business Address"
                          selectedValue={values.address}
                          error={errors.address}
                          isError={!!(errors.address && touched.address)}
                        />
                        <ErrorMessage
                          name={`address`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div>
                        <Input
                          id={`postal_code`}
                          name={`postal_code`}
                          label="Business Postal Code "
                          type="text"
                          variant="outline"
                          placeholder="Enter Postal Code "
                          handldChange={handleChange}
                          onBlur={handleBlur}
                          value={values.postal_code}
                          touched={touched.postal_code}
                        />
                        <ErrorMessage
                          name={`postal_code`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="country_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          Country <span className="!text-red-100">*</span>
                        </label>
                        <Select
                          options={countryOptions}
                          id={`country_id`}
                          name={`country_id`}
                          placeholder="Select Your Country"
                          value={countryOptions.map((item: any) => {
                            if (item?.id === values?.country_id) {
                              return { label: item?.label };
                            }
                          })}
                          onChange={(value: any) => {
                            console.log(value);
                            setFieldTouched(`country_id`, true);
                            setFieldValue(`country_id`, value.id);
                            getCities(value.id);
                          }}
                          onBlur={handleBlur}
                        />

                        <ErrorMessage
                          name={`country`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="city_id"
                          className="text-sm text-black-900 font-medium"
                        >
                          City <span className="!text-red-100">*</span>
                        </label>
                        <Select
                          options={cityOptions}
                          id={`city_id`}
                          name={`city_id`}
                          placeholder="Select Your City"
                          value={cityOptions.map((item: any) => {
                            if (item?.id === values?.city_id) {
                              return { label: item?.label };
                            }
                          })}
                          onChange={(value: any) => {
                            console.log("value", value);
                            setFieldTouched(`city_id`, true);
                            setFieldValue(`city_id`, value.id);
                          }}
                          onBlur={handleBlur}
                        />

                        <ErrorMessage
                          name={`city`}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 text-left">
                      <Input
                        id={`tax_no`}
                        name={`tax_no`}
                        label="Tax No. "
                        type="text"
                        variant="outline"
                        placeholder="Enter Tax Number"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tax_no}
                        touched={touched.tax_no}
                      />
                      <ErrorMessage
                        name={`tax_no`}
                        component={"span"}
                        className="text-xs text-red-100 pt-1"
                      />
                    </div>
                    <div className="space-y-3 ">
                      <div className="flex text-left"> </div>
                      <div className="text-left flex-col gap-3">
                        <label className="text-sm text-black-900 text-left font-medium">
                          Add Qoute <span className="!text-red-100">*</span>
                        </label>
                        {/* <Paper
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
                                <FormatAlignLehandleSubmitUpdatftIcon />
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
                          </Paper>{" "} */}
                        <TextArea
                          name="quotes"
                          className="w-full"
                          id="quotes"
                          onChange={handleChange}
                          // placeholder="Enter your Reason Here"
                          // label="Add Qoute"
                          onBlur={handleBlur}
                          value={values.quotes}
                          error={errors.quotes}
                          touched={touched.quotes}
                          // value={values.description}
                        ></TextArea>
                      </div>
                    </div>
                    {/* <div className="space-y-3 text-left">
                      <CustomButton
                        // handleButtonClick={() =>
                        //   onChangeFields(values, setValues)
                        // }
                        icon={<img className="w-6 h-6" src={AddBlack} />}
                        label="Switch to Another Branch"
                        labelClass="font-normal pl-2"
                        type={"button"}
                        styleClass="btn-white !bg-transparent !rounded-lg  mt-2 !border-[1px]   md:w-full sm:w-full  text-left"
                      />
                    </div> */}
                  </div>

                  <div className="w-full md:w-full sm:w-full flex items-end justify-end">
                    <CustomButton
                      label="Update"
                      labelClass="font-semibold"
                      type={"submit"}
                      styleClass="btn-black !rounded-lg  mt-12 w-[160px]"
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </CustomCard>
    </>
  );
};

export default Ecommerce;
