import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {forwardRef, useImperativeHandle} from "react";
import {useControl} from "react-map-gl";

export const DrawControl = forwardRef((props, ref) => {
    const drawRef = useControl(
        () => new MapboxDraw(props),
        ({map}) => {
            map.on("draw.create", props.onCreate);
            map.on("draw.update", props.onUpdate);
            map.on("draw.delete", props.onDelete);
        },
        ({map}) => {
            map.off("draw.create", props.onCreate);
            map.off("draw.update", props.onUpdate);
            map.off("draw.delete", props.onDelete);
        },
        {
            position: props.position,
        }
    );

    useImperativeHandle(ref, () => drawRef, [drawRef]); // This way I exposed drawRef outside the component

    return null;
});