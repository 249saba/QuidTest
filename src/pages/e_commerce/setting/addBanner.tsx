import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { Link, useNavigate } from "react-router-dom";
import Select from "@src/shared/select/select";
import { handleToastMessage } from "@src/shared/toastify";
import Switch from "@mui/material/Switch";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import Popup from "@src/shared/popup/popup";
import Input from "@src/shared/input";
import VideoPicker from "@src/shared/videoPicker/videoPicker";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
export interface initialSchemaValues {
  name: string;
  image: [];
  video: [];
}

const FormSchema = Yup.object().shape({
  name: Yup.string().label("name").required(),
  image: Yup.array().test(
    "is-one-image",
    "Exactly one image is required",
    (value) => {
      return value?.length === 1;
    }
  ),
  // video: Yup.array()
  //   .test("is-one-video", "Exactly one video is required", (value) => {
  //     return (
  //       value?.length === 1 &&
  //       value[0] instanceof File &&
  //       value[0].type.startsWith("video/")
  //     );
  //   })
  //   .nullable(),
});
const initialValues: initialSchemaValues = {
  name: "",
  image: [],
  video: [],
};
const AddBanners = ({ handleBanner }: any) => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (values: any) => {
    setIsLoading(true);
    const formData = new FormData();
    if (typeof values.image !== "string" && values.image?.[0] !== undefined) {
      values.image.forEach((file: any, index: number) => {
        formData.append("image", file);
      });
    }
    if (typeof values.video !== "string" && values.video?.[0] !== undefined) {
      values.video.forEach((file: any, index: number) => {
        formData.append("video", file);
      });
    }
    formData.append("name", values.name);
    backendCall({
      url: `/api/vendor/banners`,
      method: "POST",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        handleBanner();
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
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
          setFieldTouched,
          setFieldValue,
        }) => {
          const uploadImage = async (files: any) => {
            setFieldValue("image", files);
          };
          const uploadVideo = async (files: any) => {
            setFieldValue("video", files);
          };
          return (
            <Form className="space-y-6 mt-4 p-4  ">
              <CustomCard styleClass="p-4">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    {/* <p className="text-gray-900 flex gap-1">
                      <span>Dashboard</span>/<span>Settings</span>/
                      <span>Banners Setup</span>
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
                        <p onClick={handleBanner}>{"Banners Setup"}</p>
                      </Link>
                    </Breadcrumbs>

                    <h5 className="font-normal"> Banners Setup</h5>
                  </div>

                  <div className="flex gap-4 sm:ml-auto">
                    <CustomButton
                      handleButtonClick={handleBanner} // This should handle cancel action
                      type={"button"}
                      label="Cancel"
                      styleClass="btn-gray-light !rounded-md"
                    />
                    <CustomButton
                      isLoading={isLoading}
                      type={"submit"}
                      label={"Submit"}
                      styleClass="btn-black !rounded-md"
                    />
                  </div>
                </div>
              </CustomCard>
              <div className="space-y-5 text-left pb-4">
                <div className="space-y-2 ">
                  <Input
                    id="name"
                    name="name"
                    label="Title"
                    type="text"
                    variant="outline"
                    placeholder="Add Banner Title"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                  />
                </div>
                <div className="space-y-4 w-full gap-4 ">
                  <p className="text-sm text-black-900">Upload Image</p>

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
                    </ImagePicker>
                    <ErrorMessage
                      name={`image`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>
                  {/* <div className="flex   w-1/2">
                          <CustomButton
                            type={"button"}
                            // handleButtonClick={(files: any) => {
                            //   setFieldTouched("images", true);
                            //   return uploadImage(files);
                            // }}
                            label="Upload Image"
                            styleClass="btn-black !rounded-md"
                          />
                        </div> */}
                  <p className="text-gray-900 text-center w-1/2">Or</p>
                  <p className="text-sm text-black-900">Upload Video</p>

                  <div className="w-full">
                    <VideoPicker
                      className="flex-1"
                      // error={errors.images as string}
                      // value={values.images}
                      resetValue={() => {
                        setFieldValue("video", []);
                      }}
                      // removeImage={(index) => {
                      //   const temp_images: any = values.images;
                      //   temp_images.splice(index, 1);
                      //   setFieldValue("images", temp_images);
                      // }}
                      onChange={(files) => {
                        setFieldTouched("video", true);
                        return uploadVideo(files);
                      }}
                      onSizeError={(error) => {
                        handleToastMessage("error", "please select video of size less than 10mb");
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
                    </VideoPicker>
                    <ErrorMessage
                      name={`video`}
                      component={"span"}
                      className="text-xs text-red-100 pt-1"
                    />
                  </div>
                  <div className="flex   w-1/2">
                    <CustomButton
                      type={"button"}
                      // handleButtonClick={(files: any) => {
                      //   setFieldTouched("images", true);
                      //   return uploadImage(files);
                      // }}
                      label="Upload Image"
                      styleClass="btn-black !rounded-md"
                    />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default AddBanners;
