import {View} from 'react-native';
import Picker from '@react-native-picker/picker';


export default function PickerComponent({selectedValue, onValueChange, items}) {
    return (
        <View style={{width: '100%', height: 50}}>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={{height: 50, width: '100%'}}
            >
                {items.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.value} />
                ))}
            </Picker>
        </View>
    );
}