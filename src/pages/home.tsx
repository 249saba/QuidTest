import ContentContainer from "@src/containers/contentContainer";
import { ModulesModel, NearRestaurantsModel } from "@src/shared/models";
import LazyImage from "@src/shared/lazyImage";
import { useNavigate } from "react-router-dom";
import RestaurantIcon from "@assets/images/gradients/restaurants.svg";
import FoodBar from "@assets/vendor/home/food_bar.png";
import Shopping from "@assets/vendor/home/shopping.png";
import RedBottle from "@assets/vendor/home/red_bottle.png";
import Doctor from "@assets/vendor/home/doctor.png";
import Dealer from "@assets/vendor/home/dealer.png";
import Labour from "@assets/vendor/home/labour.png";

import CiCircleAlert from "@assets/icons/Info_icon.png";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { useEffect, useState } from "react";
import { SetStorage } from "@src/shared/utils/authService";
import { StorageI } from "@src/shared/interfaces";
import { Spinner } from "@src/shared/spinner/spinner";

const nearRestaurantItems = [
  {
    id: 1,
    icon: RestaurantIcon,
    bg_icon: FoodBar,
    amount: 60,
    title: "ESSEN & LOKALE",
    routerLink: "/selectPackage/2",
  },
  {
    id: 2,
    icon: RestaurantIcon,
    bg_icon: Shopping,
    amount: 60,
    title: "SHOPPING",
    routerLink: "/selectPackage/1",
  },
  {
    id: 3,
    icon: RestaurantIcon,
    bg_icon: RedBottle,
    amount: 60,
    title: "GESUNDHEIT & SCHÖNHEIT",
    routerLink: "/selectPackage/3",
  },
  {
    id: 4,
    icon: RestaurantIcon,
    bg_icon: Doctor,
    amount: 60,
    title: "ÄRZTE",
    routerLink: "/selectPackage/5",
  },
  {
    id: 5,
    icon: RestaurantIcon,
    bg_icon: Dealer,
    amount: 60,
    title: "BERATUNG & BILDUNG",
    routerLink: "/selectPackage/4",
  },
  {
    id: 6,
    icon: RestaurantIcon,
    bg_icon: Labour,
    amount: 60,
    title: "DIENSTLEISTER & FACHKRÄFTE",
    routerLink: "/selectPackage/6",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [modulesData, setModulesData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getModules();
  }, []);

  const getModules = () => {
    setLoading(true);
    backendCall({
      url: "/api/vendor/modules",
      method: "GET",
      dataModel: ModulesModel,
    }).then((res) => {
      if (res) {
        setModulesData(res.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleRoute = (item: any) => {
    navigate(item?.routerLink);
    // sessionStorage.setItem("moduleId", String(item?.id));
    localStorage.setItem("moduleId", item?.id);
  };

  return (
    <>
      {" "}
      <ContentContainer styleClass="gap-5 min-h-screen h-full login-gradient ">
        <div className="mt-5">
          <div className="bg-blue-700 bg-opacity-50 py-2 px-6 rounded-md   flex w-full gap-2 items-center sm:items-start">
            
          
            <div className="flex flex-col w-full items-center justify-center">
            <div className="flex items-center justify-center gap-3">
            <LazyImage className="h-9  w-9 text-blue-900" src={CiCircleAlert} />
            <p className="text-blue-900  font-medium ">
                Select Your Business Type.
              </p>
            </div>
             
              <p className="text-blue-900 ">
                After making your selection, you will be directed to the plans
                screen to continue the process.
              </p>
            </div>
          </div>
          {/* <div className="flex flex-col w-[100%] items-center justify-center">
      {" "}
      <h4 className=" font-semibold mt-8 ">
        Select Your Business Type
      </h4>
      <p className="text-black-900  mt-3">
        After making your selection, you will be directed to the plans screen
        to continue the process.
      </p>
    </div> */}
        </div>

        <Spinner isLoading={loading} />
        {!loading && (
          <div className="space-y-3 w-[60%] md:w-full sm:w-full mx-auto">
            {/* <div className="bg-blue-700 bg-opacity-50 p-2 text-left"> */}

            {/* </div> */}
            <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-2 m-auto cursor-pointer ">
              {modulesData.map((item: ModulesModel, index) => (
                <LazyImage
                  key={Math.random()}
                  handleClick={() => {
                    handleRoute(item);
                  }}
                  routerLink={item?.routerLink}
                  src={
                    item.bg_icon
                      ? import.meta.env.VITE_REACT_API_URL + "/" + item.bg_icon
                      : nearRestaurantItems[index]?.bg_icon
                  }
                  parentClass="relative w-90"
                  className="rounded-xl w-[500px] h-40"
                >
                  <div className="absolute top-5">
                    <div className="font-semibold text-left items-start w-full pl-6 ">
                      <p
                        className="text-black-100 w-full px-5"
                        onClick={() => {
                          handleRoute(item);
                        }}
                      >
                        {item?.title}
                      </p>
                    </div>
                  </div>
                </LazyImage>
              ))}
            </div>
          </div>
        )}
      </ContentContainer>
    </>
  );
};

export default Home;
