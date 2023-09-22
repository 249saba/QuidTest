import React, { useState, useEffect } from "react";
import Select from "../select/select";
import { GetDynamicAttribute } from "../apiService";

const SelectAttribute = (attributeId: any) => {
  const [attributesOptions, setAttributesOptions] = useState([]);
  useEffect(() => {
    GetDynamicAttribute(attributeId?.attributeId).then((res: any) => {
      if (res && !res.error) {
        setAttributesOptions(res.data);
      } else {
      }
    });
  }, [attributeId]);
  return (
    <div>
      <Select
        options={attributesOptions}
        id={attributeId?.id}
        name={attributeId?.name}
        placeholder={attributeId?.placeholder}
        value={attributesOptions.map((item: any) => {
          if (item?.id === attributeId.value) {
            return { label: item?.label };
          }
        })}
        onChange={(value: any) => {
          attributeId?.handleChange(value);
        }}
      />
    </div>
  );
};

export default SelectAttribute;
