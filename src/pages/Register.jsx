import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { ACTION_GET_DETAILS_USER, REGISTER } from "../redux/actions/user";
import { useDispatch } from "react-redux";
import "../css/Register.css";
import google from "../css/google.svg";

const Register = () => {

  const dispatch = useDispatch()
  
  const history = useHistory();

  const [form, setForm] = useState({
    username:"",
    email:"",
    password:"",
  })

  const [ warning, setWarning ] = useState("")

  const [showPwd, setShowPwd] = useState(false);

  const toggleShow = () => setShowPwd(!showPwd);

  const toLogin = () => {
    history.push("/");
  };

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
    setWarning("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const valid = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(form.email)
    const data = {
      ...form,
      image: "default.jpg"
    }
    if (form.username === "" || form.email === "" || form.password === "") {
      setWarning("input empty !!!")
    } else if (!valid) {
      setWarning("Input Email Failed !")
    }else {
      REGISTER(data).then((res) => {
        const dataResult = res.data
        localStorage.setItem('idUser', dataResult.insertId)
        localStorage.setItem('token', dataResult.token)
        dispatch(ACTION_GET_DETAILS_USER(dataResult.insertId))
        history.push('/chat')
      }).catch((err) => {
        const msg = err.response.data.message
        
        setWarning(msg)
      })
    }
    
    setForm({
      username:"",
      email: "",
      password: "",
    })
  }

  return (
    <div>
      <div className="container-fluid pageRegister">
        <div className="row card cardRegister">
          <div className="col-12">
            <div className="card-header d-flex justify-content-center align-items-center border-bottom-0 bg-white ">
            <span className="iconBackLogin" onClick={toLogin}> <IoIosArrowBack size={26} /> </span>
            <div>
                <h2 className="titleRegister" >Register</h2>
            </div>
            </div>
          </div>
          <div className="mt-3">
            <small>Let???s create your account!</small>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 col-12">
                <label for="userName" className="form-label labelRegister">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control border-0"
                  id="userName"
                  placeholder="Telegram App"
                  name="username"
                  value={form.username}
                  onChange={changeHandler}
                />
                <div className="borderRegister"></div>
              </div>
              <div className="mb-3 col-12">
                <label for="emailLogin" className="form-label labelRegister">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control border-0"
                  id="emailLogin"
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                  placeholder="example@mail.com"
                />
                <div className="borderRegister"></div>
              </div>
              <div className="mb-3">
                <label for="pass" className="form-label labelRegister">
                  Password
                </label>

                <span
                  onClick={toggleShow}
                  className="position-absolute iconShow"
                >{
                  showPwd ? <BiShow size={24} /> : <BiHide size={24} />
                }
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-control border-0"
                  id="pass"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                />
                <div className="borderRegister"></div>
                
                <div className="mt-3">
                  <p style={{color : "red"}}>{warning}</p>
                </div>
              </div>
              <div className="row mt-lg-5 mt-4 justify-content-center">
                <div className="col-lg-12 text-center w-100 btnRegister" onClick={handleSubmit}>
                  <button type="submit" className="btn btnSubmitRegister">
                    Register
                  </button>
                </div>
                <div className="col-lg-12 mt-lg-5 mt-4">
                  <div className="row justify-content-center align-items-center">
                    <div className="col-lg-4 col-3 border-bottom"></div>

                    <div className="col-lg-4 col-6 text-center">
                      <h6 className="registerWith">Register with</h6>
                    </div>

                    <div className="col-lg-4 col-3 border-bottom"></div>
                  </div>
                </div>
                <div className="col-lg-12 text-center w-100 mt-lg-5 mt-3 btnWithGoogle">
                  <button type="submit" className="btn googleRegister">
                    <span className="me-lg-2">
                      {" "}
                      <img src={google} alt="google" />{" "}
                    </span>{" "}
                    Google
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
