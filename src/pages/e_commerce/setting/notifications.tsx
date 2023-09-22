import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import { Spinner } from "@src/shared/spinner/spinner";
import { Breadcrumbs } from "@material-tailwind/react";

const Notifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState([]) as any;
  const navigate = useNavigate();
  useEffect(() => {
    getSettings();
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
  const handleEnableNotification = (status: any, id: number) => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/settings/toggle_status`,
      method: "PUT",
      data: status
        ? { field_name: "notifications_enabled", is_enabled: 1 }
        : { field_name: "notifications_enabled", is_enabled: 0 },
    }).then((res) => {
      console.log("productsList", res);
      if (res && !res.error) {
        getSettings();
      } else {
        setIsLoading(false);
      }
    });
  };
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/<span>Notifications</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              <Link to="" className="text-gray">
                <p>{"Notifications"}</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Settings</h5>
          </div>
        </div>
        <Spinner isLoading={isLoading} classname="my-3" />
        <div className="flex flex-col text-black-900 justify-between pt-5">
          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div
            className="flex font-medium justify-between items-center h-12 px-5 cursor-pointer"
            onClick={() => {
              navigate("/settings/AllNotifications");
            }}
          >
            <p>
              <span>All Notifications</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div className="flex font-medium justify-between items-center h-12 pl-5 pr-3 cursor-pointer">
            <p>
              <span>Notifications</span>
            </p>
            <Switch
              id="blue"
              name="contain_variations"
              checked={settings?.notifications_enabled == 1 ? true : false}
              onChange={() => {
                handleEnableNotification(
                  !settings?.notifications_enabled,
                  settings?.id
                );
              }}
            />
          </div>

          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
        </div>
      </CustomCard>
    </>
  );
};

export default Notifications;
