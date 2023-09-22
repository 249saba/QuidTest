import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IsAuthenticated } from "../utils/authService";
// import { authChecker, getUserIsGuest } from "../../../../shared/js/authChecker";

const AuthGuard = ({ protectedPath, children }: any) => {

  const location = useLocation();
  const isAuthenticated = IsAuthenticated();
  let url = `/?redirectUrl=${location?.pathname}`;



  return (
    <div>
      {protectedPath ? (
        <>
          {isAuthenticated ? (
            children
          ) : (
            <Navigate replace to={url} />
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
};

export default AuthGuard;
