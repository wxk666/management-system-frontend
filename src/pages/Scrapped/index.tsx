import {request} from "@umijs/max";
import {useEffect, useState} from "react";
import {Button, Card, message ,Space, Table} from "antd";
import moment from "moment";

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
const Scrapped = () =>{
    const [dataSource, setDataSource] = useState<any>([])
    const getList = async () =>{
        const res = await list()
        setDataSource(res.list)
    }
    const removeItem = async (_id) =>{
        await remove({_id})
        message.success("删除成功")
        getList()
    }
    const columns = [
        {
            dataIndex:"managementId",
            title:"设备ID"
        },
        {
            dataIndex:"managementName",
            title:"设备名"
        },
        {
            dataIndex:"creator",
            title:"维修人"
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
    return <Card title={"维修管理"}>
        <Table columns={columns} dataSource={dataSource} rowKey={"_id"}/>
    </Card>
}
export default Scrapped
