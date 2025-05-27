import React from 'react';
import { View, StyleSheet } from 'react-native';
import LogoSVG from '../../assets/images/logo.svg';

const Logo = ({ width = 185.62, height = 40.33 }) => {
  return (
    <View style={styles.container}>
      <LogoSVG width={width} height={height} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 0, 
  },
});

export default Logo;
