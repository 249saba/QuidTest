import React, { ReactNode } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";

interface IImage {
  src: string;
  height?: string;
  width?: string;
  alt?: string;
  caption?: HTMLElement | any;
  parentClass?: string;
  className?: string;
  routerLink?: any;
  children?: ReactNode;
  handleClick?: any;
}

const LazyImage = ({
  src,
  height = "auto",
  width = "100%",
  alt = "",
  caption = <></>,
  className = "",
  parentClass = "",
  routerLink,
  children,
  handleClick,
}: IImage) => {
  const navigate = useNavigate();
  return (
    <div className={parentClass}>
      <LazyLoadImage
        onClick={handleClick}
        alt={alt}
        useIntersectionObserver={true}
        height={height}
        effect="opacity"
        src={src} // use normal <img> attributes as props
        width={width}
        className={`${className} ${routerLink ? "cursor-pointer" : ""}`}
      />
      {caption}
      {children}
    </div>
  );
};

export default LazyImage;
