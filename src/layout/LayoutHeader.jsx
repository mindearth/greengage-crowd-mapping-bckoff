import {LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Button} from "antd";
import mindearthLogoWhite from "../assets/logo_white.png";
import {useAuth} from "react-oidc-context";

export function LayoutHeader({
                                 isCollapsed,
                                 setIsCollapsed
                             }) {
    const auth = useAuth();

    async function handleSignOut() {


        auth.signoutSilent()

        // try {
        //     await signOut()
        //
        //     location.reload()
        // } catch (err) {
        //     console.log('error signing out: ', err)
        // }
    }

    function toggleMenu() {
        setIsCollapsed(!isCollapsed)
    }


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
        }}>
            <div style={{
                width: 200,
            }}><Button
                onClick={toggleMenu}
                type="primary" icon={isCollapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>} size="large"/>
            </div>
            <img src={mindearthLogoWhite} alt="logo" style={{
                height: 45,
            }}/>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: 200,

            }}><Button
                onClick={handleSignOut}
                type="primary" icon={<LogoutOutlined/>} size="large"/></div>
        </div>
    )
}