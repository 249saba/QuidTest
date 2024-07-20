import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import GoogleAuth from "@src/shared/socialLogin/googleLogin";
import * as Yup from "yup";
import { Form, Formik } from "formik";

import { useNavigate } from "react-router-dom";
import ContentContainer from "@src/containers/contentContainer";
import Input from "@src/shared/input";
import Checkbox from "@src/shared/checkbox/checkbox";
import { useAuth } from "@src/shared/guards/AuthContext";
import Eye from "@assets/icons/tinted_Icon.png";

import { handleToastMessage } from "@src/shared/toastify";

import Header from "@src/shared/navbar";
import { useState } from "react";

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
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (values: any) => {
    if (values) {
      try{
        const res = await login(values.email, values.password);
        if (res) {
          navigate("/signup");
        } 
      }
      catch{ setError('Login failed. Please check your credentials.');}

    }
  };
console.log("error",error)
  return (
    <div>
      <Header isShow={true} />
      <ContentContainer>
        <div className="flex md:flex-col justify-between m-auto items-center gap-20">
          <CustomCard styleClass=" w-10/12 px-10 py-6 text-left ">
            <h1 className="font-semibold">Welcome</h1>
            <h1 className="font-semibold">back</h1>
            <h6 className="py-3 font-light">
              You need to be signed in to access the project dashboard.
            </h6>
            <Formik
              initialValues={initialValues}
              validationSchema={FormSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, handleChange, handleBlur, touched, values }) => (
                <Form className="space-y-6 mt-4 ">
                  <div className="space-y-3">
                    <Input
                      id="email"
                      name="email"
                      label="Email or username"
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
                      rightIcon={<img src={Eye} />}
                      onBlur={handleBlur}
                      error={errors.password}
                      touched={touched.password}
                      value={values.password}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 items-center justify-center">
                        <Checkbox name={"terms"} />
                        <label className="text-black-100 font-normal">
                          Keep me signed in
                        </label>{" "}
                      </div>

                      <a
                        // onClick={handleForgotPassword}
                        href="javascript:void(0)"
                        className="text-blue-600 font-medium flex text-sm pt-3 underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    {error && <p className="text-red-700">{error}</p>}
                    <div className="w-9/12 mx-auto">
                      <CustomButton
                        label="Sign in"
                        labelClass="font-semibold"
                        type={"submit"}
                        styleClass="btn-black !bg-[#30d4a3]   !rounded-lg w-full mt-5"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-col  gap-4 sm:gap-2 sm:flex sm:items-center">
                      <GoogleAuth
                        className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        // handleAuthData={handleAuthData}
                      />

                      <p className="text-gray-900 text-xs text-center mt-3">
                        Haven't joined yet?{" "}
                        <a
                          // onClick={handleSignUp}
                          className="text-blue-600 cursor-pointer"
                        >
                          Sign up
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
    </div>
  );
};

export default Login;
