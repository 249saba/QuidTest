import ContentContainer from "@src/containers/contentContainer";
import CustomCard from "@src/shared/cards/customCard";
import { ReactComponent as YellowPackage } from "@assets/vendor/package/guarantee_yellow.svg";
import { ReactComponent as BluePackage } from "@assets/vendor/package/guarantee_blue.svg";
import { ReactComponent as PinkPackage } from "@assets/vendor/package/guarantee_pink.svg";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import { CgCheck } from "react-icons/cg";
import LazyImage from "@src/shared/lazyImage";
import CustomButton from "@src/shared/customButton";
import { useNavigate, useParams } from "react-router-dom";
import { GetStorage, SetStorage } from "@src/shared/utils/authService";
import { useDispatch } from "react-redux";
import { setLayout } from "@src/shared/slices/LayoutSlice";
import { useEffect, useState } from "react";
import { GetPlansByModuleId } from "@src/shared/apiService";
import { PlansModel } from "@src/shared/models";
import { Spinner } from "@src/shared/spinner/spinner";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import { handleToastMessage } from "@src/shared/toastify";
import GoogleAuth from "@src/shared/socialLogin/googleLogin";
import FacebookAuth from "@src/shared/socialLogin/facebookLogin";
// const eCommercePackages = [
//   {
//     id: 1,
//     title: "D1 Package",
//     pricePerDeal: "8%",
//     icon: <YellowPackage className="px-6" />,
//     textColor: "text-yellow-200",
//     iconColor: "bg-yellow-100",
//     btnClass: "btn-yellow !h-10",
//     dealItems: [
//       { id: 1, title: "Show And Sell Deals" },
//       { id: 2, title: "Menu/ Service Show But Only Local Sale" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Can Be Displayed But Only The Deals Can Be Sold In The App. Items From Menu Can Only Be Sold Locally/In Store.",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "D1 Premium",
//     pricePerDeal: "8%",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Up To Users" },
//       { id: 2, title: "Deals Only, List The Shop" },
//       { id: 3, title: "Choose The Best Plan For" },
//     ],
//   },
//   {
//     id: 3,
//     title: "D2 Package",
//     pricePerDeal: "4,99€",
//     icon: <PinkPackage className="px-6" />,
//     textColor: "text-pink-100",
//     iconColor: "bg-pink-100",
//     btnClass: "btn-pink !h-10",
//     dealItems: [
//       { id: 1, title: "Menu And Deals Only Displayed" },
//       { id: 2, title: "Menu/ Service Show And Sell" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Are Displayed And Can Only Be Sold In Store/Locally",
//       },
//     ],
//   },
// ];

// const foodPackages = [
//   {
//     id: 1,
//     title: "Package",
//     pricePerDeal: "8%",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Micropage" },
//       { id: 1, title: "Online Menu" },
//       { id: 1, title: "Google Bewrtungen" },
//       { id: 1, title: "Open Table" },
//       { id: 1, title: "Chat Function" },
//       { id: 1, title: "Info Button" },
//       { id: 2, title: "QR Code" },
//     ],
//   },
// ];

// const beautyHealthPackage = [
//   {
//     id: 1,
//     title: "D1 Package",
//     pricePerDeal: "8%",
//     icon: <YellowPackage className="px-6" />,
//     textColor: "text-yellow-200",
//     iconColor: "bg-yellow-100",
//     btnClass: "btn-yellow !h-10",
//     dealItems: [
//       { id: 1, title: "Show And Sell Deals" },
//       { id: 2, title: "Menu/ Service Show But Only Local Sale" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Can Be Displayed But Only The Deals Can Be Sold In The App. Items From Menu Can Only Be Sold Locally/In Store.",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "D1 Premium",
//     pricePerDeal: "8%",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Show And Sell Deals" },
//       { id: 2, title: "Menu/ Service Show But Only Local Sale" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Can Be Displayed But Only The Deals Can Be Sold In The App. Items From Menu Can Only Be Sold Locally/In Store.",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "D2 Package",
//     pricePerDeal: "4,99€",
//     icon: <PinkPackage className="px-6" />,
//     textColor: "text-pink-100",
//     iconColor: "bg-pink-100",
//     btnClass: "btn-pink !h-10",
//     dealItems: [
//       { id: 1, title: "Menu And Deals Only Displayed" },
//       { id: 2, title: "Menu/ Service Show And Sell" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Are Displayed And Can Only Be Sold In Store/Locally",
//       },
//     ],
//   },
// ];

// const handyMenPackage = [
//   {
//     id: 1,
//     title: "H1",
//     pricePerDeal: "8%",
//     icon: <YellowPackage className="px-6" />,
//     textColor: "text-yellow-200",
//     iconColor: "bg-yellow-100",
//     btnClass: "btn-yellow !h-10",
//     dealItems: [
//       { id: 1, title: "Show And Sell Deals" },
//       { id: 2, title: "Menu/ Service Show But Only Local Sale" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Can Be Displayed But Only The Deals Can Be Sold In The App. Items From Menu Can Only Be Sold Locally/In Store.",
//       },
//     ],
//   },
//   {
//     id: 2,
//     title: "H1 Premium",
//     pricePerDeal: "8%",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Show And Sell Deals" },
//       { id: 2, title: "Menu/ Service Show But Only Local Sale" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Can Be Displayed But Only The Deals Can Be Sold In The App. Items From Menu Can Only Be Sold Locally/In Store.",
//       },
//     ],
//   },
//   {
//     id: 3,
//     title: "H2",
//     pricePerDeal: "4,99€",
//     icon: <PinkPackage className="px-6" />,
//     textColor: "text-pink-100",
//     iconColor: "bg-pink-100",
//     btnClass: "btn-pink !h-10",
//     dealItems: [
//       { id: 1, title: "Menu And Deals Only Displayed" },
//       { id: 2, title: "Menu/ Service Show And Sell" },
//       {
//         id: 3,
//         title:
//           "Info: Deals And Menu Are Displayed And Can Only Be Sold In Store/Locally",
//       },
//     ],
//   },
// ];

// const doctorPackage = [
//   {
//     id: 1,
//     title: "Package",
//     pricePerDeal: "9,99€",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Micropage" },
//       { id: 1, title: "Terminkalender" },
//       { id: 1, title: "Google Bewrtungen" },
//       { id: 1, title: "Frankshorts" },
//       { id: 1, title: "Chat Function" },
//       { id: 1, title: "Info Button" },
//       { id: 2, title: "QR Code" },
//     ],
//   },
// ];

// const onlineConsultingPackage = [
//   {
//     id: 1,
//     title: "D3",
//     pricePerDeal: "9,99€",
//     icon: <BluePackage className="px-6" />,
//     textColor: "text-blue-900",
//     iconColor: "bg-blue-900",
//     btnClass: "btn-blue",
//     dealItems: [
//       { id: 1, title: "Micropage" },
//       { id: 1, title: "Terminkalender" },
//       { id: 1, title: "Google Bewrtungen" },
//       { id: 1, title: "Frankshorts" },
//       { id: 1, title: "Chat Function" },
//       { id: 1, title: "Info Button" },
//       { id: 2, title: "QR Code" },
//     ],
//   },
// ];

const SelectPackage = () => {
  const dispatch = useDispatch();
  const [social, setSocial] = useState<any>("");
  const [packages, setPackage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPlansByModuleId();
    let social = sessionStorage.getItem("social");
    setSocial(social);
  }, []);

  const getPlansByModuleId = () => {
    setIsLoading(true);
    GetPlansByModuleId().then((res) => {
      if (res && !res.error) {
        console.log(res.data);
        setPackage(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  // var packages = eCommercePackages;
  const navigate = useNavigate();
  var title = "Ecommerce Shopping";
  // const setPackage = () => {
  //   let { id } = useParams();
  //   switch (Number(id)) {
  //     case 1:
  //       packages = eCommercePackages;
  //       title = "Ecommerce Shopping";
  //       break;
  //     case 2:
  //       packages = foodPackages;
  //       title = "Food (Essen & Lokale)";
  //       break;
  //     case 3:
  //       packages = beautyHealthPackage;
  //       title = "Beauty & Health";
  //       break;

  //     case 4:
  //       packages = handyMenPackage;
  //       title = "Handymen";
  //       break;

  //     case 5:
  //       packages = doctorPackage;
  //       title = "Doctor";
  //       break;

  //     case 6:
  //       packages = onlineConsultingPackage;
  //       title = "Online Consulting";
  //       break;

  //     default:
  //       packages = eCommercePackages;
  //       return;
  //   }
  // };
  // setPackage();

  const submit = (item: PlansModel) => {
    localStorage.setItem("plan_id", String(item.id));
    navigate("/signup");
    // dispatch(
    //   setLayout({
    //     isShowFooter: true,
    //     isShowHeader: true,
    //   })
    // );
  };
  const submitPlan = (item: PlansModel) => {
    localStorage.setItem("plan_id", String(item.id));
    // navigate("/signup");
    // dispatch(
    //   setLayout({
    //     isShowFooter: true,
    //     isShowHeader: true,
    //   })
    // );
  };
  const handleAuthData = async (loginData: any) => {
    console.log("loginData ==", loginData);
    let storage: any = GetStorage();
    const formData = new FormData();
    let email = storage?.email;

    formData.append("apiType", "login");

    let plan_id = Number(localStorage.getItem("plan_id"));
    let module_id = Number(localStorage.getItem("moduleId"));
    formData.append("social_media_token", loginData.social_media_token);
    formData.append("social_media_platform", loginData.social_media_platform);
    formData.append("email", loginData.email);
    formData.append("module_id", JSON.stringify(module_id));
    formData.append("plan_id", JSON.stringify(plan_id));

    backendCall({
      url: "/api/vendor/social_login",
      method: "POST",
      data: formData,
    }).then((res) => {
      if (res && !res.error) {
        let dataSet = res.data;
        dataSet.isLoggedIn = true;
        console.log("dataSet", dataSet);
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
  console.log("social", social);
  return (
    <ContentContainer styleClass="gap-12  h-screen !h-full login-gradient ">
      <div className="mt-5 space-y-5 w-[60%] mx-auto">
        <h4 className="font-semibold">{title}</h4>
        <h6 className="text-gray-500 font-light">
          We Are Looking Forward To Welcoming You To The Frankzone Community. We
          Will Be In Touch With You Son To Ensure That You Have Everything You
          Need To Get Started.
        </h6>
      </div>
      <Spinner isLoading={isLoading} />
      {!isLoading && (
        <section
          className={`flex flex-row sm:flex-col md:flex-col  gap-12 justify-center  items-center pb-8`}
        >
          {packages?.splice(0,3)?.map((item: PlansModel,index) => (
            <CustomCard
              key={index}
              styleClass={index==0 ||index==2?`px-3 rounded-md basis-1/4 w-full px-4 py-4`:`px-3 rounded-md basis-1/3 w-full px-8 py-8`}
            >
              <div className={index==0 ||index==2?"flex flex-col justify-center items-center gap-4 p-6":"flex flex-col justify-center items-center gap-8 p-6"}>
                {/* <h5 className="font-semibold capitalize">Shopping</h5> */}
                <h5 className="font-semibold capitalize">  {item.title}</h5>
                {/* <p className="font-normal capitalize text-black-100">
                  {item.title}
                </p> */}
                <p className="font-normal capitalize text-black-100">
                  Listing of 4.99 euro
                </p>
                {index==0? <YellowPackage className="px-6" />:index==1? <BluePackage className="px-6" />:<PinkPackage className="px-6"/>}
               
      
                <h5 className={`  flex items-center font-medium ${index==0?"text-[#FFD960]":index==2?"text-[#FFA2BA]":"text-blue-600"}`}>
                  {item.price}$/{" "}
                  <span className="text-sm font-normal ">{item.interval}</span>
                </h5>
              </div>
              <SeperatorLine className="!border-gray-800" />

              <section className="flex flex-col items-start gap-5 mt-4">
              <div className="flex items-center gap-2">
                    <CgCheck className={` rounded-full ${index==0?"bg-[#FFD960]":index==2?"bg-[#FFA2BA]":"bg-blue-600"}`} />
                    <div
                  className="text-black-900"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
                  </div>
               
                {/* {item.dealItems.map((itemDetail, index) => (
                <div key={index} className="flex gap-2 items-start w-full">
                  <div>
                    <CgCheck className={`${item.iconColor} rounded-full `} />
                  </div>
                  <p className="text-black-900 text-xs text-left w-[90%] leading-loose relative bottom-1">
                    {itemDetail.title}
                  </p>
                </div>
              ))} */}
              </section>
              {social == "Google" ? (
                <GoogleAuth
                  // className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                  handleAuthData={handleAuthData}
                  styleClass={`bg-blue-600 !rounded-md w-1/2 mx-auto mt-5 `}
                  className=""
                  label="Choose"
                  handleButtonClick={() => submitPlan(item)}
                />
              ) : social == "Facebook" ? (
                <FacebookAuth
                  // className="btn-white justify-start text-center  !rounded-lg w-full !border-gray-300 !border-[1px] !shadow-none"
                  handleAuthData={handleAuthData}
                  styleClass={`bg-blue-600 !rounded-md w-1/2 mx-auto mt-5 `}
                  label="Choose"
                  className="text-white"
                  handleButtonClick={() => submitPlan(item)}
                />
              ) : (
                <CustomButton
                  label="Choose"
                  type="button"
                  styleClass={` !rounded-md w-[70%] mx-auto mt-5  ${index==0?"bg-[#FFD960]":index==2?"bg-[#FFA2BA]":"bg-blue-600"}`}
                  handleButtonClick={() => submit(item)}
                />
              )}
            </CustomCard>
          ))}
        </section>
      )}
    </ContentContainer>
  );
};

export default SelectPackage;
