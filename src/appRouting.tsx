import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  
} from "react-router-dom";

import Login from "@pages/auth/login";

import SignUp from "@pages/auth/register";



const routes = [
  { path: "/", component: <Login />, protectedPath: false},
  { path: "/signup", component: <SignUp />, protectedPath: false },

];
const AppRouting = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component }) => (
          <Route key={Math.random()} path={path} element={component}>
          </Route>
        ))}
        {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouting;
