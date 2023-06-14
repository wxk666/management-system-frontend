import {request} from "@umijs/max";
import {useEffect, useState} from "react";
import {Button, Card, Form, message, Modal, Space, Table} from "antd";
import moment from "moment";
import {ProFormDatePicker, ProFormMoney, ProFormText} from "@ant-design/pro-form";

const remove =  (body: any) =>{
    return request('/api/scrapped', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const list = () =>{
    return request('/api/scrapped/list', {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
const update =  (body: any) =>{
    return request('/api/scrapped', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
    });
}
const Scrapped = () =>{
    const [dataSource, setDataSource] = useState<any>([])
    const [showEdit, setShowEdit] = useState<any>("")
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
    const updateItem = async (data) =>{
        console.log(data)
        await update({_id: showEdit, data})
        message.success("编辑成功")
        getList()
        setShowEdit(false)
    }
    const columns = [
        {
            dataIndex:"managementId",
            title:"设备号"
        },
        {
            dataIndex:"managementName",
            title:"设备名"
        },
        {
            dataIndex:"creator",
            title:"操作人"
        },
        {
            dataIndex:"time",
            title:"报废日期",
            render: text => moment(text).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            dataIndex:"option",
            title:"操作",
            render: (text, row) =>{
                return (
                    <Space>
                        <Button type={"link"} size={"small"} onClick={()=>{
                            setShowEdit(row._id)
                            form.setFieldsValue(row)
                        }}>编辑</Button>
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
    return <Card title={"维修管理"}>
        <Table columns={columns} dataSource={dataSource} rowKey={"_id"}/>
        <Modal title={"编辑"} open={!!showEdit} onOk={() =>{
            form.submit()
        }
        } onCancel={()=>{
            setShowEdit("")
        }}>
            <Form form={form} onFinish={(values)=>{
                updateItem(values)
            }}>
                <ProFormText label={"设备号"} name={"managementId"}/>
                <ProFormText label={"设备名"} name={"managementName"}/>
                <ProFormText label={"操作人"} name={"creator"}/>
                <ProFormDatePicker label={"报废日期"} name={"time"}/>
            </Form>
        </Modal>
    </Card>
}
export default Scrapped
