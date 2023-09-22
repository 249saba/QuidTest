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
import { ReactComponent as Logo } from "@assets/Logo.svg";
import { ReactComponent as CartIcon } from "@assets/icons/frank-shopping-bag.svg";
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
import { IsAuthenticated } from "./utils/authService";

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
    label: "Home",
    icon: UserCircleIcon,
    link: "/",
  },
  {
    label: "My Orders",
    icon: CubeTransparentIcon,
    link: "/myOrders",
  },
  {
    label: "My Bookings",
    icon: CodeBracketSquareIcon,
    link: "/",
  },
  {
    label: "My Favorites",
    icon: CodeBracketSquareIcon,
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
        {navListItems.map(({ label, icon, link }, key) => (
          <h6
            key={key}
            onClick={() => handleNavigation(link)}
            className={`lg:mx-4 sm:mx-0 md:mx-0 whitespace-nowrap  sm:text-black-900 text-black-900 sm:text-right md:text-right hov-border  w-full }`}
          >
            {label}
          </h6>
        ))}
        <div className="inline-flex ml-auto space-x-2 items-center  lg:hidden">
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
    <Navbar className=" fixed !z-[100] !bg-white p-2 lg:px-12 md:px-6 sm:px-6 rounded-none max-w-none">
      <div className="relative mx-auto flex items-center text-black-900">
        {/* <IconButton size="sm" variant="text"> */}
        <div className="inline-flex">
          <Logo
            onClick={() => navigate("/")}
            className="w-9/12 cursor-pointer"
          />
        </div>
        {/* </IconButton> */}
        {/* <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div> */}
        {/* <div className="inline-flex ml-auto space-x-2 items-center ">
          <IconButton className="mr-4" size="lg" variant="text">
            <CartIcon className="h-8 w-8" />
          </IconButton>
          <CustomButton
            label={"Login"}
            type={"submit"}
            isLoading={false}
            handleButtonClick={() => navigate("/login")}
            variant={"outlined"}
            styleClass={"btn-white sm:hidden md:hidden "}
          />
          <CustomButton
            label={"Sign Up"}
            type={"submit"}
            isLoading={false}
            variant={"outlined"}
            styleClass={"btn-black  sm:hidden md:hidden"}
            handleButtonClick={() => navigate("/signup")}
          />

        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto sm:ml-0 md:ml-0 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton> */}
      </div>
      <MobileNav open={isNavOpen} className="">
        <NavList handleNavToggle={toggleIsNavOpen} />
      </MobileNav>
    </Navbar>
  );
}
