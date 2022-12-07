import { createRoot } from "react-dom/client";
import Welcome from "./components/welcome";
import App from "./components/App";

// -------------------------------------------------------------------------------- setup for redux
import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./redux/reducer.js";
import { Provider } from "react-redux";

const root = createRoot(document.querySelector("main"));

// -------------------------------------------------------------------------------- more setup for redux
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

// -------------------------------------------------------------------------------- loged in?

fetch("/user/id.json")
    .then((result) => result.json())
    .then((userInfo) => {
        console.log(userInfo);
        if (userInfo.userID) {
            root.render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
        } else {
            root.render(<Welcome />);
        }
    });
