import LazyImage from "@shared/lazyImage";
import CheckedIcon from "@assets/icons/checked_Icon.png";
import CustomCard from "@shared/cards/customCard";
import { ErrorMessage, Formik } from "formik";
import ImagePicker from "@shared/imagePicker/imagePicker";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import { initialSchemaValues } from "@pages/e_commerce/setting/viewDocument";
import { backendCall } from "@shared/utils/backendService/backendCall";
import { handleToastMessage } from "@shared/toastify";
import CustomButton from "@shared/customButton";
import Input from "@shared/input";
import { Breadcrumbs } from "@material-tailwind/react";

export interface idCardSchema {
  id_card_front: any;
  id_card_back: any;
}
const IdCardFormSchema = Yup.object().shape({
  id_card_front: Yup.mixed().required("id_card_front is required"),
  id_card_back: Yup.mixed().required("id_card_back is required"),
});

export interface bankCardSchema {
  bank_card_front: any;
  bank_card_back: any;
  giro_contract: any;
}
const BankCardFormSchema = Yup.object().shape({
  bank_card_front: Yup.mixed().required("bank_card_front is required"),
  bank_card_back: Yup.mixed().required("bank_card_back is required"),
  giro_contract: Yup.mixed().required("giro_contract is required"),
});

export interface menuCardSchema {
  menu_card: any;
  tax_no: string;
  sales_tax_id: string;
}
const MenuCardFormSchema = Yup.object().shape({
  menu_card: Yup.mixed().required("menu_card is required"),
  tax_no: Yup.string().required("Tax number is required"),
  sales_tax_id: Yup.string().required("Sales Tax ID is required"),
});

const UpdateDocuments = () => {
  const navigate = useNavigate();
  const formikRef = useRef(null);
  const { documentType } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const idCardValues: idCardSchema = {
    id_card_front: null,
    id_card_back: null,
  };

  const bankCardValues: bankCardSchema = {
    bank_card_front: null,
    bank_card_back: null,
    giro_contract: null,
  };

  const menuCardValues: menuCardSchema = {
    menu_card: null,
    tax_no: "",
    sales_tax_id: "",
  };

  const handleSubmit = (values: any) => {
    console.log("values", values);
    setIsLoading(true);
    let apiUrl = "";
    if (documentType === "id_card") {
      apiUrl = "/api/vendor/documents/id_card";
    } else if (documentType === "bank_card") {
      apiUrl = "/api/vendor/documents/bank_card";
    } else {
      apiUrl = "/api/vendor/documents/menu_card";
    }

    backendCall({
      url: `${apiUrl}`,
      method: "PUT",
      data: values,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res?.message);
        setIsLoading(false);
        navigate("/settings/documents");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const handleSubmitOutsideFormik = () => {
    if (formikRef.current) {
      // @ts-ignore
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
                            <span>Dashboard</span>/<span>Settings</span>/
                            <span>Document Verification</span>
                        </p> */}

            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              <Link to="/settings/documents" className="text-gray">
                <p>{"Document Verification"}</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Document Verification</h5>
          </div>

          <div className="flex gap-4 sm:ml-auto">
            <CustomButton
              handleButtonClick={handleSubmitOutsideFormik}
              isLoading={isLoading}
              type={"button"}
              label={"Submit"}
              styleClass="btn-black !rounded-md"
            />
          </div>
        </div>
      </CustomCard>
      {documentType == "id_card" ? (
        <Formik
          innerRef={formikRef}
          initialValues={idCardValues}
          validationSchema={IdCardFormSchema}
          enableReinitialize
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
            setValues,
            setTouched,
            setFieldError,
          }) => {
            const uploadImage = async (field: string, files: any) => {
              console.log("files",files)
              setFieldValue(field, files);
            };

            console.log({ values });

            return (
              <CustomCard styleClass=" flex text-left flex-col gap-4 w-full ">
                <div className="space-y-2 w-full p-4 ">
                  <label htmlFor="unit_id" className="text-sm text-black-900">
                    ID Card (Front)*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("id_card_front", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("id_card_front", true);
                        return uploadImage("id_card_front", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.id_card_front && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          <LazyImage
                            src={URL.createObjectURL(values.id_card_front)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>IDss Card (Front).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.id_card_front?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() => setFieldValue("id_card_front", null)}
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`id_card_front`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>
                  <label
                    htmlFor="id_card_back"
                    className="text-sm text-black-900"
                  >
                    ID Card (Back)*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("id_card_back", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("id_card_back", true);
                        return uploadImage("id_card_back", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.id_card_back && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          {" "}
                          <LazyImage
                            src={URL.createObjectURL(values.id_card_back)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>ID Card (Back).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.id_card_back?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() => setFieldValue("id_card_back", null)}
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`id_card_back`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>
                </div>
              </CustomCard>
            );
          }}
        </Formik>
      ) : documentType == "bank_card" ? (
        <Formik
          innerRef={formikRef}
          initialValues={bankCardValues}
          validationSchema={BankCardFormSchema}
          enableReinitialize
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
            setValues,
            setTouched,
            setFieldError,
          }) => {
            const uploadImage = async (field: string, files: any) => {
              console.log("files",files)
              setFieldValue(field, files);
            };

            console.log({ values });

            return (
              <CustomCard styleClass=" flex text-left flex-col gap-4 w-full ">
                <div className="space-y-2 w-full p-4 ">
                  <label
                    htmlFor="bank_card"
                    className="text-sm  text-black-900"
                  >
                    Bank card Front*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("bank_card_front", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("bank_card_front", true);
                        console.log("bank_card_front",files)
                        return uploadImage("bank_card_front", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.bank_card_front && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          {" "}
                          <LazyImage
                            src={URL.createObjectURL(values.bank_card_front)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>Bank Card (Front).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.bank_card_front?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() =>
                              setFieldValue("bank_card_front", null)
                            }
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`bank_card_front`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>

                  <label
                    htmlFor="bank_card"
                    className="text-sm  text-black-900"
                  >
                    Bank card Back*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("bank_card_back", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("bank_card_back", true);
                        return uploadImage("bank_card_back", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.bank_card_back && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          {" "}
                          <LazyImage
                            src={URL.createObjectURL(values.bank_card_back)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>Bank Card (Back).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.bank_card_back?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() =>
                              setFieldValue("bank_card_back", null)
                            }
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`bank_card_back`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>

                  <label
                    htmlFor="giro_contract"
                    className="text-sm  text-black-900"
                  >
                    Giro Contract *
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("giro_contract", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("giro_contract", true);
                        return uploadImage("giro_contract", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.giro_contract && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          {" "}
                          <LazyImage
                            src={URL.createObjectURL(values.giro_contract)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>Giro Contract.jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.giro_contract?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() => setFieldValue("giro_contract", null)}
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`giro_contract`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>
                </div>
              </CustomCard>
            );
          }}
        </Formik>
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={menuCardValues}
          validationSchema={MenuCardFormSchema}
          enableReinitialize
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
            setValues,
            setTouched,
            setFieldError,
          }) => {
            const uploadImage = async (field: string, files: any) => {
              setFieldValue(field, files);
            };

            console.log({ values });

            return (
              <CustomCard styleClass=" flex text-left flex-col gap-4 w-full ">
                <div className="space-y-2 w-full p-4 ">
                  <label
                    htmlFor="menu_card"
                    className="text-sm  text-black-900"
                  >
                    Menu Card *
                  </label>

                  <div className="w-full">
                    <ImagePicker
                    size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("menu_card", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("menu_card", true);
                        return uploadImage("menu_card", files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage(
                          "error",
                          "please select image of size less than 10mb"
                        );
                      }}
                      touched={true}
                    >
                      <div className="flex p-6 w-full border-[2px] border-dashed flex-col items-center justify-center">
                        <p className="text-gray-900 font-normal text-sm">
                          Drop Your File Here, Or
                          <span className="text-blue-900 cursor-pointer pl-2">
                            Click to browse
                          </span>{" "}
                        </p>
                        <p className="text-gray-900 font-normal text-sm w">
                          {" "}
                          Supports PDF, JPEG, PNG, And DOCX. Max File Size 4MB
                        </p>
                      </div>
                    </ImagePicker>
                    {values.menu_card && (
                      <div className="flex justify-between items-center h-12  rounded bg-gray-100 p-3 text-black-100">
                        <div className="flex items-center gap-6 p-2">
                          {" "}
                          <LazyImage
                            src={URL.createObjectURL(values.menu_card)}
                            className="h-8 w-8 rounded"
                          />
                          <div className="flex flex-col">
                            <p>
                              <span>Giro Contract.jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.menu_card?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() => setFieldValue("menu_card", null)}
                          />
                        </div>
                      </div>
                    )}
                    <ErrorMessage
                      name={`menu_card`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>

                  <div className="flex w-full items-center gap-5">
                    <div className="w-1/2">
                      <Input
                        id={`tax_no`}
                        name={`tax_no`}
                        label="Tax No"
                        type="text"
                        variant="outline"
                        placeholder="Enter Tax Number"
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tax_no}
                        touched={touched.tax_no}
                      />
                      <ErrorMessage
                        name={`tax_no`}
                        component={"span"}
                        className="text-xs text-red-100 pt-1"
                      />
                    </div>

                    <div className="w-1/2">
                      {" "}
                      <Input
                        id={`sales_tax_id`}
                        name={`sales_tax_id`}
                        label="Sales Tax ID "
                        type="text"
                        variant="outline"
                        placeholder="Enter Sales Tax ID "
                        handldChange={handleChange}
                        onBlur={handleBlur}
                        value={values.sales_tax_id}
                        touched={touched.sales_tax_id}
                      />
                      <ErrorMessage
                        name={`sales_tax_id`}
                        component={"span"}
                        className="text-xs text-red-100 pt-1"
                      />
                    </div>
                  </div>
                </div>
              </CustomCard>
            );
          }}
        </Formik>
      )}
    </>
  );
};

export default UpdateDocuments;
