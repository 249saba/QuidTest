import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import { FiSearch } from "react-icons/fi";
import Input from "@src/shared/input";
import Pagination from "@src/shared/table/pagination";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate } from "react-router-dom";
import imageLogo from "@assets/icons/imageLogo.png";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import { useEffect, useState } from "react";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import AddWhatsNew from "./AddWhatsNew";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { Spinner } from "@src/shared/spinner/spinner";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";
import CircleCross from "@assets/icons/circle-delete.png";
import EditWhatsNew from "./edtWhatsNew";
import { Breadcrumbs } from "@material-tailwind/react";
import { Ifilters } from "@src/shared/interfaces";
import UpdateWhatsNew from "./updateWhatsNew";

const WhatsNew = () => {
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [whatsNewList, setWhatsNewList] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenDeletePopup, setIsOpenDeletePopup] = useState(false);
  const [whatsNewId, setwhatsNewId] = useState("");
  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getWhatsNew();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, [filterValue,isNew]);

  const getWhatsNew = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/whatsnew?text=${filterValue.searchValue}&limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
    }).then((res) => {
      console.log("banners ===", res);
      if (res && !res.error) {
        console.log(res);
        setWhatsNewList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleNew = () => {
    setIsNew(!isNew);
  };
  const handleEdit = (id:any) => {
  navigate(`/settings/viewWhatsNew/${id}`);
  };
  const onDelete = (id: string) => {
    setIsOpenDeletePopup(true);
    setwhatsNewId(id);
    console.log("delete Clicked ==", id);
  };
  const handleDelete = () => {
    backendCall({
      url: `/api/vendor/whatsnew/${whatsNewId}`,
      method: "DELETE",
    }).then((res) => {
      if (res && !res.error) {
        handleToastMessage("success", res.message);
        setIsOpenDeletePopup(false);
        getWhatsNew();
      } else {
        handleToastMessage("error", res?.message);
      }
    });
  };
  const onClick = (id: string) => {
    console.log("onEdit Clicked ==", id);
    navigate(`/settings/updateWhatsNew/${id}`);
  };
  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
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
            <p className="font-semibold ">This Whats New?</p>
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
      {isNew ? (
        <AddWhatsNew handleNew={handleNew} />
      ):isEdit?<EditWhatsNew handleEdit={handleEdit}/> : (
        <>
          {" "}
          <CustomCard styleClass="p-4">
            <div className="flex  justify-between  gap-2">
              <div className="text-left ">
                {/* <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Settings</span>/
                  <span>What's New</span>
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
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"What's New"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h6 className="font-normal">What's New</h6>
              </div>
              <div className="flex gap-4">
                <CustomButton
                  handleButtonClick={() => {
                    handleNew();
                  }}
                  type={"button"}
                  label="Add What's New"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="p-4">
            <div className="flex flex-col gap-3">
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
              <SeperatorLine className=" w-full !border-gray-300 " />
            </div>

            <Spinner isLoading={isLoading} classname="my-3" />
            {whatsNewList.rows && whatsNewList.rows.length > 0 ? (
              whatsNewList.rows.map((row: any) => {
                return (
                  <div className="flex flex-col text-black-900 justify-between pt-5 ">
                    <div
                      className="flex justify-between items-center h-12 rounded bg-gray-100 p-4  "
                    
                    >
                      <div className="flex items-center gap-5 cursor-pointer overflow-hidden" 
                      //   onClick={() => {
                      //  handleEdit(row?.id)
                      // }}
                      >
                        {" "}
                        <LazyImage
                          src={
                            row?.image_url
                              ? import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                row?.image_url
                              : imageLogo
                          }
                          className="w-12 h-12 object-cover rounded-full  "
                        />
                        <div className="truncate   break-normal  w-[600px]">
                          {/* <span
                            // dangerouslySetInnerHTML={{
                            //   __html: row?.description,
                            // }}
                         
                          >

                          </span> */}
                          {row?.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClick(row?.id)
                          }}
                          type="button"
                          className="text-red-100 px-2 w-24"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(row?.id)}
                          type="button"
                          className="text-red-100 px-2 w-24"
                        >
                          Delete
                        </button>
                        {/* <img src={ArrowRight} className="w-5 h-5" /> */}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No data found</div>
            )}
            {whatsNewList?.rows?.length > 0 ? (
              <Pagination
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalCount={whatsNewList.count}
              />
            ) : (
              ""
            )}
          </CustomCard>
        </>
      )}
    </>
  );
};

export default WhatsNew;
