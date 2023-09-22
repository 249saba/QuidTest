import {
  ref,
  onValue,
  push,
  child,
  getDatabase,
  get,
  update,
  query,
  equalTo,
  orderByChild,
} from "firebase/database";
import { GetStorage } from "@src/shared/utils/authService";
import { app } from "@src/firebaseConfig";

const dbPath_Users = "/Users";
const dbPath_Chats = "/Chats";
const dbPath_chatMessages = "/ChatMessages";
const db = getDatabase(app);

export const addUpdateUser = (user: any) => {
  const updates: any = {};
  const dbRef = ref(db);
  get(child(dbRef, `${dbPath_Users}/${user.id}`))
    .then((snapshot) => {
      updates[`${dbPath_Users}/${user.id}`] = user;
      update(ref(db), updates);
    })
    .catch((error) => {
      console.log("error ==", error);
    });
};

export const updateFirebaseUserStatus = async (isOnline: any) => {
  let _userData = await GetStorage();
  const { userId, email, imageUrl, firstName, lastName }: any = _userData;
  let _user = {
    id: userId,
    userEmail: email,
    userDisplayName: `${firstName ? firstName : ""}${lastName ? lastName : ""}`,
    userPhotoUrl: imageUrl ? imageUrl : "",
    online: isOnline,
  };
  addUpdateUser(_user);
};
