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
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { Breadcrumbs } from "@material-tailwind/react";
import { STORAGE } from "@src/shared/const";
import { addUpdateUser } from "@src/pages/inbox/firebaseChat";

const AllSetting = () => {
  const [settings, setSettings] = useState([]) as any;
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      getSettings();
    }, 600);

    return () => clearTimeout(delayDebounceFn);
  }, []);
  const getSettings = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/settings`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setSettings(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleGoogleRatingAndReview = (status: any, id: number) => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/settings/toggle_status`,
      method: "PUT",
      data: status
        ? { field_name: "google_rating_enabled", is_enabled: 1 }
        : { field_name: "google_rating_enabled", is_enabled: 0 },
    }).then((res) => {
      console.log("productsList", res);
      if (res && !res.error) {
        getSettings();
      } else {
        setIsLoading(false);
      }
    });
  };
  const handleEnableChat = (status: any, id: number) => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/settings/toggle_status`,
      method: "PUT",
      data: status
        ? { field_name: "chat_enabled", is_enabled: 1 }
        : { field_name: "chat_enabled", is_enabled: 0 },
    }).then((res) => {
      console.log("productsList", res);
      if (res && !res.error) {
        getSettings();
        updateFirebaseUser(status);
      } else {
        setIsLoading(false);
      }
    });
  };
  const updateFirebaseUser = (status: any) => {
    const _data: any = localStorage.getItem(STORAGE);
    const data = JSON.parse(_data);
    let _userFirebaseData = {
      id: data.id + "_vendor",
      userEmail: data.email,
      online: true,
      userDisplayName: `${data.first_name + " " + data.last_name}`,
      userPhotoUrl: data.image_url ? data.image_url : "",
      enableChat: status,
    };
    addUpdateUser(_userFirebaseData);
  };
  const navigate = useNavigate();
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
            </Breadcrumbs>
            <h5 className="font-normal"> Settings</h5>
          </div>
        </div>
        <div className="flex flex-col text-black-900 justify-between pt-5">
          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div
            className="flex justify-between items-center h-12 cursor-pointer px-7"
            onClick={() => {
              navigate("/settings/notifications", { state: settings });
            }}
          >
            <p>
              <span>Notifications</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div className="flex justify-between items-center h-12 px-7">
            <p>
              <span>Chat</span>
            </p>
            <Switch
              id="blue"
              name="contain_variations"
              checked={settings?.chat_enabled == 1 ? true : false}
              onChange={() => {
                handleEnableChat(!settings?.chat_enabled, settings?.id);
              }}
            />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />

          <div className="flex justify-between items-center h-12 px-7">
            <p>
              <span>Google Rating & Review</span>
            </p>
            <Switch
              id="blue"
              name="contain_variations"
              checked={settings?.google_rating_enabled == 1 ? true : false}
              onChange={() => {
                handleGoogleRatingAndReview(
                  !settings?.google_rating_enabled,
                  settings?.id
                );
              }}
            />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between items-center h-12 px-7 cursor-pointer"
            onClick={() => {
              navigate("/settings/banners");
            }}
          >
            <p>
              <span>Banner</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between items-center px-7 h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/deliveryManagement");
            }}
          >
            <p>
              <span>Delivery Management</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/bankInfo");
            }}
          >
            <p>
              <span>Banking Information</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/documents");
            }}
          >
            <p>
              <span>Documents Verification</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between  px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/whatsNew");
            }}
          >
            <p>
              <span>What's New</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/shopList");
            }}
          >
            <p>
              <span>Shop Management</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/terms");
            }}
          >
            <p>
              <span>Terms & Conditions</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/privacyPolicy");
            }}
          >
            <p>
              <span>Privacy & Policy</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/helpSupport");
            }}
          >
            <p>
              <span>Help & Support</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/faqs");
            }}
          >
            <p>
              <span>FAQS</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div
            className="flex justify-between px-7 items-center h-12 cursor-pointer"
            onClick={() => {
              navigate("/settings/aboutUs");
            }}
          >
            <p>
              <span>About Us</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
        </div>
      </CustomCard>
    </>
  );
};

export default AllSetting;
