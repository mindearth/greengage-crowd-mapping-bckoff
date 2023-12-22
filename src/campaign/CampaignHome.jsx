import {Tabs} from "antd";
import {CampaignList} from "./CampaignList.jsx";

export function CampaignHome() {

    const items = [{
        key: '1', label: 'List of Campaigns', children: <CampaignList/>,
    }]

    return (
        <Tabs defaultActiveKey="1" items={items}/>
    )
}