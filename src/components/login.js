import React, {useState} from 'react';
import {Form, Input, Button} from 'antd';
import {login} from "../api/api";
import MainPage from "./main";

const LoginPage = () => {
    const [state, setState] = useState({
        loginState: 'not logged in',
    })

    return (
        state.loginState === 'logged in' ?
            <MainPage username={state.username} isAdmin={state.isAdmin}/> :
            <Form
                onFinish={data => {
                    setState({loginState: 'logging in'});
                    login(data.username, data.password).then((resp) => {
                        if (resp.ok) {
                            setState({loginState: 'logged in', username: data.username, isAdmin: resp.isAdmin});
                        } else {
                            // TODO: clear up form fields
                            setState({loginState: 'log in failed'})
                        }
                    }).catch(() => {
                        setState({loginState: 'log in failed'})
                    })
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={state.loginState === 'logging in'}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
    );
};

export default LoginPage;