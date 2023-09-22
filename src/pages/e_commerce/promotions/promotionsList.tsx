import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { ProductsModel, PromotionsModel } from "@src/shared/models";
import CircleCross from "@assets/icons/circle-delete.png";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import MoreIcon from "@assets/vendor/icons/more.png";
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
import Popup from "@src/shared/popup/popup";
import { handleToastMessage } from "@src/shared/toastify";

const PromotionList = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const navigate = useNavigate();
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const [promoDetail, setPromoDetail] = useState<any>({});
  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  // useEffect(() => {
  //   getPromotions();
  // }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getPromotions();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue]);

  const getPromotions = () => {
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/promotion/?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
      dataModel: PromotionsModel,
    }).then((res) => {
      if (res && !res.error) {
        setProductsList(res.data);
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

  const onView = (id: string) => {
    setIsLoading(true);
    setIsView(true);
    backendCall({
      url: `/api/vendor/promotion/${id}`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setPromoDetail(res?.data);
        console.log("res ===", res);
      }
      setIsLoading(false);
    });
    console.log("delete Clicked ==", id);
  };
  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setPromoId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/promotion/${promoId}`,
      method: "DELETE",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        getPromotions();
        setIsOpenDeletePopup(false);
      }
    });

    console.log("Delete item ID ==", promoId);
  };
  const columns = [
    {
      title: (
        <div className="ml-8 flex justify-start items-center">
          <span className="font-semibold">{"Title"}</span>
        </div>
      ),
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (name: string, row: any) => (
        <p
          className="text-sm text-black-900 flex justify-start ml-8"
          title={`${promoDetail?.title || ""}`}
        >
          {" "}
          {name}
        </p>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Promo Code"}</span>
        </div>
      ),
      dataIndex: "code",
      key: "code",
      width: 200,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">{row.code}</div>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Date"}</span>
        </div>
      ),
      dataIndex: "expiry_date",
      key: "expiry_date",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-sm text-black-900"> {name}</p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Action"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center">
          <ViewIcon
            className={"cursor-pointer"}
            onClick={() => onView(row?.id)}
          />
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
            <p className="font-semibold ">This Promo Code?</p>
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
      {isView ? (
        <>
          <CustomCard styleClass="p-4">
            <div className="flex justify-between flex-wrap items-center">
              <div className="text-left">
                {/* <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Promotions</span>/
                  <span>Promo Codes</span>
                </p> */}
                <Breadcrumbs
                  aria-label="breadcrumb"
                  className="bg-inherit pl-0"
                >
                  <Link to="/dashboard">
                    <p>Dashboard</p>
                  </Link>
                  <Link to="/promotions/promotionsList">
                    <p>Promotions</p>
                  </Link>
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"Promo Codes"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h5 className="font-normal"> Promo Codes</h5>
              </div>

              <div className="flex gap-4 sm:ml-auto">
                <CustomButton
                  handleButtonClick={() => setIsView(false)}
                  type={"button"}
                  label="Back to Promo"
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
                <h5 className="font-normal"> Promo Codes Detail</h5>
                <div className="flex mt-4">
                  <div className="border-r-2 flex-1">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Title : </h6>
                      <p
                        className="text-gray-400 ml-4 w-52 truncate"
                        title={`${promoDetail?.title || ""}`}
                      >
                        {promoDetail?.title}
                      </p>
                    </div>
                    <div className="flex justify-start items-center mt-2">
                      <h6>Code : </h6>
                      <p className="text-gray-400 ml-4">{promoDetail?.code}</p>
                    </div>
                  </div>
                  <div className="border-r-2 flex-1 ml-4 flex-col flex  items-center">
                    <div>
                      <div className="flex justify-start items-center mt-2">
                        <h6>Start Date : </h6>
                        <p className="text-gray-400 ml-4">
                          {promoDetail?.start_date}
                        </p>
                      </div>
                      <div className="flex justify-start items-center mt-2">
                        <h6>Expire Date : </h6>
                        <p className="text-gray-400 ml-4">
                          {promoDetail?.expiry_date}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" flex-1 ml-4 flex-col flex  items-center  ">
                    <div className="flex justify-start items-center mt-2">
                      <h6>Discount % : </h6>
                      <p className="text-gray-400 ml-4">
                        {promoDetail?.discount} %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                  <span>Promo Codes</span>
                </p> */}
                <Breadcrumbs
                  aria-label="breadcrumb"
                  className="bg-inherit pl-0"
                >
                  <Link to="/dashboard">
                    <p>Dashboard</p>
                  </Link>
                  <Link to="/promotions/promotionsList">
                    <p>Promotions</p>
                  </Link>
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"Promo Codes"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h5 className="font-normal"> Promo Codes</h5>
              </div>

              <div className="flex gap-4 sm:ml-auto">
                <CustomButton
                  handleButtonClick={() => navigate("/promotions/addPromotion")}
                  type={"button"}
                  label="New Promo Code"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="sm:rounded-none">
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
              data={productsList.rows}
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
              totalCount={productsList.count}
            />
          </CustomCard>
        </>
      )}
    </>
  );
};

export default PromotionList;
