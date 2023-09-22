import CustomCard from "@src/shared/cards/customCard";
import { ReactComponent as Logo_blue } from "@assets/logo_blue.svg";
import BackroundImage from "@src/shared/backgroundImage";
import HomeBg from "@assets/images/home_bg.png";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";

import * as Yup from "yup";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { StorageI } from "@src/shared/interfaces";
import { SetStorage } from "@src/shared/utils/authService";
import ContentContainer from "@src/containers/contentContainer";
import Input from "@src/shared/input";
import SeperatorDashed from "@src/shared/seperator/seperatorLine";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import SwiperCarousel, { Slide } from "@src/shared/swiperCarousel";
import LazyImage from "@src/shared/lazyImage";
import Consultation from "@assets/images/Consultation.png";
import Ecommerce from "@assets/images/Ecommerce.png";
import handyman from "@assets/images/handman.png";
import Food from "@assets/images/Food.png";
import Operation from "@assets/vendor/icons/operation.png";
import Customers from "@assets/vendor/icons/customers.png";
import Eye from "@assets/vendor/icons/eye.png";
import ThreeLines from "@assets/icons/three_lines.png";
import Customer from "@assets/icons/customers.png";
import { ReactComponent as LockIcon } from "@assets/vendor/icons/lockIcon.svg";
import { TiMail } from "react-icons/ti";
import { useState } from "react";
import { setLayout } from "@src/shared/slices/LayoutSlice";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import Footer from "@src/shared/footer";

export interface initialSchemaValues {
  email: string;
}

const FormSchema = Yup.object().shape({
  email: Yup.string().label("Email").required(),
});

const initialValues: initialSchemaValues = {
  email: "",
};

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const register = (type: string) => {
    navigate(`/${type}`);
  };

  const handleSubmit = (values: any) => {
    if (values) {
      backendCall({
        url: `/api/vendor/send_reset_password/${values.email}`,
        method: "PATCH",
      }).then((res) => {
        if (res && !res.error) {
          handleToastMessage("success", res.message);
          navigate("/");
        } else {
          handleToastMessage("error", res.message);
        }
      });
    }
  };

  return (
    <div>
      <ContentContainer styleClass="login-bg-gradient !h-screen ">
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

          <CustomCard styleClass=" w-8/12 px-10 py-6 text-left space-y-6 text-center ">
            <LockIcon className="w-16 h-16 mx-auto" />

            <h5 className="font-semibold">Forgot Password</h5>
            <p className="font-normal text-black-900">
              Enter Your Email Address, We'll Send You A Link To Reset You
              Password
            </p>
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
                  <div className="space-y-3 text-left">
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
                      touched={errors.email}
                    />

                    <div className="w-9/12 mx-auto">
                      <CustomButton
                        label="Send Link"
                        labelClass="font-semibold"
                        type={"submit"}
                        // handleButtonClick={handleSubmit}
                        styleClass="btn-black !rounded-lg w-full mt-5"
                      />
                      <p className="text-gray-900 text-xs text-center flex gap-1 mt-4 justify-center">
                        Read our
                        <a href="javascript:void(0) " className="text-blue-600">
                          Terms & Conditions
                        </a>
                        &
                        <a href="javascript:void(0) " className="text-blue-600">
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
      <ContentContainer>
        <div className="my-24 text-center">
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
      <Footer/>
    </div>
  );
};

export default ForgotPassword;
