import CustomButton from "@src/shared/customButton";
import { ReactComponent as Fb } from "@assets/icons/facebook_blue.svg";
import { ReactComponent as Google_blue } from "@assets/icons/google_blue.svg";
import { ReactComponent as Email } from "@assets/vendor/icons/mail.svg";
import AddBlack from "@assets/vendor/icons/add_black.png";
import Apple from "@assets/vendor/icons/apple.png";
import { SetStorage } from "@src/shared/utils/authService";
import * as Yup from "yup";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Input from "@src/shared/input";
import SeperatorLine from "@src/shared/seperator/seperatorLine";

import { Button, IconButton, Typography } from "@material-tailwind/react";

import "react-phone-number-input/style.css";
import Checkbox from "@src/shared/checkbox/checkbox";
import Radio from "@src/shared/radio/radio";
import { useEffect, useState } from "react";
import { GetQuestionAnswers } from "@src/shared/apiService";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { OnBoardingStatus } from "@src/shared/enum";
import { STORAGE } from "@src/shared/const";

export interface initialSchemaValues {
  startPeriod: string;
  takingOverShop: string;
  currentlyDeliver: string;
  howUseService: string;
  categoriesToOffer: string;
  noOfLocations: string;
}

const SignUpStep3 = ({ handleStep }: any) => {
  const navigate = useNavigate();

  const [initValue, setInitValue] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [validationSchema, setValidationSchema] = useState({});

  useEffect(() => {
    getQuestionAnswers();
  }, []);

  const getQuestionAnswers = () => {
    GetQuestionAnswers().then((res) => {
      if (res && !res.error) {
        console.log(res);
        setQuestionList(res.data);
        createDynamicFormSchema(res.data);
      }
    });
  };
  console.log("validationSchema", validationSchema);
  const createDynamicFormSchema = (questions: any) => {
    const _schema: any = {};
    const initValue: any = {};

    questions.forEach((element: any) => {
      let _validation;
      _validation = Yup.string();
      if (element.is_required) {
        _validation = _validation.required("please select  one option");
      }
      initValue[element.id] = "";
      initValue["terms"] = false;

      _schema[element.id] = _validation;
      _schema["terms"] = Yup.boolean().required("pple");
    });
    setValidationSchema(Yup.object().shape(_schema));
    setInitValue(initValue);
  };

  const handleLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (values: any) => {
    console.log("login ==", await values);
    if (!values["terms"]) {
      handleToastMessage("warn", "Please accept terms and conditions");
      return;
    }
    let _intoArray = Object.entries(values);
    _intoArray.pop();
    const questions = _intoArray.map((item) => {
      const _data = {
        question_id: parseInt(item[0], 10),
        answer: item[1],
      };
      return _data;
    });
    if (questions) {
      backendCall({
        url: `/api/vendor/set_questions`,
        method: "POST",
        data: { questions: questions },
      }).then((res) => {
        if (res && !res.error) {
          handleToastMessage("success", res.message);
          const _data: any = localStorage.getItem(STORAGE);
          const data = JSON.parse(_data);
          const storageData = {
            ...data,
            ...res?.data,
          };
          
          SetStorage(storageData);
          localStorage.setItem("onBoardingStatus", res?.data?.onBoardingStatus);
          if (res?.data?.onBoardingStatus === OnBoardingStatus?.PAYMENT) {
            navigate("/payment");
          } else {
            navigate("/thankyou");
          }
          sessionStorage.removeItem("step");
          // localStorage.removeItem("step");
        } else {
          handleToastMessage("error", res.message);
        }
      });
    }
  };

  return (
    <div className="text-left flex flex-col gap-3 w-[90%] mx-auto sm:w-full">
      <h4 className=" font-semibold "> Select What Applies To You</h4>

      <div>
        {Object.entries(initValue).length && (
          <Formik
            enableReinitialize
            initialValues={initValue}
            validationSchema={validationSchema}
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
            }) => (
              <Form className="space-y-8 mt-4 w-full">
                {questionList.map((question: any, index) => (
                  <div key={index} className="space-y-6">
                    <div className="flex flex-col w-full items-start gap-8 sm:gap-8 sm:flex-col">
                      <h5 className="font-medium w-7/12 sm:w-full">
                        {question.question}{" "}
                        <span className="text-red-100">*</span>
                      </h5>
                      <div className="space-y-3 w-1/3 sm:w-full pl-10">
                        {question.answersModel.map((res: any) => (
                          <Radio
                            id={res.id}
                            name={question.id}
                            label={res.option}
                            onChange={(value) => {
                              setFieldValue(question.id, res.option);
                            }}
                            value={res.answersModel}
                          />
                        ))}
                        <ErrorMessage
                          name={question.id}
                          component={"span"}
                          className="text-xs text-red-100 pt-1"
                        />
                      </div>
                    </div>
                    {index < question.length && (
                      <SeperatorLine className="flex w-full" />
                    )}
                  </div>
                ))}

                <div className="w-1/3 md:w-full sm:w-full">
                  <div className=" mt-12 space-y-2">
                    <h5 className="font-semibold">Terms & Conditions</h5>

                    <p className="text-gray-900 text-xs text-left flex  items-center flex-wrap gap-1">
                      <Checkbox
                        name={"terms"}
                        onChange={(res) => {
                          setFieldValue("terms", res.target.checked);
                          setFieldTouched("terms");
                        }}
                      />
                      I accept the
                      <a
                        href="javascript:void(0) "
                        className="text-blue-600"
                        onClick={() => {
                          {
                            navigate({
                              search: `?state=TERMS`,
                              pathname: "/terms",
                            });
                          }
                        }}
                      >
                        Terms & Conditions{" "}
                        <span className="text-red-100">*</span>
                      </a>
                    </p>
                    <ErrorMessage
                      name={`terms`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>

                  <CustomButton
                    label="Next"
                    labelClass="font-semibold"
                    type={"submit"}
                    styleClass="btn-black !rounded-lg w-full mt-12"
                  />

                  {/* <p className="flex items-start gap-3 text-gray-400 text-opacity-50 capitalize font-light whitespace-nowrap text-xs !my-4 sm:!my-4  ">
                    <SeperatorLine className="rotate-10 w-full !border-gray-300" />{" "}
                    Or sign up with
                    <SeperatorLine className="rotate-10 w-full !border-gray-300" />
                  </p> */}
                  <div>
                    {/* <div className="flex justify-between px-6">
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
                    </div> */}
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
                    <p className="text-gray-900 text-xs text-center mt-3">
                      Read our
                      <a
                        // target="_blank"

                        onClick={() => {
                          {
                            navigate({
                              search: `?state=TERMS`,
                              pathname: "/terms",
                            });
                          }
                        }}
                        className="text-blue-600 ml-1 cursor-pointer"
                      >
                        Terms & Conditions
                      </a>
                      &
                      <a
                        target="_blank"
                        onClick={() => {
                          navigate({
                            search: `?state=PRIVACY`,
                            pathname: "/privacyPolicy",
                          });
                        }}
                        className="text-blue-600 ml-1 cursor-pointer"
                      >
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <CustomButton
        label="Back"
        labelClass="font-semibold"
        handleButtonClick={() => {
          handleStep(1);
        }}
        type={"button"}
        styleClass="btn-black !rounded-lg w-1/3 mt-12"
      />
    </div>
  );
};

export default SignUpStep3;
