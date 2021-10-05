/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../helpers/env";
import socket from '../config/socket'
import "../css/Chat.css";
import { HiMenuAlt1 } from "react-icons/hi";
import { IoSearch, IoPersonAddOutline } from "react-icons/io5";
import { ImLocation } from "react-icons/im";
import { GoPlus } from "react-icons/go";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { FaImage } from "react-icons/fa";
import { BsPerson, BsQuestionCircle, BsFillGridFill } from "react-icons/bs";
import { AiFillFolderOpen } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { HiEmojiHappy } from "react-icons/hi";

const Chat = () => {
  const [listContact, setListContact] = useState([]);

  const [receiver, setReceiver] = useState("");

  const [listMessage, setListMessage] = useState([]);

  const [user, setUser] = useState([])

  const [showToggle, setShowToggle] = useState(false);

  const [ msg, setMsg ] = useState("")

  const [showAdd, setShowAdd] = useState(false);

  const dataUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  useEffect(() => {
    setUser(JSON.parse(dataUser))
    const headers = {
      token: token,
    };
    axios
      .get(`${API_URL}users/${user.id}`, { headers })
      .then((result) => {
        const data = result.data.data.data;
        setListContact(data);
      })
      .catch((err) => {
        alert(err.response.message);
      });
  }, []);

  useEffect(() => {
    socket.on('list-messages', (payload) => {
      console.log(payload)
    })
  })

  const handleSendMsg = (e) => {
    e.preventDefault()
    const payload = {
      idsender: parseInt(user.id),
      sender: user.username,
      idreceiver: receiver.id,
      receiver: receiver.username,
      msg,
    }
    socket.emit('send-message', payload)
    setListMessage([...listMessage,{
      sender: user,
      receiver: receiver,
      msg,
    }])
    setMsg("")
  }

  const optionReceiver = (id) => {
    const filter = listContact.filter((e) => (e.id === id ? e : null));
    setReceiver(filter[0]);
    console.log(id, user.id)
    socket.emit('get-messages',{receiver: id, idsender: user.id, sender: user.username})
    // setListMessage([])
    socket.on('history-messages',(payload) => {
      console.log(payload)
    })
  };

  const showMenu = () => {
    setShowToggle(!showToggle);
  };

  const showMenuAdd = () => {
    setShowAdd(!showAdd);
  };

  const history = useHistory()
  const handleLogout = () => {
    localStorage.clear()
    history.push('/')
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 contentLeft">
            <div className="d-flex align-items-center justify-content-between p-4">
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
                      <div className="row menuList">
                        <div className="col-lg-3 text-center">
                          <FiSettings size={28} className="iconListMenu" />
                        </div>
                        <div className="col-lg-9 pt-1">
                          <p className="listMenu">Setting</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-lg-3 text-center">
                          <BsPerson size={28} className="iconListMenu" />
                        </div>
                        <div className="col-lg-9 pt-1">
                          <p className="listMenu">Contacts</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-lg-3 text-center">
                          <IoPersonAddOutline
                            size={26}
                            className="iconListMenu"
                          />
                        </div>
                        <div className="col-lg-9 pt-1">
                          <p className="listMenu">Invite Friends</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1">
                      <div className="row menuList">
                        <div className="col-lg-3 text-center">
                          <BsQuestionCircle
                            size={24}
                            className="iconListMenu"
                          />
                        </div>
                        <div className="col-lg-9 pt-1">
                          <p className="listMenu">Telegram FAQ</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 my-1" onClick={handleLogout}>
                      <div className="row menuList">
                        <div className="col-lg-3 text-center">
                          <FiLogOut
                            size={24}
                            className="iconListMenu"
                          />
                        </div>
                        <div className="col-lg-9 pt-1">
                          <p className="listMenu">Logout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-2 ">
              <div className="d-flex align-items-center pack">
                <div className="search">
                  <button className="btn">
                    <IoSearch size={30} className="iconSearch" />
                  </button>
                  <input
                    type="text"
                    className="inputSearch"
                    placeholder="Type your message..."
                  />
                </div>

                <button className="btn ms-lg-5">
                  <GoPlus size={30} className="iconAdd" />
                </button>
              </div>
              <div></div>
            </div>

            <div className="chatList mt-lg-4 p-2">
              {listContact.map((e, i) => (
                <div
                  key={i}
                  className="contact"
                  onClick={() => optionReceiver(e.id)}
                >
                  <div className="row mb-5">
                    <div className="col-lg-3">
                      <img
                        src={`${API_URL}${e.image}`}
                        alt="profile"
                        className="photo"
                      />
                    </div>
                    <div className="col-lg-6">
                      <h5>{e.username}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-9 contentRight">
            {listMessage.length === 0 && receiver === "" ? 
              <div className="d-flex justify-content-center align-items-center notChatList">
                <p className="noteChat">
                  Please select a chat to start messaging
                </p>
              </div>
             : 
              <div className="row">
                <div className="col-lg-12 receiver">
                    <div className="row justify-content-center p-3">
                      <div className="col-lg-1">
                        <img
                          src={`${API_URL}${receiver.image}`}
                          alt="receiver"
                          className="photo"
                        />
                      </div>
                      <div className="col-lg-4 pt-2">
                        <h6 className="nameReceiver">{receiver.username}</h6>
                        <small className="status">Online</small>
                      </div>
                      <div className="col-lg-5 w-50 d-flex align-items-center justify-content-end">
                        <BsFillGridFill size={28} className="iconAdd" />
                      </div>
                    </div>
                </div>

                <div className="col-lg-12 ">
                  {
                  listMessage.map((e, i) => (
                    // if (e.receiver === receiver.username || e.sender === receiver.username) {
                      e.receiver.username === receiver.username || e.sender.username === receiver.username ?
                      <div key={i} >
                          {/* {
                            e.sender.username === 
                          } */}
                          <img src={`${API_URL}${e.sender.image}`} alt="sender" /> <p>{e.msg}</p>
                      </div>
                      : null
                    // }
                  ))
                }

                </div>
                
                <div className="col-lg-12 position-absolute bottom-0 sendMsg">
                  <div className="row ms-2 packSend">
                    <div className="col-lg-8">
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

                    <div className="col-lg-4 text-end">
                      <GoPlus
                        size={28}
                        className="iconAdd mx-2"
                        onClick={showMenuAdd}
                      />

                      <HiEmojiHappy size={28} className="iconAdd mx-2" />

                      <RiSendPlaneFill size={28} className="iconAdd mx-2" onClick={handleSendMsg} />
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
