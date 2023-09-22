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
import { useState, useEffect } from "react";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import { Breadcrumbs } from "@material-tailwind/react";
const AllNotifications = () => {
  const [notifications, setNotifications] = useState([] as any);
  const [notificationToShow, setNotificationToShow] = useState(3);
  const [buttonClicked, setButtonClicked] = useState(false);
  useEffect(() => {
    getNotifications();
  }, []);
  const getNotifications = () => {
    backendCall({
      url: `/api/vendor/notifications`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        console.log("data :", res.data);
        setNotifications(res.data);
      } else {
        handleToastMessage("error", res?.message);
      }
    });
  };
  const handleLoadMoreClick = () => {
    setNotificationToShow(notifications.count);
    setButtonClicked(true);
  };
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex justify-between gap-2">
          <div className="text-left">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Notifications</span>/<span>All Notifications</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              <Link to="/settings/notifications" className="text-gray">
                <p>{"Notifications"}</p>
              </Link>
              <Link to="" className="text-gray">
                <p>{"All Notifications"}</p>
              </Link>
            </Breadcrumbs>
            <h5 className="font-normal">Notifications</h5>
          </div>
        </div>

        <div className="flex flex-col justify-between pt-5 gap-3">
          {notifications?.rows
            ?.slice(0, notificationToShow)
            .map((notification: any) => (
              <div
                key={notification.id}
                className="flex justify-between items-center h-12 rounded bg-gray-100"
              >
                <div className="flex items-center h-8 p-6 gap-2">
                  <span className="text-gray-900">
                    {notification.description}
                  </span>
                </div>
              </div>
            ))}
            {notifications?.rows?.length>0? <div className="pt-6">
            {!buttonClicked && (
              <CustomButton
                handleButtonClick={handleLoadMoreClick}
                type="button"
                label="Load More"
                styleClass="btn-white !rounded-md w-96 !border-gray-300 text-black-100 font-semibold"
              />
            )}
          </div>:   <div className="flex items-center justify-center h-8 p-6 gap-2">
                  <span className="text-black-100">
                    No data Found
                  </span>
                </div>}
         
        </div>
      </CustomCard>
    </>
  );
};

export default AllNotifications;
