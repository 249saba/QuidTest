import LazyImage from "@src/shared/lazyImage";
import { OrderModel, ProductsModel } from "@src/shared/models";
import { Table } from "@src/shared/table/table";
import { backendCall } from "@src/shared/utils/backendService/backendCall";
import CircleCross from "@assets/icons/circle-delete.png";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import TestImg from "@assets/images/Food.png";
import MoreIcon from "@assets/vendor/icons/more.png";
import { ReactComponent as SearchIcon } from "@assets/icons/Search-icon.svg";
import ChatDisabledIcon from "@assets/icons/ChatDisabledIcon.png";
import { ReactComponent as PencilIcon } from "@assets/icons/red-pencil.svg";
import { ReactComponent as ViewIcon } from "@assets/icons/witness.svg";
import moment from "moment";
import Input from "@src/shared/input";
import { Spinner } from "@src/shared/spinner/spinner";
import Pagination from "@src/shared/table/pagination";
import { Ifilters } from "@src/shared/interfaces";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import noImage from "@assets/images/NoImage.png";
import { handleToastMessage } from "@src/shared/toastify";
import Popup from "@src/shared/popup/popup";
import CustomButton from "@src/shared/customButton";
import CustomCard from "@src/shared/cards/customCard";
import { Breadcrumbs } from "@material-tailwind/react";
import ChatWithCustomer from "./chat";
import { db } from "@src/firebaseConfig";
import { child, get, onValue, ref } from "firebase/database";
import { GetStorage } from "@src/shared/utils/authService";
let _MyUsers: any = [];
const ChatList = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<any>("");
  const [vendorChats, setVendorChats] = useState([]);
  const [vendorUsers, setVendorUsers] = useState([]);
  const [usersList, setUsersLists] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [sortedUserList, setSortedUserList] = useState([]);
  const [enableChat, setEnableChat] = useState(false);
  useEffect(() => {
    const _getStorage = async () => {
      let _userData: any = await GetStorage();
      setUserId(_userData.id + "_vendor");
    };
    _getStorage();
  }, []);
  useEffect(() => {
    const chatsRef: any = ref(db, "Chats");
    const getVendorChats = () => {
      return onValue(
        chatsRef,
        (snapshot) => {
          const chats: any = [];
          if (snapshot.val()) {
            Object.entries(snapshot.val()).map((member: any) => {
              if (member[1].members && member[1].members.includes(userId)) {
                chats.push(member);
              }
            });
            setVendorChats(chats);
            getUsers();
          } else {
            console.log("No data available");
          }
        },
        {
          onlyOnce: false,
        }
      );
      // get(chatsRef)
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       Object.entries(snapshot.val()).map((member: any) => {
      //         if (member[1].members && member[1].members.includes(userId)) {
      //           chats.push(member);
      //         }
      //       });
      //       setVendorChats(chats);
      //       getUsers();
      //     } else {
      //       console.log("No data available");
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    };
    if (userId) {
      getVendorChats();
    }
  }, [userId]);

  useEffect(() => {
    let _myUsers: any = [];
    vendorChats.forEach((chat: any) => {
      vendorUsers.find((user: any) => {
        if (user[0] === chat[1].members[0]) {
          let u = {
            ...user[1],
            lastMessage: chat[1]?.lastMessageSent,
            unSeenCount: chat[1]?.adminUnseenCount,
          };
          _myUsers.push(u);
        }
      });
    });
    setUsersLists(_myUsers);
    getLastmessage(_myUsers);
  }, [vendorChats, vendorUsers]);

  useEffect(() => {
    let _date = usersList.sort(function (a: any, b: any) {
      var key1 = a.dateTime;
      var key2 = b.dateTime;

      if (key1 > key2) {
        return -1;
      } else if (key1 == key2) {
        return 0;
      } else {
        return 1;
      }
    });
    setSortedUserList(_date);
  }, [usersList]);

  const getUsers = () => {
    const usersRef: any = ref(db, "Users");
    return onValue(
      usersRef,
      (snapshot) => {
        const users: any = [];
        const _loggedInUser: any = [];
        if (snapshot.val()) {
          Object.entries(snapshot.val()).map((member: any) => {
            if (member[0] === userId) {
              _loggedInUser.push(member[1]);
            }
            users.push(member);
          });
          setVendorUsers(users);
        } else {
          console.log("No data available");
        }
        setEnableChat(_loggedInUser[0]?.enableChat);
      },
      {
        onlyOnce: false,
      }
    );

    // get(usersRef)
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       Object.entries(snapshot.val()).map((member: any) => {
    //         users.push(member);
    //       });
    //       setVendorUsers(users);
    //     } else {
    //       console.log("No data available");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  };
  const handleSelectedUser = (_user: any) => {
    setSelectedUser(_user);
  };
  const handleSearchMessage = (e: any) => {
    let _search = e.target.value;
    let _userList = _MyUsers.filter((user: any) => {
      return (user.userDisplayName && user.userEmail)
        .toLowerCase()
        .includes(_search.toLowerCase());
    });
    setUsersLists(_userList);
  };
  const getLastmessage = (_myUsers: any) => {
    const chatMessagesRef: any = ref(db, "ChatMessages");
    return onValue(
      chatMessagesRef,
      (snapshot) => {
        if (snapshot.val()) {
          let chatMessages: any = [];
          _myUsers.map((_lastMessage: any) => {
            return Object.entries(snapshot.val()).map((messages: any) => {
              Object.entries(messages[1]).map((message: any) => {
                if (message[0] === _lastMessage?.lastMessage) {
                  chatMessages.push({
                    ..._lastMessage,
                    type: message[1]?.type,
                    message: message[1]?.message,
                    dateTime: new Date(message[1]?.messageDateTime),
                  });
                }
              });
            });
          });
          _MyUsers = chatMessages;
          setUsersLists(chatMessages);
        } else {
          console.log("No data available");
        }
      },
      {
        onlyOnce: false,
      }
    );
  };

  return (
    <>
      {enableChat ? (
        <CustomCard styleClass="rounded-none">
          <div className="flex">
            <div className="w-[30%]">
              <h4 className="h-16 text-left px-2 flex items-center border text-gray-500 font-semibold">
                <Input
                  className="w-full"
                  name="search"
                  type="text"
                  leftIcon={<SearchIcon />}
                  placeholder="Search the customer"
                  handldChange={handleSearchMessage}
                />
              </h4>
              <div className="h-[520px] overflow-y-scroll">
                {sortedUserList.map((user: any) => (
                  <div
                    key={Math.random()}
                    className="border-b h-16 flex flex-col justify-center cursor-pointer"
                    onClick={() => handleSelectedUser(user)}
                  >
                    <div className="flex mx-2">
                      <img
                        className="w-[45px] h-[40px] rounded-full"
                        src={
                          user?.userPhotoUrl
                            ? import.meta.env.VITE_REACT_API_URL +
                              "/" +
                              user?.userPhotoUrl
                            : noImage
                        }
                        alt=""
                      />
                      <div className="ml-2 w-full">
                        <div className="flex justify-between">
                          <p
                            className="text-black-100 text-left font-semibold truncate w-[200px]"
                            key={user.id}
                          >
                            {user.userDisplayName !== "null"
                              ? user.userDisplayName
                              : user.userEmail}
                          </p>
                          <div className="flex items-start">
                            <div>
                              {/* <p
                                className="text-gray-500 text-left text-[10px]"
                                key={user.id}
                              >
                                {user.dateTime
                                  ? user.dateTime.toLocaleTimeString("default")
                                  : null}
                              </p> */}
                              <p
                                className="text-gray-500 text-left text-[10px]"
                                key={user.id}
                              >
                                {user.dateTime
                                  ? user.dateTime.toLocaleDateString("en-GB")
                                  : null}
                              </p>
                            </div>
                            {user?.unSeenCount &&
                            user?.id !== selectedUser?.id ? (
                              <p className="bg-red-100 rounded-full h-4 w-4 text-[10px] flex items-center justify-center ml-1">
                                {user?.unSeenCount}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <p
                          className="text-gray-500 text-left text-sm truncate w-[280px]"
                          key={user.id}
                        >
                          {user?.type === "image" ? "Image" : user.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-[70%]">
              <ChatWithCustomer selectedUser={selectedUser} />
            </div>
          </div>
        </CustomCard>
      ) : (
        <CustomCard styleClass="rounded-none ">
          <div className="flex flex-col items-center justify-center h-[600px]">
            <LazyImage src={ChatDisabledIcon} alt="" className="h-28 w-44" />
            <h5 className="font-semibold mt-10">No New Messages In Inbox</h5>
            <p className="text-[#ACACAC] mt-2">
              You Don't Have Any Messages Right Now From Customers, May Be You
              have disabled your chat
            </p>
            <p className="text-[#ACACAC]">
              {" "}
              please go to <b className="text-black-100">"Settings"</b> and
              enable it.
            </p>
            <CustomButton
              label="Go To Settings"
              type={"button"}
              handleButtonClick={(e: any) => navigate("/settings")}
              styleClass="btn-black !rounded-lg w-52 mt-10"
            />

            {/* <h3 className="text-black-100">Go to <Link to="/settings" className="text-blue-900">Setting</Link> for Enable the chat</h3> */}
          </div>
        </CustomCard>
      )}
    </>
  );
};
export default ChatList;
