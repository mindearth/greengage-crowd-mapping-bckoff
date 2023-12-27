import {Tabs} from "antd";
import {MissionList} from "./MissionList.jsx";

export function MissionHome() {
    const items = [{
        key: '1', label: 'List of Missions', children: <MissionList/>,
    }
    ]

    return (
        <Tabs defaultActiveKey="1" items={items}/>
    )
}