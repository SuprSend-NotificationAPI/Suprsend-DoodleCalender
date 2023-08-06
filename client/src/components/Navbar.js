import React from 'react'
import {Link} from "react-router-dom"
import {useNavigate} from 'react-router-dom';
import suprsend from "@suprsend/web-sdk";

export default function Navbar(props) {
  let navigate = useNavigate();
    const handlelogout = ()=>{
      localStorage.removeItem('token');
      props.showAlert("Succesfully Logged Out","success");
      suprsend.reset();
      navigate("/login");
    }
  return (
    <div>
         <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{minHeight:"10px"}}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">📅  Doodle Calender</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                
                </ul>
                {!localStorage.getItem('token')?
                <form className="d-flex" role="search">
                <Link className='btn btn-secondary mx-1' to='/login' role='button'>Login</Link>
                <Link className='btn btn-secondary mx-1' to='/signup' role='button'>Signup</Link>
                </form>:<button onClick={handlelogout} className='btn btn-secondary'>Logout</button>
                }
                </div>
            </div>
            </nav>
    </div>
  )
}
