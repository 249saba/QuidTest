import ContentContainer from "@src/containers/contentContainer";
import * as Yup from "yup";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import Input from "@src/shared/input";
import Select from "@src/shared/select/select";

import { TiDropbox } from "react-icons/ti";
import Radio from "@src/shared/radio/radio";
import Checkbox from "@src/shared/checkbox/checkbox";

import AddGray from "@src/assets/vendor/icons/add_gray.png";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import CustomButton from "@src/shared/customButton";
import { useNavigate } from "react-router-dom";

export interface initialSchemaValues {
  fullName: string;
  country: string;
  shopAddress: string;
  postalCode: number | undefined | "";
  contactInformation: {
    email: string | undefined;
    phone: string | undefined;
  };
  billingAddress: {
    sameAsShipping: string;
  };
  note: string;
  termsAndConditions: boolean;
}

const FormSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  country: Yup.string().required("Select atleast one option"),
  shopAddress: Yup.string().label("Email").required(),
  postalCode: Yup.number().required(),
  contactInformation: Yup.object().shape({
    email: Yup.string().label("Email").required(),
    phone: Yup.string().label("Email").required(),
  }),
  billingAddress: Yup.object().shape({
    sameAsShipping: Yup.string(),
  }),
  note: Yup.string(),
  termsAndConditions: Yup.boolean()
    .oneOf([true], "Please accept terms and conditions")
    .required(""),
});

const initialValues: initialSchemaValues = {
  fullName: "",
  country: "",
  shopAddress: "",
  postalCode: "",
  contactInformation: {
    email: "",
    phone: "",
  },
  billingAddress: {
    sameAsShipping: "no",
  },
  note: "",
  termsAndConditions: false,
};

const options = [
  { value: "Pk", label: "Pakistan" },
  { value: "IND", label: "India" },
  { value: "AU", label: "Australia" },
];
const PaymentDetails = () => {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/selectShopType");
  };

  return (
    <ContentContainer styleClass="sm:!h-full h-screen login-gradient ">
      <h4 className=" font-semibold text-left"> Payment Details</h4>
      <div>
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
              <div className="flex gap-10 sm:flex-col md:flex-wrap ">
                <div className="space-y-5 text-left w-full">
                  <Input
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    variant="outline"
                    placeholder="Enter Full ID"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.fullName}
                    error={errors.fullName}
                    touched={errors.fullName}
                  />

                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm text-black-900">
                      Country *
                    </label>

                    <Select
                      options={options}
                      id="country"
                      name="country"
                      placeholder="Select Your Country"
                      onChange={(value: any) => {
                        console.log(value);
                        setFieldTouched("country", true);
                        setFieldValue("country", value.value.label);
                      }}
                      onBlur={handleBlur}
                      value={values.country}
                    />
                    {touched.country && errors.country && (
                      <p className="text-xs text-red-100">{errors.country}</p>
                    )}
                  </div>

                  <Input
                    id="shopAddress"
                    name="shopAddress"
                    label="Ecommerce Shop Address "
                    type="text"
                    variant="outline"
                    placeholder="Select Your Country"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.shopAddress}
                    error={errors.shopAddress}
                    touched={errors.shopAddress}
                  />

                  <Input
                    id="postalCode"
                    name="postalCode"
                    label="Postal Code "
                    type="text"
                    variant="outline"
                    placeholder="Enter Postal Code"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.postalCode}
                    error={errors.postalCode}
                    touched={errors.postalCode}
                  />

                  <h6 className="font-medium">Contact Information</h6>

                  <Input
                    id="contactInformation.email"
                    name="contactInformation.email"
                    label="Email "
                    type="text"
                    variant="outline"
                    placeholder="Enter Email ID"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.contactInformation.email}
                    error={errors?.contactInformation?.email}
                    touched={errors?.contactInformation?.email}
                  />
                </div>
                <div className="space-y-5 text-left w-full">
                  <Input
                    id="contactInformation.phone"
                    name="contactInformation.phone"
                    label="Phone "
                    type="text"
                    variant="outline"
                    placeholder="Enter your 11 digits phone number"
                    handldChange={handleChange}
                    onBlur={handleBlur}
                    value={values.contactInformation.phone}
                    error={errors?.contactInformation?.phone}
                    touched={errors?.contactInformation?.phone}
                  />

                  <div className="space-y-5">
                    <h6 className="font-medium">Billing Details</h6>
                    <Checkbox
                      id={values.billingAddress.sameAsShipping}
                      key={Math.random()}
                      name={values.billingAddress.sameAsShipping}
                      value={values.billingAddress.sameAsShipping}
                      label="Same as shipping address"
                    />
                  </div>

                  <div className="space-y-3 pt-3">
                    <h6 className="font-medium">Additional Options</h6>
                    <div className="flex items-center">
                      <LazyImage src={AddGray} className="w-6 h-6"></LazyImage>
                      <Input
                        id="note"
                        name="note"
                        type="text"
                        placeholder="Add a note to this order"
                        handldChange={handleChange}
                        inputClassName="bg-transparent border-none"
                        onBlur={handleBlur}
                        value={values.note}
                        error={errors.note}
                        touched={errors.note}
                      />
                    </div>
                  </div>

                  <h6 className="font-medium">Terms & Conditions</h6>

                  <div className="flex gap-1 items-center">
                    <Checkbox
                      id={String(values.termsAndConditions)}
                      key={Math.random()}
                      name={String(values.termsAndConditions)}
                    />
                    <p className="text-xs text-gray-900">
                      I accept the{" "}
                      <a href="javascript:void(0)" className="text-blue-900">
                        Terms & Conditions*
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 flex-col text-left w-full">
                  <h6 className="font-medium">Your Order</h6>

                  {/* <div> */}
                  <div className="flex flex-col gap-2  w-full">
                    <div className="flex justify-between items-center">
                      <p className="text-black-900 font-normal">Package</p>
                      <p className="text-black-900 font-normal">Total</p>
                    </div>
                    <SeperatorLine className="!border-gray-500 !mt-0" />
                    <div className="flex justify-between items-center">
                      <p className="text-gray-900 font-normal">D1 Premium</p>
                      <p className="text-gray-900 font-normal">100$/Year</p>
                    </div>
                    <SeperatorLine className="!border-gray-500 !mt-0" />
                    <div className="flex justify-between items-center">
                      <p className="text-black-900 font-normal">Total</p>
                      <p className="text-black-900 font-normal">100$/Year</p>
                    </div>
                  </div>

                  <div className="flex flex-col text-left w-full mt-3">
                    <h6 className="font-medium pb-5">Payment Method</h6>
                  </div>

                  <CustomButton
                    label="Confirm"
                    styleClass="btn-black w-full !rounded-md"
                    type={"button"}
                    handleButtonClick={() => handleSubmit()}
                  />

                  {/* </div> */}
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </ContentContainer>
  );
};

export default PaymentDetails;
