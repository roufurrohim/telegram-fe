import { Route, Redirect } from "react-router-dom";

const Guard = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  
  return (
    <Route
      {...rest}
      render={(props) => {
        if (token === null) {
          alert("Anda Harus Login")
          return <Redirect to="/"/>
        } else {
          return <Component {...props} />
        }
      }
    }
    />
  );
};

export default Guard;