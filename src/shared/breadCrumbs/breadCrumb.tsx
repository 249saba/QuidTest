import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import ArrowNextIcon from "@src/shared/icons/arrow-next";
import { ICrumbs } from "@shared/interfaces";
import LazyImage from "@shared/lazyImage";
import BackIcon from "@assets/images/icons/arrow_back.svg";
import { useNavigate } from "react-router-dom";

// function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
//   event.preventDefault();
//   console.info("You clicked a breadcrumb.");
// }

const BreadCrumb = ({ item }: any) => {
  const navigate = useNavigate();
  const breadCrumbs: ICrumbs[] = [
    { title: "Home", link: "/" },
    { title: "E-commerce", link: "/" },
    // { title: "Vendors", link: "/" },
  ];
  breadCrumbs.push(item);
  const breadcrumbs = breadCrumbs.map((item: ICrumbs, index: any) => (
    <h5
      onClick={() => navigate(item.link)}
      className={`text-black-900 font-normal hover:underline hover:cursor-pointer ${
        breadCrumbs.length == ++index ? "text-blue-900" : ""
      }`}
    >
      {item.title}
    </h5>
  ));

  return (
    <Stack direction="row" alignItems="start" spacing={2}>
      <LazyImage
        routerLink={-1}
        className=" h-8 sm:h-6 "
        src={BackIcon}
        alt=""
      />
      <Breadcrumbs
        separator={<ArrowNextIcon height="14" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadCrumb;
