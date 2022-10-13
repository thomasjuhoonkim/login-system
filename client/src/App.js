import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registeredUsername, setRegisteredUsername] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loggedInUsername, setloggedInUsername] = useState("");
  const [loginStatus, setLoginStatus] = useState(false);
  const [authStatus, setAuthStatus] = useState(false);

  const link = "https://backend-login-system.herokuapp.com";
  // const link = "http://localhost:5000";

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post(link + "/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      if (!response.data.registered) {
        setRegistered(false);
        return;
      }
      setRegistered(true);
      setRegisteredUsername(response.data.username);
    });
  };

  const login = () => {
    Axios.post(link + "/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (!response.data.auth) {
        setLoginStatus(false);
        setAuthStatus(false);
        return;
      }
      localStorage.setItem("token", response.data.token);
      setloggedInUsername(response.data.result[0].username);
      setLoginStatus(true);
      setAuthStatus(false);
    });
  };

  const userAuthentication = () => {
    Axios.get(link + "/auth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((response) => {
      if (!response.data.auth) {
        setAuthStatus(false);
        return;
      }
      setAuthStatus(true);
    });
  };

  useEffect(() => {
    Axios.get(link + "/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(true);
        setloggedInUsername(response.data.user);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className="registration">
        <h1>Registration</h1>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsernameReg(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}>Register</button>
      </div>

      {registered ? (
        <h3>Thanks for registering {registeredUsername}!</h3>
      ) : (
        <></>
      )}

      <div className="login">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button onClick={login}>Login</button>
      </div>

      {loginStatus ? (
        <h3>Welcome {loggedInUsername}!</h3>
      ) : (
        <h3>Not logged in.</h3>
      )}
      {loginStatus && (
        <button onClick={userAuthentication}>Authenticate</button>
      )}
      {authStatus ? (
        <h3>Authenticated using token {localStorage.getItem("token")}</h3>
      ) : (
        <h3>Not authenticated.</h3>
      )}
    </div>
  );
}

export default App;
