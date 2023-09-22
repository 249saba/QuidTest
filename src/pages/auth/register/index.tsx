import { Step, StepButton, StepLabel, Stepper, styled } from "@mui/material";
import ContentContainer from "@src/containers/contentContainer";
import { useEffect, useState } from "react";
import Personal from "@assets/icons/Personal.png";
import Shop from "@assets/icons/Shop.png";
import { ReactComponent as Question } from "@assets/icons/ProfileQuestion.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import GoogleAuth from "@src/shared/socialLogin/googleLogin";
import { handleToastMessage } from "@src/shared/toastify";
import SignUpStep1 from "./signUpStep1";
import SignUpStep2 from "./signUpStep2";
import SignUpStep3 from "./signUpStep3";
import LazyImage from "@src/shared/lazyImage";
import { Check } from "@mui/icons-material";
import Header from "@src/shared/navbar";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { GetStorage, SetStorage } from "@src/shared/utils/authService";

const SignUp = () => {
  const steps = [
    {
      label: "Personal Information",
      icon: <LazyImage src={Personal} className="w-5 h-5" />,
    },
    {
      label: "Shop Profile",
      icon: <LazyImage src={Shop} className="w-5 h-5" />,
    },
    {
      label: "Shop Questions",
      icon: <LazyImage src={Question} className="w-5 h-5" />,
    },
  ];
  const [step, setStep] = useState(0);
  const [social, setSocial] = useState<any>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const _step = searchParams.get("step");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState<{
    [k: number]: boolean;
  }>({});
  console.log("activeStep", activeStep);
  useEffect(() => {
    let step = Number(sessionStorage.getItem("step"));
    setStep(step);
    let social = sessionStorage.getItem("Google");
    setSocial(social);
    handleStepper(step);
  }, []);

  const handleStep = (step: number) => {
    setStep(step);
    handleStepper(step);
    setActiveStep(step);
    sessionStorage.setItem("step", String(step));
  };

  const handleStepper = (step1: number) => {
    console.log("step", step);
      setStep(step1);
      setActiveStep(step1);
    
    // if (step1 >= step) {
    //   setStep(step1);
    // }

    
  };
  const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean };
  }>(({ theme, ownerState }) => ({
    // backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#fff',
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    border: "2px solid #C5C5C5",
    borderWidth: "2px !important",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
      backgroundColor: "#54CF2E",
      boxShadow: "#54CF2E",
    }),
    ...(ownerState.completed && {
      backgroundColor: "#54CF2E",
      boxShadow: "#54CF2E",
      // icon:<Personal />,
    }),
  }));

  function ColorlibStepIcon(props: any) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: <LazyImage src={Personal} className="w-5 h-5" />,
      2: <LazyImage src={Shop} className="w-5 h-5" />,
      3: <Question />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          icons[String(props.icon)]
        )}
      </ColorlibStepIconRoot>
    );
  }
  const handleAuthData = async (loginData: any) => {
    console.log("loginData ==", loginData);
    backendCall({
      url: "/api/vendor/social_login",
      method: "POST",
      data: loginData,
    }).then((res) => {
      if (res && !res.error) {
        let dataSet = res.data;
        dataSet.isLoggedIn = true;
        console.log("dataSet",dataSet)
        SetStorage(dataSet);
        setIsLoading(false);
        handleToastMessage("success", res?.message);

        // navigate("/signup");
        let storage: any = GetStorage();
        let status = storage?.onBoardingStatus;
        if (status == "SHOP") {
          sessionStorage.setItem("step", String(1));
          navigate("/signup");
        } else if (status == "QUESTIONS") {
          sessionStorage.setItem("step", String(2));

          navigate("/signup");
        } else if (status == "COMPLETED") {
          // sessionStorage.setItem("step", String(3));
          // dispatch(
          //   setLayout({
          //     isShowFooter: true,
          //     isShowHeader: true,
          //   })
          // );
          navigate("/dashboard");
        }
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  return (
    <>
      {" "}
      <Header isShow={true} />
          {/* <GoogleAuth
                        className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                        handleAuthData={handleAuthData}
                      /> */}
      <ContentContainer styleClass="login-bg-gradient min-h-screen  !h-full gap-20  ">
        <div className="block w-1/2 mx-auto sm:w-full">
          <Stepper alternativeLabel activeStep={activeStep}>
            {steps.map((step, index) => (
              <Step key={step.label} onClick={() => handleStepper(index)}>
                <StepLabel
                  StepIconComponent={ColorlibStepIcon}
                  onClick={() => handleStepper(index)}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        {step == 0 && <SignUpStep1 handleStep={handleStep} />}
        {step == 1 && <SignUpStep2 handleStep={handleStep} />}
        {step == 2 && <SignUpStep3 handleStep={handleStep} />}
      </ContentContainer>
    </>
  );
};
export default SignUp;
