import React, {useEffect, useState} from 'react';
import {fetchMaterialList, searchMaterial} from '../../api/api';
import {Table, Input} from "antd";

const {Search} = Input;

const MaterialPage = ({page, limit}) => {
    const [state, setState] = useState({
        materials: [],
        page: page,
        totalCount: 0,
    });

    useEffect(() => {
        fetchMaterialList(page, limit).then(({materials, totalCount}) => {
            setState({materials: materials, page: page, totalCount: totalCount});
        })
    }, [setState, page, limit]);

    const search = (text) => {
        if (text.length === 0) {
            fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                setState({materials: materials, page: page, totalCount: totalCount});
            });
        } else {
            searchMaterial(text, page, limit).then(({items, totalCount}) => {
                setState({materials: items, page: page, totalCount: totalCount});
            });
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Operator',
            dataIndex: 'operator',
            key: 'operator',
        },
        {
            title: 'Place',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: 'Create Time',
            dataIndex: 'ctime',
            key: 'ctime',
        },
        {
            title: 'Update Time',
            dataIndex: 'utime',
            key: 'utime',
        },
        {
            title: 'Info',
            dataIndex: 'info',
            key: 'info',
        },
    ];

    const debounceSearch = (time) => {
        let timeout;

        return function (e) {
            const t = e.target.value;
            const functionCall = () => search(t);

            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        }
    }

    return (<>
            <Search
                allowClear
                placeholder="search"
                // onSearch={pattern => {
                //     if (pattern && pattern.length > 0) {
                //         searchMaterial(pattern, page, limit).then(({items, totalCount}) => {
                //             setState({materials: items, page: page, totalCount: totalCount});
                //         });
                //     } else {
                //         fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                //             setState({materials: materials, page: page, totalCount: totalCount});
                //         });
                //     }
                // }}
                onChange={debounceSearch(300)}
            />
            <Table columns={columns} dataSource={state.materials}
                   pagination={{
                       pageSize: limit,
                       current: state.page,
                       total: state.totalCount,
                       onChange: (page) => {
                           fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                               setState({materials: materials, page: page, totalCount: totalCount});
                           })
                       }
                   }}/>
        </>
    )
}

export default MaterialPage;