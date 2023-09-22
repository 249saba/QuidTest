import { useState, useEffect } from "react";
import ContentContainer from "@src/containers/contentContainer";
import PencilEditIcon from "@src/shared/icons/pencil-edit";
import paypalIcon from "@assets/images/icons/paypal-icon.png";
import stripeIcon from "@assets/images/icons/stripe-icon.png";
import DrawBoard from "@assets/vendor/images/undraw_done_re_oak4.png";
import GreenTick from "@assets/vendor/icons/green_tick.png";
import LazyImage from "@src/shared/lazyImage";
import CustomButton from "@src/shared/customButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@src/shared/navbar";
import Radio from "@src/shared/radio/radio";
import CustomCard from "@src/shared/cards/customCard";
import { handleToastMessage } from "@src/shared/toastify";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
const PaymentMethod = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const _Flow = searchParams.get("flow");
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<any>("");
  const [dashboardStats, setDashboardStats] = useState<any>({
    stripe_onboarding_completed: 0,
    paypal_onboarding_completed: 0,
  });

  useEffect(() => {
    _Flow === "paymentOnBoarding" && getDashobardStats();
  }, []);
  const getDashobardStats = () => {
    backendCall({
      url: `/api/vendor/dashboard/stats`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setDashboardStats(res.data);
      }
    });
  };
  const getStripeUrl = (paymentMethod: any) => {
    backendCall({
      url: "/api/vendor/create_checkout",
      method: "POST",
      data: { payment_method: paymentMethod },
    }).then((res) => {
      window.open(res?.data?.url);
    });
  };
  const getStripeUrlOnBoarding = () => {
    backendCall({
      url: "/api/vendor/stripe_onboarding",
      method: "GET",
    }).then((res) => {
      window.open(res?.data?.url);
    });
  };
  const getPaypalUrlOnBoarding = () => {
    backendCall({
      url: "/api/vendor/paypal_onboarding",
      method: "GET",
    }).then((res) => {
      window.open(res?.data?.href);
    });
  };
  const handleSelectCard = (method: any) => {
    setPaymentMethod(method);
  };
  const handlePayment = () => {
    if (paymentMethod === "STRIPE") {
      if (_Flow === "paymentOnBoarding") {
        !dashboardStats?.stripe_onboarding_completed &&
          getStripeUrlOnBoarding();
      } else {
        getStripeUrl("STRIPE");
      }
    } else if (paymentMethod === "PAYPAL") {
      if (_Flow === "paymentOnBoarding") {
        !dashboardStats?.paypal_onboarding_completed &&
        getPaypalUrlOnBoarding();
      } else {
        handleToastMessage("error", "PAYPAL");
      }
    }
  };
  return (
    <>
      <Header isShow={true} />
      <ContentContainer styleClass="login-bg-gradient  min-h-screen  !h-full  ">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg">
          <h3>Bank Information</h3>
          <CustomButton
            label="Back"
            labelClass="font-semibold"
            type={"button"}
            styleClass="btn-black !rounded-lg w-[28]"
            handleButtonClick={() => navigate("/dashboard")}
          />
        </div>
        <div>
          <div className="mt-3 flex flex-col justify-between items-start gap-5 sm:px-2">
            <div
              className={`flex items-center ${
                dashboardStats?.stripe_onboarding_completed
                  ? "bg-gray-300"
                  : "bg-white"
              }  rounded-lg w-full p-4 gap-3 ${
                paymentMethod === "STRIPE" &&
                !dashboardStats?.stripe_onboarding_completed
                  ? "border-2 border-blue-600 cursor-pointer"
                  : null
              }`}
              onClick={(e: any) => handleSelectCard("STRIPE")}
            >
              <div className={`flex gap-3 items-center`}>
                <LazyImage width="60px" height="100%" src={stripeIcon} />
                <h6 className="text-black-100">STRIPE</h6>
              </div>

              {/* <div className="ml-auto">
                  <PencilEditIcon className="w-10" />
                </div> */}
            </div>
          </div>
          <div className="mt-3 flex flex-col justify-between items-start gap-5 sm:px-2">
            <div
              className={`flex items-center  ${
                dashboardStats?.paypal_onboarding_completed
                  ? "bg-gray-300"
                  : "bg-white"
              } rounded-lg w-full p-4 gap-3 ${
                paymentMethod === "PAYPAL" &&
                !dashboardStats?.paypal_onboarding_completed
                  ? "border-2 border-blue-600 cursor-pointer"
                  : null
              }`}
              onClick={(e: any) => handleSelectCard("PAYPAL")}
            >
              <div className={`flex gap-3 items-center`}>
                <LazyImage width="60px" height="100%" src={paypalIcon} />
                <h6 className="text-black-100">Paypal</h6>
              </div>

              {/* <div className="ml-auto">
                  <PencilEditIcon className="w-10" />
                </div> */}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <CustomButton
            // isLoading={isLoading}
            label="Procced"
            labelClass="font-semibold"
            type={"button"}
            styleClass="btn-black !rounded-lg w-[28] mt-5"
            handleButtonClick={handlePayment}
          />
        </div>
      </ContentContainer>
    </>
  );
};
export default PaymentMethod;
