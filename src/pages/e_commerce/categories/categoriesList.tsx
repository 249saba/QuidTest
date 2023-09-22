import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { CategryModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import { handleToastMessage } from "@src/shared/toastify";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import Checkbox from "@src/shared/checkbox/checkbox";
import Switch from "@mui/material/Switch";
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
import { getCategoriesById } from "@src/shared/apiService";
import { Link, useNavigate } from "react-router-dom";
import "@src/index.scss";

const CategoriesList = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isMandatory, setIsMandatory] = useState(true);
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getProducts();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue]);
  console.log("productsList", productsList);
  //   const getProducts = () => {
  //     setIsLoading(true);
  //     console.log(filterValue);
  //     getCategoriesById().then((res) => {
  //         console.log("category",res)
  //       if (res && !res.error) {
  //         console.log(res);
  //         setProductsList(res.data);
  //         setIsLoading(false);
  //       } else {
  //         setIsLoading(false);
  //       }
  //     });
  //   };
  const getProducts = () => {
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/category_management/?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
      dataModel: CategryModel,
    }).then((res) => {
      console.log("productsList", res);
      if (res && !res.error) {
        console.log("productsList", res);
        console.log(res);
        setProductsList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleActiveInactive = (status: any, id: number) => {
    backendCall({
      url: `/api/vendor/category_management/toggle_status`,
      method: "POST",
      data: status
        ? { category_id: id, is_enabled: 1 }
        : { category_id: id, is_enabled: 0 },
    }).then((res) => {
      console.log("productsList", res);
      if (res && !res.error) {
        getProducts();
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

  const columns = [
    {
      title: (
        <div className="px-4 flex justify-between items-center">
          <span>{"Category List"}</span>
          <span>{"Status"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex gap-3 items-center justify-between px-4">
          <p className="text-sm text-black-900 ">{row.name}</p>
          <div>
            <Switch
              className=" shadow-white"
              id="mandatoryTask"
              checked={row.is_enabled == 1 ? true : false}
              onChange={() => {
                handleActiveInactive(!row.is_enabled, row.id);
              }}
              name="mandatoryTask"
            />
          </div>
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span>{"Category"}</span>
    //     </div>
    //   ),
    //   dataIndex: "Category",
    //   key: "Category",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <div className="text-xs text-black-900">{row.Category.name}</div>
    //   ),
    // },

    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span>{"Stock"}</span>
    //     </div>
    //   ),
    //   dataIndex: "Stock",
    //   key: "Stock",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <div
    //       className={`${
    //         row.stock > 0
    //           ? "bg-green-300 text-green-400"
    //           : "bg-pink-200 text-red-100"
    //       } rounded-md p-2 text-xs `}
    //     >
    //       {row.stock} in Stock
    //     </div>
    //   ),
    // },

    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span>{"Price"}</span>
    //     </div>
    //   ),
    //   dataIndex: "Price",
    //   key: "Price",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <p className="text-xs text-black-900">${row.price}</p>
    //   ),
    // },

    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span>{""}</span>
    //     </div>
    //   ),
    //   dataIndex: "id",
    //   key: "id",
    //   width: 200,
    //   render: (id: string, row: any) => (
    //     <div className="flex gap-x-2">
    //       <Menu>
    //         <MenuHandler>
    //           <IconButton className="bg-transparent" variant="text">
    //             <LazyImage className="w-auto h-5" src={MoreIcon} />
    //           </IconButton>
    //         </MenuHandler>
    //         <MenuList className="!px-0 text-black-900">
    //           <MenuItem className=" border-b-[1px] rounded-none">Edit</MenuItem>
    //           <MenuItem className="text-red-100">Delete</MenuItem>
    //         </MenuList>
    //       </Menu>
    //     </div>
    //   ),
    // },
  ];
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Category</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="">
                <p>Category</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Categories</h5>
          </div>

          <div className="flex gap-4">
            <CustomButton
              handleButtonClick={() => {
                navigate("/categoriesList/addCategory");
              }}
              type={"button"}
              label="New Category"
              styleClass="btn-black !rounded-md"
            />
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="sm:rounded-none">
        <div className="p-4 ">
          <Input
            leftIcon={<FiSearch className="text-gray-900 h-6 w-6" />}
            id="searchValue"
            name="searchValue"
            inputClassName="!h-9"
            type="text"
            variant="outline"
            placeholder="Start typing to search for Categories"
            onChange={(e) =>
              setFilterValue({ ...filterValue, searchValue: e.target.value })
            }
            // rightIcon={
            //   <div className="flex gap-2">
            //     <span className="font-normal text-black-100 ">X</span>
            //     <span className=" text-gray-400">|</span>
            //     <span className="font-bold text-black-100">X</span>
            //   </div>
            // }
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

export default CategoriesList;
