import Footer from "@src/shared/footer";
import Header from "@src/shared/navbar";
import SideBar from "@src/shared/sidebar/sidebar";
import { selectLayout } from "@src/shared/slices/LayoutSlice";
import { RootState } from "@src/shared/store/store";
import { IsAuthenticated, IsLoggedIn } from "@src/shared/utils/authService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";

import { Outlet } from "react-router-dom";

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const HomeContainer = () => {
  const shellProps: any = useTypedSelector(selectLayout);
  const [layoutProps, setLayout] = useState({
    isShowHeader: false,
    isShowFooter: false,
  });
  useMemo(() => {
    setLayout(shellProps);
  }, [shellProps]);
  return (
    <div className="flex">
      {!IsLoggedIn() && <Header isShow={layoutProps.isShowHeader} />}
      {IsLoggedIn() && <SideBar title="Dashboard" />}
      <div className="w-full">
        <Outlet />
      </div>
      {/* <Footer isShow={layoutProps.isShowFooter} /> */}
    </div>
  );
};
export default HomeContainer;
