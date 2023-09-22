import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import { FiSearch } from "react-icons/fi";
import Input from "@src/shared/input";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import imageLogo from "@assets/icons/imageLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import { useEffect, useState } from "react";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import AddWhatsNew from "./AddWhatsNew";
import AddBranch from "./addBranch";
import UpdateBranch from "./updateBranch";
import { backendCall } from "@shared/utils/backendService/backendCall";
import { handleToastMessage } from "@shared/toastify";
import TestImg from "@assets/images/Food.png";

const BranchesList = ({ handleNew }: any) => {
  const navigate = useNavigate();
  const [isAddBranch, setIsAddBranch] = useState(false);
  const [isUpdateBranch, setIsUpdateBranch] = useState(false);
  const [shops, setShops] = useState<any>([]);
  const [shop, setShop] = useState<any>({});
  const [searchShops, setSearchShops] = useState([]);

  useEffect(() => {
    getShops();
  }, [isAddBranch,isUpdateBranch]);

  const getShops = () => {
    backendCall({
      url: `/api/vendor/shops`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        const data = res.data;
        setShops(data);
        setSearchShops(data.map((item: any) => item.id));
      } else {
        handleToastMessage("error", res.message);
      }
    });
  };

  const handleSearch = (e: any) => {
    const value = e.target.value;
    const filteredData = shops
      .filter((shop: any) => shop.business_email.includes(value))
      .map((shop: any) => shop.id);
    setSearchShops(filteredData);
  };

  const handleUpdate = () => {
    setIsUpdateBranch(!isUpdateBranch);
  };
  const handleNewBranch = () => {
    setIsAddBranch(!isAddBranch);
  };
  return (
    <>
      {isAddBranch ? (
        <AddBranch handleNew={handleNewBranch} label="Add" />
      ) : isUpdateBranch ? (
        <UpdateBranch handleNew={handleUpdate} shop={shop} />
      ) : (
        <>
          {" "}
          <CustomCard styleClass="p-4">
            <div className="flex  justify-between  gap-2">
              <div className="text-left ">
                {/* <p className="text-gray-900 flex gap-1">
                  <span>Dashboard</span>/<span>Settings</span>/
                  <span>Shop Management</span>
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
                  <p
                    onClick={() => {
                      handleNew();
                    }}
                  >
                    {"Shop Management"}
                  </p>
                  {/* <Link to="" className="text-gray">
              <p
              
              >
                {"Branches SetUp"}
              </p>
              </Link> */}
                </Breadcrumbs>
                <h5 className="font-normal">Branches SetUp</h5>
              </div>
              <div className="flex gap-4">
                <CustomButton
                  handleButtonClick={() => {
                    handleNewBranch();
                  }}
                  type={"button"}
                  label="Add New Branch"
                  styleClass="btn-black !rounded-md"
                />
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="p-4">
            <div className="p-4">
              <Input
                leftIcon={<FiSearch className="text-gray-900 h-6 w-6" />}
                id="searchValue"
                name="searchValue"
                inputClassName="!h-9"
                type="text"
                variant="outline"
                placeholder="Start typing to search for What's New"
                onChange={handleSearch}
              />
            </div>
            <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
            {shops.map((shop: any) => {
              // @ts-ignore
              if (searchShops.includes(shop?.id)) {
                return (
                  <div className="flex flex-col text-black-900 justify-between pt-5  gap-6">
                    <div
                      className="flex justify-between items-center h-12 rounded bg-gray-100 p-4 cursor-pointer"
                      onClick={() => {
                        setShop(shop);
                        handleUpdate();
                      }}
                    >
                      <div className="flex items-center gap-5">
                        {" "}
                        <LazyImage
                          src={
                            shop.image_url
                              ? import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                shop.image_url
                              : TestImg
                          }
                          className=" rounded-full h-10 w-10"
                        />
                        <div className="flex flex-col items-start">
                          <p className="text-black-900">
                            <span></span>
                          </p>
                          <p className="black-300">
                            <span>{shop.business_email}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <LazyImage src={ArrowRight} className=" rounded-md" />
                        {/* <img src={ArrowRight} className="w-5 h-5" /> */}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </CustomCard>
        </>
      )}
    </>
  );
};

export default BranchesList;
