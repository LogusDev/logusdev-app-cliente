import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";

const aboutImage = require("../../assets/images/logoguinchAqui.png");

export default function About() {
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Sobre nós</Text>
      </View>

      {/* Imagem */}
      <Image source={aboutImage} style={styles.helpImage} resizeMode="contain" />

      {/* Quem somos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👥 Quem somos</Text>

        <View style={styles.itemRow}>
          <Ionicons name="information-circle-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Somos a plataforma Guinchaqui, criada para conectar motoristas a serviços automotivos de forma rápida e segura.
          </Text>
        </View>

        <View style={styles.itemRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Nosso objetivo é garantir que qualquer pessoa consiga ajuda na estrada com apenas alguns toques.
          </Text>
        </View>

        <View style={styles.itemRow}>
          <Ionicons name="car-sport-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Trabalhamos com guincheiros e profissionais avaliados, oferecendo mais transparência e confiança.
          </Text>
        </View>
      </View>

      {/* Nossa missão */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Nossa missão</Text>

        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="target" size={22} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Tornar o processo de solicitar ajuda automotiva mais acessível, moderno e eficiente.
          </Text>
        </View>

        <View style={styles.itemRow}>
          <MaterialCommunityIcons name="map-marker-radius-outline" size={22} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Reduzir o tempo de espera ao máximo, conectando o usuário ao profissional mais próximo.
          </Text>
        </View>
      </View>

      {/* O que oferecemos */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚀 O que oferecemos</Text>

        {[
          "Chamados de guincho em tempo real",
          "Escolha do guincheiro por preço ou avaliação",
          "Pagamento via Pix, dinheiro ou cartão",
          "Cadastro e edição de veículos",
          "Seleção de destinos próximos como postos e oficinas",
          "Histórico completo de chamados realizados",
        ].map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFA500" style={{ marginRight: 10 }} />
            <Text style={styles.cardText}>{item}</Text>
          </View>
        ))}

      </View>

      {/* Nosso compromisso */}
      <View style={[styles.card, { marginBottom: 40 }]}>
        <Text style={styles.cardTitle}>🤝 Nosso compromisso</Text>

        <View style={styles.itemRow}>
          <Ionicons name="heart-outline" size={22} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Estamos comprometidos em oferecer segurança, rapidez e transparência para todos os motoristas.
          </Text>
        </View>

        <View style={styles.itemRow}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#FFA500" style={{ marginRight: 10 }} />
          <Text style={styles.cardText}>
            Melhoramos o aplicativo constantemente ouvindo feedbacks da comunidade.
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}
