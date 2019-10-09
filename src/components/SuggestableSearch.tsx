import React, { useState, useEffect } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export interface SearchResult {
  searchQuery: string;
  place_id: string;
}
export default React.memo<{
  editPlace?: SearchResult;
  onEnter: (searchResult: SearchResult) => void;
}>(
  function Component(props) {
    const [searchData, setSearchData] = useState<SearchResult>({
      searchQuery: '',
      place_id: '',
    });
    useEffect(() => {
      if (props.editPlace && props.editPlace.place_id !== searchData.place_id)
        setSearchData(props.editPlace);
    }, [props.editPlace]);
    const { searchQuery } = searchData;
    return (
      <PlacesAutocomplete
        value={searchQuery}
        onChange={value => {
          console.log(value);
          setSearchData({ searchQuery: value, place_id: '' });
        }}
        onSelect={(value, placeId) => {
          setSearchData({ searchQuery: value, place_id: placeId });
        }}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="search-wrapper">
            <input
              {...getInputProps({
                placeholder: 'Search an address',
                className: 'location-search-input',
              })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  props.onEnter(searchData);
                }
              }}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  // eslint-disable-next-line react/jsx-key
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  },
  // (previous, next) => {
  //   if (previous.editPlace === next.editPlace) {
  //     console.log('true');
  //     return true;
  //   }
  //   return false;
  // },
);
