import React from 'react';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    height: '50%',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginTop: -30,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F284E',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily:'Poppins-SemiBold'
  },

  // Estilos para o guincheiro
  guincheiroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  guincheiroImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderColor: '#A5A5A5',
    borderWidth: 2,
    top: -20,
  },

  guincheiroInfo: {
    flex: 1,
    bottom: -16,
  },

  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    top: -5,
  },

  guincheiroName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c2f3fff',
    marginBottom: 0,
    fontFamily:'Poppins-SemiBold',
    flex: 1,
   
  },

  guincheiroCalls: {
    fontSize: 12,
    color: '#666',
    marginBottom: 0,
    top: -10,
  },

  // Estilos para as informações do veículo inline
  vehicleInfoInline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },

  vehicleTextContainer: {
    flex: 1,
  },

  ratingContainer: {
    backgroundColor: '#fad7b0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-end',
    borderColor: '#000000',
    borderWidth: 1,
    marginLeft: 12,
  },

  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },

  // Estilos para o status da chamada
  infoItem: {
    marginBottom: 20,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 16,
    color: '#1F284E',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },

  // Estilos para o tempo estimado
  timeContainer: {
    marginBottom: 40,
    marginTop: 10,
  },

  timeText: {
    fontSize: 16,
    color: '#1F284E',
    lineHeight: 22,
  },

  timeHighlight: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#1F284E',
    fontFamily:'Poppins-SemiBold'
  },

  // Estilos para os botões de comunicação
  communicationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },

  communicationButton: {
    flex: 1,
    height: 50,
    borderBottomLeftRadius: 25,
    borderTopLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A5A5A5',
    borderWidth: 1,
  },

  phoneButton: {
    backgroundColor: '#F5F5F5',
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    borderTopRightRadius: 0,
    left: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  chatButton: {
    backgroundColor: '#F5F5F5',
    borderBottomRightRadius: 25,
    borderTopRightRadius: 25,
    right: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  separatorLine: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
});

export default styles;