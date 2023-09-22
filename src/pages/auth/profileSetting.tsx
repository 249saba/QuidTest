import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import LazyImage from "@src/shared/lazyImage";
import PersonIcon from "@assets/vendor/icons/person.png";
import React, { useState, useEffect } from "react";
import { Form, Formik, useFormik } from "formik";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import ImagePicker from "@src/shared/imagePicker/imagePicker";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { STORAGE } from "@src/shared/const";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { useNavigate } from "react-router-dom";
import { addUpdateUser } from "../inbox/firebaseChat";
const _initialValues1 = {
  image: [],
  first_name: "",
  last_name: "",
  email: "",
};
const _initialValues2 = {
  new_password: "",
  confirm_password: "",
};
const ProfileSetting = () => {
  const [avatar, setAvatar] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [initialValues1, setInitialValues1] = useState(_initialValues1);
  const [initialValues2, setInitialValues2] = useState(_initialValues2);
  const _data: any = localStorage.getItem(STORAGE);
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(_data);
    let initialData = {
      image: data?.image_url,
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
    };
    setInitialValues1(initialData);
    console.log("localStorage.getItem(STORAGE) ==", data);
  }, [_data]);

  const handleSubmit1 = (_values: any) => {
    setIsLoading1(true);
    const formData = new FormData();
    if (typeof _values.image !== "string" && _values.image?.[0] !== undefined) {
      formData.append("first_name", _values?.first_name);
      formData.append("last_name", _values?.last_name);
      _values.image.forEach((file: any) => {
        formData.append(`image`, file);
      });
    } else {
      formData.append("first_name", _values?.first_name);
      formData.append("last_name", _values?.last_name);
    }
    backendCall({
      url: "/api/vendor/update_profile",
      method: "PUT",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        const _data: any = localStorage.getItem(STORAGE);
        const data = JSON.parse(_data);
        const storageData = {
          ...data,
          ...res?.data,
        };
        let dataSet = res.data;
        if (dataSet.email) {
          let _userFirebaseData = {
            id: dataSet.id + "_vendor",
            userEmail: dataSet.email,
            online: true,
            userDisplayName: `${dataSet.first_name + " " + dataSet.last_name}`,
            userPhotoUrl: dataSet.image_url ? dataSet.image_url : "",
          };
          addUpdateUser(_userFirebaseData);
        }
        localStorage.setItem(STORAGE, JSON.stringify(storageData));
        console.log(res);
        setIsLoading1(false);
        handleToastMessage("success", res?.message);
        navigate("/dashboard");
      } else {
        setIsLoading1(false);
        handleToastMessage("error", res?.message);
      }
    });
    console.log("profile Form 1==", _values);
  };
  const handleSubmit2 = (_values: any) => {
    console.log("profile Form 2 ==", _values);
    setIsLoading2(true);
    const formData = new FormData();

    formData.append("new_password", _values?.new_password);
    backendCall({
      url: "/api/vendor/change_password",
      method: "PUT",
      data: formData,
    }).then((res) => {
      if (res && !res.error) {
        console.log(res);
        setIsLoading2(false);
        handleToastMessage("success", res?.message);
        navigate("/dashboard");
      } else {
        setIsLoading2(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const handleUploadClick = (files: any, setFieldValue: any) => {
    const fileReader: any = new FileReader();
    const myFiles = Array.from(files);
    fileReader.onload = () => {
      if (fileReader.readyState === 2) {
        setAvatar(fileReader.result);
      }
    };
    setFieldValue("image", files);
    fileReader.readAsDataURL(files[0]);
    // onUploadImage(myFiles);
  };
  return (
    <ShellContainer className="gap-4 overflow-scroll">
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-gray-900 flex gap-1">
              <span>Profile settings</span>
            </p>

            <h5 className="font-normal"> Profile </h5>
          </div>
        </div>
      </CustomCard>
      <Formik
        initialValues={initialValues1}
        enableReinitialize
        // validationSchema={FormSchema1}
        onSubmit={handleSubmit1}
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
        }) => {
          return (
            <Form className="space-y-6" autoComplete="off">
              <div className="flex-1">
                <CustomCard>
                  <div className=" h-52 bg-[#F4F4F4] rounded-md relative">
                    <div className="absolute top-[10%] left-[40%]">
                      <ImagePicker
                        className="flex-1"
                        error={errors.image as string}
                        value={values.image}
                        resetValue={() => {
                          setFieldValue("image", []);
                        }}
                        removeImage={(index) => {
                          const temp_profile: any = values.image;
                          temp_profile.splice(index, 1);
                          setFieldValue("image", temp_profile);
                        }}
                        onChange={(files) => {
                          setFieldTouched("image", true);
                          return handleUploadClick(files, setFieldValue);
                        }}
                        onSizeError={(error) => {
                          handleToastMessage(
                            "error",
                            "please select image of size less than 10mb"
                          );
                        }}
                        touched={true}
                      >
                        <div className="relative">
                          <div className="absolute top-40 left-28 bg-white p-3 rounded-full border-2 cursor-pointer">
                            <PencilIcon />
                          </div>
                          {!avatar ? (
                            <LazyImage
                              src={
                                import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                values?.image
                              }
                              className="h-40 w-40 mt-14  border-2 rounded-full"
                            />
                          ) : (
                            <LazyImage
                              src={avatar}
                              className="h-40 w-40 mt-14  border-2 rounded-full"
                            />
                          )}
                        </div>
                      </ImagePicker>
                    </div>
                  </div>
                  <div className="bg-[#FFF] h-16 rounded-md" />
                </CustomCard>
              </div>
              <CustomCard styleClass="p-4">
                <div className="text-left">
                  <h4>Basic Information</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 justify-between  text-left mt-4">
                  <Input
                    id="first_name"
                    name="first_name"
                    label="First Name "
                    type="text"
                    variant="outline"
                    placeholder="Enter First name"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    error={errors.first_name}
                    touched={touched.first_name}
                  />
                  <Input
                    id="last_name"
                    name="last_name"
                    label="Last name "
                    type="text"
                    variant="outline"
                    placeholder="Enter Last name"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                    error={errors.last_name}
                    touched={touched.last_name}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-5 justify-between  text-left mt-4">
                  <Input
                    id="email"
                    name="email"
                    label="Email"
                    type="text"
                    variant="outline"
                    placeholder="email"
                    handldChange={handleChange}
                    readOnly
                    onBlur={handleBlur}
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                  />
                </div>

                <div className=" text-right mt-4">
                  <CustomButton
                    isLoading={isLoading1}
                    type={"submit"}
                    label={"Save changes"}
                    styleClass="btn-black !rounded-md"
                  />
                </div>
              </CustomCard>
            </Form>
          );
        }}
      </Formik>
      <Formik
        initialValues={initialValues2}
        enableReinitialize
        // validationSchema={FormSchema1}
        onSubmit={handleSubmit2}
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
        }) => {
          return (
            <Form className="space-y-6" autoComplete="off">
              <CustomCard styleClass="p-4">
                <div className="text-left">
                  <h4>Change Password</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-5 justify-between  text-left mt-4">
                  <Input
                    id="new_password"
                    name="new_password"
                    label="New Password "
                    type="password"
                    variant="outline"
                    placeholder="Enter New Password"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.new_password}
                    error={errors.new_password}
                    touched={touched.new_password}
                  />
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    label="Confirm Password "
                    type="password"
                    variant="outline"
                    placeholder="Enter Confirm Password"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirm_password}
                    error={errors.confirm_password}
                    touched={touched.confirm_password}
                  />
                </div>

                <div className=" text-right mt-4">
                  <CustomButton
                    isLoading={isLoading2}
                    type={"submit"}
                    label={"Save changes"}
                    styleClass="btn-black !rounded-md"
                  />
                </div>
              </CustomCard>
            </Form>
          );
        }}
      </Formik>
    </ShellContainer>
  );
};

export default ProfileSetting;
