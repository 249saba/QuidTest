import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import CheckedIcon from "@assets/icons/checked_Icon.png";
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import "@src/index.scss";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { useState, useEffect } from "react";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import SeperatorLine from "@src/shared/seperator/seperatorLine";

export interface initialSchemaValues {
  id_card_front:any,
  id_card_back:any,
  bank_card_front:any,
  bank_card_back:any,
  giro_contract:any,
  menu_card:any,
  tax_no: string;
  sales_tax_id: string;
}
const FormSchema = Yup.object().shape({
  id_card_front:Yup.mixed().required('id_card_front is required'),
  id_card_back:Yup.mixed().required('id_card_back is required'),
  bank_card_front:Yup.mixed().required('bank_card_front is required'),
  bank_card_back:Yup.mixed().required('bank_card_back is required'),
  giro_contract:Yup.mixed().required('giro_contract is required'),
  menu_card:Yup.mixed().required('menu_card is required'),
  tax_no: Yup.string().required("Tax number is required"),
  sales_tax_id: Yup.string().required("Sales Tax ID is required"),
});

const ViewDocument = ({ handleViewDocument }: any) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const _initialValues: initialSchemaValues = {
    id_card_front:null,
    id_card_back:null,
    bank_card_front:null,
    bank_card_back:null,
    giro_contract:null,
    menu_card:null,
    tax_no: "",
    sales_tax_id: "",
  };

  const handleSubmit = (values:any) => {
    setIsLoading(true);
   
    backendCall({
      url: `/api/vendor/submit_documents`,
      method: "POST",
      data: values,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res?.message);
        setIsLoading(false);
        navigate("/dashboard");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const value = 0.66;
  return (
    <>
      <div className="flex  justify-between items-center  gap-2">
        <div className="flex flex-col text-left ">

          <p className="font-medium"> Upload documents</p>
          <p className="text-gray-900 pt-3">
            Before You Can Sign Your Contract, We Need Extra Information From
            You To Draw Up The Contract.
          </p>
          <p className="text-gray-900">
            The Document Is Saved Immediately After Uploading.
          </p>
        </div>
        <div className=" pr w-16 h-16">
          <CircularProgressbar styles={buildStyles({
            // Rotation of path and trail, in number of turns (0-1)
            rotation: 0.25,

            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: 'butt',

            // Text size
            textSize: '16px',


            // How long animation takes to go from one percentage to another, in seconds
            pathTransitionDuration: 0.5,

            // Can specify path transition in more detail, or remove it entirely
            // pathTransition: 'none',

            // Colors
            pathColor: 'lightgreen',
            textColor: 'lightgreen',
            trailColor: '',
            backgroundColor: 'lightgreen',
          })} value={value} maxValue={1} text={`${value * 100}%`} />
        </div>
      </div>

      <Formik
        initialValues={_initialValues}
        validationSchema={FormSchema}
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
            <Form className=" ">
              <CustomCard styleClass=" flex text-left flex-col gap-4 w-full ">
                <div className="flex pt-6 px-6 gap-3 items-center">
                  <LazyImage src={CheckedIcon} className="w-5 h-5" />
                  <p className=" font-medium text-black-900 ">
                    ID Card (Front/Back) *
                  </p>
                </div>
                <SeperatorLine className="rotate-10 w-full !border-gray-300" />

                <div className="space-y-2 w-full p-4 ">
                  <label htmlFor="unit_id" className="text-sm text-black-900">
                    ID Card (Front)*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("id_card_front", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("id_card_front", true);
                        return uploadImage("id_card_front",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                              <span>ID Card (Front).jpg</span>
                            </p>
                            <p>
                              <span className="text-gray-500">{Math.floor(values.id_card_front?.size/1024)}kb</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DeleteIcon
                            className={"cursor-pointer"}
                            onClick={() =>  setFieldValue("id_card_front", null)}
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
                  <label htmlFor="id_card_back" className="text-sm text-black-900">
                    ID Card (Back)*
                  </label>

                  <div className="w-full">
                    <ImagePicker
                      size={5}
                      className="flex-1"
                      resetValue={() => {
                        setFieldValue("id_card_back", null);
                      }}
                      onChange={(files) => {
                        setFieldTouched("id_card_back", true);
                        return uploadImage("id_card_back",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                            onClick={() =>  setFieldValue("id_card_back", null)}
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



                  <div className="w-full bg-[#cdcdec] h-12 items-center flex gap-2 px-2">
                    <LazyImage src={CheckedIcon} className="w-5 h-5" />
                    <p className="font-medium text-black-100">Bank card or Giro Contract *</p>
                  </div>
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
                        return uploadImage("bank_card_front",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                            onClick={() =>  setFieldValue("bank_card_front", null)}
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
                        return uploadImage("bank_card_back",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                            onClick={() =>  setFieldValue("bank_card_back", null)}
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
                  <p className="flex items-start gap-3 text-black-100 capitalize font-medium whitespace-nowrap text-xs !my-4 sm:!my-4  ">
                      <SeperatorLine className="rotate-10 w-full border-gray-100" />{" "}
                      Or 
                      <SeperatorLine className="rotate-10 w-full border-gray-100" />
                    </p>

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
                        return uploadImage("giro_contract",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                            onClick={() =>  setFieldValue("giro_contract", null)}
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


                  <div className="w-full bg-[#cdcdec] h-12 items-center flex gap-2 px-2">
                    <LazyImage src={CheckedIcon} className="w-5 h-5" />
                    <p className="font-medium text-black-100">Menu Card With Allergy *</p>
                  </div>

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
                        return uploadImage("menu_card",files[0]);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select image of size less than 4mb");
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
                            onClick={() =>  setFieldValue("menu_card", null)}
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
              <div className="flex w-full items-center gap-3 pt-4">
                <div className="">
                  <CustomButton
                    label="Confirm"
                    labelClass="font-semibold"
                    type={"submit"}
                    styleClass="btn-black !rounded-lg   w-64"
                  />
                </div>

                <div className="">
                  {" "}
                  <CustomButton
                    label="Skip"
                    labelClass="font-semibold"
                    type={"button"}
                    handleButtonClick={()=>navigate("/dashboard")}
                    styleClass="btn-white !rounded-md w-64 !border-gray-300 text-black-100 font-semibold"
                  />
                </div>
              </div>
            </Form>

          )



        }}
      </Formik>
    </>
  );
};

export default ViewDocument;
