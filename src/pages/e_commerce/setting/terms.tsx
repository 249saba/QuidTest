import ShellContainer from "@src/containers/shellContainer";
import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import Checkbox from "@src/shared/checkbox/checkbox";
import Switch from "@mui/material/Switch";
import ArrowRight from "@assets/icons/gray_right_arrow.png";
import { Link, useNavigate,useSearchParams } from "react-router-dom";
import "@src/index.scss";
import LazyImage from "@src/shared/lazyImage";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import Header from "@src/shared/navbar";
import { Breadcrumbs } from "@material-tailwind/react";

const Terms = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let status = searchParams.get("state");
  console.log("status",status)
  return (
    <>
    {/* <Header isShow={false} /> */}
      <CustomCard styleClass= {status=="TERMS"?"p-4 mt-20":"p-4"} >
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Terms & Conditions</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"Terms & Conditions"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal"> Terms & Conditions</h5>
          </div>
        </div>
        <div className="flex flex-col text-black-900 justify-between pt-2">
          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div
            className="flex flex-col justify-between items-start "
            // onClick={() => {
            //   navigate("/settings/AllNotifications");
            // }}
          >
            <p>
              <span className="font-medium text-black-700">Agreement</span>
            </p>
            <ul className="flex flex-col items-start text-left pt-3">
              <li>
                {" "}
                Welcome to FrankZone! These terms and conditions outline the
                rules and guidelines for your use of our platform. By accessing
                or using FrankZone, you agree to abide by these terms. Please
                read them carefully.
              </li>
              <li>1. Account Registration</li>
              <li>2. User Obligations </li>
              <li>3.Prohibited Activities </li>
              <li>4. Third-Party Services </li>
              <li>5. Limitation of Liability</li>
              <li>6. Termination</li>
              <li>7. Modifications</li>
              <li>8. Governing Law If you</li>
              <li>
                If You have any questions or concerns regarding these terms and
                conditions, please contact our support team. Thank you for using
                FrankZone and abiding by these terms as you enjoy our platform.
              </li>
            </ul>
          </div>
        </div>
      </CustomCard>
    </>
  );
};

export default Terms;
