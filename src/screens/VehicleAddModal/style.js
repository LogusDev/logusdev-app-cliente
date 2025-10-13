import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 30,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", 
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: 600,      
    minHeight: height * 0.6, 
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E1E2F",
    textAlign: "center",
  },

  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 14,
    color: "#1E1E2F",
  },

  cancelText: {
    marginTop: 15,
    fontSize: 14,
    color: "#EF8108",
    fontWeight: "600",
    textAlign: "center",
  },

  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#EF8108",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default styles;
