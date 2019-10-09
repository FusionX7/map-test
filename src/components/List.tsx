import React from 'react';
import { LocationMap } from '../utils/storage';

export default React.memo<{ items: LocationMap; selectedPlace: string }>(
  function PositionList(props) {
    const { items, selectedPlace } = props;
    return (
      <ul className="list-positions">
        {Object.keys(items).map(key => {
          if (selectedPlace === key) return null;
          return (
            <li key={key} className="list-item">
              {items[key].searchQuery.split(',')[0]}
            </li>
          );
        })}
      </ul>
    );
  },
);
