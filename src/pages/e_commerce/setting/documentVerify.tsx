import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate } from "react-router-dom";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { useEffect, useState } from "react";
import ViewDocument from "./viewDocument";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { Spinner } from "@src/shared/spinner/spinner";
import UpdateDocuments from "@pages/e_commerce/setting/updateDocuments";
import { Breadcrumbs } from "@material-tailwind/react";

const DocumentVerify = () => {
  const navigate = useNavigate();
  const [viewDocument, setViewDocument] = useState(false);
  const [document, setDocument] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getVendor();
    getDocuments();
  }, []);

  const getVendor = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/profile`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        if (res.data.accountStatus === "PENDING") {
          navigate("/settings/documentVerify");
        }
      } else {
        setIsLoading(false);
        handleToastMessage("error", res.message);
      }
    });
  };

  const getDocuments = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/documents`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setDocument(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res.message);
      }
    });
  };
  const handleViewDocument = (documentType: string) => {
    navigate(`/settings/documents/${documentType}`);
  };
  return (
    <>
      <Spinner isLoading={isLoading} classname="my-3" />
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Document Verification</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              <Link to="/settings/documents" className="text-gray">
                <p>{"Document Verification"}</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Document Verification</h5>
          </div>
        </div>
        <div
          className="flex flex-col text-black-900 justify-between pt-5 cursor-pointer"
          onClick={() => {
            document?.id_card_status === "REJECTED" ||
            document?.id_card_status === "PENDING"
              ? handleViewDocument("id_card")
              : "";
          }}
        >
          <div className="flex justify-between items-center h-12 rounded bg-gray-100 ">
            <div className="flex items-center">
              {" "}
              <LazyImage
                src={
                  document.id_card_front_url
                    ? import.meta.env.VITE_REACT_API_URL +
                      "/" +
                      document.id_card_front_url
                    : ArrowRight
                }
                className="w-12 h-12 rounded-md"
              />
              <p>
                <span>ID Card</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {document.id_card_status == "APPROVED" ? (
                <p className=" bg-green-900 text-white rounded-md px-2 w-24">
                  {document.id_card_status}
                </p>
              ) : (
                <p className=" bg-red-100 text-white rounded-md px-2 w-24">
                  {document.id_card_status}
                </p>
              )}
              <img src={ArrowRight} className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div
          className="flex flex-col text-black-900 justify-between pt-5 cursor-pointer"
          onClick={() => {
            document?.bank_card_status === "REJECTED" ||
            document?.bank_card_status === "PENDING"
              ? handleViewDocument("bank_card")
              : "";
          }}
        >
          <div className="flex justify-between items-center h-12 rounded bg-gray-100 ">
            <div className="flex items-center">
              {" "}
              <LazyImage
                src={
                  document.bank_card_front_url
                    ? import.meta.env.VITE_REACT_API_URL +
                      "/" +
                      document.bank_card_front_url
                    : ArrowRight
                }
                className="w-12 h-12 rounded-md"
              />
              <p>
                <span>Bank Card</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {document.bank_card_status == "APPROVED" ? (
                <p className=" bg-green-900 text-white rounded-md px-2 w-24">
                  {document.bank_card_status}
                </p>
              ) : (
                <p className=" bg-red-100 text-white rounded-md px-2 w-24">
                  {document.bank_card_status}
                </p>
              )}
              <img src={ArrowRight} className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div
          className="flex flex-col text-black-900 justify-between pt-5 cursor-pointer"
          onClick={() => {
            document?.menu_card_status === "REJECTED" ||
            document?.menu_card_status === "PENDING"
              ? handleViewDocument("menu_card")
              : "";
          }}
        >
          <div className="flex justify-between items-center h-12 rounded bg-gray-100 ">
            <div className="flex items-center">
              {" "}
              <LazyImage
                src={
                  document.menu_card_url
                    ? import.meta.env.VITE_REACT_API_URL +
                      "/" +
                      document.menu_card_url
                    : ArrowRight
                }
                className="w-12 h-12 rounded-md"
              />
              <p>
                <span>Menu Card With Allergy</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {document.menu_card_status == "APPROVED" ? (
                <p className=" bg-green-900 text-white rounded-md px-2 w-24">
                  {document.menu_card_status}
                </p>
              ) : (
                <p className=" bg-red-100 text-white rounded-md px-2 w-24">
                  {document.menu_card_status}
                </p>
              )}
              <img src={ArrowRight} className="w-5 h-5" />
            </div>
          </div>
        </div>
      </CustomCard>
    </>
  );
};

export default DocumentVerify;
