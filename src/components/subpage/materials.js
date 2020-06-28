import React, {useEffect, useState} from 'react';
import {fetchMaterialList, outMaterials, searchMaterial} from '../../api/api';
import {Table, Input, Button, InputNumber} from "antd";

const {Search} = Input;

const MaterialPage = ({page, limit}) => {
    const [state, setState] = useState({
        materials: [],
        page: page,
        totalCount: 0,
        operating: false,
        toBeOut: {},
    });

    useEffect(() => {
        fetchMaterialList(page, limit).then(({materials, totalCount}) => {
            setState({operating: false, toBeOut: {}, materials: materials, page: page, totalCount: totalCount});
        })
    }, [setState, page, limit]);

    const search = (text) => {
        if (text.length === 0) {
            fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                setState({...state, materials: materials, page: page, totalCount: totalCount});
            });
        } else {
            searchMaterial(text, page, limit).then(({items, totalCount}) => {
                setState({...state, materials: items, page: page, totalCount: totalCount});
            });
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        state.operating ? {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (_, record) => <InputNumber min={0} max={record.amount} defaultValue={0} onChange={(v) => {
                let toBeOut = state.toBeOut;
                toBeOut[record.name] = v;
                setState({...state, toBeOut: toBeOut});
            }} value={state.toBeOut[record.name] || 0}/>
        } : {
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
            <Button onClick={() => {
                setState({...state, operating: !state.operating});
            }}>select</Button>
            {state.operating && <Button type={"primary"} onClick={() => {
                outMaterials(state.toBeOut).then((resp) => {
                    if (resp.ok) {
                        //    TODO: deal with message alert
                        state.toBeOut = {};
                        fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                            setState({
                                ...state,
                                operating: false,
                                materials: materials,
                                page: page,
                                totalCount: totalCount
                            });
                        });
                    } else {
                        //    TODO: deal with message alert
                    }
                });
            }}>out</Button>}
            <Search
                allowClear
                placeholder="search"
                onChange={debounceSearch(300)}
            />
            <Table rowSelection={state.operating ? {
                selectedRowKeys:
                    state.materials.filter((v) => {
                        if (state.toBeOut[v.name]) {
                            return state.toBeOut[v.name] === v.amount;
                        } else {
                            return false;
                        }
                    }).map((v) => v.name),
                onSelect: (record) => {
                    let toBeOut = state.toBeOut;
                    if (toBeOut[record.name] && toBeOut[record.name] === record.amount) {
                        delete toBeOut[record.name];
                    } else {
                        toBeOut[record.name] = record.amount;
                    }
                    setState({...state, toBeOut: toBeOut});
                },
                onSelectAll: (all) => {
                    let toBeOut = state.toBeOut;
                    if (all) {
                        state.materials.forEach((r) => {
                            toBeOut[r.name] = r.amount;
                        });
                    } else {
                        state.materials.forEach((r) => {
                            toBeOut[r.name] = undefined;
                        });
                    }
                    setState({...state, toBeOut: toBeOut});
                }
            } : null} columns={columns} dataSource={state.materials}
                   pagination={{
                       pageSize: limit,
                       current: state.page,
                       total: state.totalCount,
                       onChange: (page) => {
                           fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                               setState({...state, materials: materials, page: page, totalCount: totalCount});
                           })
                       }
                   }}/>
        </>
    )
}

export default MaterialPage;