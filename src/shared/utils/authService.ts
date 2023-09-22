import { useNavigate } from "react-router-dom";
import { STORAGE } from "../const";
import { StorageI } from "../interfaces";

export const SetStorage = (data: StorageI, remember: boolean = true) => {
  if (remember) {
    localStorage.setItem(STORAGE, JSON.stringify(data));
  } else {
    sessionStorage.setItem(STORAGE, JSON.stringify(data));
  }
};

export const GetStorage = () => {
  const savedCredentials =
    sessionStorage.getItem(STORAGE) || localStorage.getItem(STORAGE);
  let credentials: StorageI | null = null;
  if (savedCredentials) {
    credentials = JSON.parse(savedCredentials);
  }
  return credentials;
};

// export const IsJobSeeker = () => {
//   if (IsAuthenticated()) {
//     if (GetStorage()?.userType == "jobSeeker") return true;
//     else return false;
//   }
//   return false;
// };

export const Logout = async () => {
  sessionStorage.removeItem(STORAGE);
  localStorage.removeItem(STORAGE);
  return await true;
};

export const IsLoggedIn = (): boolean => {
  const savedCredentials =
    sessionStorage.getItem(STORAGE) || localStorage.getItem(STORAGE);
  let credentials: any | null = null;
  if (savedCredentials) {
    credentials = JSON.parse(savedCredentials);
  }
  return !!credentials?.isLoggedIn;
};

export const IsAuthenticated = (): boolean => {
  const savedCredentials =
    sessionStorage.getItem(STORAGE) || localStorage.getItem(STORAGE);
  let credentials: StorageI | null = null;
  if (savedCredentials) {
    credentials = JSON.parse(savedCredentials);
  }
  return !!credentials;
};

export default { SetStorage, GetStorage, IsAuthenticated, Logout };
