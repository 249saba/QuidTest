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

export interface initialSchemaValues {
  name: string;
  email: string;
  phone: string;
  description: string;
}

const FormSchema = Yup.object().shape({
  // categories: Yup.array().required("categories type  is required"),
  name: Yup.string().label("name").required("name  is required"),
  email: Yup.string().label("email").required("email  is required"),
  phone: Yup.string().label("phone").required("phone  is required"),
  description: Yup.string()
    .label("description")
    .required("description  is required"),
});

const HelpSupport = ({ handleNew }: any) => {
  const navigate = useNavigate();

  const initialValues: initialSchemaValues = {
    name: "",
    email: "",
    phone: "",
    description: "",
  };

  const addSupport = (values: any) => {
    backendCall({
      url: `/api/vendor/support`,
      method: "POST",
      data: values,
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        navigate("/settings");
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  const handleSubmit = (values: any) => {
    console.log("login ==", values);
    if (values) {
      addSupport(values);
    }
  };

  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
                            <span>Dashboard</span>/<span>Settings</span>/
                            <span>Help & Support</span>
                        </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"Help & Support"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal">Help & Support</h5>
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-4">
        {" "}
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
                <div className="w-full text-left">
                  <Input
                    id={`name`}
                    name={`name`}
                    label="Full Name "
                    type="text"
                    variant="outline"
                    placeholder="Enter Your name"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name={`name`}
                    component={"span"}
                    className="text-xs text-red-100 pt-1"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 text-left ">
                  <div className="w-full">
                    <Input
                      id={`email`}
                      name={`email`}
                      label="Your Email "
                      type="text"
                      variant="outline"
                      placeholder="Enter Shop Email"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name={`email`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm text-black-900">
                      Phone Number *
                    </label>
                    <PhoneInput
                      isValidPhoneNumber={true}
                      defaultCountry="PK"
                      className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                      placeholder="Enter your 11 digits phone number"
                      onChange={(event) => {
                        if (event) {
                          setFieldValue(`phone`, event);
                        }
                      }}
                    />
                    <ErrorMessage
                      name={`phone`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>

                  <div>
                    <Input
                      id={`description`}
                      name={`description`}
                      label="Add Description"
                      type="text"
                      variant="outline"
                      placeholder="Write in detail about your Query"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage
                      name={`description`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>
                </div>

                <div className="w-full md:w-full sm:w-full flex items-end justify-end">
                  <CustomButton
                    label="Submit"
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

export default HelpSupport;
