import SwiperCarousel, { Slide } from "@src/shared/swiperCarousel";
import NewArrival1 from "@assets/images/new-arrival.png";
import Banner from "@assets/images/banner2.png";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";
import LazyImage from "@src/shared/lazyImage";
import BackroundImage from "@src/shared/backgroundImage";
import ItemCard from "@src/shared/cards/itemCard";

const BackgroundItemsList = ({ items, handleClick }: any) => {
  const navigate = useNavigate();
  const routeTo = (link: string) => {
    navigate(link);
  };
  return (
    <div className="  text-center  w-full  ">
      <SwiperCarousel
        settings={{
          navigation: true,
          zoom: true,
          pagination: false,
          breakpoints: {
            340: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            660: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          },
        }}
      >
        {items.map((elem: any, index: any) => (
          <>
            <Slide className="max-h-[450px]" key={elem.id ? elem.id : index}>
              {/* <LazyImage src={elem.src} alt="" /> */}

              <ItemCard handleClick={handleClick} items={elem} />
              {/* <img
                className=" object-cover h-full  w-full"
                src={elem.src}
                alt="image"
              /> */}
            </Slide>
          </>
        ))}
      </SwiperCarousel>
    </div>
  );
};

export default BackgroundItemsList;
