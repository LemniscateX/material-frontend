import React, {useEffect, useState} from 'react';
import {fetchHistoryList} from '../../api/api';
import {Table} from "antd";

const HistoryPage = ({page, limit}) => {
    const [state, setState] = useState({
        histories: [],
        page: page,
        totalCount: 0,
    });

    useEffect(() => {
        fetchHistoryList(page, limit).then(({histories, totalCount}) => {
            setState({histories: histories, totalCount: totalCount, page: page});
        })
    }, [page, limit, setState]);

    const columns = [
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
        },
        {
            title: 'Log',
            dataIndex: 'log',
            key: 'log',
        },
    ];

    return (
        <Table columns={columns} dataSource={state.histories}
               pagination={{
                   pageSize: limit,
                   current: state.page,
                   total: state.totalCount,
                   onChange: (page) => {
                       fetchHistoryList(page, limit).then(({histories, totalCount}) => {
                           setState({histories: histories, page: page, totalCount: totalCount});
                       })
                   }
               }}/>
    )
}

export default HistoryPage;