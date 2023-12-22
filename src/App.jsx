import {useAuth} from "react-oidc-context";
import {ConfigProvider} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LayoutApp} from "./layout/LayoutApp.jsx";
import {Home} from "./home/Home.jsx";
import {CampaignHome} from "./campaign/CampaignHome.jsx";
import {MissionHome} from "./mission/MissionHome.jsx";
import {MapperHome} from "./mapper/MapperHome.jsx";

function App() {
    const auth = useAuth();

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    // if (auth.error) {
    //     return <div>Oops... {auth.error.message}</div>;
    // }

    if (auth.isAuthenticated) {
        return (
            <ConfigProvider
                theme={{
                    token: {
                        // Seed Token
                        fontFamily: "PPMoriRegular, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',\n" +
                            "    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'",
                        colorPrimary: '#5256BE',
                        // Alias Token
                    },
                }}
            >

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LayoutApp/>}>
                            <Route index element={<Home/>}/>
                            <Route path="/campaign" element={<CampaignHome/>}/>
                            <Route path="/mission" element={<MissionHome/>}/>
                            <Route path="/mapper" element={<MapperHome/>}/>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        );
    }

    auth.signinRedirect().then(() => console.log("redirected"));

    return <div>Redirecting...</div>;
}

export default App;
