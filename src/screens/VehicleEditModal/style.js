import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  container: {
    width: width * 0.88,
    minHeight: height * 0.65,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1E1E2F",
    textAlign: "center",
  },

  pickerWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  divInputHalf: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    gap: 6,
    marginTop: 6,
    alignSelf: "center",
    minHeight: 50,
  },

  inputHalf: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#FFF",
    height: 45,
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    position: "relative",
    backgroundColor: "#FFF",
    marginBottom: 6,
  },

  textInputWithIcon: {
    flex: 1,
    height: "100%",
    paddingRight: 40,
    fontSize: 16,
    color: "#333",
  },

  iconStyleRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    marginTop: -12,
  },

  cancelText: {
    marginTop: 12,
    fontSize: 15,
    color: "#EF8108",
    fontWeight: "600",
    textAlign: "center",
  },

  button: {
    width: "95%",
    height: 45,
    backgroundColor: "#EF8108",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#EF8108",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    alignSelf: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default styles;
