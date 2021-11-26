import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { BiShow, BiHide } from "react-icons/bi";
import { ACTION_GET_DETAILS_USER, LOGIN } from "../redux/actions/user";
import { useDispatch } from "react-redux";
import "../css/Login.css";
import google from "../css/google.svg";
import socket from "../config/socket";

const Login = () => {
  const dispatch = useDispatch();

  const history = useHistory();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPwd, setShowPwd] = useState(false);

  const [warning, setWarning] = useState("");

  const toggleShow = () => setShowPwd(!showPwd);

  const toSignUp = () => {
    history.push("/register");
  };

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setWarning("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    LOGIN(form)
      .then((result) => {
        const token = result.data.data.token
        const idUser = result.data.data[0].id

        localStorage.setItem("token", token);
        localStorage.setItem('idUser', idUser)
        socket.emit("login", idUser);
        dispatch(ACTION_GET_DETAILS_USER(idUser));
        history.push("/chat");
      })
      .catch((err) => {
        const msg = err.response.data.message;
        return setWarning(msg)
      });
    setForm({
      email: "",
      password: "",
    });
  };

  return (
    <div>
      <div className="container-fluid pageLogin">
        <div className="row card cardLogin">
          <div className="col-12">
            <h2 className=" card-header border-bottom-0 bg-white titleLogin">
              Login
            </h2>
          </div>
          <div className="mt-3 mb-3">
            <small>Hi, Welcome back!</small>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3 col-12">
                <label for="emailLogin" className="form-label labelLogin">
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
                <div className="borderLogin"></div>
              </div>
              <div className="mb-3">
                <label for="pass" className="form-label labelLogin">
                  Password
                </label>

                <span
                  onClick={toggleShow}
                  className="position-absolute iconShow"
                >
                  {showPwd ? <BiShow size={24} /> : <BiHide size={24} />}
                </span>
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-control border-0"
                  id="pass"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                />
                <div className="borderLogin"></div>
              </div>

              <div className="mt-3">
                <small style={{ color: "red" }}>{warning}</small>
              </div>

              <div className="form-text text-end pt-3">
                <strong className="noteForget">Forgot Password ?</strong>
              </div>
              <div className="row mt-lg-5 mt-3">
                <div
                  onClick={handleSubmit}
                  className="col-lg-12 text-center btnLogin"
                >
                  <button type="submit" className="btn btnSubmitLogin">
                    Login
                  </button>
                </div>
                <div className="col-lg-12 mt-4">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-4 border-bottom"></div>

                    <div className="col-4 text-center">
                      <h6 className="loginWith">Login with</h6>
                    </div>

                    <div className="col-4 border-bottom"></div>
                  </div>
                </div>
                <div className="col-lg-12 text-center mt-4 btnWithGoogle">
                  <button type="submit" className="btn googleLogin">
                    <span className="me-lg-2">
                      {" "}
                      <img src={google} alt="google" />{" "}
                    </span>{" "}
                    Google
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-lg-5 mt-3 text-center createAccount">
              Don’t have an account?{" "}
              <span onClick={toSignUp} className=" btnSignUp">
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
