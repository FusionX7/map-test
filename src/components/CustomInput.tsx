import React, { useState } from 'react';
import InputRange from 'react-input-range';

export default React.memo<{ onChangeComplete: (value: any) => void }>(
  function CustomRangeSlider(props) {
    const [inputValue, setValue] = useState(1000);
    return (
      <div
        style={{
          height: '40px',
          marginTop: '20px',
          position: 'relative',
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
        <InputRange
          maxValue={5000}
          minValue={500}
          step={500}
          onChangeComplete={props.onChangeComplete}
          value={inputValue}
          formatLabel={value => {
            const formatted = value > 999 ? `${value / 1000}km` : `${value}m`;
            return formatted;
          }}
          onChange={(value: any) => {
            setValue(value);
          }}
        />
        <span className="start-node" />
        <span className="end-node" />
      </div>
    );
  },
);
