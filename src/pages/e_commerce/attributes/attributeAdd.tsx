import { getUnit } from "@mui/material/styles/cssUtils";
import { GetTaxTypes, GetUnits } from "@src/shared/apiService";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import AddBlack from "@assets/vendor/icons/add_black.png";
import RemoveBlack from "@assets/vendor/icons/remove_black.png";
import Select from "@src/shared/select/select";
import TextArea from "@src/shared/textArea";
import {
  ErrorMessage,
  FastField,
  Field,
  FieldArray,
  Form,
  Formik,
} from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import { ReactComponent as DateIcon } from "@assets/vendor/icons/datepicker.svg";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IconButton, Switch } from "@mui/material";
import { date, object } from "yup";
import { Spinner } from "@src/shared/spinner/spinner";
import { Breadcrumbs } from "@material-tailwind/react";

export interface initialSchemaValues {
  name: string;
  options: [
    {
      name: string;
    }
  ];
  is_enabled: any;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().max(25).label("Attribute Name").required(),
  options: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .test(
          "len",
          "Attribute Value is required and Value should be less than 25 characters",
          (val: any) => val?.length < 25
        )
        .required("ttribute Value is required"),
    })
  ),
  is_enabled: Yup.boolean().label("Status").required(),
});

const _initialValues: initialSchemaValues = {
  name: "",
  options: [{ name: "" }],
  is_enabled: 0,
};

const AttributeAdd = () => {
  const [initialValues, setInitialValues] = useState(_initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const [unitOptions, setUnitOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    getUnits();
    getTaxTypes();
  }, []);
  useEffect(() => {
    const handleGenerateCode = () => {
      setIsLoading(true);
      backendCall({
        url: `/api/vendor/attributes/${id}`,
        method: "GET",
      }).then((res: any) => {
        if (res && !res.error) {
          let values = {
            name: res?.data?.name,
            options: res?.data?.AttributeOptions?.map(
              (n: { name: any; id: any }) => {
                return {
                  name: n.name,
                  id: n.id,
                };
              }
            ),
            is_enabled: res?.data?.is_enabled,
          };
          console.log("res att id ==", values);
          setInitialValues(values);
        }
        setIsLoading(false);
      });
    };
    if (id) {
      handleGenerateCode();
    }
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

  const onChangeFields = (values: any, setValues: any, index?: number) => {
    // update dynamic form
    const options = [...values.options];
    console.log("values ==", values);
    console.log("values ==", options);
    if (index) {
      options.splice(index, 1);
    } else {
      options.push({
        name: "",
      });
    }
    setValues({ ...values, options });
  };
  const handleSubmit = (values: any) => {
    console.log("values ==", values);
    // const options = [...values.options];
    // console.log("values ==", values);
    // console.log("values ==", options);
    // // let index=options.findIndex
    // if (index) {
    //   options.splice(index, 1);
    // } else {
    //   options.push({
    //     name: "",
    //   });
    // }
    if (id) {
      setIsLoading(true);
      backendCall({
        url: `/api/vendor/attributes/${id}`,
        method: "PUT",
        data: values,
      }).then((res) => {
        if (res && !res.error) {
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate("/attributes");
        } else {
          setIsLoading(false);
          handleToastMessage("error", res?.message);
        }
      });
    } else {
      setIsLoading(true);
      backendCall({
        url: "/api/vendor/attributes",
        method: "POST",
        data: values,
      }).then((res) => {
        if (res && !res.error) {
          setIsLoading(false);
          handleToastMessage("success", res?.message);
          navigate("/attributes");
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
        enableReinitialize
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleChange,
          handleBlur,
          touched,
          values,
          setValues,
          setFieldTouched,
          setFieldValue,
        }) => {
          const handleChangeValue = (event: any) => {
            console.log("event", event.target.value);
            // setFieldValue(`options.${i}.name`,event.target.value)
          };

          return (
            <Form className="space-y-6 mt-4 ">
              <CustomCard styleClass="p-4">
                <div className="flex flex-wrap justify-between  items-center">
                  <div className="text-left">
                    {/* <p className="text-gray-900 flex gap-1">
                    <span>Dashboard</span>/<span>Attributes</span>
                  </p> */}
                    <Breadcrumbs
                      aria-label="breadcrumb"
                      className="bg-inherit pl-0"
                    >
                      <Link to="/dashboard">
                        <p>Dashboard</p>
                      </Link>
                      <Link to="/attributes">
                        <p>Attributes</p>
                      </Link>
                      {/* <Link to="" className="text-gray"> */}
                      <p>{"Add Attribute"}</p>
                      {/* </Link> */}
                    </Breadcrumbs>

                    <h5 className="font-normal">Attributes</h5>
                  </div>

                  <div className="flex gap-4 sm:ml-auto">
                    <CustomButton
                      handleButtonClick={() => navigate("/attributes")}
                      type={"button"}
                      label="Cancel"
                      styleClass="btn-gray-light !rounded-md"
                    />
                    <CustomButton
                      isLoading={isLoading}
                      type={"submit"}
                      label={id ? "Update" : "Save"}
                      styleClass="btn-black !rounded-md"
                    />
                  </div>
                </div>
              </CustomCard>

              {isLoading ? (
                <Spinner isLoading={isLoading} classname="my-3" />
              ) : (
                <CustomCard styleClass="p-4">
                  <div className="gap-5 grid grid-cols-1 text-left">
                    <Input
                      id="name"
                      name="name"
                      label="Attribute Name "
                      type="text"
                      variant="outline"
                      placeholder="Enter attribute name"
                      handldChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      error={errors.name}
                      touched={touched.name}
                    />
                  </div>
                  <FieldArray name="option">
                    {() =>
                      values.options.map((name: any, i: any) => {
                        return (
                          // <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 text-left mt-3">
                          <div className="space-y-2 gap-4 flex w-full">
                            <div className="w-[80%] mt-2 text-left">
                              <Input
                                id={`options.${i}.name`}
                                name={`options.${i}.name`}
                                label="Attribute Value "
                                type="text"
                                variant="outline"
                                placeholder="Add value"
                                handldChange={handleChange}
                                  // (event: any) => {
                                  
                                  // setFieldValue(
                                  //   `options.${i}.name`,
                                  //   event.target.value
                                  // );
                                  // const Options = [...values.options];
                                  // let index=Options.findIndex((option:any)=>{option.name==event.target.value})
                                  
                                  // console.log("values ==", values);
                                  // console.log("values ==", Options);
                                  // if (index) {
                                  //   Options.splice(index, 1);
                                  // } else {
                                  //   Options.push({
                                  //     name: "",
                                  //   });
                                  // }
                                  // }
                                  // setValues({ ...values, Options });
                                
                              
                                onBlur={handleBlur}
                                value={values.options[i]?.name}
                                touched={
                                  touched?.options && touched?.options[i]?.name
                                }
                              />
                              <ErrorMessage
                                name={`options.${i}.name`}
                                component={"span"}
                                className="text-xs text-red-100 pt-1"
                              />
                            </div>
                            <div className="w-[20%] flex">
                              {i == 0 && (
                                <CustomButton
                                  handleButtonClick={() =>
                                    onChangeFields(values, setValues)
                                  }
                                  icon={
                                    <img className="w-6 h-6" src={AddBlack} />
                                  }
                                  label="Add Attribute value"
                                  labelClass="font-normal pl-2"
                                  type={"button"}
                                  styleClass="btn-white !bg-transparent !rounded-lg !border-[1px] w-full  md:w-full sm:w-full mt-7"
                                />
                              )}
                              {i >= 1 && (
                                <CustomButton
                                  handleButtonClick={() =>
                                    onChangeFields(values, setValues, i)
                                  }
                                  icon={
                                    <img
                                      className="w-6 h-6"
                                      src={RemoveBlack}
                                    />
                                  }
                                  label="Remove Value"
                                  labelClass="font-normal pl-2"
                                  type={"button"}
                                  styleClass="btn-white !bg-transparent !rounded-lg !border-[1px] w-full  md:w-full sm:w-full mt-7"
                                />
                              )}
                            </div>
                          </div>
                          // {/* </div> */}
                        );
                      })
                    }
                  </FieldArray>
                  <div className="gap-5 grid grid-cols-2 sm:grid-cols-1 text-left">
                    <div className="flex items-center">
                      <p className="text-black-900">Status: </p>
                      <Switch
                        id="black"
                        name="is_enabled"
                        checked={values.is_enabled}
                        onChange={(e) => {
                          setFieldValue("is_enabled", e.target.checked ? 1 : 0);
                        }}
                      />
                    </div>
                  </div>
                </CustomCard>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AttributeAdd;
