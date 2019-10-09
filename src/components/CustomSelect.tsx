import React, { CSSProperties, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select, { components } from 'react-select';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { ActionMeta } from 'react-select/src/types';

const DropdownIndicator = (props: any) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon
          size="lg"
          icon={props.selectProps.menuIsOpen ? faCaretUp : faCaretDown}
        />
      </components.DropdownIndicator>
    )
  );
};

export default React.memo<{
  label: string;
  defaultValue?: { label: string; value: string };
  options: { value: string; label: string }[];
  onChange: (value: any, actionMeta: ActionMeta) => void;
}>(function CustomSelect(props) {
  const [value, setValue] = useState<{ label: string; value: string }>({
    label: '',
    value: '',
  });
  useEffect(() => {
    // @ts-ignore
    if (props.defaultValue) setValue(defaultValue);
  }, [props.defaultValue]);
  const { options, onChange, label, defaultValue } = props;

  return (
    <div className="select-wrapper" style={{ display: 'flex' }}>
      <div
        style={{
          width: '30%',
          lineHeight: '38px',
          borderRight: '1px solid black',
        }}>
        <span style={{ padding: '5px' }}>{label}</span>
      </div>
      <Select
        options={options}
        placeholder=""
        value={value}
        styles={{
          control: (base, state) => ({
            ...base,
            border: state.isFocused ? 0 : 0,

            boxShadow: state.isFocused ? '0' : '0',
            '&:hover': {
              border: state.isFocused ? 0 : 0,
            },
          }),
          container: base => ({
            ...base,
            width: '70%',
          }),
          indicatorSeparator: (): CSSProperties => ({}),
        }}
        components={{ DropdownIndicator }}
        onChange={(value, actionMeta) => {
          onChange(value, actionMeta);
          // @ts-ignore
          setValue(value);
        }}
      />
    </div>
  );
});
