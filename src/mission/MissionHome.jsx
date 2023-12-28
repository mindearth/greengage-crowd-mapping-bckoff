import {Tabs} from "antd";
import {MissionList} from "./MissionList.jsx";
import {MissionMap} from "./MissionMap.jsx";

export function MissionHome() {
    const items = [{
        key: '1', label: 'List of Missions', children: <MissionList/>,
    } ,{
        key: '2', label: 'View on Map', children: <MissionMap/>,
    }
    ]

    return (
        <Tabs defaultActiveKey="1" items={items}/>
    )
}