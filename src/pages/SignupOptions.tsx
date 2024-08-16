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
import Rectangle1 from "@assets/icons/Rectangle.jpg";
import Rectangle from "@assets/icons/Rectangle-1.jpg";
import Rectangle2 from "@assets/icons/Rectangle-2.jpg";
import Rectangle3 from "@assets/icons/Rectangle-3.jpg";
import Rectangle4 from "@assets/icons/Rectangle-4.jpg";
import { handleToastMessage } from "@src/shared/toastify";

import Navbar from "@src/shared/navbar";
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

const SignupOptions = () => {
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
      <CustomCard styleClass="flex flex-col w-full  py-14 items-center gap-2 justify-center">
        <div className="flex flex-col items-center justify-center">
          <h5 className="font-semibold">Three Sign-up Options</h5>
          <span className="text-blue-600 font-bold  justify-center">
            Something for Everyone
          </span>
        </div>
        <div className=" flex flex-row w-full items-center justify-center px-20 gap-6">
          <div className="flex w-1/2  items-center gap-2 justify-center">
            <img src={Rectangle4} />
          </div>
          <div className="flex w-1/2  items-center gap-2  ">
            <div className="flex flex-col items-start justify-center text-left h-[310px] px-10 bg-pink-50 rounded-sm">
              <h5 className="font-semibold">For Neighbors</h5>
              <p className="text-black-100 text-left  justify-center">
                Explore a vast array of over 400 categories and interests, all
                conveniently located nearby for your browsing pleasure
              </p>
              <div className="flex items-start gap-3 py-2">
                <span className="font-bold text-red-100">|</span>{" "}
                <span className="text-black-100  font-semibold justify-center">
                  Sign up for neighborhood news tailored to your interests
                </span>
              </div>
              <CustomButton
                label={"Sign up"}
                type={"submit"}
                isLoading={false}
                handleButtonClick={() => navigate("/login")}
                variant={"outlined"}
                styleClass={"bg-yellow-600 !text-white rounded-3xl"}
              />
            </div>
          </div>
        </div>
        <div className=" flex flex-row w-full items-center justify-center px-20 gap-6">
          <CustomCard styleClass="flex w-1/2  items-center gap-2 justify-center">
            <div className="flex flex-col items-start justify-center h-[310px] px-5 bg-green-50 rounded-sm">
              <h5 className="font-semibold">For Businesses</h5>
              <p className="text-black-100   justify-center text-left">
                Add your business to a modern-day local directory offering
                affordable leads and social engagement in our Neighborhood News
                program.
              </p>

              <div className="flex">
                <span className="font-bold text-green-400">|</span>{" "}
                <span className="text-black-100  text-left justify-center">
                  The same control panel for a home-based business as a national
                  business. Grow customers near you. Free Listing
                </span>
              </div>
              <CustomButton
                label={"Sign up"}
                type={"submit"}
                isLoading={false}
                handleButtonClick={() => navigate("/login")}
                variant={"outlined"}
                styleClass={"bg-yellow-600 !text-white rounded-3xl"}
              />
            </div>
          </CustomCard>
          <CustomCard styleClass="flex w-1/2  items-center gap-2 justify-center">
            <img src={Rectangle3} />
          </CustomCard>
        </div>
        <div className=" flex flex-row w-full items-center justify-center px-20 gap-6">
          <CustomCard styleClass="flex w-1/2  items-center gap-2 justify-center">
            <img src={Rectangle4} />
          </CustomCard>
          <CustomCard styleClass="flex w-1/2  items-center gap-2 justify-center">
            <div className="flex flex-col items-start justify-center h-[310px] px-5 bg-green-50">
              <h5 className="font-semibold">For Agencies & Multi Brands</h5>
              <p className="text-black-100   justify-center">
                A single dashboard to centralize and oversee multiple brands and
                clients. Bring your clients on board with YellowZip and empower
                them to connect with their local community.
              </p>

              <CustomButton
                label={"Sign up"}
                type={"submit"}
                isLoading={false}
                handleButtonClick={() => navigate("/login")}
                variant={"outlined"}
                styleClass={"bg-yellow-600 !text-white rounded-3xl"}
              />
            </div>
          </CustomCard>
        </div>
      </CustomCard>
      <div className=" flex flex-col gap-4">
        <CustomCard styleClass="flex w-full  items-center gap-2 justify-center">
          <img src={Rectangle} />
        </CustomCard>
        <div className="flex flex-row justify-between items-center">
          <div className=" flex flex-col px-10 items-start">
            <p className="text-black-100 font-semibold">Neighborly News</p>
            <p className="text-black-100">Get the neighborhood scoop here</p>
          </div>
          <div className=" flex flex-row px-10 items-center justify-center">
            <p className="text-black-100">Get the neighborhood scoop here</p>
            <CustomButton
              label={"Sign up"}
              type={"submit"}
              isLoading={false}
              handleButtonClick={() => navigate("/login")}
              variant={"outlined"}
              styleClass={"bg-yellow-600 !text-white rounded-3xl"}
            />
          </div>
        </div>
        <p className="text-black-100 text-left px-20">
          Free speech, no bullying, weekly world events, local events, school
          updates, advice, photos, lost and found, “no negatives” zone, comment
          freely zone, no mention of businesses (that’s why we have a free
          Directory), and no ads. Ask, comment, engage, learn, and have fun!
        </p>
      </div>
      <div className=" flex flex-row w-full items-center justify-center px-20 gap-6 py-5">
        <CustomCard styleClass="flex w-1/2  items-center gap-2 justify-center">
          <img src={Rectangle1} />
        </CustomCard>
        <div className="flex flex-col gap-6 w-full ">
          <CustomCard styleClass="flex   items-center gap-2 justify-center">
            <div className="flex flex-col items-start justify-center  p-10 w-full bg-green-50 gap-8">
              <h5 className="font-semibold">Neighborhood Committed</h5>
              <div className="flex items-center justify-between w-full">
                <p className="text-black-100">ZIP code focused</p>
                <p className="text-black-100">Neighborhood happenings</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-black-100">Love for home-based businesses</p>
                <p className="text-black-100">Free speech</p>
              </div>
              <CustomButton
                label={"Advertise"}
                type={"submit"}
                isLoading={false}
                handleButtonClick={() => navigate("/login")}
                variant={"outlined"}
                styleClass={"bg-yellow-600 !text-white rounded-3xl ppt-10"}
              />
            </div>
          </CustomCard>
          <CustomCard styleClass="flex   items-center gap-2 justify-center">
            <div className="flex flex-col items-start justify-center  p-10 w-full bg-green-50 gap-8">
              <h5 className="font-semibold">Why Advertise With Us</h5>
              <div className="flex items-center justify-between w-full">
                <p className="text-black-100">Get more business
                </p>
                <p className="text-black-100">Neighborhood happenings</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p className="text-black-100">Love for home-based businesses</p>
                <p className="text-black-100">Free speech</p>
              </div>
              <CustomButton
                label={"Advertise"}
                type={"submit"}
                isLoading={false}
                handleButtonClick={() => navigate("/login")}
                variant={"outlined"}
                styleClass={"bg-yellow-600 !text-white rounded-3xl ppt-10"}
              />
            </div>
          </CustomCard>
        </div>
      </div>
    </>
  );
};

export default SignupOptions;
