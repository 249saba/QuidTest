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
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@src/index.scss";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import isArray from "lodash/isArray";
import { Breadcrumbs } from "@material-tailwind/react";
export interface initialSchemaValues {
  description: string;
  image: any;
}

const FormSchema = Yup.object().shape({
  description: Yup.string().label("Description"),
  // image: Yup.array()
  //   .notRequired()
  //   .test({
  //     message: "Atleast One Image is required",
  //     test: (val) => (isArray(val) ? val.length > 0 && val.length <= 1 : false),
  //   }),
});
const _initialValues: initialSchemaValues = {
  description: "",
  image: [],
};
const UpdateWhatsNew = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isImage, setisImage] = useState(true);
  const [initialValues, setinitialValues] = useState(_initialValues);
  const navigate = useNavigate();
  const [text, setText] = useState("");

  const handleTextChange = (value: any) => {
    setText(value);
  };
  useEffect(() => {
    getWhatsNewDetail();
  }, []);

  const handleSubmit = (values: any) => {
    console.log("values", values);
    setIsLoading(true);
    const formData = new FormData();
    if (typeof values.image !== "string" && values.image?.[0] !== undefined) {
      values.image.forEach((file: any, index: number) => {
        formData.append("image", file);
      });
    }
    // dangerouslySetInnerHTML={{ __html: item.description }}
    formData.append("description", values.description);
    if(isImage==false){
      formData.append("image", values.image);
    }
   
    backendCall({
      url: `/api/vendor/whatsnew/${id}`,
      method: "PUT",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        navigate(`/settings/whatsNew`);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const getWhatsNewDetail = () => {
    backendCall({
      url: `/api/vendor/whatsnew/${id}`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        const { description, image_url } = res?.data;
        let initalValues = {
          description: description,
          image: image_url,
        };
        setinitialValues(initalValues);
        setIsLoading(false);
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
          }) => {
            const uploadImage = async (field: string, files: any) => {
              setFieldValue(field, files);
              setisImage(false);
            };
            return (
              <Form className="space-y-6 mt-4 p-4  ">
                <CustomCard styleClass="p-4">
                  <div className="flex  justify-between  gap-2">
                    <div className="text-left ">
                      {/* <p className="text-gray-900 flex gap-1">
                        <span>Dashboard</span>/<span>Settings</span>/
                        <span>What's New</span>
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
                        <Link to="/settings/whatsNew" className="text-gray">
                          <p>{"What's New"}</p>
                        </Link>
                        <Link to="" className="text-gray">
                          <p>{"Update What's New"}</p>
                        </Link>
                      </Breadcrumbs>

                      <h6 className="font-normal">Edit What's New</h6>
                    </div>
                    <div className="flex gap-4">
                      <CustomButton
                        isLoading={isLoading}
                        type={"submit"}
                        label={"Update"}
                        styleClass="btn-black !rounded-md"
                      />
                    </div>
                  </div>
                </CustomCard>
                <div className="space-y-5 text-left pb-4">
                  <div className="flex flex-col gap-3 text-left text-editor text-black-100 w-full h-40">
                    {/* <p className="text-sm text-black-900 font-medium">
                      Description
                    </p> */}
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
                  </div>
                  <div className="space-y-4 w-full gap-2 ">
                    {/* <p className="text-sm text-black-900 font-medium">
                      Upload Image
                    </p> */}

                    <div className="w-full">
                      {/* <ImagePicker
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
                          return uploadImage("image", files[0]);
                        }}
                        onSizeError={(error) => {
                          handleToastMessage("error", "please select image of size less than 10mb");
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
                      </ImagePicker> */}
                      <div className="flex">
                        {
                          <LazyImage
                            src={
                              isImage
                                ? import.meta.env.VITE_REACT_API_URL +
                                  "/" +
                                  values.image
                                : URL.createObjectURL(values.image)
                            }
                            className="w-[490px] h-24 object-cover "
                          />
                        }
                      </div>
                    </div>

                    <div className="flex   w-[20%]">
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
                          return uploadImage("image", files[0]);
                        }}
                        onSizeError={(error) => {
                          handleToastMessage("error", "please select image of size less than 10mb");
                        }}
                        touched={true}
                      >
                             <CustomButton
                        type={"button"}
                        // handleButtonClick={(files: any) => {
                        //   setFieldTouched("images", true);
                        //   return uploadImage(files);
                        // }}
                        label="Replace Image"
                        styleClass="btn-white !rounded-md w-full !border-gray-900 text-black-100 font-medium"
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
export default UpdateWhatsNew;
