/* eslint-disable react/display-name */
import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import currentIcon from '../assets/images/current.png';
import typeAIcon from '../assets/images/type-a.png';
import typeBIcon from '../assets/images/type-b.png';

const MARKER_TYPE = {
  CURRENT: 'CURRENT',
  A: 'A',
  B: 'B',
};
const currentIconConfig = {
  anchor: { x: 24, y: 48 } as google.maps.Point,
  scaledSize: { height: 48, width: 48 } as google.maps.Size,
};
const typedIconConfig = {
  anchor: { x: 18, y: 36 } as google.maps.Point,
  scaledSize: { height: 36, width: 36 } as google.maps.Size,
};
interface Props {
  name?: string;
  type: string;
  position: google.maps.LatLngLiteral | google.maps.LatLng;
  callback?: (key: string) => void;
}
const TypedMarker = React.memo<Props>(function TypedMarker(props) {
  let imageSource;
  let iconConfig;
  console.log(props);
  switch (props.type) {
    case MARKER_TYPE.CURRENT:
      imageSource = currentIcon;
      iconConfig = currentIconConfig;
      break;
    case MARKER_TYPE.A:
      imageSource = typeAIcon;
      iconConfig = typedIconConfig;
      break;
    case MARKER_TYPE.B:
      imageSource = typeBIcon;
      iconConfig = typedIconConfig;
      break;
    default:
      imageSource = currentIcon;
      iconConfig = currentIconConfig;
      break;
  }
  return (
    // @ts-ignore
    <Marker
      // @ts-ignore
      google={props.google}
      // @ts-ignore
      map={props.map}
      // @ts-ignore
      mapCenter={props.mapCenter}
      position={props.position}
      clickable
      onClick={
        props.callback
          ? () => {
              // @ts-ignore
              props.callback(props.name);
            }
          : undefined
      }
      icon={{
        url: imageSource,
        ...iconConfig,
      }}
    />
  );
});
export { TypedMarker, MARKER_TYPE };
