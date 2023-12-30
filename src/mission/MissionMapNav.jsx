import {NavFinishIcon, NavStartIcon, NavStraightIcon, NavTurnLeftIcon, NavTurnRightIcon} from "../core/customIcons.jsx";
import {Divider} from "antd";

export function MissionMapNav({navData}) {
    return (
        <div style={{
            width: '250px',
            maxHeight: '400px',
            position: 'absolute',
            backgroundColor: '#fff',
            bottom: '35px',
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
                        <NavTurnRightIcon
                            style={{width: 15, height: 15, marginRight: 5, fill: '#a1a1a1'}}/>}
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
        </div>
    )
}