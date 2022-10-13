import React from "react";
import ReactDOM from "react-dom/client";
import CookieConsent from "react-cookie-consent";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="CookieConsent"
      buttonStyle={{ borderRadius: 100 }}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
    <footer>
      <h3>Made by Thomas Kim</h3>
      <p>
        <a href="https://backend-login-system.herokuapp.com">
          Check out the backend!
        </a>
      </p>
      <p>
        <a href="https://www.github.com/thomasjuhoonkim">
          Check out my Github!
        </a>
      </p>
    </footer>
  </>
);
