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
import { Breadcrumbs } from "@material-tailwind/react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  let status = searchParams.get("state");
  
  return (
    <>
      <CustomCard styleClass= {status=="PRIVACY"?"p-4 mt-20":"p-4"}>
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/
              <span>Privacy Policy</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              {/* <Link to="" className="text-gray"> */}
              <p>{"Privacy Policy"}</p>
              {/* </Link> */}
            </Breadcrumbs>

            <h5 className="font-normal"> Privacy Policy</h5>
          </div>
        </div>
        <div className="flex flex-col text-black-900 justify-between pt-2">
          <SeperatorLine className="rotate-10 w-full !border-gray-300 " />
          <div
            className="flex flex-col justify-between items-start pt-4 "
            // onClick={() => {
            //   navigate("/settings/AllNotifications");
            // }}
          >
            <p>
                
              <span className="font-medium text-black-700">Agreement</span>
            </p>
            <ul className="flex flex-col items-start text-left pt-3 text-gray-400 font-poppins">
              <li>
                At FrankZone, we prioritize the privacy and security of our
                users' personal information. This Privacy Policy outlines how we
                collect, use, disclose, and protect user data when you interact
                with our platform. By using FrankZone, you consent to the
                practices described in this policy. We collect personal
                information such as names, email addresses, and contact details
                when you register an account or engage with our services. This
                information is used to provide a personalized and seamless
                experience, improve our services, and communicate important
                updates.We may also collect non-personal information, such as
                device information and website usage data, to analyze trends,
                enhance functionality, and optimize user experience. This data
                is collected through cookies and similar technologies. FrankZone
                may update this Privacy Policy periodically, and any changes
                will be communicated to you through the platform or via email.
                By continuing to use our services after such updates, you
                indicate your acceptance of the revised Privacy Policy. Please
                take the time to review this Privacy Policy thoroughly. Your
                continued use of FrankZone signifies your understanding and
                agreement with our practices regarding the collection, use, and
                protection of your personal information. If you have any
                questions or require further clarification, please don't
                hesitate to reach out to our privacy team. Thank you for
                choosing FrankZone.
              </li>
            </ul>

          </div>
        </div>
      </CustomCard>
    </>
  );
};

export default PrivacyPolicy;
