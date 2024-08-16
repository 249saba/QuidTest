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

import Navbar from "@src/shared/navbar";
import { useState } from "react";
import SignupOptions from "../SignupOptions";

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
      try {
        const res = await login(values.email, values.password);
        if (res) {
          navigate("/signup");
        }
      } catch {
        setError("Login failed. Please check your credentials.");
      }
    }
  };
  console.log("error", error);
  return (
    <>
     <div className="bg-[url('@assets/icons/home.jpg')] bg-cover bg-center bg-no-repeat h-[800px] w-full ">
      <Navbar isShow={true} />
      <ContentContainer>
        <div className="flex flex-col md:flex-col justify-between mx-8  gap-5 items-start w-full">
          <CustomCard styleClass="flex flex-row px-4 py-3 items-center gap-2 ">
            <h5 className="font-semibold">
              An Open Honest Neighborhood Platform
            </h5>
            <span className="text-blue-600 font-bold">Coming 2024</span>
          </CustomCard>
          <CustomCard styleClass="flex flex-col px-4 py-3 items-start gap-2 ">
            <h5 className="font-semibold">Powered by</h5>
            <span className="text-pink-400 font-bold">
              Neighborhood Stars That Truly Care
            </span>
            <table className="min-w-full table-auto border-collapse  ">
              <thead>
                <tr>
                  <th className="  py-2 text-left text-blue-600">
                    Neighborhood News
                  </th>
                  <th className=" py-2 text-left text-blue-600">
                    Small Business Directory 2
                  </th>
                  <th className=" py-2 text-left text-blue-600">Ask a Pro 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-pink-400  text-left py-2">
                    School happenings
                  </td>
                  <td className="text-pink-400  text-left py-2">
                    400 + Categories
                  </td>
                  <td className="text-pink-400 text-left  py-2">
                    Business Leads Bids
                  </td>
                </tr>
                <tr>
                  <td className="text-pink-400 text-left  py-2">Advice</td>
                  <td className="text-pink-400 text-left  py-2">
                    Free Listing
                  </td>
                  <td className="text-pink-400 text-left  py-2">
                    400 + Categories{" "}
                  </td>
                </tr>
                <tr>
                  <td className="text-pink-400 text-left py-2">Events</td>
                  <td className="text-pink-400 text-left py-2">Most Liked</td>
                  <td className="text-pink-400 text-left py-2">
                    Neighborhood Comments
                  </td>
                </tr>
              </tbody>
            </table>
          </CustomCard>
          <div className="flex flex-row gap-3 items-center justify-center mx-auto">
            <CustomButton
              label={"Star Sign in"}
              type={"submit"}
              isLoading={false}
              handleButtonClick={() => navigate("/login")}
              variant={"outlined"}
              styleClass={"bg-pink-600 !text-white rounded-3xl"}
            />
            <CustomButton
              label={"Star Sign up"}
              type={"submit"}
              isLoading={false}
              handleButtonClick={() => navigate("/login")}
              variant={"outlined"}
              styleClass={"bg-pink-600 !text-white rounded-3xl"}
            />
            <CustomButton
              label={"Star Program"}
              type={"submit"}
              isLoading={false}
              handleButtonClick={() => navigate("/login")}
              variant={"outlined"}
              styleClass={"bg-pink-600 !text-white rounded-3xl"}
            />
          </div>
          <CustomCard styleClass="flex flex-col py-3 items-center  m-auto justify-center w-1/2">
            <h5 className="font-semibold text-pink-400">Be A Star</h5>
            <div className=" flex gap-2 items-center justify-center ">
              <label className="text-black-100 font-bold text-lg">.</label>
              <label className="text-black-100 font-semibold">
                Real Estate Agents
              </label>
              <label className="text-black-100 font-bold text-lg">.</label>
              <label className="text-black-100 font-semibold">Insurance</label>
              <label className="text-black-100 text-lg font-bold">.</label>
              <label className="text-black-100 font-semibold">Finance</label>
              <label className="text-black-100 text-lg font-extrabold">.</label>
              <label className="text-black-100 font-semibold">Beauty</label>
            </div>
          </CustomCard>
        </div>
      </ContentContainer>
    </div>
    <SignupOptions/>
    </>
   
  );
};

export default Login;
