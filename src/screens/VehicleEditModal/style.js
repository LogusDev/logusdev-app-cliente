import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 6, 
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F284E",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#BEBEBE",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#1F284E",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  saveButton: {
    backgroundColor: "#EF8108",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  cancelText: {
    textAlign: "center",
    marginTop: 12,
    color: "#1F284E",
    fontWeight: "600",
  },
});

export default styles;
 