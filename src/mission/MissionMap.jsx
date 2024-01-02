import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Map, {Layer, Marker, NavigationControl, ScaleControl, Source} from "react-map-gl";
import {useAuth} from "react-oidc-context";
import {listCampaign} from "../campaign/CampaignService.js";
import {Button, Space} from "antd";
import * as turf from "@turf/turf";
import {GeocoderControl} from "../core/map/GeocoderControl.jsx";
import {DrawControl} from "../core/map/DrawControl.jsx";
import {generateMissionFromPoint, generateMissionHeaderFromPoint, listMissionMap} from "./MissionService.js";
import {MissionMapEdit} from "./MissionMapEdit.jsx";
import dayjs from "dayjs";
import {EnvironmentOutlined} from "@ant-design/icons";
import {MissionMapNavSum} from "./MissionMapNavSum.jsx";
import {MissionMapNav} from "./MissionMapNav.jsx";
import {MissionMapSettings} from "./MissionMapSettings.jsx";

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
    const [isEditMode, setIsEditMode] = useState(false);
    const [navData, setNavData] = useState([]);
    const [navDataTot, setNavDataTot] = useState(undefined);
    const [navDataTotTimerId, setNavDataTotTimerId] = useState(undefined);
    const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const [layerMap, setLayerMap] = useState(undefined);
    const [layerMapEdit, setLayerMapEdit] = useState(undefined);
    const [layerMapSelectedId, setLayerMapSelectedId] = useState("");

    function onViewStateChange(e) {
        setViewState(e.viewState)
    }

    function onChangeMapStyle(value) {
        setMapStyle(value);
    }

    function onChangeCampaign(value) {
        setCampaignIdxSelected(value)

        listMissionMap(auth.user.access_token, campaignData[value].id).then(response => {

            let data = response.data.map(item => JSON.parse(item.geojsonLinestring))
            data = data.map(item => {
                return {
                    ...item,
                    properties: {
                        id: item.id
                    }
                }
            })
            const result = {
                "type": "FeatureCollection",
                "features": data
            }

            setLayerMap(result)
        })

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

    function setNavDataTimer() {
        setNavDataTotTimerId(setInterval(() => {
            if (refDraw.current.getAll().features[0].geometry.coordinates.length > 1) {
                setNavDataTot(generateMissionHeaderFromPoint(refDraw.current.getAll().features[0].geometry))
            }
        }, 100))
    }

    function addMission() {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.changeMode('draw_line_string');

        setDrawMissionState('draw')
        setIsEditMode(false)

        setNavDataTimer()
    }

    function editMission(data) {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.add(data.geometry);

        const idx = layerMap.features.map(item => item.id).indexOf(data.properties.id)
        setLayerMapEdit(layerMap.features[idx])
        const features = layerMap.features.toSpliced(idx, 1)

        setLayerMap({
            ...layerMap,
            features: features
        })

        refDraw && refDraw.current && refDraw.current.changeMode('direct_select', {
            featureId: refDraw.current.getAll().features[0].id
        });

        setDrawMissionState('draw')
        setIsEditMode(true)

        setNavDataTimer()
    }

    function cancelMission() {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.changeMode('simple_select');

        if (layerMapEdit) {
            setLayerMap({
                ...layerMap,
                features: [...layerMap.features, layerMapEdit]
            })
        }

        clearTimeout(navDataTotTimerId)

        setNavData([])
        setNavDataTot(undefined)
        setDrawMissionState('view')
        setLayerMapEdit(undefined)
    }

    async function endMission() {
        refDraw && refDraw.current && refDraw.current.changeMode('simple_select');

        clearTimeout(navDataTotTimerId)

        setDrawMissionState('draw-end')

        const geometry = refDraw.current.getAll().features[0].geometry
        const data = await generateMissionFromPoint(geometry)
        setNavData(data)
        setNavDataTot(generateMissionHeaderFromPoint(geometry))


        setEditData({
            enabled: true,
            campaignId: campaignData[campaignIdxSelected].id,
            name: '',
            description: '',
            duration: navDataTot.time,
            distance: navDataTot.length,
            reward: 0,
            weekDayConstraint: 'all',
            timeConstraint: [
                dayjs().hour(0).minute(0),
                dayjs().hour(23).minute(59)],
            geojsonLinestring: JSON.stringify(refDraw.current.getAll().features[0]),
            geojsonMission: JSON.stringify({}),
            jsonNavigation: JSON.stringify(navData)
        })

        setIsModalSaveOpen(true)

        // todo check if is edit mode -> get data
    }

    const onMouseMoveMap = useCallback(event => {
        const data = event.features && event.features[0];

        if (data && data.properties) {
            setLayerMapSelectedId(data.properties.id)
        } else {
            setLayerMapSelectedId("")
        }
    }, []);

    const onMouseClickMap = useCallback(event => {
            const data = event.features && event.features[0];

            if (data && data.properties) {
                editMission(data)
            }
        }
        ,
        [layerMap]
    )


    const layerMapFilter = useMemo(() => ['in', 'id', layerMapSelectedId], [layerMapSelectedId]);

    useEffect(() => {

        listCampaign(auth.user.access_token).then(response => {
            setCampaignData(response.data)
            setIsLoading(false)
        })


    }, [])

    useEffect(() => {
        cancelMission()
    }, [isModalSaveOpen])


    return (
        <>

            <div style={{
                width: ' calc(100% + 50px)',
                height: 'calc(100% + 40px)',
                margin: '-15px -25px -25px -25px',
            }}>

                <Map
                    reuseMaps
                    ref={mapRef}
                    initialViewState={viewState}
                    mapStyle={"mapbox://styles/mapbox/" + mapStyle}
                    onMove={onViewStateChange}
                    {...viewState}
                    onMouseMove={onMouseMoveMap}
                    onClick={onMouseClickMap}
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    interactiveLayerIds={['mission-source', 'mission-source-highlighted']}>

                    {maskedLayer && <Source id="polygons-source" type="geojson" data={maskedLayer}>
                        <Layer
                            id="boundery"
                            type="fill"
                            source="polygons-source"
                            paint={{'fill-color': 'gray', 'fill-opacity': 0.5}}
                        />
                    </Source>}

                    {layerMap && <Source type="geojson" data={layerMap}>
                        <Layer
                            id="mission-source"
                            type="line"
                            source="my-data"

                            layout={{
                                "line-join": "round",
                                "line-cap": "round"
                            }}
                            paint={{
                                "line-color": "rgba(3, 170, 238, 0.5)",
                                "line-width": 5
                            }}
                        />
                        <Layer
                            id="mission-source-highlighted"
                            type="line"
                            source="my-data"

                            layout={{
                                "line-join": "round",
                                "line-cap": "round"
                            }}
                            paint={{
                                "line-color": "rgba(252,201,0,0.71)",
                                "line-width": 5
                            }}
                            filter={layerMapFilter}
                        />
                    </Source>}

                    {layerMap && layerMap.features && layerMap.features.map((item, idx) => <Marker
                        key={`marker-${idx}`}
                        longitude={item.geometry.coordinates[0][0]}
                        latitude={item.geometry.coordinates[0][1]}
                    >
                        <EnvironmentOutlined/>
                    </Marker>)}

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
                        onCreate={() => null}
                        onUpdate={() => null}
                    />
                </Map>

                <MissionMapSettings
                    campaignData={campaignData}
                    onChangeCampaign={onChangeCampaign}
                    mapStyle={mapStyle}
                    onChangeMapStyle={onChangeMapStyle}
                />

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
                        {drawMissionState === 'view' && <Button
                            onClick={addMission}
                            disabled={campaignIdxSelected === null}
                            type="primary">Draw new mission</Button>}
                        {drawMissionState === 'draw' && <Button
                            onClick={cancelMission}
                            danger>Cancel</Button>}
                        {drawMissionState === 'draw' && <Button
                            onClick={endMission}
                            type="primary">Save</Button>}
                    </Space.Compact>

                </div>

                {navDataTot !== undefined && <MissionMapNavSum navDataTot={navDataTot}/>}

                {(navData.length > 0) && <MissionMapNav navData={navData}/>}
            </div>

            <MissionMapEdit
                drawerIsOpen={isModalSaveOpen}
                closeDrawer={() => setIsModalSaveOpen(false)}
                editData={editData}
            />
        </>
    )
}