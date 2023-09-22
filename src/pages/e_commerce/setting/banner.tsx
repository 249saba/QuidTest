import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import Input from "@src/shared/input";
import LazyImage from "@src/shared/lazyImage";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import TestImg from "@assets/images/Food.png";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import CircleCross from "@assets/icons/circle-delete.png";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { Link, useNavigate } from "react-router-dom";
import { handleToastMessage } from "@src/shared/toastify";
import Switch from "@mui/material/Switch";
import AddBanners from "./addBanner";
import { Breadcrumbs } from "@material-tailwind/react";
import Popup from "@src/shared/popup/popup";
import EditBanners from "./editBanner";

const Banners = () => {
  const [bannersList, setBannersList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isbanner, setIsbanner] = useState(false);
  const [bannerData, setbannerData] = useState();
  const [isEditbanner, setIsEditbanner] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [promoId, setPromoId] = useState("");
  const navigate = useNavigate();

  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getBanners();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue, isbanner]);

  const getBanners = () => {
    setIsLoading(true);
    console.log(filterValue);
    backendCall({
      url: `/api/vendor/banners/?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
    }).then((res) => {
      console.log("banners ===", res);
      if (res && !res.error) {
        console.log(res);
        setBannersList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleAddBanner = () => {
    setIsbanner(!isbanner);
  };
  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
  const onView = (data:any) => {
    setbannerData(data);
    setIsEditbanner(true)
    // navigate(`/products/addProduct/${id}`);
  };
  const handleEditBanner = () => {
    setIsEditbanner(!isEditbanner)
    // navigate(`/products/addProduct/${id}`);
  };

  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setPromoId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/banners/${promoId}`,
      method: "DELETE",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        getBanners();
        setIsOpenDeletePopup(false);
      }
    });

    console.log("Delete item ID ==", promoId);
  };
  const columns = [
    {
      title: (
        <div className="pl-1 flex items-center justify-center gap-2">
          <input type="checkbox" className="custom-checkbox" />
          <span>{"Title"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-xs text-black-900">{row.name}</p>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span>{"Photo"}</span>
        </div>
      ),
      dataIndex: "image_url",
      key: "image_url",
      width: 200,
      render: (name: string, row: any) => (
        <div className="h-40 w-60 flex items-center justify-center">  <LazyImage
        src={
          row?.image_url
            ? import.meta.env.VITE_REACT_API_URL + "/" + row?.image_url
            : TestImg
        }
        className="h-40 w-60 flex items-center justify-center"
      /></div>
     
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span>{"Video"}</span>
        </div>
      ),
      dataIndex: "video_url",
      key: "video_url",
      width: 200,
      render: (video_url: string, row: any) => (
        <div className="h-40 flex   justify-center">   
         <video controls className="h-40 flex  w-96 justify-center">
        <source
          src={
            row?.video_url
              ? import.meta.env.VITE_REACT_API_URL + "/" + row?.video_url
              : TestImg
          }
          type="video/mp4"
          className="h-40 w-60 object-contain"
          // className="h-20 w-40 flex items-center"
        />
      </video></div>
    
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span>{"Actions"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 200,
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
          {/* <Switch
            id="blue"
            name="contain_variations"
            checked={true}
            // onChange={(e) => {
            //   setIsVariantAdd(false);
            //   setFieldValue(
            //     "contain_variations",
            //     e.target.checked ? 1 : 0
            //   );
            // }}
          /> */}
             {/* <ViewIcon className={"cursor-pointer"} onClick={() => onView(row)} /> */}
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
            <p className="font-semibold ">This Banner?</p>
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

      {isbanner ? (
        <AddBanners handleBanner={handleAddBanner} />
      ): isEditbanner?<EditBanners bannerData={bannerData} handleEditBanner={handleEditBanner}/> : (
        <>
          {" "}
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
                    <p>{"Banners Setup"}</p>
                  </Link>
                </Breadcrumbs>
                <h5 className="font-normal"> Banners Setup</h5>
              </div>

              <div className="flex gap-4">
                <CustomButton
                  handleButtonClick={() => {
                    handleAddBanner();
                  }}
                  type={"button"}
                  label="Add New Banner"
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
              data={bannersList.rows}
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
              totalCount={bannersList.count}
            />
          </CustomCard>
        </>
      )}
    </>
  );
};

export default Banners;
