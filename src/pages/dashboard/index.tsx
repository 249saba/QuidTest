import ShellContainer from "@src/containers/shellContainer";
import { ReactComponent as Warning } from "@assets/vendor/icons/warning.svg";
import ArrowRight from "@assets/vendor/icons/arrow_right.png";
import { FiPlusCircle } from "react-icons/fi";
import CustomButton from "@src/shared/customButton";
import { Progress } from "@material-tailwind/react";
import ProgressBar from "@src/shared/progressBar/progressBar";
import { Table } from "@src/shared/table/table";
import { useEffect, useState } from "react";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import Pagination from "@src/shared/table/pagination";
import CustomCard from "@src/shared/cards/customCard";
import Input from "@src/shared/input";
import { Spinner } from "@src/shared/spinner/spinner";
import { ReactComponent as DeleteIcon } from "@assets/icons/delete.svg";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import raiting from "@assets/icons/Polygon.png";
import moment from "moment";
import { Ifilters } from "@src/shared/interfaces";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardStats, setDashboardStats] = useState([]) as any;
  const [tab, setTab] = useState("RECENT_ORDER");
  const [isLoading, setIsLoading] = useState(false);
  const [ordersList, setOrdersList] = useState([]) as any;
  const [ratingListing, setRatingListing] = useState([]) as any;
  const [user, setUser] = useState({}) as any;
  const [filterValue, setFilterValue] = useState<Ifilters>({
    searchValue: "",
    offset: 0,
    limit: 10,
    order: "asc",
  });

  useEffect(() => {
    getDashobardStats();
    getUser();
  }, []);
  useEffect(() => {
    getOrders();
    getRatingAndReviews();
  }, [tab]);

  const getUser = () => {
    backendCall({
      url: `/api/vendor/profile`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        console.log(res);

        setUser(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  const getOrders = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/orders?limit=${filterValue.limit}&offset=${filterValue.offset}&order=desc&state=PENDING`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        console.log(res);

        setOrdersList(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const getRatingAndReviews = () => {
    setIsLoading(true);
    backendCall({
      url: `/api/vendor/dashboard/ratings?limit=${filterValue.limit}&offset=${filterValue.offset}&order=asc`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        console.log(res);
        console.log("res.data ==", res.data);
        setRatingListing(res.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };
  const getDashobardStats = () => {
    backendCall({
      url: `/api/vendor/dashboard/stats`,
      method: "GET",
    }).then((res) => {
      if (res && !res.error) {
        setDashboardStats(res.data);
      }
    });
  };
  const handleRecentOrder = () => {
    setTab("RECENT_ORDER");
    getOrders();
  };
  const handleRatingAndReviews = () => {
    setTab("RATING");
    getRatingAndReviews();
  };
  const onRecentOrderView = (id: any) => {
    navigate({ search: `?id=${id}&state=ALL`, pathname: "/orders/viewOrder" });
  };
  const recentOrdercolumns = [
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Customer"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (name: string, row: any) => (
        <div className="flex  items-center justify-center">
          <p className="text-black-900 capitalize">{row.User.name}</p>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Order ID"}</span>
        </div>
      ),
      dataIndex: "Order ID",
      key: "Order ID",
      width: 150,
      render: (name: string, row: any) => (
        <div className="text-sm text-black-900">{row.code}</div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Quantity"}</span>
        </div>
      ),
      dataIndex: "Quantity",
      key: "Quantity",
      width: 150,
      render: (name: string, row: any) => (
        <div className={`rounded-md p-2 text-sm `}>{row.quantity_count}</div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Status"}</span>
        </div>
      ),
      dataIndex: "Status",
      key: "Status",
      width: 150,
      render: (name: string, row: any) => (
        <div className="flex justify-center">
          <p
            className={
              row.state && row.state == "PENDING"
                ? "text-white bg-orange-500  rounded px-2 py-1"
                : row.state == "REJECTED"
                ? "text-white  bg-red-100  rounded px-2 py-1"
                : "text-white bg-green-500  rounded px-2 py-1"
            }
          >
            {row.state?.charAt(0).toUpperCase() +
              row.state?.slice(1)?.toLowerCase()}
          </p>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Date"}</span>
        </div>
      ),
      dataIndex: "Date",
      key: "Date",
      width: 150,
      render: (name: string, row: any) => (
        <p className="text-sm text-black-900">
          {moment(row.date).utc().format("DD-MM-YYYY")}
        </p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Actions"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center items-center">
          <ViewIcon
            className={"cursor-pointer"}
            onClick={() => onRecentOrderView(row?.id)}
          />
          <DeleteIcon className={"cursor-pointer"} onClick={() => {}} />
        </div>
      ),
    },
  ];
  const ratingCoulmns = [
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Customer"}</span>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, row: any) => (
        <div className="flex  items-center justify-center">
          <p className="text-black-900 capitalize">{row.User.name}</p>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Rating"}</span>
        </div>
      ),
      dataIndex: "Rating",
      key: "Rating",
      width: 200,
      render: (name: string, row: any) => (
        <div className="text-xs text-black-900 flex justify-center">
          <img src={raiting} className="w-3 h-3 mr-1" />
          <span>{row.rating}</span>
        </div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Review"}</span>
        </div>
      ),
      dataIndex: "Review",
      key: "Review",
      width: 200,
      render: (name: string, row: any) => (
        <div className={`rounded-md p-2 text-xs `}>{row.review}</div>
      ),
    },
    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Date"}</span>
        </div>
      ),
      dataIndex: "Date",
      key: "Date",
      width: 200,
      render: (name: string, row: any) => (
        <p className="text-xs text-black-900">
          {moment(row.createdAt).utc().format("DD-MM-YYYY")}
        </p>
      ),
    },

    {
      title: (
        <div className="pl-1 flex justify-center items-center">
          <span className="font-semibold">{"Actions"}</span>
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (id: string, row: any) => (
        <div className="flex gap-x-2 justify-center items-center">
          <ViewIcon className={"cursor-pointer"} onClick={() => {}} />
        </div>
      ),
    },
  ];
  const handleChangePage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, offset: event });
  };

  const handleChangeRowsPerPage = (event: any) => {
    console.log(event);
    setFilterValue({ ...filterValue, limit: event });
  };
  return (
    <>
      <ShellContainer className="gap-4">
        {user?.accountStatus === "PENDING" ? (
          <div
            className="bg-red-100 rounded-md flex justify-between items-center px-5 py-6 cursor-pointer"
            onClick={() => {
              navigate("/settings/documentVerify");
            }}
          >
            <h6 className="flex items-center gap-x-2 text-white font-light">
              <Warning className="w-6 h-6" /> Please Verify Your Documents First
              To Perform Operations
            </h6>
            <img src={ArrowRight} className="w-5 h-5" />
          </div>
        ) : (
          ""
        )}
        {dashboardStats?.can_sell_deals || dashboardStats?.can_sell_products ? (
          !dashboardStats?.stripe_onboarding_completed ||
          !dashboardStats?.paypal_onboarding_completed ? (
            <div
              className="bg-[#54CF2E] rounded-md flex justify-between items-center px-5 py-6 cursor-pointer"
              onClick={() => {
                navigate("/payment?flow=paymentOnBoarding");
              }}
            >
              <h6 className="flex items-center gap-x-2 text-white font-light">
                <Warning className="w-6 h-6" /> Please Add Your Bank
                Information.
              </h6>
              <div className="flex">
                <p className="bg-[#F44336] rounded-full w-5 h-5 text-white text-xs flex justify-center items-center mr-2">
                  {dashboardStats?.stripe_onboarding_completed +
                    dashboardStats?.paypal_onboarding_completed ===
                  0
                    ? 2
                    : dashboardStats?.stripe_onboarding_completed +
                        dashboardStats?.paypal_onboarding_completed ===
                      2
                    ? 0
                    : dashboardStats?.stripe_onboarding_completed +
                      dashboardStats?.paypal_onboarding_completed}
                </p>
                <img src={ArrowRight} className="w-5 h-5" />
              </div>
            </div>
          ) : null
        ) : (
          ""
        )}

        <div className="bg-white rounded-md flex justify-between items-center px-5 py-6">
          <h5>Dashboard</h5>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div
            className="bg-white rounded-md px-5 py-6 space-y-4 cursor-pointer"
            onClick={() => {
              navigate({ search: `?state=PENDING`, pathname: "/orders" });
            }}
          >
            <h6 className=" text-yellow-800 text-left font-medium">
              Pending Orders
            </h6>
            <h2 className="text-yellow-800 text-right">
              {dashboardStats?.pending_orders}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full flex-col gap-1">
                <p className="text-yellow-800 text-left">
                  {Number(dashboardStats.percentage_pending)}%
                </p>
                <ProgressBar
                  color="bg-yellow-800"
                  value={Number(dashboardStats.percentage_pending)}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-md px-5 py-6 space-y-4 cursor-pointer"
            onClick={() => {
              navigate({ search: `?state=ALL`, pathname: "/orders" });
            }}
          >
            <h6 className="text-blue-900 text-left font-medium">
              In Progress Orders
            </h6>
            <h2 className="text-blue-900 text-right">
              {dashboardStats.in_progress_orders}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <div className="flex w-full flex-col gap-1">
                <p className="text-blue-900 text-left">
                  {Number(dashboardStats.percentage_in_progress)}%
                </p>
                <ProgressBar
                  color="bg-blue-900"
                  value={Number(dashboardStats.percentage_in_progress)}
                />
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-md px-5 py-6 space-y-4  cursor-pointer"
            onClick={() => {
              navigate({ search: `?state=ALL`, pathname: "/orders" });
            }}
          >
            <h6 className="text-green-500 text-left font-medium">
              Completed Orders
            </h6>
            <h2 className="text-green-500 text-right">
              {dashboardStats.completed_orders}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <p className="text-green-500 text-left">
                {Number(dashboardStats.completed_orders)}%
              </p>
              <ProgressBar
                color="bg-green-500"
                value={Number(dashboardStats.completed_orders)}
              />
            </div>
          </div>
          <div className="bg-white rounded-md px-5 py-6 space-y-4">
            <h6 className="text-red-400 text-left font-medium">
              Total Avg Earnings
            </h6>
            <h2 className="text-red-400 text-right">
              0{/* {dashboardStats.total_revenue} */}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <p className="text-red-400 text-left">
                {/* {Number(dashboardStats.percentage_total_revenue)}% */}
                {Number(0)}%
              </p>
              <ProgressBar
                color="bg-red-400"
                // value={Number(dashboardStats.percentage_total_revenue)}
                value={Number(0)}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-4">
          <div className="flex flex-row items-center justify-between my-2">
            {/* <div className=" flex justify-start">
              <p className=" font-extrabold">
                {tab == "RECENT_ORDER" ? "Recent Orders" : "Rating & Reviews"}
              </p>
            </div> */}
            <div className="flex justify-end">
              <CustomButton
                handleButtonClick={handleRecentOrder}
                label={"Recent Order"}
                type={"button"}
                variant={"outlined"}
                styleClass={
                  tab == "RECENT_ORDER"
                    ? "btn-black !rounded-xl !font-medium mr-2"
                    : "btn-gray-light  !rounded-xl !font-medium mr-2 "
                }
              />
              <CustomButton
                handleButtonClick={handleRatingAndReviews}
                label={"Rating & Reviews"}
                type={"button"}
                variant={"outlined"}
                styleClass={
                  tab == "RATING"
                    ? "btn-black  !rounded-xl !font-medium mr-2"
                    : "btn-gray-light  !rounded-xl !font-medium mr-2 "
                }
              />
            </div>
          </div>
          {tab == "RECENT_ORDER" && (
            <CustomCard styleClass="sm:rounded-none">
              <Spinner isLoading={isLoading} classname="my-3" />
              <Table
                tableLayout="fixed"
                columns={recentOrdercolumns as any}
                emptyText={"No data found"}
                data={ordersList.rows}
                rowKey="id"
                scroll={{ x: 1000 }}
                sticky={true}
                className="matrix"
                onHeaderRow={() => ({
                  className: "header-title",
                })}
              />
              <Pagination
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalCount={ordersList.count}
              />
            </CustomCard>
          )}
          {tab == "RATING" && (
            <CustomCard styleClass="sm:rounded-none">
              <Spinner isLoading={isLoading} classname="my-3" />
              <Table
                tableLayout="fixed"
                columns={ratingCoulmns as any}
                emptyText={"No data found"}
                data={ratingListing.rows}
                rowKey="id"
                scroll={{ x: 1000 }}
                sticky={true}
                className="matrix"
                onHeaderRow={() => ({
                  className: "header-title",
                  style: { fontWeight: "bold" },
                })}
              />
              <Pagination
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                totalCount={ratingListing.count}
              />
            </CustomCard>
          )}
        </div>
      </ShellContainer>
    </>
  );
};

export default Dashboard;
