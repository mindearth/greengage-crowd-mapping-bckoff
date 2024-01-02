import {Button, Radio, Select, Space, Table} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {listCampaign} from "../campaign/CampaignService.js";
import {useAuth} from "react-oidc-context";
import Search from "antd/lib/input/Search.js";
import {listMission} from "./MissionService.js";

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
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.name < b.name,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Status',
            width: '140px',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Kind',
            width: '140px',
            dataIndex: 'kind',
            key: 'kind',
        },
        {
            title: 'Distance mt',
            width: '140px',
            dataIndex: 'distanceMt',
            key: 'distanceMt',
        },
        {
            title: 'Duration min',
            width: '140px',
            dataIndex: 'durationMin',
            key: 'durationMin',
        },
        {
            title: 'Reward',
            width: '140px',
            dataIndex: 'reward',
            key: 'reward',
        }
    ]


    async function getData() {
        setIsLoading(true)
        setData([])

        const response = await listMission(auth.user.access_token);

        setData(response.data)
        setIsLoading(false)
    }

    function onSearch(value) {
        setFilterText(value.toUpperCase())
    }

    function filterData() {
        const result = []

        data.forEach(item => {
            if (item.name.toUpperCase().includes(filterText)) {
                result.push(item)
            }
        });

        return result
    }

    useEffect(() => {
        getData()

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
                        onClick={getData}
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
                        onSearch={onSearch}
                        placeholder="Filter"
                        style={{
                            width: 200,
                        }}
                        enterButton
                    />
                    <Radio.Group options={MissionOptions} optionType="button" buttonStyle="solid"/>
                </Space>

                <div></div>
            </div>

            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={filterText === "" ? data : filterData()}
                loading={isLoading}
            />
        </>
    )
}