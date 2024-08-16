import React, { Fragment } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
} from "@material-tailwind/react";
import Logo from "@assets/icons/Placeholder_Logo.png";
import Neighborly_new from "@assets/icons/Neighborly_new.png";
import Directory from "@assets/icons/Directory.png";
import Ask_a_pro from "@assets/icons/Ask_a_pro.png";
import jobs from "@assets/icons/jobs.png";
import Biz_for_sale from "@assets/icons/Biz_for_sale.png";
import Fund_me from "@assets/icons/Fund_me.png";
import Deals from "@assets/icons/Deals.png";
import location from "@assets/icons/location.png";
import search from "@assets/icons/search.png";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
} from "@heroicons/react/24/outline";
import CustomButton from "./customButton";
import { useNavigate } from "react-router-dom";

export interface IFooterProps {
  isShow?: boolean;
}

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full"
            >
              <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid"
        >
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md"
          >
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  {
    label: "Neighborly news",
    icon: Neighborly_new,
    link: "/",
  },
  {
    label: "Directory",
    icon: Directory,
    link: "/myOrders",
  },
  {
    label: "Ask a pro",
    icon: Ask_a_pro,
    link: "/",
  },
  {
    label: "jobs",
    icon: jobs,
    link: "/favourites",
  },
  {
    label: "Biz for Sale",
    icon: Biz_for_sale,
    link: "/favourites",
  },
  {
    label: "Fund Me",
    icon: Fund_me,
    link: "/favourites",
  },
  {
    label: "Deals",
    icon: Deals,
    link: "/favourites",
  },
];

function NavList({ handleNavToggle }: any) {
  const navigate = useNavigate();
  const handleNavigation = (link: string) => {
    navigate(link);
    handleNavToggle();
  };
  return (
    <ul className="mb-4 mt-5 gap-4  flex flex-col    lg:flex-row lg:items-center ">
      {/* <NavListMenu /> */}
      <>
        {/* {navListItems.map(({ label, icon, link }, key) => (
          <h6
            key={key}
            onClick={() => handleNavigation(link)}
            className={`lg:mx-4 sm:mx-0 md:mx-0 whitespace-nowrap  sm:text-black-900 text-black-900 sm:text-right md:text-right hov-border  w-full }`}
          >
            {label}
          </h6>
        ))} */}

        <div className="inline-flex ml-auto space-x-2 items-center   lg:hidden">
          <CustomButton
            label={"Login"}
            type={"submit"}
            isLoading={false}
            variant={"outlined"}
            styleClass={"btn-white "}
            handleButtonClick={() => handleNavigation("/login")}
          />
          <CustomButton
            label={"Sign Up"}
            type={"submit"}
            isLoading={false}
            variant={"outlined"}
            styleClass={"btn-black "}
            handleButtonClick={() => handleNavigation("/signup")}
          />

          {/* <ProfileMenu /> */}
        </div>
      </>
    </ul>
  );
}

export default function NavBar({ isShow }: IFooterProps) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);
  const navigate = useNavigate();
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 1100 && setIsNavOpen(false)
    );
  }, []);

  return (
    <div className=" fixed !z-[100]  p-2 lg:px-6 md:px-6 sm:px-6 rounded-none w-full opacity-90 bg-white">
      <div className="relative mx-auto flex items-center text-black-900 space-x-3">
        <div className="inline-flex">
          <img
            src={Logo}
            onClick={() => navigate("/")}
            className="w-9/12 cursor-pointer"
          />
        </div>
        <div className=" flex flex-row justify-between items-center border h-10 rounded-full border-black-100 px-4 w-2/4">
          <label className=" flex  text-black-700 font-semibold">
            Car Detail Biz
          </label>
          <div className="flex items-center justify-center">
            <span>|</span>
            <img src={location} className="h-5 w-5" />
            <span>Houston, TX 7707</span>
            <img src={search} className="h-5 w-5" />
          </div>
        </div>
        <CustomButton
          label={"About"}
          type={"submit"}
          isLoading={false}
          handleButtonClick={() => navigate("/login")}
          variant={"outlined"}
          styleClass={"btn-white"}
        />
        <CustomButton
          label={"Advertise"}
          type={"submit"}
          isLoading={false}
          handleButtonClick={() => navigate("/login")}
          variant={"outlined"}
          styleClass={"btn-white "}
        />
        {/* </IconButton> */}
        <div className="absolute top-1/4 right-[1%] flex gap-3">
        {navListItems.map((item)=>
        <div className="flex flex-col items-center justify-center">
          <img src={item.icon} className="h-5 w-5"/>
          <label className="font-semibold">{item.label}</label>
          
        </div>)}
     
   
       
   
      </div>
      <MobileNav open={isNavOpen} className="">
        <NavList handleNavToggle={toggleIsNavOpen} />
      </MobileNav>
      </div>
    </div>
  );
}
