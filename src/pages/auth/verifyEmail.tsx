import CustomCard from "@src/shared/cards/customCard";

import CustomButton from "@src/shared/customButton";

import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GetStorage, SetStorage } from "@src/shared/utils/authService";
import ContentContainer from "@src/containers/contentContainer";
import Countdown from "react-countdown";
import LazyImage from "@src/shared/lazyImage";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Eye from "@assets/vendor/icons/eye.png";
import { ReactComponent as LockIcon } from "@assets/vendor/icons/lockIcon.svg";
import { TiMail } from "react-icons/ti";
import { useEffect, useState } from "react";
import { setLayout } from "@src/shared/slices/LayoutSlice";
import { ReactComponent as Mail } from "@assets/vendor/icons/mailBlack.svg";
import OtpInput from "react-otp-input";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import Footer from "@src/shared/footer";
import { addUpdateUser } from "../inbox/firebaseChat";
import { OnBoardingStatus } from "@src/shared/enum";
const renderTime = ({ remainingTime }: any) => {
  return (
    <div className="timer">
      <div className="text">Remaining</div>
      <div className="value">{remainingTime}</div>
      <div className="text">seconds</div>
    </div>
  );
};
const VerifyEmail = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0);
  const minuteSeconds = 30;
  const register = (type: string) => {
    navigate(`/${type}`);
  };

  const getTimeSeconds = (time: any) => (minuteSeconds - time) | 0;
  const handleSubmit = () => {
    let email = searchParams.get("email");
    let password = searchParams.get("password");
    setIsLoading(true);
    backendCall({
      url: "/api/vendor/login",
      method: "POST",
      data: { email: email, password: password },
    }).then((res) => {
      if (res && !res.error) {
        console.log(res);
        setIsLoading(false);
        handleToastMessage("success", res?.message);
        setKey(key + 1);
        // navigate({ search: `?email=${values.email}&password=${values.password}`, pathname: "/verify" });
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });

    // if (values.email === "business@codesorbit.com") {
    //   let data: StorageI = { data: values, userType: "business" };
    //   SetStorage(data);
    //   navigate(`/business/chooseMembership`);
    // } else {
    //   let data: StorageI = { data: values, userType: "jobSeeker" };
    //   SetStorage(data);
    //   navigate(`/`);
    // }
  };

  const handleLogin = () => {
    let email = searchParams.get("email");
    let _data = {
      email: email,
      otp: Number(otp),
    };
    backendCall({
      url: "/api/vendor/verify_otp",
      data: _data,
      method: "POST",
    }).then((res) => {
      if (res && !res.error) {
        let dataSet = res.data;
        dataSet.isLoggedIn = true;
        SetStorage(dataSet);
        if (dataSet.email) {
          let _userFirebaseData = {
            id: dataSet.id + "_vendor",
            userEmail: dataSet.email,
            online: true,
            userDisplayName: `${dataSet.first_name + " " + dataSet.last_name}`,
            userPhotoUrl: dataSet.image_url ? dataSet.image_url : "",
          };
          addUpdateUser(_userFirebaseData);
        }
        setIsLoading(false);
        handleToastMessage("success", res?.message);

        // navigate("/signup");
        let storage: any = GetStorage();
        let status = storage?.onBoardingStatus;
        if (status == OnBoardingStatus?.SHOP) {
          sessionStorage.setItem("step", String(1));
          navigate("/signup");
        } else if (status == OnBoardingStatus?.QUESTIONS) {
          sessionStorage.setItem("step", String(2));
          navigate("/signup");
        } else if (status == OnBoardingStatus.PAYMENT) {
          navigate("/payment");
        } else if (status == OnBoardingStatus?.COMPLETED) {
          // sessionStorage.setItem("step", String(3));
          dispatch(
            setLayout({
              isShowFooter: true,
              isShowHeader: true,
            })
          );
          navigate("/dashboard");
        }
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  const renderTime = (dimension:any, time:any) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };
  const date1 = Date.now() + 60000;
  console.log(date1);
  return (
    <div>
      <ContentContainer styleClass="login-bg-gradient !h-screen ">
        <div className="flex md:flex-col justify-between m-auto items-center gap-20">
          <div className="w-full text-left space-y-4">
            <h2 className=" font-medium leading-tight">
              Unleash The Power Of Ecommerce With Our Platform
            </h2>
            <p className="text-gray-900 font-light">
              Are you tired of struggling to reach new customers and grow your
              eCommerce business? Look no further than our website. Our platform
              makes it simple to add your online shop and start selling to a
              wider audience.
            </p>
          </div>

          <CustomCard styleClass=" w-8/12 flex flex-col text-[#A30000] justify-center items-center  px-10 py-6 gap-5">
            <Mail className="w-16 h-16 mx-auto" />
            <h5 className="font-semibold">Verification Code</h5>
            {/* <Countdown date={1694675122597} renderer={renderer} />, */}
            <CountdownCircleTimer
              key={key}
              isPlaying
              duration={30}
              colors="rgb(107 97 97)"
              // onComplete={() => {
              //   // handleSubmit()
              //   // do your stuff here
              //   return { shouldRepeat: false, delay: 1.5 }; // repeat animation in 1.5 seconds
              // }}
            >
              {({ elapsedTime, color }: any) => (
                <span style={{ color }}>
                  {renderTime("seconds",getTimeSeconds(elapsedTime))}
                </span>
              )}
            </CountdownCircleTimer>
            <p className="font-normal text-black-900">
              please enter the 6-digit Verification code Sent to your Email
            </p>
            <div className="flex justify-center">
              <OtpInput
                value={otp}
                // inputType={"number"}
                onChange={setOtp}
                numInputs={6}
                inputStyle={`focus:outline-transparent bg-white border-2 flex  border-black-900 text-2xl font-normal text-black-900 rounded-lg py-3 !w-14 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none `}
                renderSeparator={<span>&nbsp;&nbsp;&nbsp;</span>}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <CustomButton
              handleButtonClick={handleLogin}
              label="Verify & Proceed"
              type={"button"}
              styleClass="btn-black !rounded-md w-[80%] mx-auto"
            />
            <div className="flex items-center justify-center">
              <p className="font-normal text-black-900">
                Didn't recieved the email ?
              </p>
              <span
                className="font-normal text-blue-900 cursor-pointer"
                onClick={handleSubmit}
              >
                Resend Email
              </span>
            </div>
            <p className="text-gray-900 text-xs text-center flex gap-1 justify-center">
              Read our
              <a
                onClick={() => {
                  {
                    navigate({
                      search: `?state=TERMS`,
                      pathname: "/terms",
                    });
                  }
                }}
                className="text-blue-600 ml-1 cursor-pointer"
              >
                Terms & Conditions
              </a>
              &
              <a
                target="_blank"
                onClick={() => {
                  navigate({
                    search: `?state=PRIVACY`,
                    pathname: "/privacyPolicy",
                  });
                }}
                className="text-blue-600 ml-1 cursor-pointer"
              >
                Privacy Policy
              </a>
            </p>
          </CustomCard>
        </div>
      </ContentContainer>
      <ContentContainer>
        <div className="my-24 text-center">
          <h2 className=" leading-none">
            Unlock New Opportunities for Your Business:
          </h2>
          <h2 className="text-red-100 "> Register with Our Platform Today!</h2>
        </div>

        <div className="grid grid-cols-3 gap-8 justify-center items-center sm:grid-cols-2 pb-8">
          <CustomCard styleClass="relative space-y-10 pb-8 h-full">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={Eye}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Streamlined operations</h4>
              <p className="text-gray-500 font-light">
                Your platform might offer tools and resources that can help
                businesses streamline their operations and improve efficiency.
                For example, you might offer an inventory management system or
                analytics dashboard that can help businesses make more informed
                decisions about their operations.
              </p>
            </div>
          </CustomCard>
          <CustomCard styleClass="relative space-y-10 h-full pb-8">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={Eye}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Access to new customers</h4>
              <p className="text-gray-500 font-light">
                By tapping into your platform's customer base, businesses can
                gain access to a new set of customers who are already engaged
                with your platform. This can help to expand their customer base
                and increase revenue.
              </p>
            </div>
          </CustomCard>
          <CustomCard styleClass="relative space-y-10 h-full pb-8">
            <div className="flex justify-center">
              <LazyImage
                parentClass="absolute top-[-50px]"
                className="h-24 w-24 "
                src={Eye}
              ></LazyImage>
            </div>

            <div className="text-center space-y-4 p-6">
              <h4 className="font-medium">Increased visibilty</h4>
              <p className="text-gray-500 font-light">
                By registering with your platform, businesses can increase their
                visibility to potential customers who might not have otherwise
                known about their product or service. This can help to attract
                new customers and increase sales.
              </p>
            </div>
          </CustomCard>
        </div>
      </ContentContainer>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
