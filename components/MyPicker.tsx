import React, { useState } from 'react';
import { View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const MyPicker = ({ onValueChange, items, style, disabled }:any) => {
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

    const capitalizeFirstLetter = (str :any) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <View>
            <RNPickerSelect
                value={selectedValue}
                onValueChange={(value) => {
                    setSelectedValue(value);
                    onValueChange(value);
                }}
                items={items.map((item :any) => ({ label: capitalizeFirstLetter(item.name), value: item.id.toString() }))}
                style={style}
                disabled={disabled || false}
            />
        </View>
    );
};

export default MyPicker;