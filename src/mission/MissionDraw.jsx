import {Button, Divider, Modal} from "antd";
import {GeocoderControl} from "../core/map/GeocoderControl.jsx";
import Map, {Layer, NavigationControl, ScaleControl, Source} from "react-map-gl";
import {useEffect, useRef, useState} from "react";
import * as turf from "@turf/turf";
import {DrawControl} from "../core/map/DrawControl.jsx";
import {generateMissionFromPoint} from "./MissionService.js";
import {NavFinishIcon, NavStartIcon, NavTurnLeftIcon, NavTurnRightIcon} from "../core/customIcons.jsx";

export function MissionDraw({
                                campaignId,
                                campaignName,
                                campaignGeoJson,
                                modalMissionIsOpen,
                                setModalMissionIsOpen
                            }) {
    const [viewState, setViewState] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [mapStyle, setMapStyle] = useState('light-v9');
    const [maskedLayer, setMaskedLayer] = useState(undefined);
    const [boundery, setBoundery] = useState(undefined);
    const [navData, setNavData] = useState([]);
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

    function onViewStateChange(e) {
        setViewState(e.viewState)
    }

    function addMission() {
        refDraw && refDraw.current && refDraw.current.deleteAll();
        refDraw && refDraw.current && refDraw.current.changeMode('draw_line_string');

    }

    async function onUpdateBound(e) {
        const data = await generateMissionFromPoint(e.features[0].geometry)
        console.log(data)

        setNavData(data)

        // setFeature(e.features[0])
        // setFeatures(currFeatures => {
        //     const newFeatures = {...currFeatures};
        //     for (const f of e.features) {
        //         newFeatures[f.id] = f;
        //     }
        //     return newFeatures;
        // });
    }

    useEffect(() => {
        if (!modalMissionIsOpen) {
            return
        }

        if (campaignGeoJson) {
            const geoJson = JSON.parse(campaignGeoJson)
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
                mapRef.current.flyTo({center: center.geometry.coordinates, duration: 2000, zoom: 12});


            }, 1000);

        }
    }, [campaignId, modalMissionIsOpen]);

    // useEffect(() => {
    //
    //     console.log(feature)
    //
    //     if (feature) {
    //     //     const json = Object.values(features)[0]
    //     //
    //     //     console.log(json.geometry.coordinates)
    //     //     var line = turf.lineString(json.geometry.coordinates)
    //     // console.log(turf.length(line) * 1000)
    //
    //         console.log(feature.geometry.coordinates)
    //
    //         var point1 = turf.point(feature.geometry.coordinates[1]);
    //         var point2 = turf.point(feature.geometry.coordinates[2]);
    //
    //         var bearing = turf.rhumbBearing(point1, point2);
    //         console.log(bearing)
    //
    //         mapboxGeocodingAddressFirst(feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]).then(response => console.log(response))
    //
    //
    //     }
    //
    //
    // }, [feature]);

    return (
        <Modal
            title={"Insert massive missions for the campaign - " + campaignName}
            centered
            keyboard={false}
            maskClosable={false}
            open={modalMissionIsOpen}
            onCancel={() => setModalMissionIsOpen(false)}
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

                {maskedLayer && <Source id="polygons-source" type="geojson" data={maskedLayer}>
                    <Layer
                        id="boundery"
                        type="fill"
                        source="polygons-source"
                        paint={{'fill-color': 'gray', 'fill-opacity': 0.5}}
                    />
                </Source>}


                <GeocoderControl mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} bbox={boundery}
                                 position="top-left"/>
                <NavigationControl position="bottom-right"/>
                <ScaleControl position="bottom-left"/>

                <DrawControl
                    ref={refDraw}
                    position="top-left"
                    displayControlsDefault={false}
                    controls={{
                        line_string: false,
                        polygon: false,
                        trash: false
                    }}
                    onCreate={onUpdateBound}
                    onUpdate={onUpdateBound}
                />


            </Map>

            <div style={{
                position: 'absolute',
                top: '120px',
                left: '10px',

            }}>
                <Button
                    onClick={addMission}>
                    Add new mission
                </Button>
            </div>


            {(navData.length > 0) && <div style={{
                width: '250px',
                maxHeight: '400px',
                position: 'absolute',
                backgroundColor: '#fff',
                top: '65px',
                right: '20px',
                overflowY: 'auto',
                borderRadius: '10px',
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

        </Modal>
    )
}
