import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
import { ReactComponent as Email } from "@assets/vendor/icons/mail.svg";
import Apple from "@assets/vendor/icons/apple.png";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Input from "@src/shared/input";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { setLayout } from "@src/shared/slices/LayoutSlice";
import { Button, IconButton, Typography } from "@material-tailwind/react";
import Header from "@src/shared/navbar";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { GetStorage, SetStorage } from "@src/shared/utils/authService";
import GoogleAuth from "@src/shared/socialLogin/googleLogin";
import { useState } from "react";
import FacebookAuth from "@src/shared/socialLogin/facebookLogin";
import AppleAuth from "@src/shared/socialLogin/appleLogin";
import {phone} from 'phone';

export interface initialSchemaValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: any | undefined;
  password: string;
  confirm_password: string;
}

const FormSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required").max(15, "First name must be less than 16 characters!"),
  last_name: Yup.string().required("Last name is required").max(15, "Last name must be less than 16 characters!"),
  email: Yup.string().label("Email").required().max(50, "Email must be less than 50 characters!"),
  phone: Yup.string()
    .required("Phone number is Required")
    .min(13, "Phone number must be 13 characters!")
    .max(15, "Phone number must be less than 15 characters!"),
  password: Yup.string().required("Password is required").max(15, "Password must be less than 16 characters!"),
  confirm_password: Yup.string()
    .required("Password is required")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});

const SignUpStep1 = ({ handleStep }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const initialValues: initialSchemaValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  };

  const handleLogin = () => {
    navigate("/");
  };
  const handleAuthData = async (loginData: any) => {
    console.log("loginData ==", loginData);
    let storage: any = GetStorage();
    const formData = new FormData();
    let email = storage?.email;
    formData.append("apiType", "register");

    let plan_id = Number(localStorage.getItem("plan_id"));
    let module_id = Number(localStorage.getItem("moduleId"));
    formData.append("social_media_token", loginData.social_media_token);
    formData.append("social_media_platform", loginData.social_media_platform);
    formData.append("email", loginData.email);
    formData.append("module_id", JSON.stringify(module_id));
    formData.append("plan_id", JSON.stringify(plan_id));

    backendCall({
      url: "/api/vendor/social_login",
      method: "POST",
      data: formData,
    }).then((res) => {
      if (res && !res.error) {
        let dataSet = res.data;
        dataSet.isLoggedIn = true;
        SetStorage(dataSet);
        setIsLoading(false);
        handleToastMessage("success", res?.message);


        localStorage.setItem("onBoardingStatus", res?.data?.onBoardingStatus);
        // handleToastMessage("success", res.message);
        handleStep(1);
        // navigate("/signup");
        // let storage: any = GetStorage();
        // let status = storage?.onBoardingStatus;
        // if (status == "SHOP") {
        //   sessionStorage.setItem("step", String(1));
        //   navigate("/signup");
        // } else if (status == "QUESTIONS") {
        //   sessionStorage.setItem("step", String(2));

        //   navigate("/signup");
        // } else if (status == "COMPLETED") {
        //   // sessionStorage.setItem("step", String(3));
        //   // dispatch(
        //   //   setLayout({
        //   //     isShowFooter: true,
        //   //     isShowHeader: true,
        //   //   })
        //   // );
        //   navigate("/dashboard");
        // }
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const handleSubmit = async (values: any) => {
   
    if (values) {
      let dataSet = values;
      // delete dataSet.confirm_password;
      dataSet.plan_id = localStorage.getItem("plan_id");
      dataSet.module_id = localStorage.getItem("moduleId");
      dataSet.first_name = values.first_name;
      dataSet.last_name = values.last_name;
      dataSet.email = values.email;
      dataSet.phone = values.phone;
      dataSet.password = values.password;

      if (!dataSet.plan_id) {
        handleToastMessage("error", "Please select a plan first");
        return;
      }
      console.log(dataSet);
      backendCall({
        url: "/api/vendor/register",
        method: "POST",
        data: dataSet,
      }).then((res) => {
        if (res && !res.error) {
          SetStorage(res.data);
          localStorage.setItem("onBoardingStatus", res?.data?.onBoardingStatus);
          handleToastMessage("success", res.message);
          handleStep(1);
        } else {
          handleToastMessage("error", res.message);
        }
      });
    }
  };

  return (
    <>
      {" "}
      <div className="text-left flex flex-col gap-3 w-10/12 mx-auto sm:w-full">
        <h4 className=" font-semibold "> Get Started</h4>
        <p className="w-1/3 sm:w-full">
          Join our platform and expand your business reach to new customers.
        </p>
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={FormSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              errors,
              handleChange,
              handleBlur,
              touched,
              values,
              setFieldTouched,
              setFieldValue,
            }) => (
              <Form className="space-y-6 mt-4 ">
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-10 ">
                  {/* <div className="space-y-5 text-left w-full"> */}
                  <Input
                    id="first_name"
                    name="first_name"
                    label="First Name"
                    type="text"
                    variant="outline"
                    placeholder="Enter First Name"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    error={errors.first_name}
                    touched={touched.first_name}
                  />
                  <Input
                    id="last_name"
                    name="last_name"
                    label="Last Name"
                    type="text"
                    variant="outline"
                    placeholder="Enter Last Name"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                    error={errors.last_name}
                    touched={touched.last_name}
                  />

                  <Input
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    variant="outline"
                    placeholder="Enter Email ID"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
                  {/* <Input
                  id="phone"
                  name="phone"
                  label="Phone Number *"
                  type="text"
                  variant="outline"
                  placeholder="Enter your 11 digits phone number"
                  handldChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  error={errors.phone}
                  touched={errors.phone}
                /> */}

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm text-black-900 font-medium"
                    >
                      Phone Number <span className="text-red-100">*</span>
                    </label>
                    <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        isValidPhoneNumber={true}
                      // defaultCountry="PK"
                      className="h-12 border border-gray-900 rounded-[4px] bg-white pl-4 pr-9 PhoneInputInput text-black-900 text-[14px]"
                      placeholder="Enter your 13 digits phone number"
                      onChange={(event) => {
                        if (event) {
                          setFieldValue("phone", event);
                        }
                      }}
                      onBlur={() => {
                        setFieldTouched("phone", true);
                      }}
                      value={values.phone}
                    />
                    <ErrorMessage
                      name={`phone`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>

                  <Input
                    id="password"
                    name="password"
                    label="Password "
                    type="password"
                    variant="outline"
                    placeholder="Create Strong Password"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                  />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirm Password "
                    type="password"
                    variant="outline"
                    placeholder="Confirm Your Password"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirm_password}
                    error={errors.confirm_password}
                    touched={touched.confirm_password}
                  />
                  {/* </div> */}

                  <div className="w-1/2 md:w-full sm:w-full">
                    <CustomButton
                      label="Next"
                      labelClass="font-semibold"
                      type={"submit"}
                      handleButtonClick={handleSubmit}
                      styleClass="btn-black !rounded-lg w-full mt-5"
                    />

                    <p className="flex items-start gap-3 text-gray-400 text-opacity-50 capitalize font-light whitespace-nowrap text-xs !my-4 sm:!my-4  ">
                      <SeperatorLine className="rotate-10 w-full !border-gray-300" />{" "}
                      Or sign up with
                      <SeperatorLine className="rotate-10 w-full !border-gray-300" />
                    </p>
                    <div>
                      <div className="flex justify-between ">
                        <IconButton className="bg-transparent shadow-none">
                          <GoogleAuth
                            // className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                            handleAuthData={handleAuthData}
                            icon={<Google_blue />}

                            // handleButtonClick={() => submitPlan(item)}
                          />
                        </IconButton>

                        <IconButton className="bg-transparent shadow-none">
                          <Email className="w-6 h-6" />
                        </IconButton>
                        <IconButton className="bg-transparent shadow-none">
                          <FacebookAuth
                            // className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                            handleAuthData={handleAuthData}
                            icon={<Fb />}
                          />
                          {/* <Fb className="w-6 h-6" /> */}
                        </IconButton>
                        <IconButton className="bg-transparent shadow-none">
                        <AppleAuth
                        // className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        handleAuthData={handleAuthData}
                        icon={<img loading="lazy" src={Apple} alt="apple" />}
                      />
                          </IconButton>
                        {/* <IconButton className="bg-transparent shadow-none">
                          <img loading="lazy" src={Apple} alt="apple" />
                        </IconButton> */}
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
                        <p className="text-gray-900 text-xs text-center flex flex-wrap gap-1 justify-center">
                          Read our
                          <a
                            href="javascript:void(0) "
                            className="text-blue-600"
                          >
                            Terms & Conditions
                          </a>
                          &
                          <a
                            href="javascript:void(0) "
                            className="text-blue-600"
                          >
                            Privacy Policy
                          </a>
                        </p>
                      </div>
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
          // type={"submit"}
          type={"button"}
          handleButtonClick={() => {
            dispatch(
              setLayout({
                isShowFooter: false,
                isShowHeader: false,
              })
            );
            navigate("/selectPackage");
          }}
          styleClass="btn-black !rounded-lg w-1/4 mt-5"
        />
      </div>
    </>
  );
};

export default SignUpStep1;
