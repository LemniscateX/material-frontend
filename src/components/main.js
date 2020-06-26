import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
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

const { Header, Sider, Content } = Layout;

const MainPage = (props) => {
  const [state, setState] = useState({
    collapsed: false,
    pageType: 'material',
  });

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={state.collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['material']} onClick={({ key }) => {
          setState({
            ...state,
            pageType: key,
          })
        }}>
          <Menu.Item key="material" icon={<UserOutlined />} >
            物资列表
            </Menu.Item>
          <Menu.Item key="history" icon={<VideoCameraOutlined />}>
            历史记录
            </Menu.Item>
          {props.isAdmin && <Menu.Item key="user" icon={<UploadOutlined />}>
            用户管理
            </Menu.Item>}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setState({ ...state, collapsed: !state.collapsed }),
          })}

          {/* TODO: username + logout */}
          {props.username}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
          }}
        >
          {
            state.pageType === 'material' ? <MaterialPage /> :
              state.pageType === 'history' ? <HistoryPage /> :
                state.pageType === 'user' ? <UserPage /> :
                    <></>
          }
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainPage;
