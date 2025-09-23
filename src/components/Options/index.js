import {StyleSheet,View,Text,TouchableOpacity} from 'react-native';
import { Ionicons } from "@expo/vector-icons";


export default function Options(props){
    return(
        <TouchableOpacity>
          <View style={styles.container}>
              <View style={styles.container2}>
                  <Ionicons name={props.name} size={24} color={props.color || 'black'} />
                  <Text style={styles.text}>{props.text}</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={24}  />
          </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        width: 308.5,
      },
      container2: {
        flexDirection: 'row',
        alignItems: 'center',
        
      },
      text: {
        fontSize: 18,
        color: '#1D275F',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 13,
        marginTop: 2,
      },
})