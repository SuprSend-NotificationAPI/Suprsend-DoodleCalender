import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from './components/Navbar'
import Login from './components/login'
import Register from './components/register'
import Home from './components/Home';
import Alert from './components/Alert'
import suprsend from "@suprsend/web-sdk";
suprsend.init(process.env.REACT_APP_WKEY,process.env.REACT_APP_WSECRET);

export default function App() {
  const [alert,setAlert] = React.useState(null);
  const showAlert = (message,type)=>{
    setAlert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setAlert(null);
    },1500);
  }

  return (
    <Router>
      <Navbar showAlert={showAlert}/>
      <Alert alert={alert}/>
      <Routes>
       <Route exact path="/" element = {<Home showAlert={showAlert}/>} />
       <Route exact path="/login" element = {<Login showAlert={showAlert}/>} />
       <Route exact path="/signup" element = {<Register showAlert={showAlert}/>} />
      </Routes>
    </Router>
  )
}
