import ContentContainer from "@src/containers/contentContainer";
import SearchSuggestion from "@src/shared/searchSuggestion";
import { ReactComponent as SearchIcon } from "@assets/icons/search-icon.svg";
import CustomButton from "@src/shared/customButton";
import BreadCrumb from "@src/shared/breadCrumbs/breadCrumb";
import { ICrumbs } from "@shared/interfaces";
import { Outlet } from "react-router-dom";

const Favourites = () => {
  const item: ICrumbs = { title: "Favourites", link: "/" };

  const handleChange = () => {};
  return (
    <ContentContainer styleClass="gap-10">
      <div className="w-6/12 sm:w-full md:w-full mx-auto">
        <SearchSuggestion
          type={"text"}
          name={"search"}
          placeholder="Search here..."
          handldChange={handleChange}
          inputClassName={"h-16 !rounded-[32px]"}
          variant="normal"
          leftIcon={<SearchIcon className="!left-8" />}
          rightIcon={
            <CustomButton
              label={"Search"}
              type={"submit"}
              isLoading={false}
              variant={"outlined"}
              styleClass={"btn-black"}
            />
          }
        />
      </div>

      <div className="w-full py-8 overflow-hidden">
        <div className="flex justify-between items-center pb-4">
          <div className=" text-black-900 flex sm:flex-col md:flex-col  sm:items-start  md:items-start justify-between w-full font-normal  items-center">
            <BreadCrumb item={item} />
            <div className=" flex sm:ml-auto md:ml-auto sm:mt-3 md:mt-3 gap-3 ">
              <CustomButton
                label={"Checkout"}
                type={"button"}
                variant={"outlined"}
                styleClass={
                  "btn-gray w-full !px-16 sm:!px-4  !rounded-xl !font-medium "
                }
              />
              <CustomButton
                label={"Delete"}
                type={"button"}
                variant={"outlined"}
                styleClass={"btn-gray w-full  !rounded-xl !font-medium "}
              />
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </ContentContainer>
  );
};
export default Favourites;
