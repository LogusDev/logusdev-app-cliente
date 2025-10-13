import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddButton({ onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="add" size={40} color="#A0A0A0" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    height: 120,            
    width: '90%',          
    borderWidth: 1,        
    borderColor: '#C4C4C4',  
    borderRadius: 12,       
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F9F9F9', 
  },
});