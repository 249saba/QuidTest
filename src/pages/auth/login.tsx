import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
// import { ReactComponent as Apple} from "@assets/icons/apple_icon.svg";
import Apple from "@assets/vendor/icons/apple.png";
import * as Yup from "yup";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ContentContainer from "@src/containers/contentContainer";
import Input from "@src/shared/input";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import LazyImage from "@src/shared/lazyImage";
import Consultation from "@assets/images/Consultation.png";
import Ecommerce from "@assets/images/Ecommerce.png";
import handyman from "@assets/images/handman.png";
import Food from "@assets/images/Food.png";
import Eye from "@assets/vendor/icons/eye.png";
import ThreeLines from "@assets/icons/three_lines.png";
import Customer from "@assets/icons/customers.png";
import { useEffect, useState } from "react";
import { setLayout } from "@src/shared/slices/LayoutSlice";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import Footer from "@src/shared/footer";
import Header from "@src/shared/navbar";
import GoogleAuth from "@src/shared/socialLogin/googleLogin";
import FacebookAuth from "@src/shared/socialLogin/facebookLogin";
import AppleAuth from "@src/shared/socialLogin/appleLogin";
import { GetStorage, Logout, SetStorage } from "@src/shared/utils/authService";
import { OnBoardingStatus } from "@src/shared/enum";

export interface initialSchemaValues {
  email: string;
  password: string;
}

const FormSchema = Yup.object().shape({
  email: Yup.string().label("Email").required(),
  password: Yup.string().label("Password").required(),
});

const initialValues: initialSchemaValues = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("social");
  }, []);

  const handleSubmit = (values: any) => {
    console.log("login ==", values);

    if (values) {
      setIsLoading(true);
      backendCall({
        url: "/api/vendor/login",
        method: "POST",
        data: values,
      }).then((res) => {
        if (res && !res.error) {
          console.log(res);
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate({
            search: `?email=${values.email}&password=${values.password}`,
            pathname: "/verify",
          });
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };

  const handleSignUp = () => {
    sessionStorage.removeItem("step");
    Logout().then(() => {
      navigate("/categories");
    });
    // dispatch(
    //   setLayout({
    //     isShowFooter: true,
    //     isShowHeader: true,
    //   }));
 
  };
  const handleGoogleSignUp = () => {
    sessionStorage.removeItem("step");
    sessionStorage.setItem("social", "Google");
    dispatch(
      setLayout({
        isShowFooter: true,
        isShowHeader: true,
      })
    );
    navigate("/categories");
  };
  const handleFacebookSignUp = () => {
    sessionStorage.removeItem("step");
    sessionStorage.setItem("social", "Facebook");
    dispatch(
      setLayout({
        isShowFooter: true,
        isShowHeader: true,
      })
    );
    navigate("/categories");
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };
  const handleAuthData = async (loginData: any) => {
    console.log("loginData ==", loginData);
    let storage: any = GetStorage();
    const formData = new FormData();
    let email = storage?.email;
    // setIsLoading(true);
    formData.append("apiType", "login");

    let plan_id = Number(localStorage.getItem("plan_id"));
    let module_id = Number(localStorage.getItem("moduleId"));
    formData.append("social_media_token", loginData.social_media_token);
    formData.append("social_media_platform", loginData.social_media_platform);
    formData.append("email", loginData.email);
    // formData.append("module_id", JSON.stringify(module_id));
    // formData.append("plan_id", JSON.stringify(plan_id));

    backendCall({
      url: "/api/vendor/social_login",
      method: "POST",
      data: formData,
    }).then((res) => {
      if (res && !res.error) {
        let dataSet = res.data;
        dataSet.isLoggedIn = true;
        console.log("dataSet", dataSet);
        SetStorage(dataSet);
        setIsLoading(false);
        handleToastMessage("success", res?.message);

        // navigate("/signup");
        let storage: any = GetStorage();
        let status = storage?.onBoardingStatus;
        if (status == OnBoardingStatus.SHOP) {
          sessionStorage.setItem("step", String(1));
          navigate("/signup");
        } else if (status == OnBoardingStatus.QUESTIONS) {
          sessionStorage.setItem("step", String(2));
          navigate("/signup");
        } else if (status == OnBoardingStatus.PAYMENT) {
          navigate("/payment");
        } else if (status == OnBoardingStatus?.COMPLETED) {
          // sessionStorage.setItem("step", String(3));
          dispatch(
            setLayout({
              isShowFooter: true,
              isShowHeader: true,
            })
          );
          navigate("/dashboard");
        }
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  // const handleAuthData = async (loginData: any) => {
  //   console.log("loginData ==", loginData);
  //   backendCall({
  //     url: "/api/vendor/social_login",
  //     method: "POST",
  //     data: loginData,
  //   }).then((res) => {
  //     if (res && !res.error) {
  //       let dataSet = res.data;
  //       dataSet.isLoggedIn = true;
  //       console.log("dataSet",dataSet)
  //       SetStorage(dataSet);
  //       setIsLoading(false);
  //       handleToastMessage("success", res?.message);

  //       // navigate("/signup");
  //       let storage: any = GetStorage();
  //       let status = storage?.onBoardingStatus;
  //       if (status == "SHOP") {
  //         sessionStorage.setItem("step", String(1));
  //         navigate("/signup");
  //       } else if (status == "QUESTIONS") {
  //         sessionStorage.setItem("step", String(2));

  //         navigate("/signup");
  //       } else if (status == "COMPLETED") {
  //         // sessionStorage.setItem("step", String(3));
  //         dispatch(
  //           setLayout({
  //             isShowFooter: true,
  //             isShowHeader: true,
  //           })
  //         );
  //         navigate("/dashboard");
  //       }
  //     } else {
  //       setIsLoading(false);
  //       handleToastMessage("error", res?.message);
  //     }
  //   });
  // };

  return (
    <div>
      <Header isShow={true} />
      <ContentContainer styleClass="login-bg-gradient ">
        <div className="flex md:flex-col justify-between m-auto items-center gap-20">
          <div className="w-full text-left space-y-4">
            <h2 className=" font-medium leading-tight">
              Unleash The Power Of Ecommerce With Our Platform
            </h2>
            <p className="text-gray-900 font-light">
              Are you tired of struggling to reach new customers and grow your
              eCommerce business? Look no further than our website. Our platform
              makes it simple to add your online shop and start selling to a
              wider audience.
            </p>
          </div>

          <CustomCard styleClass=" w-8/12 px-10 py-6 text-left ">
            <h5 className="font-semibold">Get Started</h5>
            <h6 className="py-3 font-light">
              Join our platform and expand your business reach to new customers.
            </h6>
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
                setFieldValue,
              }) => (
                <Form className="space-y-6 mt-4 ">
                  <div className="space-y-3">
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

                    <Input
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Enter Password"
                      variant="outline"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      value={values.password}
                    />

                    <div className="w-9/12 mx-auto">
                      <CustomButton
                        isLoading={isLoading}
                        label="Login"
                        labelClass="font-semibold"
                        type={"submit"}
                        styleClass="btn-black !rounded-lg w-full mt-5"
                      />
                    </div>
                    <a
                      onClick={handleForgotPassword}
                      href="javascript:void(0)"
                      className="text-blue-600 font-medium flex text-sm pt-3 "
                    >
                      Forgot password?
                    </a>

                    <p className="flex items-start gap-3 text-gray-300 capitalize font-light whitespace-nowrap text-xs !my-4 sm:!my-4  ">
                      <SeperatorLine className="rotate-10 w-full border-gray-300" />{" "}
                      Or sign up with
                      <SeperatorLine className="rotate-10 w-full border-gray-300" />
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 sm:flex sm:items-center">
                      <GoogleAuth
                        className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        handleAuthData={handleAuthData}
                      />
                      {/* <CustomButton
                        icon={<Google_blue />}
                        handleButtonClick={handleGoogleSignUp}
                        labelClass="w-full sm:hidden text-sm font-medium"
                        label="Google"
                        type={"submit"}
                        styleClass="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                      /> */}
                      {/* <CustomButton
                       icon={<Fb />}
                        handleButtonClick={handleFacebookSignUp}
                        labelClass="w-full sm:hidden text-sm font-medium"
                        label="Facebook"
                        type={"submit"}
                        styleClass="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                      /> */}

                      <FacebookAuth
                        className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        handleAuthData={handleAuthData}
                      />
                      {/* <CustomButton
                        icon={<Fb />}
                        labelClass="w-full sm:hidden text-sm font-medium"
                        label="Facebook"
                        type={"submit"}
                        styleClass="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                      /> */}
                      <AppleAuth
                        className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        handleAuthData={handleAuthData}
                      />
                      {/* <CustomButton
                        icon={<img loading="lazy" src={Apple} alt="apple" />}
                        labelClass="w-full sm:hidden text-sm font-medium"
                        label="Apple"
                        type={"submit"}
                        styleClass="btn-white justify-start text-center !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                      /> */}

                      <p className="text-gray-900 text-xs text-center mt-3">
                        Don't Have An Account?{" "}
                        <a
                          onClick={handleSignUp}
                 
                          className="text-blue-600 cursor-pointer"
                        >
                          Sign Up
                        </a>
                      </p>
                      <p className="text-gray-900 text-xs text-center flex gap-1 justify-center">
                        Read our
                        <a  className="text-blue-600 cursor-pointer"    onClick={()=>{{   navigate({ search: `?state=TERMS`, pathname: "/terms" });}}}>
                          Terms & Conditions
                        </a>
                        &
                        <a href="javascript:void(0) " className="text-blue-600 cursor-pointer"         onClick={()=>{navigate({ search: `?state=PRIVACY`, pathname: "/privacyPolicy" });}}>
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </CustomCard>
        </div>
      </ContentContainer>
      <ContentContainer styleClass="!pt-0">
        <div className="my-12 text-center">
          <h2 className=" leading-none">
            Unlock New Opportunities for Your Business:
          </h2>
          <h2 className="text-red-100 "> Register with Our Platform Today!</h2>
        </div>

        <div className="grid grid-cols-3 gap-8 justify-center items-center sm:grid-cols-2 pb-8">
          <CustomCard styleClass="relative space-y-10 pb-8 h-full">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={ThreeLines}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Streamlined operations</h4>
              <p className="text-gray-500 font-light">
                Your platform might offer tools and resources that can help
                businesses streamline their operations and improve efficiency.
                For example, you might offer an inventory management system or
                analytics dashboard that can help businesses make more informed
                decisions about their operations.
              </p>
            </div>
          </CustomCard>
          <CustomCard styleClass="relative space-y-10 h-full pb-8">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={Customer}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Access to new customers</h4>
              <p className="text-gray-500 font-light">
                By tapping into your platform's customer base, businesses can
                gain access to a new set of customers who are already engaged
                with your platform. This can help to expand their customer base
                and increase revenue.
              </p>
            </div>
          </CustomCard>
          <CustomCard styleClass="relative space-y-10 h-full pb-8">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={Eye}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Increased visibilty</h4>
              <p className="text-gray-500 font-light">
                By registering with your platform, businesses can increase their
                visibility to potential customers who might not have otherwise
                known about their product or service. This can help to attract
                new customers and increase sales.
              </p>
            </div>
          </CustomCard>
        </div>
      </ContentContainer>
      <Footer />
    </div>
  );
};

export default Login;
