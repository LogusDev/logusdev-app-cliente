import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import ActivityCard from "../../components/ActivityCard";
import { getUserCalls, updateExistingAddresses } from "../../services/calls";
import { UserContext } from "../../contexts/UserContext";

export default function ActivityScreen({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useContext(UserContext);

  
  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);

        // await updateExistingAddresses(token);
        // console.log("Atualizou endereços, agora vai buscar os chamados...")
        const data = await getUserCalls(token);
        setActivities(data);
      } catch (error) {
        console.log("Erro ao buscar atividades:", error);
      } finally {
        setLoading(false);
        console.log("Finalizou carregamento");
      }
    }
    
    if (user && token) {
      fetchActivities();
    }
  }, [user, token]);


  const groupedByDate = activities.length
    ? activities.reduce((acc, activity) => {
        const date = activity.requisitado_em?.split("T")[0] || "Sem data";
        if (!acc[date]) acc[date] = [];
        acc[date].push(activity);
        return acc;
      }, {})
    : {};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F284E" />
        <Text>Carregando atividades...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Atividades</Text>

      {Object.keys(groupedByDate).length === 0 ? (
        <Text style={styles.emptyText}>Nenhum chamado encontrado.</Text>
      ) : (
        Object.keys(groupedByDate).map((date) => (
          <View key={date}>
            <Text style={styles.date}>{date}</Text>
            {groupedByDate[date].map((activity) => (
              <ActivityCard
                key={activity.id}
                id={activity.id}
                user={activity.guincheiro?.nome || "Nome não encontrado"}
                avatar={activity.guincheiro?.foto_url || "https://cdn-icons-png.flaticon.com/512/12225/12225881.png"}
                startTime={new Date(activity.requisitado_em).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                endTime={
                  activity.completado_em
                    ? new Date(activity.completado_em).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"
                }
                startAddress={activity.endereco_inicial || activity.latitude_inicial}
                endAddress={activity.endereco_final || activity.latitude_final}
              />
            ))}
          </View>
        ))
      )}

      <Text style={styles.footer}>Você entrou no app em: 03/05/2025</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    color: "#1F284E",
    fontSize: 32,
    fontWeight: "200",
    fontFamily: "Poppins-SemiBold",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
});
