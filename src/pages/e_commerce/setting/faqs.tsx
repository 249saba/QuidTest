import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { Breadcrumbs } from "@material-tailwind/react";

const Faqs = () => {
  const navigate = useNavigate();
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/<span>FAQS</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"FAQS"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal"> FAQS</h5>
          </div>
        </div>
      </CustomCard>
      <CustomCard styleClass="p-4">
        <div className="flex flex-col text-black-900 justify-between ">
          <div className="flex faqsdiv border-[#70707033]  rounded  justify-between items-center h-12 ">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content2"
                id="panel1a-header2"
              >
                <Typography className="faqsdiv">What Is Frankzone?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <p className="text-left">
                FrankZone is a versatile online platform that brings together various categories and services to cater to the diverse needs of users. With its comprehensive admin panel and user panel, FrankZone offers a seamless experience for both administrators and users seeking different services.
                </p>
              </AccordionDetails>
            </Accordion>

            {/* <p>
              <span className="text-black-100">What is FrankZone</span>
            </p>
            <img src={ArrowRight} className="w-5 h-5" /> */}
          </div>
        </div>
      </CustomCard>
    </>
  );
};

export default Faqs;
