import {deleteCampaign, getCampaign, listCampaign} from "./CampaignService.js";
import {useAuth} from "react-oidc-context";
import {useEffect, useState} from "react";
import {Button, Divider, Popconfirm, Progress, Space, Table, Tag} from "antd";
import {getIntervalTimeFromNow} from "../core/utils.js";
import {ReloadOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search.js";
import {CampaignEdit} from "./CampaignEdit.jsx";
import {CampaignBoundMap} from "./CampaignBoundMap.jsx";

export function CampaignList() {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [modalAreaIsOpen, setModalAreaIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
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
            title: 'Completed',
            width: '160px',
            render: (_, record) => (
                <Progress steps={4} percent={30}/>
            )
        },
        {
            title: 'Remaining time',
            width: '190px',
            render: (_, record) => {
                const result = getIntervalTimeFromNow(record.dateEnd)

                if (result.day < 0) {
                    return (
                        <>
                            <Tag color="warning">expired</Tag>
                            <span>{result.label}</span>
                        </>
                    )
                }

                return result.label
            }
        },
        {
            title: 'Area',
            width: '150px',
            dataIndex: 'area',
            key: 'areaKm2',
            render: (_, record) => record.areaKm2
                ? <Button
                    onClick={() => editCampaignBoundMap(record)}
                    type="link">{(record.areaKm2).toLocaleString()} km<sup>2</sup></Button>
                : <Button
                    onClick={() => editCampaignBoundMap(record)}
                    type="link">not defined</Button>
        },
        {
            title: 'Action',
            key: 'action',
            width: '200px',
            render: (_, record) => (
                <>
                    <Button onClick={() => editItem(record.id)} type="link">Edit</Button>
                    <Divider
                        style={{padding: 0, margin: 0}}
                        type="vertical"/>
                    <Popconfirm
                        title="Delete"
                        description="Are you sure to delete this campaign?"
                        onConfirm={() => deleteTask(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link">Delete</Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    async function editItem(campaignId) {
        const response = await getCampaign(auth.user.access_token, campaignId)

        setEditData(response.data)

        showDrawer();
    }

    async function deleteTask(campaignId) {
        await deleteCampaign(auth.user.access_token, campaignId)

        getData()
    }

    function editCampaignBoundMap(data) {
        setEditData(data)

        setModalAreaIsOpen(true)
    }

    function newItem() {
        setEditData(null)

        showDrawer();
    }

    function showDrawer() {
        setDrawerIsOpen(true);
    }

    function closeDrawer(refresh) {
        refresh && getData()

        setDrawerIsOpen(false);
    }

    async function getData() {
        setIsLoading(true)
        setData([])

        const response = await listCampaign(auth.user.access_token);

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
    }, []);


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
                    <Search
                        onSearch={onSearch}
                        placeholder="Filter"
                        style={{
                            width: 200,
                        }}
                        enterButton
                    />
                </Space>
                <Button
                    onClick={newItem}
                    type="primary">Add new campaign</Button>
            </div>

            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={filterText === "" ? data : filterData()}
                loading={isLoading}
            />

            <CampaignBoundMap
                campaignId={editData ? editData.id : null}
                campaignName={editData ? editData.name : null}
                campaignGeoJson={editData ? editData.geojson : null}
                modalAreaIsOpen={modalAreaIsOpen}
                setModalAreaIsOpen={setModalAreaIsOpen}/>

            <CampaignEdit
                drawerIsOpen={drawerIsOpen}
                closeDrawer={closeDrawer}
                editData={editData}
            />

        </>
    )
}