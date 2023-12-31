import {Tabs} from "antd";
import {MapperList} from "./MapperList.jsx";

export function MapperHome() {
    const items = [{
        key: '1', label: 'List of Mappers', children: <MapperList/>,
    }]

    return (
        <Tabs defaultActiveKey="1" items={items}/>
    )
}