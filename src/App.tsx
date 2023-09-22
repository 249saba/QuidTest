// import React,{useState} from 'react'
// import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from "react-toastify";
import "./App.scss";
import AppRouting from "./appRouting";
// import { decrement, increment } from './redux/counter';
// import CustomButton from './shared/components/customButton';

const App = () => {
  return (
    <div className="App">
      <AppRouting />
      <ToastContainer />
    </div>
  );
};

export default App;
