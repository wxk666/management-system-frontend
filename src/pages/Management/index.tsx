import {request} from "@umijs/max";
import {useEffect, useState} from "react";
import {Button, Card, Form, message, Modal, Space, Table} from "antd";
import {ProFormMoney, ProFormText,} from "@ant-design/pro-form";
import {
    QueryFilter,
} from '@ant-design/pro-components';
const list = (params ={}) =>{
    return request('/api/management/list', {
        headers: {
            'Content-Type': 'application/json',
        },
        params
    });
}
const remove =  (body: any) =>{
    return request('/api/management', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const fix =  (body: any) =>{
    return request('/api/management/fix', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const scrapped =  (body: any) =>{
    return request('/api/management/scrapped', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const Management = () =>{
    const [dataSource, setDataSource] = useState<any>([])
    const [showFix, setShowFix] = useState<string>("")
    const [form] = Form.useForm()

    const getList = async (values = {}) =>{
        const res = await list(values)
        setDataSource(res.list)
    }
    const removeItem = async (_id) =>{
        await remove({_id})
        message.success("删除成功")
        getList()
    }
    const fixItem = async (values) =>{
        await fix({_id: showFix, money: values.money, creator: localStorage.getItem("name")})
        message.success("维修状态设置成功")
        getList()
        setShowFix("")
    }
    const scrappedItem = async (_id) =>{
        await scrapped({_id, creator: localStorage.getItem("name")})
        message.success("报废状态设置成功")
        getList()
    }
    useEffect(() => {
        getList()
    }, []);
    const columns = [
        {
            dataIndex:"_id",
            title:"设备号"
        },
        {
            dataIndex:"name",
            title:"设备名称"
        },
        {
            dataIndex:"status",
            title:"设备状态"
        },
        {
            dataIndex:"option",
            title:"操作",
            render: (text, row) =>{
                return (
                    <Space>
                        <Button type={"link"} size={"small"} onClick={() =>{
                            setShowFix(row._id)
                        }}>维修</Button>
                        <Button type={"link"} size={"small"} onClick={()=>{
                            scrappedItem(row._id)
                        }}>报废</Button>
                        <Button type={"link"} size={"small"} danger onClick={()=>{
                            removeItem(row._id)
                        }}>删除</Button>
                    </Space>
                )
            }
        },
    ]

    return <Card title={"设备管理"}>
        <QueryFilter onFinish={async (values) =>{
            getList(values)
        }}>
            <ProFormText label={"设备号"} name={"_id"}/>
            <ProFormText label={"设备名"} name={"name"}/>
        </QueryFilter>
        <Table columns={columns} dataSource={dataSource} rowKey={"_id"}/>
        <Modal title={"设备维修"} open={!!showFix} onOk={() =>{
            form.submit()
        }
        } onCancel={()=>{
            setShowFix("")
        }}>
            <Form form={form} onFinish={(values)=>{
                fixItem(values)
            }}>
                <ProFormMoney label={"维修费"} name={"money"}/>
            </Form>
        </Modal>
    </Card>
}
export default Management
