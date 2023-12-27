import {Alert, Button, Descriptions, Modal, Select, Typography} from "antd";
import Map, {GeolocateControl, NavigationControl, ScaleControl} from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import {GeocoderControl} from "../core/map/GeocoderControl.jsx";
import {useEffect, useRef, useState} from "react";
import {DrawControl} from "../core/map/DrawControl.jsx";
import {DeleteOutlined} from "@ant-design/icons";
import {updateCampaignBound} from "./CampaignService.js";
import * as turf from "@turf/turf";
import {useAuth} from "react-oidc-context";

const {Text} = Typography;

export function CampaignBoundMap({
                                     campaignId,
                                     campaignName,
                                     campaignGeoJson,
                                     modalAreaIsOpen,
                                     setModalAreaIsOpen
                                 }) {

    const auth = useAuth();
    const [viewState, setViewState] = useState({})
    const [features, setFeatures] = useState(undefined);
    const [hasFeatures, setHasFeatures] = useState(false);
    const [mapStyle, setMapStyle] = useState('light-v9');
    const [areaKm2, setAreaKm2] = useState(0); //
    const mapRef = useRef();
    const refDraw = useRef(null);
    const descriptionItems = [
        {
            key: '1',
            label: 'Longitude',
            contentStyle: {
                width: '180px',
                textAlign: 'right'
            },
            children: parseFloat(viewState.longitude).toFixed(4),
        },
        {
            key: '2',
            label: 'Latitude',
            contentStyle: {
                textAlign: 'right'
            },
            children: parseFloat(viewState.longitude).toFixed(4),
        },
        {
            key: '3',
            contentStyle: {
                textAlign: 'right'
            },
            label: 'Zoom',
            children: parseFloat(viewState.zoom).toFixed(4),
        },
        {
            key: '4',
            label: 'Base map',
            contentStyle: {
                padding: "0 0 0 10px"

            },
            children: <Select
                className="select-map-style"
                defaultValue={mapStyle}
                onChange={onChangeMapStyle}
                bordered={false}
                style={{
                    width: '100%',
                }}
                options={[
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
        },
        {
            key: '5',
            contentStyle: {
                textAlign: 'right'
            },
            label: 'Area',
            children: <>{(areaKm2).toLocaleString()} <Text type="secondary"><small>Km<sup>2</sup></small></Text></>
        },
    ]

    function onChangeMapStyle(value) {
        setMapStyle(value);
    }

    function onUpdateBound(e) {
        setFeatures(currFeatures => {
            const newFeatures = {...currFeatures};
            for (const f of e.features) {
                newFeatures[f.id] = f;
            }
            return newFeatures;
        });
    }

    function onDeleteBound(e) {
        setFeatures(currFeatures => {
            const newFeatures = {...currFeatures};
            for (const f of e.features) {
                delete newFeatures[f.id];
            }
            return newFeatures;
        });
    }

    function onViewStateChange(e) {
        setViewState(e.viewState)
    }

    function addBound() {
        refDraw.current.changeMode('draw_polygon');
    }

    function redrawBound() {
        refDraw && refDraw.current && refDraw.current.deleteAll();

        setFeatures(undefined)
        setAreaKm2(0)
        setHasFeatures(false)
    }

    async function saveBound() {
        const json = JSON.stringify(Object.values(features)[0])

        await updateCampaignBound(
            auth.user.access_token,
            {
                id: campaignId,
                geojson: json,
                areaKm2: areaKm2
            })

        setModalAreaIsOpen(false)
    }

    useEffect(() => {
        setViewState({
            longitude: 0,
            latitude: 0,
            zoom: 0,
            pitch: 0,
            maxPitch: 0
        })

        redrawBound();

        if (campaignGeoJson) {
            const geoJson = JSON.parse(campaignGeoJson)

            setTimeout(() => {
                const polygon = turf.polygon(geoJson.geometry.coordinates)
                const center = turf.centerOfMass(polygon)

                refDraw.current.add(geoJson)
                mapRef.current?.flyTo({center: center.geometry.coordinates, duration: 2000, zoom: 12});
            }, 2);

            const f = {}
            f[geoJson.id] = geoJson

            setFeatures(f)
            setHasFeatures(true)
        }

    }, [campaignGeoJson, campaignId, campaignName]);

    useEffect(() => {
        if (features) {
            const f = Object.values(features)[0]
            const areaMq2 = turf.area(f)
            setAreaKm2(Math.round(areaMq2 / 1000))

            setHasFeatures(true)
        }

    }, [features]);

    return (
        <Modal
            title={"Define the area of interest of the campaign - " + campaignName}
            centered
            keyboard={false}
            maskClosable={false}
            open={modalAreaIsOpen}
            onOk={saveBound}
            okButtonProps={{
                disabled: !hasFeatures,
            }}
            onCancel={() => setModalAreaIsOpen(false)}
            width="90%"
            height="90%"
        >

            <Map
                ref={mapRef}
                initialViewState={viewState}
                mapStyle={"mapbox://styles/mapbox/" + mapStyle}
                onMove={onViewStateChange}
                {...viewState}
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                interactiveLayerIds={['data']}>

                <GeocoderControl mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} position="top-left"/>
                <NavigationControl position="bottom-right"/>
                <GeolocateControl
                    showUserLocation={true}
                    showAccuracyCircle={false}
                    position="bottom-right"/>
                <ScaleControl position="bottom-left"/>

                <DrawControl
                    ref={refDraw}
                    position="top-left"
                    displayControlsDefault={false}
                    controls={{
                        polygon: false,
                        trash: false
                    }}
                    defaultMode="draw_polygon"
                    onCreate={onUpdateBound}
                    onUpdate={onUpdateBound}
                    onDelete={onDeleteBound}
                />
            </Map>

            <div style={{
                width: '250px',
                position: 'absolute',
                backgroundColor: '#fff',
                top: '65px',
                right: '20px',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 2px',
            }}>

                <Descriptions bordered size="small" column={1} items={descriptionItems}/>
            </div>

            {hasFeatures && <div style={{
                position: 'absolute',
                top: '120px',
                left: '10px',

            }}>
                <Button onClick={redrawBound} icon={<DeleteOutlined/>}>
                    Redraw bound
                </Button>
            </div>}

            {!hasFeatures && <div style={{
                position: 'absolute',
                width: '750px',
                bottom: '120px',
                right: 'calc(50% - 375px)',
                borderRadius: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 2px',
            }}>
                <Alert
                    style={{
                        color: 'rgba(0,0,0,0.65)',
                    }}
                    action={
                        <Button size="small" onClick={addBound}>
                            Add bound
                        </Button>
                    }
                    message="Press to add button and star drawing on the map, To confirm press enter or double click."
                    type="warning"

                />
            </div>
            }

        </Modal>
    )
}