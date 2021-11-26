/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { API_URL } from "../helpers/env";
import socket from "../config/socket";
import "../css/Chat.css";
import { ACTION_GET_USERS, ACTION_GET_DETAILS_USER, UPDATE_USER } from "../redux/actions/user";

import { HiMenuAlt1, HiOutlinePencil } from "react-icons/hi";
import { IoSearch, IoPersonAddOutline } from "react-icons/io5";
import { ImLocation } from "react-icons/im";
import { GoPlus } from "react-icons/go";
import { GrLock } from "react-icons/gr";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaImage } from "react-icons/fa";
import { BsPerson, BsQuestionCircle, BsFillGridFill } from "react-icons/bs";
import { AiFillFolderOpen, AiOutlineCamera, AiTwotoneDelete } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiEmojiHappy } from "react-icons/hi";
import { IoIosArrowBack } from "react-icons/io";

const Chat = () => {
  const dispatch = useDispatch();

  const dataStore = useSelector((state) => state.users)

  const listContact = useSelector((state) => state.users.all);

  const user = useSelector((state) => state.users.details[0]);

  const [receiver, setReceiver] = useState("");

  const [listMessage, setListMessage] = useState([]);

  const [listMsgHistory, setListMsgHistory] = useState([]);

  const [showToggle, setShowToggle] = useState(false);

  const [msg, setMsg] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  
  const [showFriend, setShowFriend] = useState(false);
  
  const [showMsg, setshowMsg] = useState(false);
  
  const [showDel, setshowDel] = useState(false);

  const [warning, setWarning] = useState("")

  const [dataUser, setDataUser] = useState({
    // username: !dataStore.loadDetails ? user.username : "",
    // fullname: !dataStore.loadDetails ? user.fullname : "",
    imgPreview: "",
    // img: !dataStore.loadDetails ? user.image : "",
    // biodata: !dataStore.loadDetails ? user.bio : "",
    // phone: !dataStore.loadDetails ? user.phone : "",
  });
  
  // const dataUser = localStorage.getItem("user");
  // const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("idUser")

  useEffect(() => {
    dispatch(ACTION_GET_USERS());
  }, []);

  // handle button edit image
  const hiddenFileInput = useRef(null);
  const handleClickImg = (e) => {
    hiddenFileInput.current.click();
  };

  // handle scroll chat bottom
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  };

  useEffect(() => scrollToBottom, [listMsgHistory, listMessage,receiver])
  useEffect(() => scrollToBottom,[])

  const handleChangeImg = (e) => {
    setDataUser({
      ...dataUser,
      image: e.target.files[0],
      imgPreview: URL.createObjectURL(e.target.files[0]),
    });
  };

  const handleChange = (e) => {
    const {name, value} = e.target
    setDataUser({
      ...dataUser,
      [name]: value,
    })
    setWarning("")
  }


  const handleUpdate = (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append("fullname", dataUser.fullname)
    formData.append("username", dataUser.username)
    formData.append("email", user.email)
    formData.append("image", dataUser.image)
    formData.append("bio", dataUser.bio)
    formData.append("phone", dataUser.phone)
    
    UPDATE_USER(formData)
    .then((res) => {
      dispatch(ACTION_GET_DETAILS_USER(idUser))
      btnShowEdit()
    })
    .catch((err) => {
      const errorFile = err.response.data.message.message 
      
      if (errorFile === undefined) {
        console.log(err.response.data)
        setWarning(err.response.data.message + " Change your Photo")
      } else {
        
        setWarning(err.response.data.message.message)
      }
    })
  }

  const handleSendMsg = (e) => {
    e.preventDefault();
    const payload = {
      idSender: parseInt(user.id),
      sender: user.image,
      idReceiver: receiver.id,
      receiver: receiver.image,
      msg,
    };
    socket.emit("send-message", payload);
    setListMessage([
      ...listMessage,
      {
        id: Math.floor(Math.random() * 1000),
        idSender: parseInt(user.id),
        sender: user.image,
        idReceiver: receiver.id,
        receiver: receiver.image,
        msg,
      },
    ]);
    setMsg("");
  };

  const optionReceiver = (id) => {
    setshowMsg(!showMsg)
    const filter = listContact.filter((e) => (e.id === id ? e : null));
    setReceiver(filter[0]);

    socket.emit("get-messages", { receiver: id, idsender: user.id });
    setListMessage([]);
    socket.on("history-messages", (payload) => {
      console.log(payload)
      setListMsgHistory(payload);
    });
  };

  useEffect(() => {
    socket.on("list-messages", (payload) => {
    //   if (payload.receiver === receiver.username) {
        setListMessage([
          ...listMessage,
          {
            ...payload,
            id: Math.floor(Math.random() * 1000),
          },
        ]);  
    //   }
      
    });
  });

  const showMenu = () => {
    setShowToggle(!showToggle);
  };

  const showMenuAdd = () => {
    setShowAdd(!showAdd);
  };

  const btnShowMsg = () => {
    setshowMsg(!showMsg)
  }

  const btnShowProf = () => {
    setShowProfile(!showProfile);
    setShowToggle(!showToggle)
  };

  const btnShowEdit = () => {
    setDataUser({...dataUser,...user})
    setShowEdit(!showEdit);
    
  };

  const btnShowFriend = () => {
    setShowFriend(!showFriend)
  }

  const btnShowDel = () => {
    setshowDel(!showDel)
  }

  const delMsg = (id) => {
    const newcart = listMessage.filter((e)=>{
      if(e.id !== id){
        return e
      }
    })
    setListMessage(newcart)
    socket.emit("del-message", { id, receiver: receiver.id, idsender: user.id });
    socket.on("history-after-delete", (payload) => {
      setListMsgHistory(payload);
      
    });
  }

  

  const history = useHistory();
  const handleLogout = () => {
    localStorage.clear();
    history.push("/");
  };
  
  return (
    <div>
      <div className="container-fluid">
        { dataStore.loadDetails || dataStore.loadAll ? 
        (
          <div className="d-flex justify-content-center align-items-center">
            <h1>Loading...</h1>
          </div>
        ) : (<div className="row">
          
          <div className={showMsg ? "d-lg-block col-lg-3 contentLeft d-none" : "col-lg-3 contentLeft"}>  
            {/* Profile User */}
            {showProfile ? (
              <div className={showEdit ? "d-none" : "p-lg-4 p-3"}>
                <div
                  className="position-absolute iconBackP"
                  onClick={btnShowProf}
                >
                  <IoIosArrowBack size={28} />
                </div>
                <div>
                  <div className="d-flex align-items-lg-center justify-content-center">
                    <h4 className="titleUser">{user.username}</h4>
                  </div>
                  <div className="mt-lg-5 mt-4 text-center">
                    <img
                      src={`${API_URL}${user.image}`}
                      alt="user"
                      className="photoUser"
                    />
                    <div className="mt-lg-4 mt-3 nameProfile">
                      <p className="">
                        <b>{user.fullname}</b>
                      </p>
                      <div className="noteUser">
                        <small>{user.username}</small>
                      </div>
                    </div>
                  </div>
                  <div className="mt-lg-4 mt-3">
                    <h5>Account</h5>
                    <p className="mb-0">
                      {user.phone === "null" ? "xxx" : user.phone}
                    </p>
                    <small onClick={btnShowEdit} className="noteTelp">
                      Tap to change phone number
                    </small>
                  </div>
                  <div className="marginPhone"></div>
                  <div className="mt-3">
                    <p className="mb-0">{user.username}</p>
                    <span className="noteUsername">Username</span>
                  </div>
                  <div className="marginPhone"></div>
                  <div className="mt-3">
                    <p className="mb-0">
                      {user.bio}
                    </p>
                    <span className="noteUsername">Bio</span>
                  </div>
                  <div className="mt-4">
                    <div>
                      <h4>Settings</h4>
                    </div>
                    <div className="row mt-3">
                      <div className="row">
                        <div className="col-2">
                          <GrLock size={28} className="iconSettings" />
                        </div>
                        <div className="col-9">
                          <span className="listChangePwd">Change Password</span>
                        </div>
                      </div>

                      <div className="row" onClick={btnShowEdit}>
                        <div className="col-2 mt-lg-4 mt-3">
                          <HiOutlinePencil size={28} className="iconSettings" />
                        </div>
                        <div className="col-9 mt-lg-4 mt-3">
                          <span className="listChangePwd">Edit Profile</span>
                        </div>
                      </div>

                      <div onClick={handleLogout} className="row">
                        <div className="col-2 mt-lg-4 mt-3">
                          <FiLogOut size={28} className="ms-1 iconSettings" />
                        </div>
                        <div className="col-9 mt-lg-4 mt-3">
                          <span className="listChangePwd">Logout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Edit Profile */}
            {showEdit ? (
              <div className="p-lg-4 p-3">
                <form onSubmit={handleUpdate}>
                  <div
                    className="position-absolute iconBackP"
                    onClick={btnShowEdit}
                  >
                    <IoIosArrowBack size={28} />
                  </div>
                  <div>
                    <div className="d-flex align-items-center justify-content-center">
                      <h4 className="titleUser">{user.username}</h4>
                    </div>

                    <div className="mt-lg-5 mt-4 text-center">
                      <img
                        src={
                          dataUser.imgPreview === ""
                            ? `${API_URL}${user.image}`
                            : dataUser.imgPreview
                        }
                        alt="user"
                        className="editPhotoUser"
                      />

                      <div className="position-absolute btnImg">
                        <input
                          type="file"
                          name="image"
                          id="image"
                          onChange={handleChangeImg}
                          ref={hiddenFileInput}
                          accept="image/png, image/jpg, image/jpeg"
                          style={{ display: "none" }}
                        />
                        <button
                          type="button"
                          onClick={handleClickImg}
                          className="btn"
                        >
                          <AiOutlineCamera size={22} className="iconImg" />
                        </button>
                      </div>

                      <div className="d-flex flex-column align-items-center justify-content-center mt-lg-4 mt-3 nameProfile">
                        <input
                          type="text"
                          name="fullname"
                          value={dataUser.fullname}
                          onChange={handleChange}
                          className="form-control w-50 text-center border-0"
                        />
                        <div className="mt-1 noteUser">
                        <small>{user.username}</small>
                        </div>
                      </div>

                      <div className="d-flex flex-column flex-start mt-4">
                        <h5 className="text-start">Account</h5>
                        <input
                          type="number"
                          name="phone"
                          value={dataUser.phone}
                          onChange={handleChange}
                          placeholder="Input Number with code country(62)"
                          className="form-control w-75 border-0 inputPhone"
                        />

                      </div>
                      <div className="marginPhone"></div>
                      <div className="d-flex flex-column flex-start mt-4">
                      
                        <input
                          type="text"
                          name="username"
                          value={dataUser.username}
                          onChange={handleChange}
                          placeholder="Input username"
                          className="form-control w-50 border-0"
                        />

                        <span className="text-start mt-1 ms-3 noteUsername">Username</span>
                      </div>
                      <div className="marginPhone"></div>
                      <div className="d-flex flex-column flex-start mt-lg-4">
                      
                        <textarea
                          type="text"
                          name="bio"
                          value={dataUser.bio}
                          onChange={handleChange}
                          placeholder="Input Bio..."
                          className="form-control w-75 border-0"
                        />

                        <span className="text-start mt-1 ms-3 noteUsername">Bio</span>
                      </div>
                      <div className="mt-lg-3 warning"><p>{warning}</p></div>
                    </div>
                        
                    <div className="mt-5 d-flex justify-content-center align-items-center ">
                    <div className="">
                      <button type="submit" className="btn me-4 btnSave">Save</button>
                    </div>
                    
                    <div className="">
                      <button onClick={btnShowEdit} className="btn ms-4 btnCancel">Cancel</button>
                    </div>
                    
                  </div>

                  </div>
                </form>
              </div>
            ) : null}

            {/* list menu */}
            <div
              className={
                showProfile
                  ? "d-none"
                  : "d-flex align-items-center justify-content-between p-4"
              }
            >
                <h3 className="titleTele">Telegram</h3>
              
              <div className="btn dropdown">
                <HiMenuAlt1 size={30} className="iconMenu" onClick={showMenu} />
              </div>
              <div
                className={
                  !showToggle ? "d-none" : "d-block row position-absolute menu"
                }
              >
                <div className="col-lg-12 p-3">
                  <div className="row mt-4 ms-2">
                    <div className="col-lg-12 my-1">
                      <div className="row menuList" onClick={btnShowProf}>
                        <div className="col-3 text-center">
                          <FiSettings size={28} className="iconListMenu" />
                        </div>
                        <div className="col-9 pt-1">
                          <p className="listMenu">Setting</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-3 text-center">
                          <BsPerson size={28} className="iconListMenu" />
                        </div>
                        <div className="col-9 pt-1">
                          <p className="listMenu">Contacts</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-3 text-center">
                          <IoPersonAddOutline
                            size={26}
                            className="iconListMenu"
                          />
                        </div>
                        <div className="col-9 pt-1">
                          <p className="listMenu">Invite Friends</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-3 text-center">
                          <BsQuestionCircle
                            size={24}
                            className="iconListMenu"
                          />
                        </div>
                        <div className="col-9 pt-1">
                          <p className="listMenu">Telegram FAQ</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1" onClick={handleLogout}>
                      <div className="row menuList">
                        <div className="col-3 text-center">
                          <FiLogOut size={24} className="iconListMenu" />
                        </div>
                        <div className="col-9 pt-1">
                          <p className="listMenu">Logout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* form search */}
            <div className={showProfile ? "d-none" : "p-2 mb-lg-0 mb-4"}>
              <div className="d-flex align-items-center pack">
                <div className="search">
                  <button className="btn">
                    <IoSearch size={30} className="iconSearch" />
                  </button>
                  <input
                    type="text"
                    className="inputSearch"
                    placeholder="Type your contact..."
                  />
                </div>

                <button className="btn ms-lg-5">
                  <GoPlus size={30} className="iconAdd" />
                </button>
              </div>
              <div></div>
            </div>

            {/* list contact */}
            <div className={showProfile ? "d-none" : "mt-lg-4 p-2 contactList"}>
              {listContact.map((e, i) => (
                <div
                  key={i}
                  className="contact mb-4"
                  onClick={() => optionReceiver(e.id)}
                >
                  <div className="row">
                    <div className="col-lg-3 col-3 d-flex justify-content-end ">
                      <img
                        src={`${API_URL}${e.image}`}
                        alt="profile"
                        className="photo"
                      />
                    </div>
                    <div className="col-lg-6 col-6">
                      <h5>{e.fullname}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* for pc devices */}
          <div className={showFriend ? "d-lg-block d-none col-lg-6 contentRight" : "d-lg-block d-none col-lg-9 contentRight"}>
            {listMessage.length === 0 && receiver === "" ? (
              <div className="d-flex justify-content-center align-items-center notChatList">
                <p className="noteChat">
                  Please select a chat to start messaging
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12 receiver">
                  <div className="row justify-content-lg-center p-3">
                    <div className="col-lg-1 col-3">
                      <img
                        src={`${API_URL}${receiver.image}`}
                        alt="receiver"
                        className="photo"
                      />
                    </div>
                    <div className="col-lg-4 col-3 pt-2">
                      <h6 className="nameReceiver">{receiver.fullname}</h6>
                      <small className="status">Online</small>
                    </div>
                    <div className="col-lg-5 col-4 w-50 d-flex align-items-center justify-content-end">
                      <BsFillGridFill onClick={btnShowFriend} size={28} className="iconAdd" />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 pt-lg-3 contentMsg">
                  {listMsgHistory.map((e, i) => (
                      e.idReceiver === receiver.id ||
                      e.idSender === receiver.id ?
                    <div
                      key={i}
                      onClick={btnShowDel}
                      className={
                        e.idSender === user.id
                          ? "d-flex justify-content-end mb-4 msgSender"
                          : "d-flex justify-content-start mb-4"
                      }
                    >
                      <div
                        className={
                          e.idSender === user.id
                            ? "me-3 msgsSender "
                            : "d-none"
                        }
                      >
                        <p>{e.msg}</p>
                        <div onClick={() => delMsg(e.id)} className={showDel ? "delMSg" : "d-none"}>
                          <button className="btn">
                            <AiTwotoneDelete size={20} />
                          </button>
                          
                        </div>
                      </div>
                      <div className="imgSender d-flex align-items-end">
                        {
                          e.idSender === user.id ? 
                          <img
                          src={`${API_URL}${e.sender}`}
                          alt="chat"
                          className="photoChat"
                        />
                         :
                        <img
                          src={`${API_URL}${e.sender}`}
                          alt="chat"
                          className="photoChat"
                        />
                        
                        }
                        
                      </div>
                      <div
                        className={
                          e.idSender === user.id
                            ? " d-none "
                            : "d-block ms-3 msgsReceiver"
                        }
                      >
                        <div>
                          <p>{e.msg}</p>
                        </div>
                        
                      </div>
                    </div>
                    : null
                  ))}

                  {listMessage.map(
                    (e, i) =>
                    e.idReceiver === receiver.id ||
                    e.idSender === receiver.id ?
                  <div
                    key={i}
                    onClick={btnShowDel}
                    className={
                      e.idSender === user.id
                        ? "d-flex justify-content-end mb-4 msgSender"
                        : "d-flex justify-content-start mb-4"
                    }
                  >
                    <div
                      className={
                        e.idSender === user.id
                          ? "me-3 msgsSender "
                          : "d-none"
                      }
                    >
                      <p>{e.msg}</p>
                      <div onClick={() => delMsg(e.id)} className={showDel ? "delMSg" : "d-none"}>
                        <button className="btn">
                          <AiTwotoneDelete size={20} />
                        </button>
                        
                      </div>
                    </div>
                    <div className="imgSender d-flex align-items-end">
                      {
                        e.idSender === user.id ? 
                        <img
                        src={`${API_URL}${e.sender}`}
                        alt="chat"
                        className="photoChat"
                      />
                       :
                      <img
                        src={`${API_URL}${e.sender}`}
                        alt="chat"
                        className="photoChat"
                      />
                      
                      }
                      
                    </div>
                    <div
                      className={
                        e.idSender === user.id
                          ? " d-none "
                          : "d-block ms-3 msgsReceiver"
                      }
                    >
                      <div>
                        <p>{e.msg}</p>
                      </div>
                      
                    </div>
                  </div>
                  : null
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="col-lg-12 bottom-0 sendMsg">
                  <div className="row ms-2 packSend">
                    <div className="col-lg-8 col-6">
                      <form onSubmit={handleSendMsg}>
                        <input
                          type="text"
                          className="inputMessage ms-lg-2"
                          value={msg}
                          onChange={(e) => setMsg(e.target.value)}
                          placeholder="Type your message..."
                        />
                      </form>
                    </div>

                    {/* menu add on input message */}
                    <div
                      className={
                        showAdd
                          ? "d-block row position-absolute menuAdd"
                          : "d-none"
                      }
                    >
                      <div className="col-lg-12 p-3">
                        <div className="row mt-4 ms-2">
                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <FaImage size={28} className="iconListMenu" />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Image</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <AiFillFolderOpen
                                  size={28}
                                  className="iconListMenu"
                                />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Documents</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <BsPerson size={28} className="iconListMenu" />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Contact</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <ImLocation
                                  size={24}
                                  className="iconListMenu"
                                />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Location</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 col-6 text-end">
                      <GoPlus
                        size={28}
                        className="iconAdd mx-2"
                        onClick={showMenuAdd}
                      />

                      <HiEmojiHappy size={28} className="iconAdd mx-2" />

                      <RiSendPlaneFill
                        size={28}
                        className="iconAdd mx-2"
                        onClick={handleSendMsg}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            )}
          </div>
          
          {/* for mobile devices */}
          <div className={showMsg && !showFriend ? "d-lg-none col-lg-6 contentRight" : "d-none"}>
            {listMessage.length === 0 && receiver === "" ? (
              <div className="d-flex justify-content-center align-items-center notChatList">
                <p className="noteChat">
                  Please select a chat to start messaging
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-12 receiver">
                  <div className="row justify-content-center align-items-center p-3">
                    <div onClick={btnShowMsg} className="col-1 text-start">
                      <IoIosArrowBack size={26} />
                    </div>
                    <div className="col-lg-1 col-2">
                      <img
                        src={`${API_URL}${receiver.image}`}
                        alt="receiver"
                        className="photo"
                      />
                    </div>
                    <div className="col-lg-4 col-4 pt-lg-2 contentTitle">
                      <h6 className="nameReceiver">{receiver.fullname}</h6>
                      <small className="status">Online</small>
                    </div>
                    <div className="col-lg-5 col-4 d-flex align-items-center justify-content-end">
                      <BsFillGridFill onClick={btnShowFriend} size={28} className="iconAdd" />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 pt-3 contentMsg">
                  {listMsgHistory.map((e, i) => (
                      e.idReceiver === receiver.id ||
                      e.idSender === receiver.id ?
                    <div
                      key={i}
                      onClick={btnShowDel}
                      className={
                        e.idSender === user.id
                          ? "d-flex justify-content-end mb-4 msgSender"
                          : "d-flex justify-content-start mb-4"
                      }
                    >
                      <div
                        className={
                          e.idSender === user.id
                            ? "me-3 msgsSender "
                            : "d-none"
                        }
                      >
                        <p>{e.msg}</p>
                        <div onClick={() => delMsg(e.id)} className={showDel ? "delMSg" : "d-none"}>
                          <button className="btn">
                            <AiTwotoneDelete size={20} />
                          </button>
                          
                        </div>
                      </div>
                      <div className="imgSender d-flex align-items-end">
                        {
                          e.idSender === user.id ? 
                          <img
                          src={`${API_URL}${e.sender}`}
                          alt="chat"
                          className="photoChat"
                        />
                         :
                        <img
                          src={`${API_URL}${e.sender}`}
                          alt="chat"
                          className="photoChat"
                        />
                        
                        }
                        
                      </div>
                      <div
                        className={
                          e.idSender === user.id
                            ? " d-none "
                            : "d-block ms-3 msgsReceiver"
                        }
                      >
                        <div>
                          <p>{e.msg}</p>
                        </div>
                        
                      </div>
                    </div>
                    : null
                  ))}

                  {listMessage.map(
                    (e, i) =>
                    e.idReceiver === receiver.id ||
                    e.idSender === receiver.id ?
                  <div
                    key={i}
                    onClick={btnShowDel}
                    className={
                      e.idSender === user.id
                        ? "d-flex justify-content-end mb-4 msgSender"
                        : "d-flex justify-content-start mb-4"
                    }
                  >
                    <div
                      className={
                        e.idSender === user.id
                          ? "me-3 msgsSender "
                          : "d-none"
                      }
                    >
                      <p>{e.msg}</p>
                      <div onClick={() => delMsg(e.id)} className={showDel ? "delMSg" : "d-none"}>
                        <button className="btn">
                          <AiTwotoneDelete size={20} />
                        </button>
                        
                      </div>
                    </div>
                    <div className="imgSender d-flex align-items-end">
                      {
                        e.idSender === user.id ? 
                        <img
                        src={`${API_URL}${e.sender}`}
                        alt="chat"
                        className="photoChat"
                      />
                       :
                      <img
                        src={`${API_URL}${e.sender}`}
                        alt="chat"
                        className="photoChat"
                      />
                      
                      }
                      
                    </div>
                    <div
                      className={
                        e.idSender === user.id
                          ? " d-none "
                          : "d-block ms-3 msgsReceiver"
                      }
                    >
                      <div>
                        <p>{e.msg}</p>
                      </div>
                      
                    </div>
                  </div>
                  : null
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="col-lg-12 bottom-0 sendMsg">
                  <div className="row ms-2 packSend">
                    <div className="col-lg-8 col-6">
                      <form onSubmit={handleSendMsg}>
                        <input
                          type="text"
                          className="inputMessage ms-lg-2"
                          value={msg}
                          onChange={(e) => setMsg(e.target.value)}
                          placeholder="Type your message..."
                        />
                      </form>
                    </div>

                    {/* menu add on input message */}
                    <div
                      className={
                        showAdd
                          ? "d-block row position-absolute menuAdd"
                          : "d-none"
                      }
                    >
                      <div className="col-lg-12 p-3">
                        <div className="row mt-4 ms-2">
                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <FaImage size={28} className="iconListMenu" />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Image</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <AiFillFolderOpen
                                  size={28}
                                  className="iconListMenu"
                                />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Documents</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <BsPerson size={28} className="iconListMenu" />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Contact</p>
                              </div>
                            </div>
                          </div>

                          <div className="col-lg-12 my-1">
                            <div className="row menuList">
                              <div className="col-lg-3 text-center">
                                <ImLocation
                                  size={24}
                                  className="iconListMenu"
                                />
                              </div>
                              <div className="col-lg-9 pt-1">
                                <p className="listMenu">Location</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4 col-6 text-end">
                      <GoPlus
                        size={28}
                        className="iconAdd mx-2"
                        onClick={showMenuAdd}
                      />

                      <HiEmojiHappy size={28} className="iconAdd mx-2" />

                      <RiSendPlaneFill
                        size={28}
                        className="iconAdd mx-2"
                        onClick={handleSendMsg}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
            )}
          </div>

          <div className={showFriend ? "col-lg-3 position-lg-absolute vh-100 p-4 contentUserContact" : "d-none"}>
          
                <div
                  className="position-absolute iconBackP"
                  onClick={btnShowFriend}
                >
                  <IoIosArrowBack size={28} />
                </div>
                <div>
                  <div className="d-flex align-items-lg-center justify-content-center">
                    <h4 className="titleUser">{receiver.username}</h4>
                  </div>
                  <div className="mt-lg-5 mt-4 text-center">
                    <img
                      src={`${API_URL}${receiver.image}`}
                      alt="user"
                      className="photoUser"
                    />
                    <div className="mt-4 text-start nameProfile">
                      <p className="mb-0">
                        <b>{receiver.fullname}</b>
                      </p>
                        <small className="fs-6">Online</small>
                      {/* </div> */}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="fw-bold">Phone number</h5>
                    <p className="mb-0">
                      {receiver.phone}
                    </p>
                  </div>
                  <div className="marginPhone"></div>
                  <div className="mt-3">

                  </div>
                  <div className="mt-3">
                    <p className="mb-0">
                      {receiver.bio}
                    </p>
                    <span className="noteUsername">Bio</span>
                  </div>
                  <div className="mt-lg-4">
                    
                  </div>
                </div>
          </div>
        </div>)}
      </div>
    </div>
  );
};

export default Chat;
