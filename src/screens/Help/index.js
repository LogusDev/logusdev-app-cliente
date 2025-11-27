import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import styles from "./styles";

const helpImage = require("../../assets/images/logoguinchAqui.png");

export default function Help() {
  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Ajuda</Text>
      </View>

      <Image source={helpImage} style={styles.helpImage} resizeMode="contain" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📱 Como usar o app?</Text>
        <Text style={styles.cardText}>• Crie sua conta ou faça login usando seu e-mail.</Text>
        <Text style={styles.cardText}>• Complete seu perfil com seus dados pessoais.</Text>
        <Text style={styles.cardText}>• Cadastre ou edite os veículos que você possui para agilizar os chamados.</Text>
        <Text style={styles.cardText}>
          • Na tela inicial, permita o acesso à sua localização para que guincheiros próximos possam te encontrar.
        </Text>
        <Text style={styles.cardText}>
          • Você pode escolher destinos próximos, como postos, auto-peças ou mecânicas.
        </Text>
        <Text style={styles.cardText}>• Escolha o serviço desejado: guincho, borracharia, socorro, etc.</Text>
        <Text style={styles.cardText}>
          • Aguarde a confirmação do profissional mais próximo ou escolha o guincheiro que preferir baseado em preço ou avaliação.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💳 Pagamento</Text>
        <Text style={styles.cardText}>• Você pode pagar diretamente ao prestador de serviço.</Text>
        <Text style={styles.cardText}>• Formas de pagamento disponíveis: Pix, dinheiro ou cartão.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Chamados em tempo real</Text>
        <Text style={styles.cardText}>• Acompanhe todas as informações do chamado em tempo real.</Text>
        <Text style={styles.cardText}>• Veja detalhes do guincheiro, veículo e serviço contratado.</Text>
        <Text style={styles.cardText}>
          • Informações sobre horário, valor do serviço e status do chamado são atualizadas automaticamente.
        </Text>
        <Text style={styles.cardText}>
          • Você também pode revisar os chamados já feitos com todos os detalhes: motorista, veículo, guincho, horário e valor.
        </Text>
      </View>

      <View style={[styles.card, {marginBottom: 40}]}>
        <Text style={styles.cardTitle}>🛠 Suporte</Text>
        <Text style={styles.cardText}>• Em caso de problemas com sua conta ou com algum serviço, entre em contato pelo WhatsApp:</Text>
        <Text style={styles.contact}>(11) 97825-7810</Text>
      </View>
    </ScrollView>
  );
}
