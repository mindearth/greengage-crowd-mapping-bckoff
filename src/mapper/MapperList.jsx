import {useAuth} from "react-oidc-context";
import {useEffect, useState} from "react";
import {Button, Space, Table} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search.js";
import {getMapper, listMapper} from "./MapperService.js";
import {MapperEdit} from "./MapperEdit.jsx";

export function MapperList() {
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const [modalAreaIsOpen, setModalAreaIsOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [data, setData] = useState([]);
    const [filterText, setFilterText] = useState('');
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.name < b.name,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Name',
            render: (record) => {
                return record.name + ' ' + record.surname
            }
        },
        {
            title: 'Action',
            key: 'action',
            width: '200px',
            render: (_, record) => (
                <>
                    <Button onClick={() => editItem(record.id)} type="link">Edit</Button>
                </>
            )
        }
    ]

    async function getData() {
        setIsLoading(true)
        setData([])

        const response = await listMapper(auth.user.access_token);

        setData(response.data)
        setIsLoading(false)
    }

    async function editItem(mapperId) {
        const response = await getMapper(auth.user.access_token, mapperId)

        setEditData(response.data)

        showDrawer();
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

    function showDrawer() {
        setDrawerIsOpen(true);
    }

    function closeDrawer(refresh) {
        refresh && getData()

        setDrawerIsOpen(false);
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
                <div></div>
            </div>

            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={filterText === "" ? data : filterData()}
                loading={isLoading}
            />

            <MapperEdit
                drawerIsOpen={drawerIsOpen}
                closeDrawer={closeDrawer}
                editData={editData}
            />

        </>
    )
}