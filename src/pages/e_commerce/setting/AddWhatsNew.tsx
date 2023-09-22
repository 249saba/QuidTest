import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import TextArea from "@src/shared/textArea";
import imageLogo from "@assets/icons/imageLogo.png";
import { Fragment } from "react";
import Select from "@src/shared/select/select";
import Checkbox from "@src/shared/checkbox/checkbox";
import * as Yup from "yup";
import { FiSearch } from "react-icons/fi";
import Input from "@src/shared/input";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@src/index.scss";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { Breadcrumbs } from "@material-tailwind/react";
export interface initialSchemaValues {
  description: string;
  image: any;
}

const FormSchema = Yup.object().shape({
  description: Yup.string().label("Description"),
  image: Yup.array().test(
    "is-one-image",
    "Exactly one image is required",
    (value) => {
      return !value || value.length === 1;
    }
  ),
});
const initialValues: initialSchemaValues = {
  description: "",
  image: [],
};
const AddWhatsNew = ({ handleNew }: any) => {
  const navigate = useNavigate();
  //   const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [text, setText] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (values: any) => {
    setIsLoading(true);
    const formData = new FormData();
    if (typeof values.image !== "string" && values.image?.[0] !== undefined) {
      values.image.forEach((file: any, index: number) => {
        formData.append("image", file);
      });
    }
    formData.append("description", values.description);
    backendCall({
      url: `/api/vendor/whatsnew`,
      method: "POST",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        handleNew();
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  return (
    <>
      <CustomCard styleClass="p-4">
        <Formik
          initialValues={initialValues}
          validationSchema={FormSchema}
          enableReinitialize={true}
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
          }) => {
            const uploadImage = async (files: any) => {
              setFieldValue("image", files);
            };
            return (
              <Form className="space-y-6  p-4  ">
                <CustomCard styleClass="p-4">
                  <div className="flex  justify-between  gap-2">
                    <div className="text-left ">
                      {/* <p className="text-gray-900 flex gap-1">
                        <span>Dashboard</span>/<span>Settings</span>/
                        <span>What's New</span>/<span>What's New</span>
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
                        <Link to="" className="text-gray">
                          <p>{"What's New"}</p>
                        </Link>
                      </Breadcrumbs>
                      <h6 className="font-normal">What's New</h6>
                    </div>
                    <div className="flex gap-4">
                      <CustomButton
                        isLoading={isLoading}
                        type={"submit"}
                        label={"Save"}
                        styleClass="btn-black !rounded-md w-40 h-8"
                      />
                    </div>
                  </div>
                </CustomCard>
                <div className="space-y-5 text-left pb-4">
                  <div className="flex flex-col gap-3 text-left text-editor text-black-100 w-full h-40">
                    {/* <p className="text-sm text-black-900 font-medium">
                      Description
                    </p> */}{" "}
                    {/* <ReactQuill
                      value={values.description}
                      id="description"
                      onChange={(value: any) => {
                        console.log("value",value);
                        setFieldValue("description", value);
                      }}
                      modules={{
                        toolbar: [
                          // [{ header: [1, 2, 3, false] }],
                          ["bold", "italic", "underline"],
                          // [{ list: 'ordered' }, { list: 'bullet' }],
                          [
                            { align: "" },
                            { align: "center" },
                            { align: "right" },
                            { align: "justify" },
                          ],
                        ],
                      }}
                      formats={["bold", "italic", "underline", "align"]}
                    /> */}
                    <TextArea
                      name="description"
                      className="w-full"
                      id="description"
                      onChange={handleChange}
                      labelClassName="!text-black-900 !font-medium"
                      // placeholder="Enter your Reason Here"
                      label="Description"
                      onBlur={handleBlur}
                      value={values.description}
                    ></TextArea>
                    <ErrorMessage
                      name={`description`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>
                  <div className="space-y-4 w-full gap-4 ">
                    <p className="text-sm text-black-900 font-medium">
                      Upload Image
                    </p>

                    <div className="w-full">
                      <ImagePicker
                        className="flex-1"
                        // error={errors.images as string}
                        // value={values.images}
                        resetValue={() => {
                          setFieldValue("image", []);
                        }}
                        // removeImage={(index) => {
                        //   const temp_images: any = values.images;
                        //   temp_images.splice(index, 1);
                        //   setFieldValue("images", temp_images);
                        // }}
                        onChange={(files) => {
                          setFieldTouched("image", true);
                          return uploadImage(files);
                        }}
                        onSizeError={(error) => {
                          handleToastMessage(
                            "error",
                            "please select image of size less than 10mb"
                          );
                        }}
                        touched={true}
                      >
                        <div className="p-6 border-[2px] border-dashed border-gray-400 w-1/2">
                          <p className="text-gray-900 font-normal text-sm">
                            Drop your images here, Or{" "}
                            <span className="text-blue-900 cursor-pointer">
                              Click to browse
                            </span>{" "}
                            1200*600 (3:4) Recommended, Up to 10MB Each
                          </p>
                        </div>
                      </ImagePicker>
                      <ErrorMessage
                        name={`image`}
                        component={"span"}
                        className="text-xs capitalize text-red-100"
                      />
                    </div>

                    <div className="flex   w-1/2">
                      <ImagePicker
                        className="flex-1"
                        // error={errors.images as string}
                        // value={values.images}
                        resetValue={() => {
                          setFieldValue("image", []);
                        }}
                        // removeImage={(index) => {
                        //   const temp_images: any = values.images;
                        //   temp_images.splice(index, 1);
                        //   setFieldValue("images", temp_images);
                        // }}
                        onChange={(files) => {
                          setFieldTouched("image", true);
                          return uploadImage(files);
                        }}
                        onSizeError={(error) => {
                          handleToastMessage(
                            "error",
                            "please select image of size less than 10mb"
                          );
                        }}
                        touched={true}
                      >
                        {values.image[0] && (
                          <div className="flex">
                            <LazyImage
                              // src={import.meta.env.VITE_REACT_API_URL +
                              //   "/" +
                              //   values.image}
                                src={URL.createObjectURL(values.image[0])}
                              className="w-[490px] h-24 object-cover "
                            />
                          </div>
                        )}

                        <CustomButton
                          type={"button"}
                          // handleButtonClick={(files: any) => {
                          //   setFieldTouched("images", true);
                          //   return uploadImage(files);
                          // }}
                          label="Upload Image"
                          styleClass="btn-black !rounded-md"
                        />
                      </ImagePicker>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </CustomCard>
    </>
  );
};

export default AddWhatsNew;
