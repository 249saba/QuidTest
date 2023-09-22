import LazyImage from "@src/shared/lazyImage";
import { ProductsModel, ViewOrderModal } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import CircleCross from "@assets/icons/circle-delete.png";
import CancelOrder from "@assets/icons/cancel_order.png";
import { useEffect, useState } from "react";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ErrorMessage, FastField, Field, Form, Formik } from "formik";
import Select from "@src/shared/select/select";
import Input from "@src/shared/input";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";
import CustomButton from "@src/shared/customButton";
import CustomCard from "@src/shared/cards/customCard";
import moment from "moment";
import * as Yup from "yup";
import TextArea from "@src/shared/textArea";
import { Breadcrumbs } from "@material-tailwind/react";
export interface initialSchemaValues {
  // deal_id: string | object;
  description: string;
}

const FormSchema = Yup.object().shape({
  // deal_id: Yup.object().label("deal_id").required("Deal type  is required"),
  description: Yup.string().label("Description").required(),
});
const orderStateOptions = [
  {
    label: "SHIPPED",
    value: "SHIPPED",
  },
  {
    label: "DELIVERED",
    value: "DELIVERED",
  },
];
const initialValues: initialSchemaValues = {
  // deal_id: "",
  description: "",
};
const ViewOrder = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(false);
  const [btnLabel, setBtnLAbel] = useState("Accept");
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const [orderState, setOrderState] = useState("");
  const [orderStatus, setorderStatus] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  let id = searchParams.get("id");
  // let status = searchParams.get("status");
  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  // useEffect(() => {
  //   getProducts();
  // }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getProducts();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue]);

  const getProducts = () => {
    let id = searchParams.get("id");
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/orders/${id}`,
      method: "GET",
      dataModel: ViewOrderModal,
    }).then((res) => {
      console.log("product ===", res);
      if (res && !res.error) {
        console.log(res);
        setProductsList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleSubmit = (values: any) => {
    console.log("values", values);
    let id = searchParams.get("id");
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/orders/${id}/accept_reject`,
      method: "PUT",
      data: { state: "REJECTED", rejection_reason: values.description },
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        navigate("/orders");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
  const onEdit = (id: string) => {
    console.log("onEdit Clicked ==", id);
    navigate(`/products/addProduct/${id}`);
  };

  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setPromoId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/product/${promoId}`,
      method: "DELETE",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        getProducts();
        setIsOpenDeletePopup(false);
      }
    });

    console.log("Delete item ID ==", promoId);
  };
  console.log("productsList", productsList);
  const handleBtnStatus = () => {
    setIsCancel(true);
  };
  const handleStatus = () => {
    setIsLoading(true);
    let id = searchParams.get("id");
    backendCall({
      url: `/api/vendor/orders/${id}/accept_reject`,
      method: "PUT",
      data: { state: "ACCEPTED" },
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        navigate("/orders");
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };

  const handleOrderState = () => {
    if(orderStatus==""){
      handleToastMessage("error","Please select order status");
      return;
    }
    backendCall({
      url: `/api/vendor/orders/${id}/${orderStatus}`,
      method: "PUT",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res?.message);
      } else {
        handleToastMessage("error", res?.message);
      }
    });
  };

  console.log("status", productsList?.status);
  // console.log("status",searchParams.get("state"))
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>All Orders</span>/
              <span>Order Details</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link
                to={`/orders/?state=${
                  searchParams.get("status") === "PENDING" ? "PENDING" : "ALL"
                }`}
              >
                <p>{(searchParams.get("status") || "").toLowerCase()} Orders</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"Order Details"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal">Order Details</h5>
          </div>
          {searchParams.get("state") !== "ALL" ? (
            <div className="flex gap-4 sm:ml-auto">
              <CustomButton
                handleButtonClick={() => {
                  handleBtnStatus();
                }}
                type={"button"}
                label="Cancel"
                styleClass="btn-gray-light !rounded-md"
              />
              <CustomButton
                isLoading={isLoading}
                type={"submit"}
                label={btnLabel}
                styleClass="btn-black !rounded-md"
                handleButtonClick={() => {
                  handleStatus();
                }}
              />
            </div>
          ) : productsList?.status !== "PENDING" ? (
            <div className="flex gap-4 sm:ml-auto">
              {" "}
              <CustomButton
                handleButtonClick={() => {
                  navigate("/orders/?state=ALL");
                }}
                type={"button"}
                label="Cancel"
                styleClass="btn-gray-light !rounded-md"
              />
              <CustomButton
                isLoading={isLoading}
                type={"submit"}
                label={"Update"}
                styleClass="btn-black !rounded-md"
                handleButtonClick={() => {
                  handleOrderState();
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </CustomCard>
      <CustomCard styleClass="sm:rounded-none">
        {/* <Formik
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
            <Form className="space-y-6 mt-4 p-4  ">
              {btnLabel == "Update" ? (
                <div className="space-y-5 text-left pb-4">
                  <div className="space-y-2 ">
                    <label
                      htmlFor="category_id"
                      className="text-sm text-black-900"
                    >
                      Change Status
                    </label>
                    <Select
                      // options={categoryOptions}
                      id="category_id"
                      name="category_id"
                      // value={categoryOptions.map((item: any) => {
                      //   if (item?.id === values?.category_id) {
                      //     return { label: item?.label };
                      //   }
                      // })}
                      placeholder="Select To Change Sstatus"
                      onChange={(value: any) => {
                        setFieldTouched("category_id", true);
                        setFieldValue("category_id", value.id);
                      }}
                      onBlur={handleBlur}
                      onFocus={() => {
                        setFieldTouched("category_id", true);
                      }}
                    />
                    <ErrorMessage
                      name={`category_id`}
                      component={"span"}
                      className="text-xs capitalize text-red-100"
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </Form>
          )}
        </Formik> */}
        <div className="p-4 flex flex-col text-start gap-5 justify-evenly">
          {productsList?.status ? (
            productsList?.status != "PENDING" &&
            productsList?.status != "REJECTED" ? (
              <div className="flex flex-col gap-2 w-full ">
                <label htmlFor="unit_id" className="text-sm text-black-900">
                  Order Status
                </label>
                <Select
                  options={orderStateOptions}
                  value={orderState}
                  placeholder="Select Your Order Status"
                  onChange={(value: any) => {
                    console.log("value ==", value);
                    setOrderState(value);
                    setorderStatus(value.value);
                    // handleOrderState(value);
                  }}
                />
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <h6 className="text-green-500 ">
            Order ID : <span>{productsList?.order_code}</span>
          </h6>
          <div className="flex gap-10 items-center justify-between">
            <div className="border-gray-300 flex flex-col justify-start h-20">
              <div className="font-normal  flex items-center gap-2  ">
                <span className="text-black-900 font-semibold">
                  Customer Name :
                </span>
                <span className="text-gray-500">{productsList?.user_name}</span>
              </div>
              <div className="font-normal  flex items-center gap-2">
                <span className="text-black-900 font-semibold">Phone No :</span>
                <span className="text-gray-500">{productsList?.phone}</span>
              </div>
            </div>
            {/* <p className="h-20 text-gray-300">|</p> */}
            <div className="border-l-2 border-gray-300 flex flex-col justify-start pl-10 pr-20">
              <div className="font-normal  flex items-center gap-2 ">
                <span className="text-black-900 font-semibold">City :</span>
                <span className="text-gray-500">
                  {productsList?.shipping_address}
                </span>
              </div>
              <div className="font-normal  flex items-center gap-2">
                <span className="text-black-900 font-semibold">Date :</span>
                <span className="text-gray-500">
                  {moment(productsList?.date).utc().format("DD-MM-YYYY")}
                </span>
              </div>
              <div className="font-normal  flex items-center gap-2">
                <span className="text-black-900 font-semibold">Time :</span>
                <span className="text-gray-500">
                  {moment(productsList?.date).format("hh:mm:ss A")}
                </span>
              </div>
            </div>
            <div className="border-l-2 border-gray-300 flex flex-col justify-start pl-10 pr-32">
              <div className="font-normal  flex items-center gap-2">
                <span className="text-black-100 font-semibold">Address :</span>
                <span className="text-gray-500">
                  {productsList?.shipping_address}
                </span>
              </div>
            </div>
          </div>
          <h6 className="text-gray-400 ">Order Details</h6>

          <div className="font-normal  flex items-center gap-2  ">
            <span className="text-black-900 font-semibold">Order Status :</span>
            <span
              className={
                productsList?.status == "PENDING"
                  ? "text-white-500 bg-orange-500  rounded px-2 py-1"
                  : productsList?.status == "REJECTED"
                  ? "text-white-100  bg-red-100  rounded px-2 py-1"
                  : "text-white-100 bg-green-500  rounded px-2 py-1"
              }
            >
              {productsList?.status}
            </span>
          </div>
          {console.log("productsList ==", productsList)}
          {productsList?.OrderLines?.map((product: any) => (
            <div className="flex justify-between items-center border-b-2 border-gray-300 pb-10">
              <div className="border-gray-300 flex justify-start flex-col h-20">
                <div className="font-normal  flex items-start gap-2  ">
                  <span className="text-black-900 font-semibold">
                    Product Image :
                  </span>
                  {/* <span className="text-gray-500" >{"John Doe"}</span> */}
                  <LazyImage
                    src={
                      import.meta.env.VITE_REACT_API_URL +
                      "/" +
                      product?.ProductVariant?.cover_image_url
                    }
                    alt="image"
                    className="h-20 w-20 rounded"
                  />
                </div>
              </div>
              {/* <p className="h-20 text-gray-300">|</p> */}
              <div className="border-l-2 border-gray-300 flex justify-start flex-col pl-10 pr-20">
                <div className="font-normal  flex items-center gap-2 ">
                  <span className="text-black-900 font-semibold">
                    Quantity :
                  </span>
                  <span className="text-gray-500">{product?.quantity}</span>
                </div>
                <div className="font-normal  flex items-center gap-2">
                  <span className="text-black-900 font-semibold">
                    Total Price :
                  </span>
                  <span className="text-gray-500">{product?.price}</span>
                </div>
                <div className="font-normal  flex items-center gap-2">
                  <span className="text-black-900 font-semibold">Color :</span>
                  <span className="text-gray-500">
                    {
                      product?.ProductVariant?.ProductOptions[1]
                        ?.AttributeOption?.name
                    }
                  </span>
                </div>
              </div>
              <div className="border-l-2 border-gray-300 flex justify-start flex-col pl-10 pr-32">
                <div className="font-normal  flex items-center gap-2 ">
                  <span className="text-black-900 font-semibold">
                    Product Name :
                  </span>
                  <span className="text-gray-500">
                    {product?.ProductVariant?.Product.name}
                  </span>
                </div>
                <div className="font-normal  flex items-center gap-2">
                  <span className="text-black-900 font-semibold">
                    Category :
                  </span>
                  <span className="text-gray-500">
                    {product?.ProductVariant?.Product?.Category?.name}
                  </span>
                </div>
                <div className="font-normal  flex items-center gap-2">
                  <span className="text-black-900 font-semibold">Size :</span>
                  <span className="text-gray-500">
                    {
                      product?.ProductVariant?.ProductOptions[0]
                        ?.AttributeOption?.name
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Spinner isLoading={isLoading} classname="my-3" />
      </CustomCard>
      <Popup
        isOpen={isCancel}
        handleClose={() => setIsCancel(false)}
        isShowHeader={true}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <LazyImage src={CircleCross} className=" mt-6" />
          <h5 className="font-semibold mt-5">Are you sure?</h5>
          <div className="flex flex-col justify-center items-center">
            <p className="font-medium ">
              Are you sure you want to <span className="font-bold">Cancel</span>{" "}
            </p>
            <p className="font-medium ">This Order</p>
            <br />
            <p className="font-semibold ">
              Order ID #{productsList?.order_code}
            </p>
            {/* <p className="font-semibold "> {id}</p> */}
          </div>

          <div className="space-y-3 mt-8 flex justify-around w-4/5">
            <CustomButton
              handleButtonClick={() => setIsCancel(false)}
              label={"Close"}
              type={"button"}
              variant={"outlined"}
              styleClass={
                "btn-gray-light w-full  !rounded-xl !font-medium mr-2 "
              }
            />
            <CustomButton
              handleButtonClick={() => {
                setIsCancel(false);
                setCancelOrder(true);
              }}
              label={"Yes, Cancel"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"}
            />
          </div>
        </div>
      </Popup>
      <Popup
        isOpen={cancelOrder}
        handleClose={() => setCancelOrder(false)}
        isShowHeader={true}
      >
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
            setFieldValue,
            setFieldTouched,
          }) => (
            <Form className="space-y-6  mt-8 ">
              <div className="flex flex-col justify-center items-center gap-3">
                <LazyImage src={CancelOrder} className=" mt-6" />
                {/* <h5 className="font-semibold mt-5">Are you sure?</h5> */}
                <div className="flex flex-col justify-center items-center">
                  <p className="font-medium ">
                    <span className="font-bold">Cancellation</span>{" "}
                  </p>
                  {/* <p className="font-semibold ">This Order?</p> */}
                  <p className="font-normal text-gray-500">
                    kindly give reason for Cancellation
                  </p>
                </div>
              </div>
              <div className="space-y-3 ">
                <div className="flex items-center">
                  {" "}
                  <TextArea
                    name="description"
                    className="w-[500px]"
                    id="description"
                    onChange={handleChange}
                    placeholder="Enter your Reason Here"
                    onBlur={handleBlur}
                    value={values.description}
                  ></TextArea>
                  {errors.description && touched.description && (
                    <p className="my-2 text-xs text-start text-red-600 font-bold">
                      *{errors.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center">
                <CustomButton
                  handleButtonClick={() => setCancelOrder(false)}
                  label={"Close"}
                  type={"button"}
                  variant={"outlined"}
                  styleClass={
                    "btn-gray-light w-full  !rounded-xl !font-medium mr-2 "
                  }
                />
                <CustomButton
                  // handleButtonClick={handleLogout}
                  label={"Cancel Order"}
                  type={"submit"}
                  variant={"outlined"}
                  styleClass={
                    "btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"
                  }
                />
              </div>
            </Form>
          )}
        </Formik>
      </Popup>
    </>
  );
};
export default ViewOrder;
