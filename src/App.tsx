
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "@src/shared/guards/AuthContext";
import Login from "@pages/auth/login";
import "./App.scss";
import AppRouting from "./appRouting";



const App = () => {
  return (
    <AuthProvider>
     <div className="App">
      <AppRouting />
      <ToastContainer />
    </div>
  </AuthProvider>
  
  );
};

export default App;
