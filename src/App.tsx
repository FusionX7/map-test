/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import { geocodeByPlaceId } from 'react-places-autocomplete';

import './utils/input.css';
import './App.css';
import {
  getAllLocation,
  updateLocation,
  saveLocation,
  LocationMap,
} from './utils/storage';
import { TypedMarker, MARKER_TYPE } from './components/TypedMarker';
import CustomSelect from './components/CustomSelect';
import CustomRangeInput from './components/CustomInput';
import PositionList from './components/List';
import SuggestableSearch, {
  SearchResult,
} from './components/SuggestableSearch';

const API_KEY = 'AIzaSyDcZKNST8XQsEcqHVJLIkoskfeTp8IFrFM';
let StoredLocations = getAllLocation();
const optionsType = [{ value: 'A', label: 'A' }, { value: 'B', label: 'B' }];
const optionsFilter = [{ value: '0', label: 'No filter' }, ...optionsType];

const App: React.FC<any> = (props: { google: any; loaded: boolean }) => {
  const [place, setPlace] = useState<google.maps.GeocoderResult | null>(null);
  const [editPlace, setEditPlace] = useState<string | null>(null);
  // const bounds = new google.maps.LatLngBounds();
  // if (Object.keys(StoredLocations).length > 1) {
  //   Object.keys(StoredLocations).forEach(element => {
  //     bounds.extend(StoredLocations[element].position);
  //   });
  //   console.log(bounds);
  // }
  const [filter, setFilter] = useState<{
    type: string;
    visibleRange: number;
  }>({ type: '0', visibleRange: 1000 });
  const _type = useRef<string>('');
  const _searchQuery = useRef<string>('');
  const markerCallback = useCallback((key: string) => {
    setPlace(null);
    setEditPlace(key);
  }, []);
  const enterCallback = useCallback((searchResult: SearchResult) => {
    const { place_id, searchQuery } = searchResult;
    if (StoredLocations[place_id]) {
      setEditPlace(place_id);
      return;
    }

    setEditPlace(null);
    geocodeByPlaceId(place_id)
      .then(res => {
        setPlace(res[0]);
      })
      .catch(err => {
        console.log(err);
      });
    _searchQuery.current = searchQuery;
  }, []);

  const Markers = useMemo(() => {
    if (editPlace) {
      const from = new google.maps.LatLng(
        StoredLocations[editPlace].position.lat,
        StoredLocations[editPlace].position.lng,
      );
      return Object.keys(StoredLocations).reduce((result: LocationMap, key) => {
        let item = StoredLocations[key];
        if (key === editPlace) {
          result[key] = { ...item, type: MARKER_TYPE.CURRENT };
          console.log('key=== edit', result[key]);
          return result;
        }
        if (filter.type === '0') {
          const to = new google.maps.LatLng(
            item.position.lat,
            item.position.lng,
          );
          if (
            google.maps.geometry.spherical.computeDistanceBetween(from, to) <
            filter.visibleRange
          )
            result[key] = item;
          return result;
        }
        if (item.type === filter.type) {
          const to = new google.maps.LatLng(
            item.position.lat,
            item.position.lng,
          );
          if (
            google.maps.geometry.spherical.computeDistanceBetween(from, to) <
            filter.visibleRange
          )
            result[key] = item;
        }
        return result;
      }, {});
    }
    return Object.keys(StoredLocations).reduce((result: LocationMap, key) => {
      let item = StoredLocations[key];
      result[key] = item;
      return result;
    }, {});
  }, [StoredLocations, editPlace, filter]);
  console.log(Markers);
  const editMode = () => {
    if (place)
      return (
        <>
          <div className="edit-item">
            <CustomSelect
              label="Type"
              options={optionsType}
              onChange={value => {
                _type.current = value.value;
              }}
            />
          </div>
          <div className="edit-item">
            <button
              style={{ width: '100%', fontSize: 18, fontWeight: 'bold' }}
              onClick={async () => {
                if (place) {
                  if (_type.current === '') {
                    alert('Please select marker type!');
                    return;
                  }
                  await saveLocation(
                    _searchQuery.current,
                    _type.current,
                    place,
                  );
                  StoredLocations = getAllLocation();
                  setPlace(null);
                }
              }}
              type="button">
              Add
            </button>
          </div>
        </>
      );
    if (editPlace) {
      let placeType = optionsType[0];
      if (Markers[editPlace].type === 'B') placeType = optionsType[1];
      console.log(placeType);
      return (
        <>
          <div className="edit-item">
            <CustomSelect
              label="Type"
              options={optionsType}
              onChange={value => {
                _type.current = value.value;
              }}
              defaultValue={placeType}
            />
          </div>
          <div className="edit-item">
            <button
              style={{ width: '100%', fontSize: 18, fontWeight: 'bold' }}
              onClick={() => {
                updateLocation(editPlace, {
                  ...StoredLocations[editPlace],
                  type: _type.current,
                });
                StoredLocations = getAllLocation();
                setEditPlace(null);
              }}
              type="button">
              update
            </button>
          </div>
          <div className="edit-item">
            <CustomSelect
              label="Filter"
              defaultValue={optionsFilter[0]}
              options={optionsFilter}
              onChange={value => {
                setFilter({ ...filter, type: value.value });
              }}
            />
          </div>
          <div className="edit-item" style={{ overflow: 'hidden' }}>
            <CustomRangeInput
              onChangeComplete={value => {
                setFilter({ ...filter, visibleRange: value });
              }}
            />
          </div>
          <div className="edit-item">
            <PositionList selectedPlace={editPlace} items={Markers} />
          </div>
        </>
      );
    }
    return null;
  };
  return (
    <div className="App">
      <div className="map-container">
        <Map
          google={props.google}
          zoom={6}
          center={place ? place.geometry.location : undefined}
          // bounds={
          //   place && place.geometry.viewport
          //     ? place.geometry.viewport
          //     : undefined
          // }
          initialCenter={{ lat: 14.058324, lng: 108.277199 }}>
          {place && (
            <TypedMarker
              position={place.geometry.location}
              type={MARKER_TYPE.CURRENT}
            />
          )}
          {Object.keys(Markers).map(key => {
            const markerData = Markers[key];
            return (
              <TypedMarker
                key={key}
                name={key}
                position={markerData.position}
                type={markerData.type}
                callback={
                  markerData.type === MARKER_TYPE.CURRENT
                    ? undefined
                    : markerCallback
                }
              />
            );
          })}
        </Map>
      </div>
      <div className="editor-container">
        <div className="editor-wrapper">
          <SuggestableSearch
            onEnter={enterCallback}
            editPlace={
              editPlace
                ? {
                    searchQuery: StoredLocations[editPlace].searchQuery,
                    place_id: editPlace,
                  }
                : undefined
            }
          />
          {editMode()}
        </div>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: API_KEY,
  libraries: ['places', 'geometry'],
})(App);
