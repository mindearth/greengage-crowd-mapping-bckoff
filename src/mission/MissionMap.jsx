import {useEffect, useRef, useState} from "react";
import Map, {GeolocateControl, Layer, NavigationControl, ScaleControl, Source} from "react-map-gl";
import {useAuth} from "react-oidc-context";
import {listCampaign} from "../campaign/CampaignService.js";
import {Button, Radio, Select, Space} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search.js";
import * as turf from "@turf/turf";
import {GeocoderControl} from "../core/map/GeocoderControl.jsx";

export function MissionMap() {
    const auth = useAuth();
    const mapRef = useRef();
    const refDraw = useRef(null);
    const worldMask = turf.polygon([
        [
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90],
            [-180, -90],
        ],
    ]);
    const [isLoading, setIsLoading] = useState(true);
    const [campaignIdxSelected, setCampaignIdxSelected] = useState(null);
    const [campaignData, setCampaignData] = useState([]);
    const [viewState, setViewState] = useState({})
    const [mapStyle, setMapStyle] = useState('streets-v9');
    const [maskedLayer, setMaskedLayer] = useState(undefined);
    const [boundery, setBoundery] = useState(undefined);

    function onViewStateChange(e) {
        setViewState(e.viewState)
    }

    function onChangeMapStyle(value) {
        setMapStyle(value);
    }

    function onChangeCampaign(value) {
        setCampaignIdxSelected(value)

        const campaign = campaignData[value]
        if (campaign.geojson) {
            const geoJson = JSON.parse(campaign.geojson)
            const polygon = turf.polygon(geoJson.geometry.coordinates)
            const bounds = turf.bbox(turf.transformScale(polygon, 1.2))

            setBoundery(turf.bbox(polygon))

            setMaskedLayer(turf.mask(polygon, worldMask))

            setTimeout(() => {
                setViewState({
                    longitude: 0,
                    latitude: 0,
                    zoom: 2,
                    pitch: 0,
                    maxPitch: 0,
                    maxBounds: bounds
                })


                setIsLoading(false)
                const center = turf.centerOfMass(polygon)
                mapRef.current.flyTo({center: center.geometry.coordinates, duration: 20, zoom: 12});


            }, 1000);

        }


    }

    useEffect(() => {

        listCampaign(auth.user.access_token).then(response => {
            setCampaignData(response.data)
            setIsLoading(false)
        })


    }, [])

    return (

        <div style={{
            width: ' calc(100% + 50px)',
            height: 'calc(100% + 40px)',
            margin: '-15px -25px -25px -25px',
        }}>

            <Map
                ref={mapRef}
                initialViewState={viewState}
                mapStyle={"mapbox://styles/mapbox/" + mapStyle}
                onMove={onViewStateChange}
                {...viewState}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                interactiveLayerIds={['data']}>

                {maskedLayer && <Source id="polygons-source" type="geojson" data={maskedLayer}>
                    <Layer
                        id="boundery"
                        type="fill"
                        source="polygons-source"
                        paint={{'fill-color': 'gray', 'fill-opacity': 0.5}}
                    />
                </Source>}

                <GeocoderControl mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} position="top-left"/>
                <NavigationControl position="bottom-right"/>
                <ScaleControl position="bottom-left"/>

            </Map>

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
                        }}                        options={[
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

            <div style={{
                position: 'absolute',
                top: '10px',
                right: '-15px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>
                <Button
                    disabled={campaignIdxSelected === null}
                    style={{
                        boxShadow: '0 0 10px 2px rgba(0,0,0,.1)'
                    }}
                    type="primary">Draw new mission</Button>

            </div>


        </div>


    )
}