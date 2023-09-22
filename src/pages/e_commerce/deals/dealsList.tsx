import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { DealsModel, ProductsModel, PromotionsModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import { ReactComponent as TwentyFourHR } from "@assets/icons/twentyfourHR.svg";
import HotDeals from "@assets/icons/Hot-Deals.png";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import MoreIcon from "@assets/vendor/icons/more.png";
import {
  Breadcrumbs,
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
import { GetDealTypes } from "@src/shared/apiService";
import moment from "moment";
import { ButtonGroup, Button } from "@mui/material";
import { handleToastMessage } from "@src/shared/toastify";
import CircleCross from "@assets/icons/circle-delete.png";
import Popup from "@src/shared/popup/popup";
import { formatedDate } from "@src/shared/dateFormat";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import ProductDealList from "./productDealList";
import AllCategory from "./dealCategory";
import ProductList from "./productList";

const DealsList = () => {
  const [dealsList, setDealsList] = useState([]) as any;
  const [dealTypeOptions, setDealTypeOptions] = useState([]);
  const [categoryData, setcategoryData] = useState<any>({});
  const [selectedDealId, setSelectedDealId] = useState(1);
  const [productData, setProductData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isproductList, setIsProductList] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [activeTabId, setActiveTabId] = useState(1);
  const [promoId, setPromoId] = useState("");
  const [promoDetail, setPromoDetail] = useState<any>({});
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  // useEffect(() => {
  //   getDeals();
  // }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getDeals();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue, selectedDealId]);

  useEffect(() => {
    getDealTypes();
  }, []);

  const getDealTypes = () => {
    GetDealTypes().then((res) => {
      if (res && !res.error) {
        setDealTypeOptions(res.data);
      } else {
      }
    });
  };

  const getDeals = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/deals/${selectedDealId}?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
      dataModel: DealsModel,
    }).then((res) => {
      if (res && !res.error) {
        // let dealsArray: any = [];
        // res.data.rows.map((items: any) => {
        //   items.VendorDealCategories.map((item: any) => {
        //     let _deals = item.Products.map((product: any) => {
        //       return {
        //         id: product?.VendorDealProduct?.id,
        //         productName: product.name,
        //         category: product.Category?.name,
        //         image: product?.DefaultVariant?.ProductImages[0]?.image_url,
        //         date: item?.createdAt,
        //         discount: items?.discount,
        //         startTime: items?.start_time,
        //         endTime: items?.end_time,
        //         deal: items?.Deal?.name,
        //       };
        //     });
        //     dealsArray.push(_deals);
        //   });
        // });
        // let temp: any = [];
        // dealsArray.forEach((item: any) => {
        //   item.forEach((i: any) => {
        //     temp.push(i);
        //   });
        // });
        setDealsList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
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
  const handleTab = (id: any) => {
    setActiveTabId(id);
    setSelectedDealId(id);
  };
  const handleProductList = (data: any) => {
    setProductData(data);
    setIsProductList(!isproductList);
  };
  const onView = (data: any) => {
    console.log("delete Clicked ==", data);
    setIsLoading(true);
    setPromoDetail(data);
    setIsView(true);
    let id = data?.id;
    backendCall({
      url: `/api/vendor/deals/get_deal_by_id/${data?.id}`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setcategoryData(res?.data);
        console.log("res ===", res);
      }
      setIsLoading(false);
    });
    console.log("delete Clicked ==", data);
  };
  console.log("categoryData", categoryData);
  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setPromoId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/deals/${promoId}`,
      method: "DELETE",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        getDeals();
        setIsOpenDeletePopup(false);
      }
    });
  };
  console.log("promoDetail", promoDetail);
  const columns = [
    {
      title: (
        <div className=" flex items-center ml-6 justify-center">
          <span className="font-semibold">{"Title"}</span>
        </div>
      ),
      dataIndex: "Title",
      key: "Title",
      width: 50,
      render: (name: string, row: any) => (
        <div className="flex gap-3 ml-4 justify-center items-center">
          <div className="text-sm text-black-900">
            {row.title}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className=" flex items-center ml-6 justify-start">
          <span className="font-semibold">{"Start Date"}</span>
        </div>
      ),
      dataIndex: "Start_Date",
      key: "Start_Date",
      width: 50,
      render: (name: string, row: any) => (
        <div className="flex gap-3 ml-4 justify-start items-center">
          <div className="text-sm text-black-900">
            {formatedDate(row.start_time)}
          </div>
        </div>
      ),
    },

    {
      title: (
        <div className=" flex items-center justify-center">
          <span className="font-semibold">{"Expiray Date"}</span>
        </div>
      ),
      dataIndex: "Expiray_Date",
      key: "Expiray_Date",
      width: 50,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">
          {formatedDate(row.end_time)}
        </div>
      ),
    },
    {
      title: (
        <div className=" flex items-center justify-center">
          <span className="font-semibold">{"Discount (%)"}</span>
        </div>
      ),
      dataIndex: "discount",
      key: "discount",
      width: 50,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">{row.discount}%</div>
      ),
    },

    {
      title: (
        <div className=" flex items-center justify-center">
          <span className="font-semibold">{"Delivery Type"}</span>
        </div>
      ),
      dataIndex: "Delivery_Type",
      key: "Delivery_Type",
      width: 50,
      render: (name: string, row: any) => {
        return row.delivery_type?.map((type: any) => (
          <div className="text-sm text-black-900">{type}</div>
        ));
      },
    },

    // {
    //   title: (
    //     <div className=" flex ">
    //       <span>{"End Time"}</span>
    //     </div>
    //   ),
    //   dataIndex: "end_time",
    //   key: "end_time",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <p className="text-sm text-black-900">
    //       {moment(name).utc().format("DD-MM-YYYY HH:MM")}
    //     </p>
    //   ),
    // },

    {
      title: (
        <div className=" flex items-center justify-center">
          <span className="font-semibold">{"Action"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center">
          <ViewIcon className={"cursor-pointer"} onClick={() => onView(row)} />
          <DeleteIcon
            className={"cursor-pointer"}
            onClick={() => onDelete(row?.id)}
          />
        </div>
      ),
    },
  ];
  return (
    <>
      <Popup
        isOpen={isOpenDeletePopup}
        handleClose={() => setIsOpenDeletePopup(false)}
        isShowHeader={true}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <LazyImage src={CircleCross} className="h-[220px] mt-6" />
          <h5 className="font-semibold mt-5">Are you sure?</h5>
          <div className="flex flex-col justify-center items-center">
            <p className="font-medium ">
              Are you sure you want to <span className="font-bold">Delete</span>{" "}
            </p>
            <p className="font-semibold ">This Deal?</p>
          </div>

          <div className="space-y-3 mt-8 flex justify-around w-4/5">
            <CustomButton
              handleButtonClick={() => setIsOpenDeletePopup(false)}
              label={"No"}
              type={"button"}
              variant={"outlined"}
              styleClass={
                "btn-gray-light w-full  !rounded-xl !font-medium mr-2 "
              }
            />
            <CustomButton
              handleButtonClick={handleDelete}
              label={"Yes, Delete"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"}
            />
          </div>
        </div>
      </Popup>
      {isproductList ? (
        <ProductList
          productData={productData}
          handleProductList={handleProductList}
        />
      ) : isView ? (
        <>
          <CustomCard styleClass="p-4">
            <div className="flex justify-between flex-wrap items-center">
              <div className="text-left">
                {/* <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Promotions</span>/
                  <span>Deal Details</span>
                </p> */}
                <Breadcrumbs
                  aria-label="breadcrumb"
                  className="bg-inherit pl-0"
                >
                  <Link to="/dashboard">
                    <p>Dashboard</p>
                  </Link>
                  <Link to="">
                    <p onClick={() => setIsView(false)}>Promotions</p>
                  </Link>
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"Deal Details"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h5 className="font-normal"> Deal Details</h5>
              </div>

              <div className="flex gap-4 sm:ml-auto">
                <CustomButton
                  handleButtonClick={() => setIsView(false)}
                  type={"button"}
                  label="Back to Deals"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="p-4 sm:rounded-none">
            {isLoading ? (
              <Spinner isLoading={isLoading} classname="my-3" />
            ) : (
              <div className="text-left">
                <h5 className="font-normal"> View Deal</h5>
                <div className="flex mt-4 ml-4">
                  {" "}
                  <div className="flex justify-start items-center mt-2">
                    <h6>Title : </h6>
                    <p className="text-gray-400 ml-4">{promoDetail?.title}</p>
                  </div>
                </div>
                <div className="flex mt-4">
                  <div className=" flex-1 ml-4 border-r-2">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Start Date : </h6>
                      <p className="text-gray-400 ml-4">
                        {formatedDate(promoDetail?.start_time)}
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 ml-4 border-r-2">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Expiry Date : </h6>
                      <p className="text-gray-400 ml-4">
                        {formatedDate(promoDetail?.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 ml-4 border-r-2">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Discount: </h6>
                      <p className="text-gray-400 mx-4">
                        {promoDetail?.discount}%
                      </p>
                    </div>
                  </div>
                  <div className=" flex-1 ml-4 ">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Delivery Type: </h6>
                      {promoDetail?.delivery_type.map((type: any) => (
                        <p className="text-gray-400 mx-4">
                          {type}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CustomCard>
          <CustomCard styleClass="p-4 sm:rounded-none">
            {isLoading ? (
              <Spinner isLoading={isLoading} classname="my-3" />
            ) : (
              <>
                {" "}
                <div className="text-left">
                  <h5 className="font-normal"> Category</h5>
                </div>
                <div className="flex flex-col text-black-900 justify-between pt-5">
                  {categoryData?.VendorDealCategories?.map(
                    (category: any, index: Number) => (
                      <>
                        {" "}
                        <div
                          className="flex font-medium justify-between items-center h-12 px-5 cursor-pointer"
                          onClick={() => {
                            handleProductList(category);
                          }}
                        >
                          <p>
                            <span>{category?.Category?.name}</span>
                          </p>
                          <img src={ArrowRight} className="w-5 h-5" />
                        </div>{" "}
                        <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
                      </>
                    )
                  )}
                </div>
              </>
            )}
          </CustomCard>
        </>
      ) : (
        <>
          <CustomCard styleClass="p-4">
            <div className="flex justify-between flex-wrap items-center">
              <div className="text-left">
                {/* <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Promotions</span>/
                  <span>Deals</span>
                </p> */}
                <Breadcrumbs
                  aria-label="breadcrumb"
                  className="bg-inherit pl-0"
                >
                  <Link to="/dashboard">
                    <p>Dashboard</p>
                  </Link>
                  <Link to="">
                    <p>Promotions</p>
                  </Link>
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"Deal"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h5 className="font-normal"> Deals</h5>
              </div>

              <div className="flex gap-4 sm:ml-auto">
                <CustomButton
                  handleButtonClick={() => navigate("/promotions/addDeal")}
                  type={"button"}
                  label="Add New Deal"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>

          <CustomCard styleClass="sm:rounded-none">
            <div className="text-left px-4 pt-4 flex">
              {dealTypeOptions.map((deal: any) => (
                <p
                  className={`text-gray-900  flex cursor-pointer mx-2 ${
                    activeTabId === deal?.id
                      ? "border-red-300 border-b-2 !text-black-900 font-medium"
                      : null
                  }`}
                  onClick={() => handleTab(deal?.id)}
                >
                  {" "}
                  {deal?.image_url  ? (
                    <LazyImage src={ import.meta.env
                      .VITE_REACT_API_URL +
                      "/" +deal?.image_url} className="w-8 h-8" />
                 ): (
                    ""
                  )}
                  {deal?.label}
                </p>
              ))}
            </div>
            <div className="p-4">
              <Input
                leftIcon={<FiSearch className="text-gray-900 h-6 w-6" />}
                id="searchValue"
                name="searchValue"
                inputClassName="!h-9"
                type="text"
                variant="outline"
                placeholder="Start typing to search for products"
                onChange={(e) =>
                  setFilterValue({
                    ...filterValue,
                    searchValue: e.target.value,
                  })
                }
              />
            </div>

            <Spinner isLoading={isLoading} classname="my-3" />
            <Table
              tableLayout="fixed"
              columns={columns as any}
              emptyText={"No data found"}
              data={dealsList}
              rowKey="id"
              scroll={{ x: 1000 }}
              sticky={true}
              className="matrix"
              onHeaderRow={() => ({
                className: "header-title",
              })}
            />
            <Pagination
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              totalCount={dealsList.count}
            />
          </CustomCard>
        </>
      )}
    </>
  );
};
export default DealsList;
