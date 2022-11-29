import { createRoot } from "react-dom/client";
import Welcome from "./components/welcome";
import App from "./components/App";

const root = createRoot(document.querySelector("main"));

// -------------------------------------------------------------------------------- loged in?

fetch("/user/id.json")
    .then((result) => result.json())
    .then((userInfo) => {
        console.log(userInfo);
        if (userInfo.userID) {
            root.render(<App />);
        } else {
            root.render(<Welcome />);
        }
    });
