import React, {useEffect, useState} from 'react';
import {fetchUserList} from '../../api/api';
import {Table} from "antd";

const UserPage = ({page, limit}) => {
    const [state, setState] = useState({
        users: [],
        page: page,
        totalCount: 0,
    });

    useEffect(() => {
        fetchUserList(page, limit).then(({users, totalCount}) => {
            setState({users: users, totalCount: totalCount, page: page});
        })
    }, [page, limit, setState]);

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Permission',
            dataIndex: 'permission',
            key: 'permission',
        },
    ];

    return (
        <Table columns={columns} dataSource={state.users}
               pagination={{
                   pageSize: limit,
                   current: state.page,
                   total: state.totalCount,
                   onChange: (page) => {
                       fetchUserList(page, limit).then(({users, totalCount}) => {
                           setState({users: users, page: page, totalCount: totalCount});
                       })
                   }
               }}/>
    )
}

export default UserPage;