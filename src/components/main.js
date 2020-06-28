import React, {useState} from 'react';
import {Button, Layout, Menu} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import MaterialPage from './subpage/materials';
import HistoryPage from './subpage/history';
import UserPage from "./subpage/user";
import {logout} from "../api/api";

const {Header, Sider, Content} = Layout;

const MainPage = ({username, isAdmin}) => {
    const [state, setState] = useState({
        collapsed: false,
        pageType: 'material',
    });

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={state.collapsed}>
                <div className="logo"/>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['material']} onClick={({key}) => {
                    setState({
                        ...state,
                        pageType: key,
                    })
                }}>
                    <Menu.Item key="material" icon={<UserOutlined/>}>
                        物资列表
                    </Menu.Item>
                    <Menu.Item key="history" icon={<VideoCameraOutlined/>}>
                        历史记录
                    </Menu.Item>
                    {isAdmin && <Menu.Item key="user" icon={<UploadOutlined/>}>
                        用户管理
                    </Menu.Item>}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}>
                    {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => setState({...state, collapsed: !state.collapsed}),
                    })}

                    {/* TODO: username + logout */}
                    {username}

                    <Button type={"primary"} onClick={() => {
                        logout().then((resp) => {
                            if (resp.ok) {
                                window.location.reload();
                            }
                        })
                    }}>Log out</Button>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                    }}
                >
                    {
                        state.pageType === 'material' ? <MaterialPage page={1} limit={5}/> :
                            state.pageType === 'history' ? <HistoryPage page={1} limit={5}/> :
                                state.pageType === 'user' ? <UserPage page={1} limit={5}/> :
                                    <></>
                    }
                </Content>
            </Layout>
        </Layout>
    );
}

export default MainPage;
