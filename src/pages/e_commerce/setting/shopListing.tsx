import CustomCard from "@src/shared/cards/customCard";

import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate } from "react-router-dom";
import Branches from "@assets/icons/Branches.png";
import EcommerceSetup from "@assets/icons/EcommerceSetup.png";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import { useEffect, useState } from "react";
import BranchesList from "./branchesList";
import UpdateBranch from "./updateBranch";
import Ecommerce from "./ecommerce";
import { Breadcrumbs } from "@material-tailwind/react";

const ShopListing = () => {
  const navigate = useNavigate();
  const [isAddBranch, setIsAddBranch] = useState(false);
  const [isUpdateBranch, setIsUpdateBranch] = useState(false);
  const [isbranch, setIsbranch] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);
  const handleUpdate = () => {
    setIsUpdateBranch(!isUpdateBranch);
  };
  const handleNew = () => {
    setIsAddBranch(!isAddBranch);
  };
  const handleBranch = () => {
    setIsbranch(!isbranch);
  };
  const handleEcommerce = () => {
    setIsEcommerce(!isEcommerce);
  };
  return (
    <>
      {isEcommerce ? (
        <Ecommerce handleNew={handleEcommerce} label="Add" />
      ) : isbranch ? (
        <BranchesList handleNew={handleBranch} />
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
                  {/* <Link to="" className="text-gray"> */}
                  <p>{"Shop Management"}</p>
                  {/* </Link> */}
                </Breadcrumbs>

                <h5 className="font-normal">Shop Management</h5>
              </div>
            </div>
          </CustomCard>
          <CustomCard styleClass="p-4">
            <div className="flex flex-col text-black-900 justify-between pt-5  gap-6">
              <div
                className="flex justify-between items-center h-12 cursor-pointer rounded bg-gray-100 px-4 "
                onClick={() => {
                  handleEcommerce();
                }}
              >
                <div className="flex items-center gap-5 cursor-pointer justify-center h-12">
                  {" "}
                  <LazyImage src={EcommerceSetup} className=" rounded-md w-8 " />
                  <div className="flex flex-col items-start">
                    <p className="text-black-900">
                      <span>Ecommerace Setup</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LazyImage src={ArrowRight} className=" rounded-md " />
                </div>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer h-12 rounded bg-gray-100 p-4 "
                onClick={() => {
                  handleBranch();
                }}
              >
                <div className="flex items-center gap-5">
                  {" "}
                  <LazyImage src={Branches} className=" rounded-md w-8" />
                  <div className="flex flex-col items-start">
                    <p className="text-black-900">
                      <span>Branches</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LazyImage src={ArrowRight} className=" rounded-md" />
                </div>
              </div>
            </div>
          </CustomCard>
        </>
      )}
    </>
  );
};

export default ShopListing;
