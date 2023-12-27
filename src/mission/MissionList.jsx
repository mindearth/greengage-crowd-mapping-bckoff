import {Button, Radio, Space} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search.js";

export function MissionList() {
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
                    <Search
                        placeholder="Filter"
                        style={{
                            width: 200,
                        }}
                        enterButton
                    />
                    <Radio.Group options={MissionOptions} optionType="button"   buttonStyle="solid" />
                </Space>

                <Button
                    type="primary">Add new mission</Button>
            </div>
        </>
    )
}