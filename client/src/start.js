import { createRoot } from "react-dom/client";
import Welcome from "./components/welcome";

const root = createRoot(document.querySelector("main"));

// -------------------------------------------------------------------------------- loged in?

fetch("/user/id.json")
    .then((result) => result.json())
    .then((userInfo) => {
        console.log(userInfo);
        if (userInfo.userID) {
            root.render(<h1>Hello again!</h1>);
        } else {
            root.render(<Welcome />);
        }
    });
