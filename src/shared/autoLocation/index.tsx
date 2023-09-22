import { useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getZipCode,
} from "use-places-autocomplete";
import { geocodeByAddress } from 'react-google-places-autocomplete';

function AutoLocation({
  suburbSelect,
  label,
  selectedValue,
  error,
  isError,
  placeholder = "Choose location",
  isRequired,
}: any) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInput = (e: any) => {
    setValue(e.target.value);
    suburbSelect(e.target.value);
  };

  const handleSelect = (val: any) => {
    setValue(val, false);
    clearSuggestions();
    getGeocode({ address: val }).then((results) => {
      // console.log("result", results[0]);
      const { lat, lng } = getLatLng(results[0]);
      const zipCode = getZipCode(results[0], true);
      suburbSelect({
        val,
        lat,
        lng,
        zipCode,
      });
      const parameter = {
        address: "Taiwan",
        // placeId: "ChIJraeA2rarQjQRPBBjyR3RxKw",
      };
      getGeocode(parameter).then((results) => {
        // console.log("results:", results[0]);
        const zipCode = getZipCode(results[0], true);
        console.log("ZIP Code: ", zipCode);
      });
      geocodeByAddress('Montevideo, Uruguay')
  .then(results => console.log("results",results))
  .catch(error => console.error(error));
    });
  };
  return (
    <div className="flex flex-col items-start w-full px-2 relative">
      {label && (
        <label className="block mb-2 text-sm text-black-100 font-medium">
          {label} <span className="!text-red-100">*</span>
        </label>
      )}
      <input
        value={selectedValue}
        onChange={handleInput}
        // disabled={!ready}
        className="border border-solid border-gray-900 focus:border-black-900 focus:border-[1px] text-black-100 pl-2 w-full h-12 rounded"
        placeholder={placeholder}
      />
      {status === "OK" && (
        <ul className="shadow w-full z-10 absolute top-[5.5rem] bg-white text-black-100">
          {data.map(({ place_id, description }) => (
            <li
              className="hover:bg-gray-light py-1 pl-4 text-left cursor-pointer text-black-100"
              key={place_id}
              onClick={() => handleSelect(description)}
            >
              <small className="text-black-100">{description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoLocation;
