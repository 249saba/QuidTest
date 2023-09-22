import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { ProductsModel } from "@src/shared/models";
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
import { Breadcrumbs } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";

const ProductsList = () => {
  const [productsList, setProductsList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "desc",
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
      url: `/api/vendor/product/?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=desc`,
      method: "GET",
      dataModel: ProductsModel,
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

  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
  const onEdit = (id: string,status:string) => {
    console.log("onEdit Clicked ==", id);
    if (status==="PENDING"){
      navigate(`/products/addProduct/${id}`);
    }else{
      navigate(`/products/editProduct/${id}`);
    }

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
        <div className="ml-8 flex justify-start items-center">
          <span className="font-semibold">{"Products"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (name: string, row: any) => (
        <div className="flex gap-3 ml-4 justify-start items-center">
          
          <LazyImage
            src={
              row?.DefaultVariant?.cover_image_url?
              import.meta.env.VITE_REACT_API_URL +'/'+
              row?.DefaultVariant?.cover_image_url : TestImg
            }
            className="w-12 h-12 object-cover"
          />
          <div>
            <p className="text-black-900 capitalize">{name}</p>
            {/* <p className="text-xs text-gray-900">
              ID: {row.id} | SKU: {row.unit_id}
            </p> */}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Category"}</span>
        </div>
      ),
      dataIndex: "Category",
      key: "Category",
      width: 150,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">{row.Category.name}</div>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Variants"}</span>
        </div>
      ),
      dataIndex: "Variants",
      key: "Variants",
      width: 150,
      render: (name: string, row: any) => (
        <div className={`rounded-md p-2 text-sm  text-black-900`}>
          {row.variants_count > 1
            ? row.variants_count + " Variants"
            : row.variants_count + " Variant"}
        </div>
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
      width: 150,
      render: (name: string, row: any) => (
        <p className="text-sm text-black-900">{row.price}€</p>
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
          <PencilIcon
            className={"cursor-pointer"}
            onClick={() => onEdit(row?.id,row?.status)}
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
            <p className="font-semibold ">This Product?</p>
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
          <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="">
                <p>Products</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              {/* <p>{"Terms & Conditions"}</p> */}
              {/* </Link> */}
            </Breadcrumbs>
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Products</span>
            </p> */}

            <h5 className="font-normal"> Products</h5>
          </div>

          <div className="flex gap-4">
            <CustomButton
              handleButtonClick={() => {
                navigate("/products/addProduct");
              }}
              type={"button"}
              label="New Product"
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

export default ProductsList;
