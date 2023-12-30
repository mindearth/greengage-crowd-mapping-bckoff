import {Select, Space} from "antd";

export function MissionMapSettings({
                                       campaignData,
                                       onChangeCampaign,
                                       mapStyle,
                                       onChangeMapStyle
                                   }) {
    return (
        <div style={{
            position: 'absolute',
            top: '55px',
            left: '-15px',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px'
        }}>
            <Space>
                <Select
                    placeholder="Select a campaign"
                    style={{
                        width: 250,
                        boxShadow: '0 0 10px 2px rgba(0,0,0,.1)'
                    }}
                    onChange={onChangeCampaign}
                    options={campaignData.map((item, idx) => {
                        return {
                            value: idx,
                            label: item.name
                        }
                    })}
                />
                <Select
                    defaultValue={mapStyle}
                    onChange={onChangeMapStyle}
                    style={{
                        width: 150,
                        boxShadow: '0 0 10px 2px rgba(0,0,0,.1)'
                    }} options={[
                    {
                        value: 'light-v9',
                        label: 'Light',
                    },
                    {
                        value: 'dark-v9',
                        label: 'Dark',
                    },
                    {
                        value: 'streets-v9',
                        label: 'Streets',
                    },
                    {
                        value: 'outdoors-v9',
                        label: 'Outdoors',
                    },
                    {
                        value: 'satellite-streets-v9',
                        label: 'Satellite',
                    },
                ]}
                />
            </Space>
        </div>
    )
}