import {useEffect, useRef, useState} from "react";
import Map, {Layer, NavigationControl, ScaleControl, Source} from "react-map-gl";
import {useAuth} from "react-oidc-context";
import {listCampaign} from "../campaign/CampaignService.js";
import {Button, Divider, Select, Space} from "antd";
import * as turf from "@turf/turf";
import {GeocoderControl} from "../core/map/GeocoderControl.jsx";
import {DrawControl} from "../core/map/DrawControl.jsx";
import {generateMissionFromPoint, generateMissionHeaderFromPoint} from "./MissionService.js";
import {NavFinishIcon, NavStartIcon, NavStraightIcon, NavTurnLeftIcon, NavTurnRightIcon} from "../core/customIcons.jsx";

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
    const [drawMissionState, setDrawMissionState] = useState('view');
    const [navData, setNavData] = useState([]);
    const [navDataTot, setNavDataTot] = useState(undefined);
    const [navDataTotTimerId, setNavDataTotTimerId] = useState(undefined);

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
            }, 100);
        }
    }

    async function onUpdateBound(e) {
        debugger
    }

    function addMission() {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.changeMode('draw_line_string');

        setDrawMissionState('draw')

        setNavDataTotTimerId(setInterval(() => {
            if (refDraw.current.getAll().features[0].geometry.coordinates.length > 1) {
                setNavDataTot(generateMissionHeaderFromPoint(refDraw.current.getAll().features[0].geometry))
            }
        }, 100))
    }

    function cancelMission() {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.changeMode('simple_select');

        clearTimeout(navDataTotTimerId)

        setNavData([])
        setNavDataTot(undefined)
        setDrawMissionState('start')
    }

    async function endMission() {
        refDraw && refDraw.current && refDraw.current.changeMode('simple_select');

        clearTimeout(navDataTotTimerId)

        setDrawMissionState('draw-end')

        const geometry = refDraw.current.getAll().features[0].geometry
        console.log(geometry)
        const data = await generateMissionFromPoint(geometry)
        console.log(data)
        setNavData(data)
        setNavDataTot(generateMissionHeaderFromPoint(geometry))
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
                <DrawControl
                    ref={refDraw}
                    position="top-left"
                    displayControlsDefault={false}
                    defaultMode="simple_select"
                    keybindings={false}
                    touchEnabled={false}
                    controls={{
                        line_string: false,
                        polygon: false,
                        trash: false
                    }}
                    onCreate={() => console.log('xx')}
                    onUpdate={() => console.log('xx')}
                />
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

            <div style={{
                position: 'absolute',
                top: '10px',
                right: '-15px',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
            }}>

                <Space.Compact direction="vertical"
                               style={{
                                   boxShadow: '0 0 10px 2px rgba(0,0,0,.1)'

                               }}>
                    <Button
                        onClick={addMission}
                        disabled={campaignIdxSelected === null}
                        type="primary">Draw new mission</Button>
                    {drawMissionState === 'draw' && <Button
                        onClick={cancelMission}
                        danger>Cancel</Button>}
                    {drawMissionState === 'draw' && <Button
                        onClick={endMission}
                        type="primary">Finish</Button>}
                    {drawMissionState === 'draw-end' && <Button
                        type="primary">Save</Button>}
                </Space.Compact>

            </div>

            {navDataTot !== undefined && <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '250px',
                position: 'absolute',
                backgroundColor: '#fff',
                top: '10px',
                left: '620px',
                overflowY: 'auto',
                borderRadius: '4px',
                padding: '5px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 2px',
            }}>
                <div>
                    <span style={{fontFamily: 'monospace'}}>{navDataTot?.length}</span> <span
                    style={{color: '#a1a1a1'}}>mt</span>
                </div>
                <div>
                    <span style={{fontFamily: 'monospace'}}>{navDataTot?.time}</span> <span
                    style={{color: '#a1a1a1'}}>min</span>
                </div>
            </div>}

            {(navData.length > 0) && <div style={{
                width: '250px',
                maxHeight: '400px',
                position: 'absolute',
                backgroundColor: '#fff',
                top: '95px',
                left: '-14px',
                overflowY: 'auto',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 2px',
            }}>
                {navData.map((item, idx) => <div key={idx}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        {item.type === "start" &&
                            <NavStartIcon style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>}
                        {item.type === "right" &&
                            <NavTurnRightIcon style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>}
                        {item.type === "left" &&
                            <NavTurnLeftIcon style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>}
                        {item.type === "straight" &&
                            <NavStraightIcon style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>}
                        {item.description}
                    </div>
                    <Divider style={{
                        fontFamily: 'monospace',
                        fontSize: '0.9em',
                        color: '#a1a1a1',
                        margin: '5px 0'
                    }}> {item.distance}mt</Divider>

                </div>)}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <NavFinishIcon style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>
                    Finish
                </div>
            </div>}


        </div>


    )
}