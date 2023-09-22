import { getUnit } from "@mui/material/styles/cssUtils";
import { GetTaxTypes, GetUnits } from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { ReactComponent as DateIcon } from "@assets/vendor/icons/datepicker.svg";
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { useNavigate } from "react-router";
import { date, object } from "yup";
import { Breadcrumbs } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export interface initialSchemaValues {
  title: string;
  discount: number;
  code: string;
  start_date: Date | any;
  expiry_date: Date | any;
}

const FormSchema = Yup.object().shape({
  title: Yup.string().label("Title").max(20).required(),
  discount: Yup.number()
    .min(0)
    .max(100)
    .label("Discount")
    .required()
    .typeError("Enter Discount in number"),
  code: Yup.string().max(8).label("Code").required(),
  start_date: Yup.date()
    .typeError("Start date is required and must be less than expiry date")
    .label("Start Date")
    .required("Start date is required"),
  expiry_date: date()
    .typeError("End date is required and must be greater than start date")
    .min(Yup.ref("start_date"), "End date can't be before start date")
    .required("End date is required"),
});

const initialValues: initialSchemaValues = {
  title: "",
  discount: 0,
  code: "",
  start_date: "",
  expiry_date: "",
};

const PromotionAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getUnits();
    getTaxTypes();
  }, []);

  const getUnits = () => {
    GetUnits().then((res) => {
      if (res && !res.error) {
        console.log(res);
        setUnitOptions(res.data);
      } else {
      }
    });
  };

  const getTaxTypes = () => {
    GetTaxTypes().then((res) => {
      if (res && !res.error) {
        console.log(res);
        setTaxTypeOptions(res.data);
      } else {
      }
    });
  };
  const handleGenerateCode = (setFieldValue: any) => {
    backendCall({
      url: `/api/vendor/promotion/generate_code`,
      method: "GET",
    }).then((res: any) => {
      if (res && !res.error) {
        setFieldValue("code", res?.data?.code);
        console.log("res ===", res);
      }
      setIsLoading(false);
    });
  };

  const handleSubmit = (values: any) => {
    console.log("values ==", values);
    var dataSet = { ...values };
    dataSet.start_date = String(
      moment(dataSet.start_date).format("yyyy-MM-DD")
    );
    dataSet.expiry_date = String(
      moment(dataSet.expiry_date).format("yyyy-MM-DD")
    );
    if (dataSet) {
      setIsLoading(true);
      backendCall({
        url: "/api/vendor/promotion",
        method: "POST",
        data: dataSet,
      }).then((res) => {
        if (res && !res.error) {
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate("/promotions/promotionsList");
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
          setFieldTouched,
          setFieldValue,
        }) => (
          <Form className="space-y-6 mt-4 ">
            <CustomCard styleClass="p-4">
              <div className="flex flex-wrap justify-between  items-center">
                <div className="text-left">
                  {/* <p className="text-gray-900 flex gap-1">
                    <span>Dashboard</span>/<span>Promotions</span>/
                    <span>Promo Codes</span>
                  </p> */}
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    className="bg-inherit pl-0"
                  >
                    <Link to="/dashboard">
                      <p>Dashboard</p>
                    </Link>
                    <Link to="/promotions/promotionsList">
                      <p>Promotions</p>
                    </Link>
                    {/* <Link to="" className="text-gray"> */}
                    <p>{"Promo Codes"}</p>
                    {/* </Link> */}
                  </Breadcrumbs>

                  <h5 className="font-normal">Promo Codes</h5>
                </div>

                <div className="flex gap-4 sm:ml-auto">
                  <CustomButton
                    handleButtonClick={() =>
                      navigate("/promotions/promotionsList")
                    }
                    type={"button"}
                    label="Cancel"
                    styleClass="btn-gray-light !rounded-md"
                  />
                  <CustomButton
                    isLoading={isLoading}
                    type={"submit"}
                    label="Save"
                    styleClass="btn-black !rounded-md"
                  />
                </div>
              </div>
            </CustomCard>

            <CustomCard styleClass="p-4">
              <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 text-left">
                <Input
                  id="title"
                  name="title"
                  label="Title "
                  type="text"
                  variant="outline"
                  placeholder="Enter Title For promo code"
                  handldChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                  error={errors.title}
                  touched={touched.title}
                />
                <Input
                  id="discount"
                  name="discount"
                  label="Discount %"
                  type="text"
                  variant="outline"
                  placeholder="Discount Percentage"
                  handldChange={handleChange}
                  onBlur={handleBlur}
                  value={values.discount}
                  error={errors.discount}
                  touched={touched.discount}
                />
                <div className="w-full space-y-2 gap-4">
                  <Input
                    id="code"
                    name="code"
                    label="Promo code "
                    type="text"
                    variant="outline"
                    placeholder="Enter Code"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.code}
                    // error={errors.code}
                    touched={touched.code}
                  />
                  <ErrorMessage
                    name={`code`}
                    component={"span"}
                    className="text-xs capitalize text-red-100"
                  />
                </div>
                <div className="w-full space-y-2 gap-4 flex flex-col justify-center">
                  <CustomButton
                    handleButtonClick={() => handleGenerateCode(setFieldValue)}
                    isLoading={isLoading}
                    type={"button"}
                    label="Generate Code"
                    styleClass="btn-black !rounded-md mt-7 w-2/4"
                  />
                  <ErrorMessage
                    name={`code`}
                    component={"span"}
                    className="text-xs capitalize text-transparent"
                  />
                </div>
                <div className="w-full space-y-2">
                  <label
                    htmlFor="start_date"
                    className="text-black-900 text-sm"
                  >
                    Start Date *
                  </label>
                  <div className="relative">
                    <DateTimePicker
                      className={`focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-3`}
                      value={values.start_date}
                      calendarIcon={<DateIcon className="w-5 h-5" />}
                      minDate={new Date()}
                      format={"yyyy-MM-dd"}
                      // placeholderText={"Start date"}
                      // selected={values.start_date}
                      onChange={(e) => {
                        setFieldValue("start_date", e);
                      }}
                    />
                    {/* <DateIcon className="absolute top-0 m-auto bottom-0 right-3" /> */}
                  </div>
                  <ErrorMessage
                    name={`start_date`}
                    component={"span"}
                    className="text-xs capitalize text-red-100"
                  />
                </div>

                <div className="w-full space-y-2">
                  <label
                    htmlFor="expiry_date"
                    className="text-black-900 text-sm"
                  >
                    End Date *
                  </label>
                  <div className="relative">
                    <DateTimePicker
                      className={`focus:outline-transparent bg-gray-light border border-gray-900 text-sm text-black-900 rounded-[4px] block w-full h-13 p-3`}
                      value={values.expiry_date}
                      calendarIcon={<DateIcon className="w-5 h-5" />}
                      minDate={new Date()}
                      format={"yyyy-MM-dd"}
                      // placeholderText={"Expiry date"}
                      // selected={values.expiry_date}
                      onChange={(e) => {
                        setFieldValue("expiry_date", e);
                      }}
                    />
                    {/* <DateIcon className="absolute top-0 m-auto bottom-0 right-3" /> */}
                  </div>
                  <ErrorMessage
                    name={`expiry_date`}
                    component={"span"}
                    className="text-xs capitalize text-red-100"
                  />
                </div>
              </div>
            </CustomCard>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PromotionAdd;
