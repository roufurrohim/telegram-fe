import axios from "axios";
import { API_URL } from "../../helpers/env";

export const ACTION_GET_USERS = () => {
  const token = localStorage.getItem("token");
  const idUser = localStorage.getItem("idUser");
  const headers = {
    token,
  };
  return (dispatch) => {
    dispatch(usersPending());
    axios
      .get(`${API_URL}users/${idUser}`, { headers })
      .then((result) => {
        // const data = result.data.data.data;
        dispatch(usersFullfilled(result.data.data));
      })
      .catch((err) => {
        dispatch(usersRejected(err));
      });
  };
};

export const ACTION_GET_DETAILS_USER = (id) => {
  const token = localStorage.getItem("token");
  const headers = {
    token,
  };

  return (dispatch) => {
    dispatch(userDetailsPending());
    axios
      .get(`${API_URL}user/${id}`, { headers })
      .then((result) => {
        dispatch(userDetailsFullFilled(result.data.data));
      })
      .catch((err) => {
        dispatch(userDetailsRejected(err));
      });
  };
};

export const REGISTER = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}register`, data)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const LOGIN = (data) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}login`, data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const UPDATE_USER = (form) => {
  const idUser = localStorage.getItem("idUser");
  return new Promise((resolve, reject) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      token: localStorage.getItem("token"),
    };
    axios
      .patch(`${API_URL}user/${idUser}`, form, { headers })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const usersPending = () => {
  return {
    type: "GET_USERS_PENDING",
  };
};

const usersFullfilled = (payload) => {
  return {
    type: "GET_USERS_FULLFILLED",
    payload,
  };
};

const usersRejected = (payload) => {
  return {
    type: "GET_USERS_REJECTED",
    payload: "An error occurred!",
  };
};

const userDetailsPending = () => {
  return {
    type: "GET_USER_DETAILS_PENDING",
  };
};

const userDetailsFullFilled = (payload) => {
  return {
    type: "GET_USER_DETAILS_FULLFILLED",
    payload,
  };
};

const userDetailsRejected = (payload) => {
  return {
    type: "GET_USER_DETAILS_REJECTED",
    payload: "An error occurred!",
  };
};
