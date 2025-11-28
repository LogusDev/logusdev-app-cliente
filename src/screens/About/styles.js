import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    left: "4%",
    top: "-35%",
    color: "#1F284E",
    fontSize: 32,
    fontWeight: 200,
    marginTop: 33,
    fontFamily: "Poppins-SemiBold",
  },

  helpImage: {
    top: "-5%",
    width: "70%",
    height: 180,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: "-25%",
  },

  card: {
    backgroundColor: "#1F284E",
    padding: 50,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  cardTitle: {
    color: "#FFA500",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  cardText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  contact: {
    color: "#FFA500",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default styles;
