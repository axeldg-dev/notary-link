import {createRoot} from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import {Provider} from "react-redux";
import {store} from "./app/store/store.js";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <App/>
    </Provider>
);
  