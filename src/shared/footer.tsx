import { ReactComponent as Linkedln } from "@assets/icons/linkedln.svg";
import { ReactComponent as Fb } from "@assets/icons/fb.svg";
import { ReactComponent as Twitter } from "@assets/icons/twitter.svg";
import  PlayStore  from "@assets/icons/google_playstore.png";
import  ApplePlayStore  from "@assets/icons/apple_playstore.png";
import  Facebook  from "@assets/icons/facebook_footer.png";
import  TwitterFooter  from "@assets/icons/twitter_footer.png";
import  Youtube  from "@assets/icons/youtube_footer.png";
import  Insta  from "@assets/icons/insta_footer.png";
import { ReactComponent as Greater } from "@assets/icons/greater.svg";

import FooterBg from "@assets/images/FooterBg.png";
import { ReactComponent as Logo_white } from "@assets/logo_white.svg";

import { Link } from "react-router-dom";
import BackgroundImage from "./backgroundImage";
import { Avatar } from "@material-tailwind/react";
import { useState } from "react";
import LazyImage from "./lazyImage";

export interface IFooterProps {
  isShow?: boolean;
}
const Footer = ({ isShow }: IFooterProps) => {
  return (
    <>
      <footer className="bg-black-100 px-16 sm:px-8 pt-16 pb-6">
          <div className="grid grid-cols-4 sm:grid-cols-1 items-start">
          <div className="grid justify-start items-center pt-24 sm:justify-start sm:pt-4 space-y-3">
              <h5 className="text-white font-semibold mr-auto">Frankzone</h5>
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                 
                  Lorem ipsum
                </span>
                <span className="inline-flex  items-center gap-2 text-white opacity-85 ">
                  {" "}
                 
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                 
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                 
                  Lorem ipsum
                </span>
               
              </div>
            </div>
            <div className="grid justify-start sm:justify-start sm:pt-4 space-y-3">
              <h5 className="text-white font-semibold mr-auto">About us</h5>
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
                  
                  Lorem ipsum
                </span>
              </div>
            </div>

            <div className="grid justify-start sm:justify-start sm:pt-4 space-y-3">
              <h5 className="text-white font-semibold mr-auto">Legal topics</h5>
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                  Lorem ipsum
                </span>
                <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                  Lorem ipsum
                </span>
              </div>
            </div>

            <div className="grid justify-start gap-5 sm:justify-center sm:pt-4 items-start">
            <span className="inline-flex items-center gap-2 text-white opacity-85 ">
                  {" "}
               
                 Download the App
                </span>
                <div className="inline-flex items-center gap-2 text-white opacity-85 ">
               <LazyImage src={ApplePlayStore} />
               <LazyImage src={PlayStore}/>
                </div>
              <h5 className="text-white  mr-auto sm:mr-1 pb-1">
                Follow Us
              </h5>
              <div className="flex  gap-4">
              <LazyImage src={Facebook} className="w-8 h-8"/>
               <LazyImage src={TwitterFooter} className="w-8 h-8"/>
               <LazyImage src={Youtube} className="w-8 h-8" />
               <LazyImage src={Insta} className="w-8 h-8"/>
              </div>
            </div>
          </div>

          <div className="pt-6  text-center space-y-4">
            {/* <hr className="solid opacity-40" /> */}
            <p className="font-normal text-white opacity-85">
              Copyright©{new Date().getFullYear()}  Frankzone
            </p>
          </div>
       
      </footer>

      
    </>
  );
};

export default Footer;
