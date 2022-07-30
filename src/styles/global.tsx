import { StyleSheet } from 'react-native'
const globalStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1d233e',
    minHeight: '100%',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  ButtonStyle: {
    width: '100%',
    height: 49,
    backgroundColor: '#191E34',
    borderRadius: 5,
    elevation: 5,
    padding: 15,
  },
  gap10: {
    marginBottom: 10,
  },
  gap20: {
    marginBottom: 20,
  },
  gap30: {
    marginBottom: 30,
  },
  gap40: {
    marginBottom: 40,
  },
  textColorPrimary: {
    color: '#fff',
    textAlign: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textMedium: {
    fontWeight: '500',
  },
  textLight: {
    fontWeight: '300',
  },
  textSize16: {
    fontSize: 16,
  },
  textSize24: {
    fontSize: 24,
  },
  blockInput: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
  },
  blockInputLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    width: '100%',
    height: 20,
    lineHeight: 21,
  },
  blockInputInput: {
    backgroundColor: '#191E34',
    width: '100%',
    height: 38,
    fontSize: 16,
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  paragraphe: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  btnSmall: {
    width: 85,
    height: 36,
    backgroundColor: '#191E34',
    borderRadius: 5,
    elevation: 5,
    padding: 9,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
})

export default globalStyles
