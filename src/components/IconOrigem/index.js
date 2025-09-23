import React from 'react';
import { View, StyleSheet } from 'react-native';
import LogoSVG from '../../assets/images/iconOrigem.svg';

const IconOrigem = ({ width = 185.62, height = 40.33 }) => {
  return (
    <View>
      <LogoSVG width={width} height={height} />
    </View>
  );
};

export default IconOrigem;