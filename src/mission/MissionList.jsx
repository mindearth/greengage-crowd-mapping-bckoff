import {Button, Radio, Result, Select, Space} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {MissionDraw} from "./MissionDraw.jsx";
import {listCampaign} from "../campaign/CampaignService.js";
import {useAuth} from "react-oidc-context";
import Search from "antd/lib/input/Search.js";

export function MissionList() {
    const auth = useAuth();
    const MissionOptions = [
        {value: 0, label: 'All'},
        {value: 1, label: 'Not published'},
        {value: 2, label: 'Free'},
        {value: 3, label: 'Reserved'},
        {value: 4, label: 'Completed'},
        {value: 5, label: 'Uploaded'},
        {value: 6, label: 'Confirmed'},
        {value: 7, label: 'Paid'},
    ]
    const [isLoading, setIsLoading] = useState(true);
    const [campaignIdxSelected, setCampaignIdxSelected] = useState(null);
    const [campaignData, setCampaignData] = useState([]);
    const [modalMissionIsOpen, setModalMissionIsOpen] = useState(false);

    function drawNewMission() {
        if (campaignIdxSelected !== null) {
            setModalMissionIsOpen(true)
        }
    }

    useEffect(() => {

        listCampaign(auth.user.access_token).then(response => {
            setCampaignData(response.data)
            setIsLoading(false)
        })


    }, [])

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <Space>
                    <Button
                        type="primary" icon={<ReloadOutlined/>}></Button>
                    <Select
                        placeholder="Select a campaign"
                        style={{width: 250}}
                        onChange={value => setCampaignIdxSelected(value)}
                        options={campaignData.map((item, idx) => {
                            return {
                                value: idx,
                                label: item.name
                            }
                        })}
                    />
                    <Search
                        placeholder="Filter"
                        style={{
                            width: 200,
                        }}
                        enterButton
                    />
                    <Radio.Group options={MissionOptions} optionType="button" buttonStyle="solid"/>
                </Space>

                <Button
                    onClick={drawNewMission}
                    disabled={campaignIdxSelected === null}
                    type="primary">Draw new mission</Button>
            </div>

            {campaignIdxSelected === null && <Result
                status="warning"
                title="Select a campaign before show data."
            />}

            <MissionDraw
                campaignId={campaignIdxSelected !== null ? campaignData[campaignIdxSelected].id : null}
                campaignName={campaignIdxSelected !== null ? campaignData[campaignIdxSelected].name : null}
                campaignGeoJson={campaignIdxSelected !== null ? campaignData[campaignIdxSelected].geojson : null}
                modalMissionIsOpen={modalMissionIsOpen}
                setModalMissionIsOpen={setModalMissionIsOpen}/>
        </>
    )
}