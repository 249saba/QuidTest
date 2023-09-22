import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
import { ReactComponent as Email } from "@assets/vendor/icons/mail.svg";
import AddBlack from "@assets/vendor/icons/add_black.png";
import Apple from "@assets/vendor/icons/apple.png";

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
import Shop from "@assets/icons/Enable Shop.png";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { Button, IconButton, Typography } from "@material-tailwind/react";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { SetStorage } from "@src/shared/utils/authService";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import Select from "@src/shared/select/select";
import Checkbox from "@src/shared/checkbox/checkbox";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import AutoLocation from "@src/shared/autoLocation";
import {
  GetDealTypes,
  getAllCitiesByCountryId,
  getAllCountries,
  getCategoriesById,
  getSubCatById,
} from "@src/shared/apiService";
import { useEffect, useState } from "react";
import { MdRemoveCircleOutline } from "react-icons/md";
import CustomSelect from "@src/shared/select/customSelect";
import LazyImage from "@src/shared/lazyImage";
import { STORAGE } from "@src/shared/const";

export interface initialSchemaValues {
  categories: [] | object;
  business_name: string;
  terms: boolean;
  shops: [
    {
      business_email: string;
      address: string;
      lat: string;
      lng: string;
      postal_code: number | any;
      city_id: string;
      country_id: string;
      business_phone: string;
      landline_number: string;
      tax_no: string;
    }
  ];
}

const FormSchema = Yup.object().shape({
  categories: Yup.array().required("categories type  is required"),
  // categories: Yup.object()
  //   .label("categories")
  //   .required("categories  is required"),
  business_name: Yup.string()
    .max(30, "Business name must be less than or equal to 30 characters!")
    .typeError("Business name must be string")
    .required("Business name is required"),
  // terms: Yup.boolean()
  //   .oneOf([true], "Please accept terms and conditions")
  //   .required(""),
  shops: Yup.array().of(
    Yup.object().shape({
      business_email: Yup.string()
        .max(50, "Business email must be less than or equal to 50 characters!")
        .email("Email must be valid")
        .required("Shop Email is required"),
      address: Yup.string().label("Address").required(),
      lat: Yup.string().label("lat").required(),
      lng: Yup.string().label("lng").required(),
      postal_code: Yup.string()
        .max(10, "Postal Code must be less than or equal to 10 characters!")
        .typeError("Postal Code must be a number")

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
      tax_no: Yup.string()
        .required("Tax number is required")
        .max(10, "Tax no must be less than  or equal to 10 characters!"),
    })
  ),
});

const SignUpStep2 = ({ handleStep }: any) => {
  const navigate = useNavigate();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const initialValues: initialSchemaValues = {
    categories: [],
    business_name: "",
    terms: false,
    shops: [
      {
        business_email: "",
        address: "",
        lat: "",
        lng: "",
        postal_code: "",
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
    console.log("categoryOptions", categoryOptions);
    console.log("categoryOptions", values.categories);
    let arr: any = [];
    categoryOptions.forEach((option: any) => {
      values.categories.forEach((category: any) => {
        if (option.value == category) {
          arr.push(option.id);
        }
      });
    });
    console.log("arr", arr);
    var dataSet = { ...values };
    // let arr: any = [];
    // arr.push(values.categories.id);
    dataSet.categories = arr;
    backendCall({
      url: `/api/vendor/set_shops`,
      method: "POST",
      data: dataSet,
    }).then((res) => {
      if (res && !res.error) {
        const _data: any = localStorage.getItem(STORAGE);
        const data = JSON.parse(_data);
        const storageData = {
          ...data,
          ...res?.data,
        };
        SetStorage(storageData);
        handleToastMessage("success", res.message);
        localStorage.setItem("onBoardingStatus", res?.data?.onBoardingStatus);
        // SetStorage(res.data);
        handleStep(2);
        // navigate("/signup/2")
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
    navigate("/");
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
    <div className="text-left flex flex-col gap-3 w-10/12 mx-auto sm:w-full">
      <h4 className=" font-semibold "> Register Your Ecommerce Shop</h4>
      <p className="w-1/3 sm:w-full">
        Join our platform and expand your business reach to new customers.
      </p>
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
              {/* {JSON.stringify(values)}
              {JSON.stringify(errors)} */}
              <div className="space-y-2 w-full sm:w-full  sm:pr-0">
                <label
                  htmlFor="categories"
                  className="text-sm text-black-900 font-medium"
                >
                  Select Category <span className="text-red-100">*</span>
                </label>

                {/* <Select
                  options={categoryOptions}
                  id="categories"
                  name="categories"
                  isMulti
                  value={values.categories}
                  placeholder="Select Your Category"
                  onChange={(value: any) => {
                    setFieldTouched("categories", true);
                    setFieldValue("categories", value);
                  }}
                  onBlur={handleBlur}
                /> */}
                <Field
                  className="custom-select !text-black-100"
                  name="categories"
                  options={categoryOptions}
                  component={CustomSelect}
                  placeholder="Select Your Category"
                  isMulti={true}
                />
                <ErrorMessage
                  name={`categories`}
                  component={"span"}
                  className="text-xs text-red-100 pt-1"
                />
                {/* {touched.categories ||
                  (errors.categories && (
                    <p className="text-xs text-red-100">{errors.categories}</p>
                  ))} */}
              </div>

              <Input
                id="business_name"
                name="business_name"
                label="Business Name "
                type="text"
                variant="outline"
                placeholder="Enter Shop Name"
                handldChange={handleChange}
                onBlur={handleBlur}
                value={values.business_name}
                error={errors.business_name}
                touched={errors.business_name}
              />
              {/* <ErrorMessage
                              name={`business_name`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            /> */}
              <FieldArray name="shops">
                {() =>
                  values.shops.map((shopItem: any, i: any) => {
                    return (
                      <div className="space-y-10" key={i}>
                        {i >= 1 && (
                          <div className="w-full h-16 bg-[#96bdf78c]  flex justify-between items-center">
                            <div className="flex gap-2 px-5 items-center">
                              <div className=" h-12 bg-[#5397fd8c] w-12 rounded-full flex items-center justify-center">
                                {" "}
                                <LazyImage src={Shop} className="w-5 h-5" />
                              </div>

                              <p className="text-black-100 font-medium">
                                Branch : {i}
                              </p>
                            </div>
                            <div
                              className="flex items-center gap-5 px-5 cursor-pointer"
                              onClick={() => {
                                onChangeFields(values, setValues, i);
                              }}
                            >
                              <DeleteIcon
                                className={"cursor-pointer"}
                                onClick={() => {
                                  onChangeFields(values, setValues, i);
                                }}
                              />
                              <p className="text-red-100">Remove</p>
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 ">
                          <div>
                            <Input
                              id={`shops.${i}.business_email`}
                              name={`shops.${i}.business_email`}
                              label="Business Email "
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
                              className="text-sm text-black-900 font-medium"
                            >
                              Business Phone Number{" "}
                              <span className="text-red-100">*</span>
                            </label>
                            <PhoneInput
                              international
                              countryCallingCodeEditable={false}
                              isValidPhoneNumber={true}
                              // defaultCountry="PK"
                              className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                              placeholder="Enter your 15 digits phone number"
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
                            <label
                              htmlFor="country"
                              className="text-sm text-black-900 font-medium"
                            >
                              Business LandLine Number{" "}
                              <span className="text-red-100">*</span>
                            </label>
                            <PhoneInput
                              international
                              countryCallingCodeEditable={false}
                              isValidPhoneNumber={true}
                              // defaultCountry="PK"
                              className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                              placeholder="Enter your 11 digits  number"
                              onChange={(event) => {
                                if (event) {
                                  setFieldValue(
                                    `shops.${i}.landline_number`,
                                    event
                                  );
                                }
                              }}
                              touched={
                                touched?.shops &&
                                touched?.shops[i]?.landline_number
                              }
                              // value={shopItem.eCommerceShopPhone}
                            />
                            {/* <PhoneInput
                              value={`shops.${i}.landline_number`}
                              onChange={(event) => {
                                if (event) {
                                  console.log("event",event)
                                  setFieldValue(
                                    `shops.${i}.landline_number`,
                                    event
                                  );
                                }
                              }}
                            /> */}
                            {/* <Input
                              // type="number"
                              id={`shops.${i}.landline_number`}
                              name={`shops.${i}.landline_number`}
                              label="Landline Number "
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
                            /> */}

                            <ErrorMessage
                              name={`shops.${i}.landline_number`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                          </div>
                          <div>
                            <AutoLocation
                              suburbSelect={async (value: any) => {
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
                              id={`shops.${i}.address`}
                              name={`shops.${i}.address`}
                              label="Business Address"
                              selectedValue={shopItem.address}
                              error={`errors.shops.${i}.address`}
                              isError={
                                !!(
                                  `errors.shops.${i}.address` &&
                                  `touched.shops.${i}.address`
                                )
                              }
                            />
                            <ErrorMessage
                              name={`shops.${i}.address`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                            {/* <Input
                              id={`shops.${i}.address`}
                              name={`shops.${i}.address`}
                              label="Business Address *"
                              type="text"
                              variant="outline"
                              placeholder="Enter Last Name"
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
                            <ErrorMessage
                              name={`shops.${i}.address`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            /> */}
                          </div>
                          <div>
                            <Input
                              id={`shops.${i}.postal_code`}
                              name={`shops.${i}.postal_code`}
                              label="Business Postal Code "
                              type="number"
                              variant="outline"
                              placeholder="Enter Postal Code "
                              handldChange={handleChange}
                              onBlur={handleBlur}
                              touched={
                                touched?.shops && touched?.shops[i]?.postal_code
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
                              className="text-sm text-black-900 font-medium"
                            >
                              Country <span className="text-red-100">*</span>
                            </label>
                            <Select
                              options={countryOptions}
                              id={`shops.${i}.country_id`}
                              name={`shops.${i}.country_id`}
                              placeholder="Select Your Country"
                              onChange={(value: any) => {
                                console.log(value);
                                setFieldTouched(`shops.${i}.country_id`, true);
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
                              name={`shops.${i}.country_id`}
                              component={"span"}
                              className="text-xs text-red-100 pt-1"
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="city_id"
                              className="text-sm text-black-900 font-medium"
                            >
                              City <span className="text-red-100">*</span>
                            </label>
                            <Select
                              options={cityOptions}
                              id={`shops.${i}.city_id`}
                              name={`shops.${i}.city_id`}
                              placeholder="Select Your City"
                              value={cityOptions.map((item: any) => {
                                if (item?.id === values.shops[i].city_id) {
                                  return { label: item?.label };
                                }
                              })}
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
                              name={`shops.${i}.city_id`}
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

                        {/* {i >= 1 && (
                          <CustomButton
                            handleButtonClick={() =>
                              onChangeFields(values, setValues, i)
                            }
                            icon={<MdRemoveCircleOutline className="w-6 h-6" />}
                            label="Add New Address"
                            labelClass="font-normal pl-2"
                            type={"button"}
                            styleClass="btn-white !bg-transparent !rounded-lg  mt-2 !border-[1px] w-1/4  md:w-full sm:w-full "
                          />
                        )} */}
                      </div>
                    );
                  })
                }
              </FieldArray>
              <CustomButton
                handleButtonClick={() => onChangeFields(values, setValues)}
                icon={<img className="w-6 h-6" src={AddBlack} />}
                label="Add New Branch"
                labelClass="font-normal pl-2"
                type={"button"}
                styleClass="btn-white !bg-transparent !rounded-lg  mt-2 !border-[1px] w-1/4  md:w-full sm:w-full "
              />
              <div className="w-1/3 md:w-full sm:w-full">
                {/* <div className=" mt-12 space-y-2">
                  <h5 className="font-semibold">Terms & Conditions</h5>

                  <div className="flex  items-start">
                    <Checkbox
                      name="terms"
                      id="terms"
                      label={
                        <p className="text-gray-900 text-xs text-left flex gap-1">
                          I accept the
                          <a
                            href="javascript:void(0) "
                            className="text-blue-600"
                          >
                            Terms & Conditions *
                          </a>{" "}
                        </p>
                      }
                      onChange={(value: any) => {
                        setFieldTouched(`terms`, true);
                        setFieldValue(`terms`, value.target.checked);
                        // getCities(value.id);
                      }}
                      error={errors.terms}
                    />
                  </div>
                </div> */}

                <CustomButton
                  label="Next"
                  labelClass="font-semibold"
                  type={"submit"}
                  styleClass="btn-black !rounded-lg w-full mt-12"
                />

                <p className="flex items-start gap-3 text-gray-400 text-opacity-50 capitalize font-light whitespace-nowrap text-xs !my-4 sm:!my-4  ">
                  <SeperatorLine className="rotate-10 w-full !border-gray-300" />{" "}
                  Or sign up with
                  <SeperatorLine className="rotate-10 w-full !border-gray-300" />
                </p>
                <div>
                  <div className="flex justify-between px-6">
                    <IconButton className="bg-transparent shadow-none">
                      <Google_blue className="w-6 h-6" />
                    </IconButton>
                    <IconButton className="bg-transparent shadow-none">
                      <Email className="w-6 h-6" />
                    </IconButton>
                    <IconButton className="bg-transparent shadow-none">
                      <Fb className="w-6 h-6" />
                    </IconButton>

                    <IconButton className="bg-transparent shadow-none">
                      <img loading="lazy" src={Apple} alt="apple" />
                    </IconButton>
                  </div>
                  <div className="flex flex-col  gap-4 sm:gap-2 sm:flex sm:items-center">
                    <p className="text-gray-900 text-xs text-center mt-3">
                      Already Have An Account?
                      <a
                        href="javascript:void(0) "
                        onClick={handleLogin}
                        className="text-blue-600 ml-1"
                      >
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <CustomButton
        label="Back"
        labelClass="font-semibold"
        handleButtonClick={() => {
          handleStep(0);
        }}
        type={"button"}
        styleClass="btn-black !rounded-lg w-1/3 mt-12"
      />
    </div>
  );
};

export default SignUpStep2;
