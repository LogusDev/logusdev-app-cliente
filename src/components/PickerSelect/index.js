import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function PickerSelect(props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={props.name}
        size={24}
        style={styles.icon}
        color="#a7a7a7"
      />
      <View style={{ flex: 1 }}>
        <RNPickerSelect
          placeholder={props.placeholder}
          items={props.items}
          onValueChange={props.onValueChange}
          value={props.value}
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles}
          Icon={() => (
            <Ionicons name="chevron-down" size={20} color="#a7a7a7" />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#333',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 8,
    color: '#333',
    paddingRight: 30,
  },
  placeholder: {
    color: '#a7a7a7',
  },
});
