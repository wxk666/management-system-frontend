import {request} from "@umijs/max";
import {useEffect, useState} from "react";
import {Button, Card, Form, message, Modal, Space, Table} from "antd";
import moment from "moment";
import {ProFormDigit, ProFormMoney, ProFormText} from "@ant-design/pro-form";

const buy =  (body: any) =>{
    return request('/api/management/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const remove =  (body: any) =>{
    return request('/api/order', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const list = () =>{
    return request('/api/order/list', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
const Management = () =>{
    const [dataSource, setDataSource] = useState<any>([])
    const [showForm, setShowForm] = useState<any>("")
    const [form] = Form.useForm()
    const getList = async () =>{
        const res = await list()
        setDataSource(res.list)
    }
    const removeItem = async (_id) =>{
        await remove({_id})
        message.success("删除成功")
        getList()
    }
    const buyItem = async (values) =>{
        const res = await buy({...values, creator: localStorage.getItem("name")})
        message.success("购买成功")
        getList()
        setShowForm("")
    }
    const columns = [
        {
            dataIndex:"count",
            title:"购买数量"
        },
        {
            dataIndex:"money",
            title:"购买金额"
        },
        {
            dataIndex:"creator",
            title:"购买人"
        },
        {
            dataIndex:"time",
            title:"购买日期",
            render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            dataIndex:"managementIds",
            title:"设备号",
            render: text => text.join(",")
        },
        {
            dataIndex:"managementNames",
            title:"设备名",
            render: text => text.join(",")
        },
        {
            dataIndex:"option",
            title:"操作",
            render: (text, row) =>{
                return (
                    <Space>
                        <Button type={"link"} size={"small"}>编辑</Button>
                        <Button type={"link"} size={"small"} danger onClick={()=>{
                            removeItem(row._id)
                        }}>删除</Button>
                    </Space>
                )
            }
        },
    ]
    useEffect(() => {
        getList()
    }, []);
    return <Card title={"购买管理"}>
        <Button type={"primary"} style={{marginBottom: 10}} onClick={()=>{
            setShowForm("create")
        }
        }>购买设备</Button>
        <Table columns={columns} dataSource={dataSource} rowKey={"_id"}/>
        <Modal open={!!showForm} onOk={()=>{
            form.submit()
        }} onCancel={()=>{
            setShowForm("")
        }} title={showForm === "create" ? "购买设备" : "编辑购买记录"}>
            <Form form={form} onFinish={(values)=>{
                if(showForm === "create"){
                    buyItem(values)
                }
            }}>
                <ProFormText label={"设备名称"} name={"name"}/>
                <ProFormDigit label={"设备数量"} name={"count"}/>
                <ProFormMoney label={"购买金额"} name={"money"}/>
            </Form>
        </Modal>
    </Card>
}
export default Management
