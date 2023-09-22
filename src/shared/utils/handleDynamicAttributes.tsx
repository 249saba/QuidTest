import React, { useEffect, useState } from "react";
import { GetDynamicAttribute } from "../apiService";

const HandleDynamicAttributes = ({ attributeId, optionId }: any) => {
  const [attributesOptions, setAttributesOptions] = useState<any>([]);
  useEffect(() => {
    const getAttributes = async () => {
      await GetDynamicAttribute(attributeId).then((res: any) => {
        if (res && !res.error) {
          setAttributesOptions(res.data);
        } else {
        }
      });
    };

    getAttributes();
  }, [attributeId, optionId]);
  return (
    <div>
      {attributesOptions.map((item: any) => {
        if (item?.id == optionId) {
          return (
            <p className="text-black-900 flex justify-center">{item?.label} </p>
          );
        }
      })}
    </div>
  );
};

export default HandleDynamicAttributes;
