import { getUnit } from "@mui/material/styles/cssUtils";
import {
  GetDealTypes,
  GetProductByCategoryId,
  GetTaxTypes,
  GetUnits,
  getCategoriesById,
} from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { ReactComponent as DateIcon } from "@assets/vendor/icons/datepicker.svg";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { useNavigate } from "react-router";

import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { json } from "node:stream/consumers";
import PencilEditIcon from "@src/shared/icons/pencil-edit";
import { Breadcrumbs } from "@material-tailwind/react";

export interface initialSchemaValues {
  deal_id: string | object;
  discount: number | undefined;
}

const FormSchema = Yup.object().shape({
  //   deal_id: Yup.object().label("deal_id").required("Deal type  is required"),
  //   discount: Yup.number()
  //     .typeError("Must be a number")
  //     .nullable()
  //     .min(1)
  //     .required("Discount is required"),
});

const initialValues: initialSchemaValues = {
  deal_id: "",
  discount: undefined,
  // products: [],
};

const BankInfo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setisOpenModal] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [dealTypeOptions, setDealTypeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCatProds, setSelectedCatProds] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [isBankInfo, setIsbankInfo] = useState(false);
  const [categoryData, setcategoryData] = useState([]);
  const location = useLocation();

  const navigate = useNavigate();

  const handleBankInfo = () => {
    setIsbankInfo(!isBankInfo);
  };

  return (
    <div className="flex flex-col gap-4">
      <Formik
        initialValues={initialValues}
        validationSchema={FormSchema}
        enableReinitialize={true}
        onSubmit={() => {}}
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
            <>
              <CustomCard styleClass="p-4">
                <div className="flex flex-wrap justify-between  items-center">
                  <div className="text-left">
                    {/* <p className="text-gray-900 flex gap-1">
                      <span>Dashboard</span>/<span>Settings</span>/
                      <span>Banking Information</span>
                    </p> */}
                    <Breadcrumbs
                      aria-label="breadcrumb"
                      className="bg-inherit pl-0"
                    >
                      <Link to="/dashboard">
                        <p>Dashboard</p>
                      </Link>
                      <Link to="/settings">
                        <p>Settings</p>
                      </Link>
                      <Link to="/settings/bankInfo" className="text-gray">
                        <p>{"Banking Information"}</p>
                      </Link>
                    </Breadcrumbs>

                    <h5 className="font-normal"> Banking Information</h5>
                  </div>

                  <div className="flex gap-4 sm:ml-auto">
                    {/* <CustomButton
                        handleButtonClick={() => {
                          navigate("");
                        }}
                        type={"button"}
                        label="Cancel"
                        styleClass="btn-gray-light !rounded-md"
                      /> */}
                    <CustomButton
                      // isLoading={isLoading}
                      type={"submit"}
                      label="Update"
                      styleClass="btn-black !rounded-md"
                      handleButtonClick={() => {
                        handleBankInfo();
                      }}
                    />
                  </div>
                </div>
              </CustomCard>

              {isBankInfo ? (
                <CustomCard styleClass="p-4">
                  <div className="flex px-6  h-16 items-center justify-between rounded bg-gray-100">
                    <div className="flex">
                      <img />{" "}
                      <div className="flex items-center  flex-col  ">
                        <span className="text-black-900 font-medium">
                          City Bank
                        </span>
                        <span className="text-gray-300">11111111122222</span>
                      </div>
                    </div>
                    <PencilIcon
                      className={"cursor-pointer"}
                      onClick={() => {
                        handleBankInfo();
                      }}
                    />
                  </div>
                </CustomCard>
              ) : (
                <CustomCard styleClass="p-4">
                  <div className="space-y-2 font-semibold text-black-100 text-left ">
                    Add Banking Information
                  </div>
                  <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 text-left pt-5">
                    <div className="space-y-2 ">
                      <label
                        htmlFor="unit_id"
                        className="text-sm text-black-900"
                      >
                        Select Your Bank *
                      </label>

                      <Select
                        // options={dealTypeOptions}
                        id="deal_id"
                        name="deal_id"
                        placeholder="Select Bank"
                        value={values.deal_id}
                        onChange={(value: any) => {
                          //   console.log("value", value);
                          //   console.log("deal_id", values);
                          //   setFieldTouched("deal_id", true);
                          //   setFieldValue("deal_id", value);
                        }}
                        onBlur={handleBlur}
                        //  value={console.log("values",values.deal_id)}
                      />
                      <ErrorMessage
                        name={`deal_id`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      />
                    </div>

                    <Input
                      id="discount"
                      name="discount"
                      label="Account No "
                      type="text"
                      variant="outline"
                      placeholder="Enter 14 digits account no"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                      value={values.discount}
                      error={errors.discount}
                      touched={touched.discount}
                    />
                  </div>
                </CustomCard>
              )}
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BankInfo;
