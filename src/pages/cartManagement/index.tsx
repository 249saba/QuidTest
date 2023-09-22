import ContentContainer from "@src/containers/contentContainer";
import BreadCrumb from "@src/shared/breadCrumbs/breadCrumb";
import { ICrumbs } from "@shared/interfaces";
import { Outlet } from "react-router-dom";

const CartManagement = () => {
  const item: ICrumbs = { title: "Vendors", link: "/" };

  return (
    <ContentContainer styleClass="gap-10">
      <div className="w-full py-8 overflow-hidden">
        <div className="flex justify-between items-center pb-4">
          <div className=" text-black-900 flex font-normal  items-center">
            <BreadCrumb item={item} />
          </div>
        </div>
        <Outlet />
      </div>
    </ContentContainer>
  );
};
export default CartManagement;
