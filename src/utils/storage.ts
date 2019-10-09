import { getLatLng } from 'react-places-autocomplete';

export interface LocationMarker {
  type: string;
  searchQuery: string;
  position: google.maps.LatLngLiteral;
}
export interface LocationMap {
  [s: string]: LocationMarker;
}
const myStorage = localStorage;

async function saveLocation(
  searchQuery: string,
  type: string,
  geoObject: google.maps.GeocoderResult,
): Promise<boolean> {
  const { place_id } = geoObject;
  try {
    const latLng = await getLatLng(geoObject);
    const location = { searchQuery, type, position: latLng };
    myStorage.setItem(place_id, JSON.stringify(location));
    return true;
  } catch (err) {
    return false;
  }
}

function existCheck(placeId: string): boolean {
  return Boolean(myStorage.getItem(placeId));
}
function getAllLocation(): LocationMap {
  const values: LocationMap = {};
  const keys = Object.keys(localStorage);
  let i = keys.length;

  while (i--) {
    const savedLocation = localStorage.getItem(keys[i]);
    if (savedLocation !== null) values[keys[i]] = JSON.parse(savedLocation);
  }

  return values;
}
function updateLocation(key: string, location: any) {
  myStorage.setItem(key, JSON.stringify(location));
}
export { saveLocation, existCheck, getAllLocation, updateLocation };
