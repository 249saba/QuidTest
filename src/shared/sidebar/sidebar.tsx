import Button from "@shared/button";
import {
  AppBar,
  List,
  IconButton,
  Popover,
  Toolbar,
  Box,
  Typography,
  Drawer,
  Avatar,
  Menu,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LeftArrow from "@assets/icons/Arrow.svg";
import RightArrow from "@assets/icons/Arrow.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxDropdownMenu } from "react-icons/rx";
import { ReactComponent as Notification } from "@assets/vendor/icons/notification.svg";
import { ReactComponent as Question } from "@assets/vendor/icons/question.svg";
import { ReactComponent as Dashboard } from "@assets/vendor/icons/dashboard.svg";
import { ReactComponent as Dashboard_white } from "@assets/vendor/icons/dashboard_white.svg";
import { ReactComponent as Product } from "@assets/vendor/icons/product.svg";
import { ReactComponent as Product_white } from "@assets/vendor/icons/product_white.svg";
import { ReactComponent as Category } from "@assets/vendor/icons/clipboard.svg";
import { ReactComponent as Category_white } from "@assets/vendor/icons/clipboard_white.svg";
import { ReactComponent as Orders } from "@assets/vendor/icons/checkout.svg";
import { ReactComponent as Orders_white } from "@assets/vendor/icons/checkout_white.svg";
import { ReactComponent as Inbox } from "@assets/vendor/icons/mail.svg";
import { ReactComponent as Inbox_white } from "@assets/vendor/icons/mail_white.svg";
import { ReactComponent as Promotion } from "@assets/vendor/icons/discount.svg";
import { ReactComponent as Promotion_white } from "@assets/vendor/icons/discount_white.svg";
import { ReactComponent as Settings } from "@assets/vendor/icons/settings.svg";
import { ReactComponent as Settings_white } from "@assets/vendor/icons/settings_white.svg";
import PersonIcon from "@assets/vendor/icons/person.png";
import SeperatorLine from "../seperator/seperatorLine";
import { STORAGE } from "@src/shared/const";
import { Logout } from "../utils/authService";
import { useDispatch } from "react-redux";
import { setLayout } from "../slices/LayoutSlice";
import { ReactComponent as Logo } from "@assets/Logo.svg";
import CustomButton from "@src/shared/customButton";
import CircleCross from "@assets/icons/circle-delete.png";
import Popup from "@src/shared/popup/popup";
import LazyImage from "@src/shared/lazyImage";
import { AiFillAccountBook } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";

const drawerWidth = 280;
const _initialValues1 = {
  image: [],
  first_name: "",
  last_name: "",
  email: "",
};
const vendorNavbar = [
  {
    link: "/dashboard",
    title: "Dashboard",
    icon: <Dashboard className="w-6 h-6" />,
    icon_white: <Dashboard_white className="w-6 h-6" />,
  },
  {
    link: "/products",
    title: "Products",
    icon: <Product className="w-6 h-6" />,
    icon_white: <Product_white className="w-6 h-6" />,
  },
  {
    link: "/categoriesList",
    title: "Categories",
    icon: <Category className="w-6 h-6" />,
  },
  {
    link: "/orders",
    title: "Orders",
    icon: <Orders className="w-6 h-6" />,
    icon_white: <Orders_white className="w-6 h-6" />,
    more_items: [
      {
        link: "/orders/?state=ALL",
        title: "Approved Orders",
        icon: <Orders className="w-6 h-6" />,
      },
      {
        link: "/orders/?state=PENDING",
        title: "Pending Orders",
        icon: <Orders className="w-6 h-6" />,
      },
      {
        link: "/orders/?state=REJECTED",
        title: "Rejected Orders",
        icon: <Orders className="w-6 h-6" />,
      },
    ],
  },
  {
    link: "/inbox",
    title: "Inbox",
    icon: <Inbox className="w-6 h-6" />,
    icon_white: <Inbox_white className="w-6 h-6" />,
  },

  {
    link: "/promotions",
    title: "Promotions",
    icon: <Promotion className="w-6 h-6" />,
    icon_white: <Promotion_white className="w-6 h-6" />,
    more_items: [
      {
        link: "/promotions/dealsList",
        title: "Deals",
        icon: <Promotion className="w-6 h-6" />,
      },
      {
        link: "/promotions/promotionsList",
        title: "Promo Codes",
        icon: <Promotion className="w-6 h-6" />,
      },
    ],
  },
  {
    link: "/attributes",
    title: "Attributes",
    icon: <Product className="w-6 h-6" />,
    icon_white: <Product_white className="w-6 h-6" />,
  },
  {
    link: "/settings",
    title: "Settings",
    icon: <Settings className="w-6 h-6" />,
    icon_white: <Settings_white className="w-6 h-6" />,
    // more_items: [
    //   {
    //     link: "/notifications",
    //     title: "Notifications",
    //     icon: <Settings className="w-6 h-6" />,
    //   },
    //   {
    //     link: "/delivery_management",
    //     title: "Delivery Management",
    //     icon: <Settings className="w-6 h-6" />,
    //   },
    //   {
    //     link: "/banners_setup",
    //     title: "Banners setup",
    //     icon: <Settings className="w-6 h-6" />,
    //   },
    //   {
    //     link: "/updates_management",
    //     title: "Updates Management",
    //     icon: <Settings className="w-6 h-6" />,
    //   },
    // ],
  },
];
const SidebarItem = ({ item, dataIndex }: any) => {
  const activeRoute = useLocation();
  const splitLocation = activeRoute.pathname.split("/");
 
  return (
    <Link key={dataIndex} to={item?.link}>
      <div
        className={`py-3 px-5 flex gap-x-3 mb-2 cursor-pointer rounded-md ${
          splitLocation[1] == item.link.replace("/", "")
            ? "bg-black-900 "
            : "bg-transparent"
        }`}
      >
        {splitLocation[1] == item.link.replace("/", "")
          ? item.icon_white
          : item.icon}
        <p
          className={`text-black-900 ${
            splitLocation[1] == item.link.replace("/", "") ? "text-white" : ""
          }`}
        >
          {" "}
          {item.title}
        </p>
      </div>
    </Link>
  );
};

const SidebarMoreItem = ({ item, dataIndex }: any) => {
  const activeRoute = useLocation();
  const splitLocation = activeRoute.pathname.split("/");
  return (
    <Accordion
      key={dataIndex}
      className="!bg-transparent !shadow-none !border-transparent  !outline-none"
    >
      <AccordionSummary
        className={`!h-12 !min-h-0 ${
          splitLocation[1] == item.link.replace("/", "")
            ? "!bg-black-900 !text-white "
            : "!bg-transparent !shadow-none"
        }`}
        expandIcon={<MdArrowDropDown className="text-gray-900" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className="flex gap-3 px-1">
          {splitLocation[1] == item.link.replace("/", "")
            ? item.icon_white
            : item.icon}
          {item.title}
        </div>
      </AccordionSummary>
      {item.more_items.map((elem: any, index: any) => (
        <Link key={index} to={elem.link}>
          <p
            className={`text-left ml-6 pl-2 py-2 mt-2 mb-1 hover:bg-gray-800 ${
              activeRoute.pathname == elem.link ? "bg-gray-800" : ""
            }`}
          >
            {elem.title}
          </p>
        </Link>
      ))}
    </Accordion>
  );
};

const SideBar = (props: any) => {
  // const [anchorLanguage, setAnchorLanguage] = useState<null | HTMLElement>(
  //   null
  // );
  // const open = Boolean(anchorLanguage);

  // const setLanguage = async () => {
  //   const lang = await localStorage.getItem("language");
  //   if (lang) {
  //     i18n.changeLanguage(lang);
  //   }
  // };

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorLanguage(event.currentTarget);
  // };
  // const handleLanguageClose = () => {
  //   setAnchorLanguage(null);
  // };

  // const handleLanguage = (lang: string) => {
  //   i18n.changeLanguage(lang);
  //   localStorage.setItem("language", lang);
  //   handleLanguageClose();
  // };
  const dispatch = useDispatch();

  const { window, vendor } = props;
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showHideNavbar, setShowHideNavbar] = useState<boolean>(true);
  const [initialValues1, setInitialValues1] = useState(_initialValues1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpenSignoutPopup, setIsOpenSignoutPopup] = useState(false);
  const navigate = useNavigate();
  const _data: any = localStorage.getItem(STORAGE);
  useEffect(() => {
   
    const data = JSON.parse(_data);
    let initialData = {
      image: data?.image_url,
      first_name: data?.first_name,
      last_name: data?.last_name,
      email: data?.email,
    };
    setInitialValues1(initialData);
    console.log("localStorage.getItem(STORAGE) ==", data);
  },[_data]);
  const container =
    window !== undefined ? () => window().document.body : undefined;

  const sideBarItems = useMemo(() => {
    return vendorNavbar;
  }, [vendor]);

  const handleClickDropdown = (event: any) => {
    setAnchorEl(event.currentTarget);
    setIsDropdownOpen(true);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setIsDropdownOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Logo onClick={() => navigate("/")} className="w-9/12 cursor-pointer" />
      </Toolbar>
      <List className="top-7">
        {sideBarItems.map((item, index) => {
          if (item.more_items) {
            return (
              <SidebarMoreItem key={index} item={item} dataIndex={index} />
            );
          } else {
            return <SidebarItem key={index} item={item} dataIndex={index} />;
          }
        })}
      </List>
    </div>
  );

  const handleLogout = () => {
    // dispatch(
    //   setLayout({
    //     isShowFooter: false,
    //     isShowHeader: false,
    //   })
    // );
    Logout().then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% -  ${showHideNavbar ? drawerWidth : "0"}px)`,
          },
          ml: { sm: `${showHideNavbar ? drawerWidth : "0"}px` },
        }}
      >
        <Toolbar className="flex justify-between bg-white ">
          <div className="flex gap-x-2 items-center">
            {/* {!mobileOpen && (
              <>
                {showHideNavbar ? (
                  <img
                    src={LeftArrow}
                    onClick={() => setShowHideNavbar(false)}
                    alt="alt"
                    className="w-[20px] w-[20px] cursor-pointer"
                  />
                ) : (
                  <img
                    src={RightArrow}
                    onClick={() => setShowHideNavbar(true)}
                    alt="alt"
                    className="w-[20px] w-[20px] cursor-pointer"
                  />
                )}
              </>
            )} */}

            <h1 className="text-darkBlack font-bold text-lg">Dashboard</h1>
          </div>

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              marginRight: "auto",
              marginLeft: "10px",
              color: "black",
              display: { sm: "none" },
            }}
          >
            <GiHamburgerMenu />
          </IconButton>
          <div className="inline-flex items-center gap-2">
            <Question className="text-black-900 px-1" />
            <Notification className="text-black-900 px-1" />
            <Typography
              variant="h6"
              noWrap
              component="div"
              className={`!ml-auto rounded-full ${
                isDropdownOpen ? " ease-in duration-300  " : "bg-white"
              } flex items-center justify-center`}
              aria-describedby={"simple-popover"}
              onClick={handleClickDropdown}
            >
              <div className="flex items-center justify-around cursor-pointer">
              {initialValues1?.image?  <LazyImage
                              src={
                                import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                initialValues1?.image
                              }
                              // size={"small"}
                              className="h-10 w-10   border-2 rounded-full"
                            />:   <Avatar sizes={"small"} />}
                {/* <Avatar sizes="small" src={PersonIcon} /> */}
                {/* {isDropdownOpen ? (
                  <RxDropdownMenu height={20} width={20} fill="#000" />
                ) : (
                  <RxDropdownMenu height={20} width={20} fill="#000" />
                )} */}
              </div>
            </Typography>
            <Popover
              id={"simple-popover"}
              open={isDropdownOpen}
              anchorEl={anchorEl}
              onClose={handleCloseDropdown}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div className="w-64">
                <div className="flex flex-col justify-center items-center my-4">
                  <div className="flex pl-3 w-full font-semibold text-sm mt-3 cursor-pointer" onClick={() => 
                    { setIsDropdownOpen(false);
                      navigate("/profile")
                    }
                   }>
                    {initialValues1?.image?  <LazyImage
                              src={
                                import.meta.env.VITE_REACT_API_URL +
                                "/" +
                                initialValues1?.image
                              }
                              // size={"small"}
                              className="h-10 w-10   border-2 rounded-full"
                            />:   <Avatar sizes={"small"} />}
                 
                  
                    <div className="flex flex-col ml-3">
                      <p className="text-black-900 font-light text-sm">{initialValues1.first_name}</p>
                      <p className="text-black-900 text-opacity-30 font-normal text-xs  w-40 break-words">
                      {initialValues1.email}
                
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full mt-2">
                    {/* <SeperatorLine className="!border-gray-800"></SeperatorLine>
                    <p className="text-xs font-light text-black-900 pl-3 pt-2 cursor-pointer">
                      Profile Settings
                    </p> */}
                    <SeperatorLine className="!border-gray-800"></SeperatorLine>
                    <p className="text-xs font-light text-black-900 pl-3 pt-2 cursor-pointer">
                      Payment Method
                    </p>
                    <SeperatorLine className="!border-gray-800"></SeperatorLine>
                    <p className="text-xs font-light text-black-900 pl-3 pt-2 cursor-pointer" onClick={() =>{
                       setIsDropdownOpen(false);
                       navigate("/shorts")
                    }
                      }>
                      Manage Shorts
                    </p>
                    <SeperatorLine className="!border-gray-800"></SeperatorLine>
                    <p className="text-xs font-light text-black-900 pl-3 pt-2 cursor-pointer" onClick={() => navigate("/settings")}>
                      Setting
                    </p>
                    <SeperatorLine className="!border-gray-800"></SeperatorLine>
                    <p
                      onClick={() => setIsOpenSignoutPopup(true)}
                      className="text-xs font-light text-red-100 pl-3 pt-2 cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                </div>
                <div className="flex justify-around items-center bg-grey-200"></div>
              </div>
            </Popover>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: showHideNavbar ? drawerWidth : "0" },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#FFFFFF",
              boxShadow: "#00000029",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: showHideNavbar ? drawerWidth : "0",
              backgroundColor: "#FFFFFF",
              boxShadow: "#00000029",
            },
          }}
          open={showHideNavbar}
        >
          {drawer}
        </Drawer>
      </Box>
      <Popup
        isOpen={isOpenSignoutPopup}
        handleClose={() => setIsOpenSignoutPopup(false)}
        isShowHeader={true}
      >
        <div className="flex flex-col justify-center items-center gap-3">
          <LazyImage src={CircleCross} className=" mt-6" />
          <h5 className="font-semibold mt-5">Are you sure?</h5>
          <div className="flex flex-col justify-center items-center">
            <p className="font-medium ">
              Are you sure you want to <span className="font-bold">Sign out</span>{" "}
              
            </p>
            <p className="font-semibold ">from Dashboard ?</p>
          </div>

          <div className="space-y-3 mt-8 flex justify-around w-4/5">
            <CustomButton
              handleButtonClick={() => setIsOpenSignoutPopup(false)}
              label={"No"}
              type={"button"}
              variant={"outlined"}
              styleClass={
                "btn-gray-light w-full  !rounded-xl !font-medium mr-2 "
              }
            />
            <CustomButton
              handleButtonClick={handleLogout}
              label={"Yes, Logout"}
              type={"button"}
              variant={"outlined"}
              styleClass={"btn-red w-full !mt-0 !rounded-xl !font-medium ml-2"}
            />
          </div>
        </div>
      </Popup>
    </>
    
  );
};
export default SideBar;
