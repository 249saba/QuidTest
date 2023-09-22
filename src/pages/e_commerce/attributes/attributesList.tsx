import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import CircleCross from "@assets/icons/circle-delete.png";
import { ProductsModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { Switch } from "@mui/material";
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
import { AttributesModel } from "@src/shared/models/attributes";
import { formatedDate } from "@src/shared/dateFormat";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";

const AttributesList = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
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
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/attributes/?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
      dataModel: AttributesModel,
    }).then((res) => {
      if (res && !res.error) {
        console.log("attributes ===", res);
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
  const handleToggle = (e: any, id: string) => {
    console.log("toggle Clicked ==", e.target.checked);
    let isEnable = e.target.checked ? 1 : 0;
    backendCall({
      url: `/api/vendor/attributes/${id}/${isEnable}`,
      method: "PATCH",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        getProducts();
      }
    });
  };
  const onEdit = (id: string) => {
    console.log("onEdit Clicked ==", id);
    navigate(`/attributes/addAttribute/${id}`);
  };
  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setPromoId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/attributes/${promoId}`,
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
        <div className="ml-8 flex justify-start items-center">
          <span className="font-semibold">{"Attributes"}</span>
        </div>
      ),
      dataIndex: "Attributes",
      key: "Attributes",
      width: 200,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900 flex justify-start ml-8">
          {row.name}
        </div>
      ),
    },
    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span className="font-semibold">{"Date"}</span>
    //     </div>
    //   ),
    //   dataIndex: "Date",
    //   key: "Date",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <div className="text-xs text-black-900 pl-1 text-left">
    //       {formatedDate(row.createdAt)}
    //     </div>
    //   ),
    // },

    // {
    //   title: (
    //     <div className="pl-1 flex justify-between items-center">
    //       <span className="font-semibold">{"Status"}</span>
    //     </div>
    //   ),
    //   dataIndex: "Status",
    //   key: "Status",
    //   width: 200,
    //   render: (name: string, row: any) => (
    //     <div className="text-xs text-black-900 pl-1 text-left">
    //       <Switch
    //         id="black"
    //         name="is_enabled"
    //         // value={row.is_enabled}
    //         checked={row.is_enabled}
    //         // onChange={(e) => {
    //         //   setFieldValue("is_enabled", e.target.checked ? 1 : 0);
    //         // }}
    //       />
    //     </div>
    //   ),
    // },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Actions"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 50,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center items-center">
          <Switch
            id="black"
            name="is_enabled"
            // value={row.is_enabled}
            checked={row.is_enabled}
            onChange={(e) => handleToggle(e, row?.id)}
          />
          <PencilIcon
            className={"cursor-pointer"}
            onClick={() => onEdit(row?.id)}
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
            <p className="font-semibold ">This Attribute?</p>
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
      <CustomCard styleClass="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Attributes</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="">
                <p>Attributes</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Attributes</h5>
          </div>

          <div className="flex gap-4">
            <CustomButton
              handleButtonClick={() => {
                navigate("/attributes/addAttribute");
              }}
              type={"button"}
              label="Add Attribute"
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
              setFilterValue({ ...filterValue, searchValue: e.target.value })
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
  );
};

export default AttributesList;
