import CustomCard from "@src/shared/cards/customCard";
import CustomButton from "@src/shared/customButton";
import { Link, useNavigate } from "react-router-dom";
import "@src/index.scss";
import { useEffect, useState } from "react";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import Input from "@src/shared/input";
import { handleToastMessage } from "@src/shared/toastify";
import { Breadcrumbs } from "@material-tailwind/react";
import SeperatorLine from "@src/shared/seperator/seperatorLine";
import Switch from "@mui/material/Switch";
const DeliveryManagement = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState([]) as any;
  const [selectedOption, setSelectedOption] = useState("distance");
  const [distanceCharge, setDistanceCharge] = useState<any>();
  const [defaultCharge, setDefaultCharge] = useState<any>();
  useEffect(() => {
    getSettings();
  }, []);
  const getSettings = () => {
    backendCall({
      url: `/api/vendor/settings`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setSettings(res.data);
        setSelectedOption(res.data.delivery_type);
        if (res.data.delivery_type == "BY_DISTANCE") {
          setDistanceCharge(res.data.delivery_charges);
        }
        if (res.data.delivery_type == "FIXED") {
          setDefaultCharge(res.data.delivery_charges);
        }
      }
    });
  };
  const handleOptionChange = (e: any) => {
    setSelectedOption(e);
  };

  const handleDistanceChargeChange = (e: any) => {
    setDistanceCharge(Number(e.target.value));
    // setDefaultCharge(0);
  };

  const handleDefaultChargeChange = (e: any) => {
    setDefaultCharge(Number(e.target.value));
    setDistanceCharge(0);
  };
  const handleUpdate = () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("delivery_type", selectedOption);
    if (selectedOption == "BY_DISTANCE") {
      formData.append("delivery_charges", String(distanceCharge));
    }
    if (selectedOption == "FIXED") {
      formData.append("delivery_charges", String(defaultCharge));
    }
    backendCall({
      url: `/api/vendor/settings/update_delivery_settings`,
      method: "PUT",
      data: formData,
      contentType: "multipart/form-data;",
    }).then((res) => {
      if (res && !res.error) {
        setIsLoading(false);
        handleToastMessage("success", res?.message);
      } else {
        setIsLoading(false);
        handleToastMessage("error", res?.message);
      }
    });
  };
  return (
    <>
      <CustomCard styleClass="p-4">
        <div className="flex  justify-between  gap-2">
          <div className="text-left ">
            {/* <p className="text-gray-900 flex gap-1">
              <span>Dashboard</span>/<span>Settings</span>/<span>Delivery Management</span>
            </p> */}
            <Breadcrumbs aria-label="breadcrumb" className="bg-inherit pl-0">
              <Link to="/dashboard">
                <p>Dashboard</p>
              </Link>
              <Link to="/settings">
                <p>Settings</p>
              </Link>
              <Link to="" className="text-gray">
                <p>{"Delivery Management"}</p>
              </Link>
            </Breadcrumbs>

            <h5 className="font-normal"> Delivery Management</h5>
          </div>
          <CustomButton
            isLoading={isLoading}
            type={"submit"}
            label={"Update"}
            styleClass="btn-black !rounded-md"
            handleButtonClick={handleUpdate}
          />
        </div>
      </CustomCard>
      <CustomCard>
        <div className="flex flex-col text-black-900  p-5 gap-3">
          <div className="flex items-center h-12 gap-3 justify-between cursor-pointer  !text-black-100 !font-medium" onClick={()=>{handleOptionChange("BY_DISTANCE")}}>
            <label className="">
              {/* <input
                type="radio"
                value="BY_DISTANCE"
                checked={selectedOption == "BY_DISTANCE"}
                onChange={handleOptionChange}
              /> */}
              Delivery Charge By Distance
            </label>
            <Switch
              id="blue"
              name="contain_variations"
              checked={selectedOption == "BY_DISTANCE"}
              onChange={()=>{handleOptionChange("BY_DISTANCE")}}
            />
          </div>
          {selectedOption == "BY_DISTANCE" && (
            <Input
              id="delivery_charges"
              name="delivery_charges"
              type="number"
              label="Min.Delivery Charge"
              className="!text-left !text-black-100 !font-medium"
              labelClassName="!text-black-100 "
              variant="outline"
              placeholder="Delivery Charge / Kilometers"
              handldChange={handleDistanceChargeChange}
              value={distanceCharge}
              disabled={selectedOption !== "BY_DISTANCE"}
            />
          )}
            {/* <Input
              id="delivery_charges"
              name="delivery_charges"
              type="text"
              variant="outline"
              placeholder="Delivery Charge / Kilometers"
              handldChange={handleDistanceChargeChange}
              value={distanceCharge}
              disabled={selectedOption !== "BY_DISTANCE"}
            /> */}
          <SeperatorLine className="rotate-10 w-full !border-gray-300" />
          <div className="flex !text-black-100 !font-medium justify-between cursor-pointer" onClick={()=>{handleOptionChange("FIXED")}}>
            <label>
              {/* <input
                type="text"
                value="FIXED"
                checked={selectedOption == "FIXED"}
                onChange={handleOptionChange}
              /> */}
              Default Delivery Charge
            </label>
            <Switch
              id="blue"
              name="contain_variations"
              checked={selectedOption == "FIXED"}
              onChange={()=>{handleOptionChange("FIXED")}}
            />
          </div>
          {selectedOption == "FIXED" && (
            <Input
              id="delivery_charges"
              name="delivery_charges"
              label="Default Delivery Charge"
              type="number"
              className="!text-left !text-black-100 !font-medium"
              labelClassName="!text-black-100 "
              variant="outline"
              placeholder="Delivery Charge"
              handldChange={handleDefaultChargeChange}
              value={defaultCharge}
              disabled={selectedOption !== "FIXED"}
            />
          )}
            {/* <Input
              id="delivery_charges"
              name="delivery_charges"
              label="Min.Delivery Charge"
              type="text"
              className="!text-left !text-black-100 !font-medium"
              labelClassName="!text-black-100 !font-medium"
              variant="outline"
              placeholder="Delivery Charge"
              handldChange={handleDefaultChargeChange}
              value={defaultCharge}
              disabled={selectedOption !== "FIXED"}
            /> */}
          {/* <SeperatorLine className="rotate-10 w-full !border-gray-300" /> */}
        </div>
      </CustomCard>
    </>
  );
};

export default DeliveryManagement;
