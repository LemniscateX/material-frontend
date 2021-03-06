import React, {useEffect, useState} from 'react';
import {fetchMaterialList, inMaterial, outMaterials, searchMaterial} from '../../api/api';
import {Table, Input, Button, InputNumber, Modal, Form, Select, message} from "antd";

const {Search} = Input;
const {Option} = Select;

const MaterialPage = ({page, limit}) => {
    const [state, setState] = useState({
        materials: [],
        page: page,
        totalCount: 0,
        operating: false,
        adding: false,
        toBeOut: {},
    });

    useEffect(() => {
        fetchMaterialList(page, limit).then(({materials, totalCount}) => {
            setState({
                operating: false,
                adding: false,
                toBeOut: {},
                materials: materials,
                page: page,
                totalCount: totalCount
            });
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
            sortDirections: ['descend', 'ascend'],
            sorter: (a, b) => a.name.localeCompare(b.name),
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
            sorter: (a, b) => a.amount - b.amount,
        },
        {
            title: 'Operator',
            dataIndex: 'operator',
            key: 'operator',
            sorter: (a, b) => a.operator.localeCompare(b.operator),
        },
        {
            title: 'Place',
            dataIndex: 'place',
            key: 'place',
            sorter: (a, b) => a.place.localeCompare(b.place),
        },
        {
            title: 'Create Time',
            dataIndex: 'ctime',
            key: 'ctime',
            sorter: (a, b) => a.ctime.localeCompare(b.ctime),
        },
        {
            title: 'Update Time',
            dataIndex: 'utime',
            key: 'utime',
            sorter: (a, b) => a.utime.localeCompare(b.utime),
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

    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const [form] = Form.useForm();

    return (<>
            <Button onClick={() => {
                setState({...state, adding: !state.adding});
            }}>add</Button>
            <Modal
                visible={state.adding}
                centered
                title="Add Form"
                onCancel={() => {
                    setState({...state, adding: !state.adding});
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    {...layout}
                    name="basic"
                    form={form}
                    onFinish={(data) => {
                        inMaterial(data.name, data.amount, data.place, data.info).then((resp) => {
                            if (resp.ok) {
                                message.success("In successfully");
                                form.resetFields();
                                fetchMaterialList(page, limit).then(({materials, totalCount}) => {
                                    setState({...state, adding: false, materials: materials, page: page, totalCount: totalCount});
                                });
                            } else {
                                message.error(`${resp.err}`);
                            }
                        })
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input stuff name!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Please input stuff amount!',
                            },
                        ]}
                    >
                        <InputNumber min={1}/>
                    </Form.Item>

                    <Form.Item
                        label="Place"
                        name="place"
                        rules={[
                            {
                                required: true,
                                message: 'Please select stuff place!',
                            },
                        ]}
                    >
                        <Select
                            allowClear
                        >
                            <Option value="place1">Place 1</Option>
                            <Option value="place2">Place 2</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Info"
                        name="info"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Button onClick={() => {
                setState({...state, operating: !state.operating});
            }}>select</Button>
            {state.operating && <Button type={"primary"} onClick={() => {
                outMaterials(state.toBeOut).then((resp) => {
                    if (resp.ok) {
                        message.success("Out successfully");
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
                        message.error(`${resp.err}`);
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