import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {AuthProvider} from "react-oidc-context";
import {WebStorageStateStore} from "oidc-client-ts";

const oidcConfig = {
    authority: "https://iam.mindearth.ai/realms/greengage",
    client_id: "backoffice-app",
    redirect_uri: "http://localhost:5173/",
    // redirect_uri: "https://greengage-mission-control.mindearth.ai/",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider {...oidcConfig}>
        <App/>
    </AuthProvider>,
)