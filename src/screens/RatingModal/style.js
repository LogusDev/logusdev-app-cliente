import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F284E',
    marginBottom: 20,
    fontFamily: 'Poppins-SemiBold'
  },
  guincheiroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  guincheiroImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  guincheiroInfo: {
    flex: 1,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  guincheiroName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c2f3f',
    fontFamily: 'Poppins-SemiBold',
    flexShrink: 1,
  },
  ratingBadge: {
    backgroundColor: '#FFF1DE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B76E00',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#1F284E',
  },
  licensePlate: {
    fontSize: 14,
    color: '#666',
  },
  ratingQuestion: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular'
  },
  starStyle: {
    marginVertical: 15,
  },
  commentPrompt: {
    fontSize: 15,
    color: '#000000',
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start',
  },
  textInput: {
    width: '100%',
    height: 100,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 14,
    color:'#000000'
  },
});

export default styles;