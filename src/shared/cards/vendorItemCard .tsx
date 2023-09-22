import { useNavigate } from "react-router-dom";
import LazyImage from "../lazyImage";
import CustomCard from "./customCard";

const VendorItemCard = ({ items }: any) => {
  const navigate = useNavigate();
  const handleClick = ({ id }: any) => {
    navigate(`/vendors/vendorDetail/${id}`);
  };
  return (
    <CustomCard
      key={Math.random()}
      onClick={() => handleClick(items.item)}
      styleClass=" h-full cursor-pointer "
    >
      <div className="relative">
        <LazyImage
          src={items.item.icon}
          alt=""
          className="object-cover w-full h-[260px] rounded-t-xl "
        />
      </div>
      <div className="px-4 py-4 space-y-2">
        <div className="flex gap-3 items-center">
          <LazyImage
            src={items.brandIcon}
            width="60px"
            alt=""
            className="object-cover rounded-t-xl "
          />

          <div className="space-y-1">
            <h5 className="text-black-900 text-left   font-semibold">
              {items?.item?.title}
            </h5>
            <div className=" bg-light-green-100 w-max rounded-lg items-center  flex p-3 py-1 gap-1 ">
              <LazyImage
                src={items.deliveryIcon}
                alt=""
                className="object-cover rounded-t-xl "
              />
              <span className="text-xs text-green-900 ">Delivery</span>
            </div>
          </div>
          <p className="text-right ml-auto flex justify-end text-sm text-black-900 ">
            <LazyImage
              className="w-9/12 pt-[1px]"
              src={"src/assets/images/icons/star_yellow.png"}
              alt=""
            />
            {items.rating}
            <span className="text-gray-900 pl-1">({items.totalReviews})</span>
          </p>
        </div>
      </div>
    </CustomCard>
  );
};

export default VendorItemCard;
