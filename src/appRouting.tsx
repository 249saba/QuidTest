import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import AuthGuard from "./shared/guards/authGuard";
import Login from "@pages/auth/login";
import HomeContainer from "./containers/homeContainer";
import Home from "@src/pages/home";
import ForgotPassword from "@pages/auth/forgotPassword";
import ResetPassword from "@pages/auth/resetPassword";
import Cart from "@src/pages/cartManagement/cart";
import CartManagement from "@pages/cartManagement";
import ChoosePayment from "@pages/cartManagement/choosePayment";
import Favourites from "@pages/favourites";
import FavouritesList from "@pages/favourites/favouritesList";
import MyOrders from "@pages/myOrders";
import MyOrdersList from "@src/pages/myOrders/myOrdersList";
import SelectPackage from "@pages/landing/selectPackage";
import Dashboard from "@pages/dashboard";
import PaymentDetails from "@pages/landing/paymentDetails";
import SelectShopType from "@pages/landing/selectShopType";
import SignUp from "@pages/auth/register";
import ThankYou from "@pages/auth/register/thankYou";
import VerifyEmail from "./pages/auth/verifyEmail";
import Products from "./pages/e_commerce/products";
import ProductsList from "./pages/e_commerce/products/productsList";
import ProductAdd from "./pages/e_commerce/products/productAdd";
import Promotions from "./pages/e_commerce/promotions";
import PromotionList from "./pages/e_commerce/promotions/promotionsList";
import PromotionAdd from "./pages/e_commerce/promotions/promotionAdd";
import Deals from "./pages/e_commerce/deals";
import DealsList from "./pages/e_commerce/deals/dealsList";
import DealsAdd from "./pages/e_commerce/deals/dealAdd";
import CategoriesList from "./pages/e_commerce/categories/categoriesList";
import Categories from "./pages/e_commerce/categories";
import CategoryAdd from "./pages/e_commerce/categories/categoryAdd";
import SelectCategory from "./pages/e_commerce/deals/selectCategory";
import AllCategory from "./pages/e_commerce/deals/dealCategory";
import AttributesList from "./pages/e_commerce/attributes/attributesList";
import AttributeAdd from "./pages/e_commerce/attributes/attributeAdd";
import Orders from "@pages/myOrders";
import ViewOrder from "./pages/myOrders/ViewOrder";
import Setting from "./pages/e_commerce/setting";
import AllSetting from "./pages/e_commerce/setting/allSetting";
import Notifications from "./pages/e_commerce/setting/notifications";
import AllNotifications from "./pages/e_commerce/setting/allNotifications";
import Banners from "./pages/e_commerce/setting/banner";
import ProductEdit from "@pages/e_commerce/products/productEdit";
import ProductSingleEdit from "@pages/e_commerce/products/productSingleEdit";
import ProductMultiEdit from "@pages/e_commerce/products/productMultiEdit";
import DeliveryManagement from "./pages/e_commerce/setting/deliveryManagement";
import BankInfo from "./pages/e_commerce/setting/bankInfo";
import DocumentVerify from "./pages/e_commerce/setting/documentVerify";
import WhatsNew from "./pages/e_commerce/setting/whatsNew";
import ShopListing from "./pages/e_commerce/setting/shopListing";
import Terms from "./pages/e_commerce/setting/terms";
import PrivacyPolicy from "./pages/e_commerce/setting/privacyPolicy";
import HelpSupport from "./pages/e_commerce/setting/helpSupport";
import Faqs from "./pages/e_commerce/setting/faqs";
import AboutUs from "./pages/e_commerce/setting/aboutUs";
import UpdateWhatsNew from "./pages/e_commerce/setting/updateWhatsNew";
import ViewDocument from "./pages/e_commerce/setting/viewDocument";
import UpdateDocuments from "@pages/e_commerce/setting/updateDocuments";
import ProfileSetting from "./pages/auth/profileSetting";
import Shorts from "./pages/e_commerce/shorts";
import ShortsList from "./pages/e_commerce/shorts/manageShorts";
import EditWhatsNew from "./pages/e_commerce/setting/edtWhatsNew";
import Inbox from "./pages/inbox";
import ChatList from "./pages/inbox/chatList";
import PaymentMethod from "./pages/auth/register/paymentMethod";

const routes = [
  { path: "/", component: <Login />, protectedPath: false, children: [] },
  { path: "/signup/:step?", component: <SignUp />, protectedPath: false },
  { path: "/verify", component: <VerifyEmail />, protectedPath: false },
  { path: "/thankyou", component: <ThankYou />, protectedPath: false },
  { path: "/payment", component: <PaymentMethod />, protectedPath: false },

  {
    path: "/forgotPassword",
    component: <ForgotPassword />,
    protectedPath: false,
  },
  {
    path: "/resetPassword",
    component: <ResetPassword />,
    protectedPath: false,
  },
  {
    path: "/",
    component: <HomeContainer />,

    children: [
      { path: "/categories", component: <Home />, protectedPath: false },
      { path: "/profile", component: <ProfileSetting />, protectedPath: true },
      { path: "/terms", component: <Terms />, protectedPath: false },
      {
        path: "/privacyPolicy",
        component: <PrivacyPolicy />,
        protectedPath: false,
      },
      { path: "/dashboard", component: <Dashboard />, protectedPath: true },
      {
        path: "/shorts",
        component: <Shorts />,
        protectedPath: true,
        children: [{ path: "", component: <ShortsList /> }],
      },
      {
        path: "/selectPackage",
        component: <SelectPackage />,
        protectedPath: false,
      },

      {
        path: "/paymentDetails",
        component: <PaymentDetails />,
        protectedPath: false,
      },
      {
        path: "/selectShopType",
        component: <SelectShopType />,
        protectedPath: false,
      },

      {
        path: "/products",
        component: <Products />,
        protectedPath: true,
        children: [
          { path: "", component: <ProductsList /> },
          { path: "addProduct/:id?", component: <ProductAdd /> },
          { path: "addProduct/:status?", component: <ProductAdd /> },
          { path: "editProduct/:id", component: <ProductEdit /> },
          { path: "editSingleVariant/:id", component: <ProductSingleEdit /> },
          { path: "editMultiVariant/:id", component: <ProductMultiEdit /> },
        ],
      },
      {
        path: "/categoriesList",
        component: <Categories />,
        protectedPath: true,
        children: [
          { path: "", component: <CategoriesList /> },
          { path: "addCategory", component: <CategoryAdd /> },
        ],
      },
      {
        path: "/attributes",
        component: <Products />,
        protectedPath: true,
        children: [
          { path: "", component: <AttributesList /> },
          { path: "addAttribute/:id?", component: <AttributeAdd /> },
        ],
      },

      {
        path: "/promotions",
        component: <Promotions />,
        protectedPath: true,
        children: [
          { path: "promotionsList", component: <PromotionList /> },
          { path: "addPromotion", component: <PromotionAdd /> },
          { path: "dealsList", component: <DealsList /> },
          { path: "addDeal/:name?", component: <DealsAdd /> },
          { path: "addDeal/:data", component: <DealsAdd /> },
          { path: "checkDeal", component: <SelectCategory /> },
          { path: "allCategory", component: <AllCategory /> },
        ],
      },

      {
        path: "/cartManagement",
        component: <CartManagement />,
        protectedPath: true,
        children: [
          { path: "", component: <Cart /> },
          { path: "choosePayment", component: <ChoosePayment /> },
        ],
      },

      {
        path: "/favourites",
        component: <Favourites />,
        protectedPath: true,
        children: [{ path: "", component: <FavouritesList /> }],
      },

      {
        path: "/orders",
        component: <Orders />,
        protectedPath: true,
        children: [
          { path: "", component: <MyOrdersList /> },
          { path: "viewOrder/:id?", component: <ViewOrder /> },
          { path: "viewOrder/:state?", component: <ViewOrder /> },
        ],
      },
      {
        path: "/inbox",
        component: <Inbox />,
        protectedPath: true,
        children: [{ path: "", component: <ChatList /> }],
      },
      {
        path: "/settings",
        component: <Setting />,
        protectedPath: true,
        children: [
          { path: "", component: <AllSetting /> },
          { path: "notifications", component: <Notifications /> },
          { path: "AllNotifications", component: <AllNotifications /> },
          { path: "banners", component: <Banners /> },
          { path: "deliveryManagement", component: <DeliveryManagement /> },
          { path: "bankInfo", component: <BankInfo /> },
          { path: "documentVerify", component: <ViewDocument /> },
          { path: "documents", component: <DocumentVerify /> },
          { path: "documents/:documentType", component: <UpdateDocuments /> },
          { path: "whatsNew", component: <WhatsNew /> },
          { path: "updateWhatsNew/:id", component: <UpdateWhatsNew /> },
          { path: "viewWhatsNew/:id", component: <EditWhatsNew /> },
          { path: "shopList", component: <ShopListing /> },
          { path: "terms", component: <Terms /> },
          { path: "privacyPolicy", component: <PrivacyPolicy /> },
          { path: "helpSupport", component: <HelpSupport /> },
          { path: "aboutUs", component: <AboutUs /> },
          { path: "faqs", component: <Faqs /> },
        ],
      },
    ],
  },
];
const AppRouting = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component, children }) => (
          <Route key={Math.random()} path={path} element={component}>
            {children &&
              children.map(({ path, component, protectedPath, children }) => (
                <Route
                  key={Math.random()}
                  path={path}
                  element={
                    <AuthGuard protectedPath={protectedPath}>
                      {component}
                    </AuthGuard>
                  }
                >
                  {children &&
                    children?.length > 0 &&
                    children.map(({ path, component }) => (
                      <Route
                        key={Math.random()}
                        path={path}
                        element={component}
                      />
                    ))}
                </Route>
              ))}
          </Route>
        ))}
        {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouting;
