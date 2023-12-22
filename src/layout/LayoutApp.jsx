import {Layout, Menu} from "antd";
import Sider from "antd/lib/layout/Sider.js";
import {Content, Footer, Header} from "antd/lib/layout/layout.js";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {LayoutHeader} from "./LayoutHeader.jsx";
import {LayoutFooter} from "./LayoutFooter.jsx";
import {
    HomeOutlined,
    NodeIndexOutlined,
    NotificationOutlined,
    PieChartOutlined,
    SkinOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useEffect, useState} from "react";

export function LayoutApp() {
    const location = useLocation()
    const navigate = useNavigate();
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState()
    const [isCollapsed, setIsCollapsed] = useState(false)


    const items = [
        getItem('Home', '1', <HomeOutlined/>),
        getItem('Client', '2', <UserOutlined/>),
        getItem('Campaign', '3', <NotificationOutlined/>),
        getItem('Mission', '4', <NodeIndexOutlined />),
        getItem('Mapper', '5', <SkinOutlined/>),
    ];

    function getItem(label, key, icon, children) {
        return {
            key,
            icon,
            children,
            label,
        };
    }

    function clickItem(item) {

        switch (item.key) {
            case '2':
                navigate('/client')
                break

            case '3':
                navigate('/campaign')
                break

            case '4':
                navigate('/mission')
                break

            case '5':
                navigate('/mapper')
                break

            default:
                navigate('/')

        }
    }

    useEffect(() => {
        const path = location.pathname.split('/')

        switch (path[1]) {
            case 'client':
                setDefaultSelectedKeys('2')
                break
            case 'campaign':
                setDefaultSelectedKeys('3')
                break
            case 'mission':
                setDefaultSelectedKeys('4')
                break
            case 'mapper':
                setDefaultSelectedKeys('5')
                break
            default:
                setDefaultSelectedKeys('1')
        }
    }, []);

    return (
        <Layout style={{
            height: '100%',
            overflow: 'none'
        }}>
            <Header style={{
                height: 90,
                padding: '0 20px',
            }}>
                <LayoutHeader isCollapsed={isCollapsed}
                              setIsCollapsed={setIsCollapsed}/>
            </Header>
            <Layout style={{
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: '#001529',
            }}>
                <Sider
                    width={200}
                    collapsed={isCollapsed}
                    style={{
                        padding: '0 5px',
                    }}>
                    {defaultSelectedKeys && <Menu
                        onClick={clickItem}
                        inlineCollapsed={isCollapsed}

                        theme="dark"
                        defaultSelectedKeys={[defaultSelectedKeys]}
                        mode="inline"
                        items={items}/>}
                </Sider>
                <Content style={{
                    backgroundColor: '#f5f5f5',
                    borderTopLeftRadius: 40,
                    borderBottomLeftRadius: 40,
                    border: '25px #f5f5f5 solid',
                    borderRight: 'none',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        padding: 25,
                        backgroundColor: '#fff',
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        border: '1px var(--color-yellow) solid'
                    }}>
                        <Outlet/>
                    </div>

                </Content>
            </Layout>
            <Footer style={{
                height: '40px',
                paddingTop: 10,
                backgroundColor: '#001529',
                color: 'rgba(255,255,255,0.67)',
            }}>
                <LayoutFooter/>
            </Footer>
        </Layout>
    )
}

