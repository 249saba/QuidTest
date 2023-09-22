import LazyImage from "@src/shared/lazyImage";
import { OrderModel, ProductsModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import CircleCross from "@assets/icons/circle-delete.png";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import MoreIcon from "@assets/vendor/icons/more.png";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import moment from "moment";
import Input from "@src/shared/input";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";
import CustomButton from "@src/shared/customButton";
import CustomCard from "@src/shared/cards/customCard";
import { Breadcrumbs } from "@material-tailwind/react";

const MyOrdersList = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    getProducts();
  }, []);
  let status = searchParams.get("state");
  useEffect(() => {
    getProducts();
  }, [status]);
  console.log("status", status);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getProducts();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue]);

  const getProducts = () => {
    setIsLoading(true);
    console.log(filterValue);
    let status = searchParams.get("state");
    backendCall({
      url: status
        ? `/api/vendor/orders?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc&state=${status}`
        : `/api/vendor/orders?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc&state=ALL`,
      method: "GET",
      dataModel: OrderModel,
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
  console.log("productsList", productsList);
  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
  const onEdit = (id: any, status: any) => {
    console.log("onEdit Clicked ==", id);
    let _status = searchParams.get("state");
    navigate({
      search: `?id=${id}&status=${status}&state=${_status}`,
      pathname: "/orders/viewOrder",
    });
    // navigate(`/orders/viewOrder`);
    // navigate("/orders/viewOrder");
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
  const columns = [
    {
      title: (
        <div className="ml-4 flex justify-start items-center">
          <span className="font-semibold">{"Customer"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 80,
      render: (name: string, row: any) => (
        <div className="flex  items-center ml-4 justify-start">
          {/*           
          <LazyImage
            src={
              row?.DefaultVariant?.ProductImages[0]?.image_url?
              import.meta.env.VITE_REACT_API_URL +'/'+
              row?.DefaultVariant?.ProductImages[0]?.image_url : TestImg
            }
            className="w-12 h-12 object-cover"
          /> */}

          <span className="text-black-900 capitalize text-sm">
            {row.user_name}
          </span>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Order ID"}</span>
        </div>
      ),
      dataIndex: "Order ID",
      key: "Order ID",
      width: 80,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">{row.order_id}</div>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Items"}</span>
        </div>
      ),
      dataIndex: "Items",
      key: "Items",
      width: 80,
      render: (name: string, row: any) => (
        <div className={`rounded-md p-2 text-sm `}>{row.items_count}</div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Quantity"}</span>
        </div>
      ),
      dataIndex: "Quantity",
      key: "Quantity",
      width: 80,
      render: (name: string, row: any) => (
        <div className={`rounded-md p-2 text-sm `}>{row.quantity}</div>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Price"}</span>
        </div>
      ),
      dataIndex: "Price",
      key: "Price",
      width: 80,
      render: (name: string, row: any) => (
        <p className="text-sm text-black-900">€{row.price}</p>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Status"}</span>
        </div>
      ),
      dataIndex: "Status",
      key: "Status",
      width: 80,
      render: (name: string, row: any) => (
        <div className="flex justify-center">
          <p
            className={
              row.status && row.status == "PENDING"
                ? "text-white bg-orange-500  rounded px-2 py-1"
                : row.status == "REJECTED"
                ? "text-white  bg-red-100  rounded px-2 py-1"
                : "text-white bg-green-500  rounded px-2 py-1"
            }
          >
            {row.status?.charAt(0).toUpperCase() +
              row.status?.slice(1)?.toLowerCase()}
            {/* {row.status.toLowerCase()} */}
          </p>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Date"}</span>
        </div>
      ),
      dataIndex: "Date",
      key: "Date",
      width: 80,
      render: (name: string, row: any) => (
        <p className="text-sm text-black-900">
          {moment(row.date).utc().format("DD-MM-YYYY")}
        </p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Actions"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center items-center">
          {/* <Menu>
            <MenuHandler>
              <IconButton className="bg-transparent" variant="text">
                <LazyImage className="w-auto h-5" src={MoreIcon} />
              </IconButton>
            </MenuHandler>
            <MenuList className="!px-0 text-black-900">
              <MenuItem
                className=" border-b-[1px] rounded-none"
                onClick={() => onEdit(row?.id)}
              >
                Edit
              </MenuItem>
              <MenuItem
                className="text-red-100"
                onClick={() => onDelete(row?.id)}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu> */}
          {/* <ViewIcon
            className={"cursor-pointer"}
            onClick={() => onView(row?.id)}
          /> */}
          <ViewIcon
            className={"cursor-pointer"}
            onClick={() => onEdit(row?.id, row.status)}
          />
          {/* <DeleteIcon
            className={"cursor-pointer"}
            onClick={() => onDelete(row?.id,)}
          /> */}
        </div>
      ),
    },
  ];
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>All Orders</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              {searchParams.get("state") == "ALL" ? (
                // <Link to="">
                  <p>Approved Orders</p>
               
              ) : (
        
                  <p>Pending Orders</p>
                
              )}
            </Breadcrumbs>
            {searchParams.get("state") == "ALL" ? (
              <h5 className="font-normal"> Approved Orders</h5>
            ) : (
              <h5 className="font-normal">Pending Orders</h5>
            )}
          </div>

          {/* <div className="flex gap-4">
            <CustomButton
              handleButtonClick={() => {
                navigate("/products/addProduct");
              }}
              type={"button"}
              label="New Product"
              styleClass="btn-black !rounded-md"
            />
          </div> */}
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
              setFilterValue({ ...filterValue, searchValue: e.target.value })
            }
          />
        </div>
        <Spinner isLoading={isLoading} classname="my-3" />
        <Table
          tableLayout="fixed"
          columns={columns as any}
          emptyText={"No data found"}
          data={productsList}
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
  );
};
export default MyOrdersList;
