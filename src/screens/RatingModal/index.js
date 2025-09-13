import React, { useState, useEffect } from "react";
import { Modal, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating-widget";
import Button from "../../components/Button/index"; // Reutilize seu componente de botão
import styles from './style';
import { ratingCall } from '../../services/calls'; // Verifique o caminho da sua API

// O Modal recebe os dados e as funções de controle como props
export default function RatingModal({ visible, onClose, guincheiro, vehicle, callId, navigation }) {
    const [rating, setRating] = useState(0);
    const [comentario, setComentario] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Reseta o estado do modal sempre que ele for fechado e reaberto
    useEffect(() => {
        if (visible) {
            setRating(0);
            setComentario('');
        }
    }, [visible]);

    const handleRating = async () => {
        if (rating === 0) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        setIsLoading(true);
        try {
            await ratingCall({ nota: rating, comentario, chamado_id: callId });
            // Após enviar, fecha o modal
            onClose(); 
            // Opcional: navegar para a home após fechar
            navigation.navigate('MainHome');
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            alert("Não foi possível enviar sua avaliação. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    // Não renderiza nada se não houver dados
    if (!guincheiro || !vehicle) {
        return null;
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose} // Permite fechar com o botão "voltar" do Android
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* View para capturar o toque fora do modal e fechar */}
                    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />

                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.title}>Avaliação</Text>
                        
                        <View style={styles.guincheiroContainer}>
                            <Image
                                style={styles.guincheiroImage}
                                source={{ uri: guincheiro.photo }}
                            />
                            <View style={styles.guincheiroInfo}>
                                <View style={styles.nameRatingRow}>
                                    <Text style={styles.guincheiroName} numberOfLines={1}>{guincheiro.name}</Text>
                                    <View style={styles.ratingBadge}>
                                        <Text style={styles.ratingText}>{guincheiro.rating?.toFixed(1) || 'N/A'} ★</Text>
                                    </View>
                                </View>
                                <Text style={styles.vehicleModel}>{vehicle.model} - {vehicle.color}</Text>
                                <Text style={styles.licensePlate}>Placa: {vehicle.licensePlate}</Text>
                            </View>
                        </View>

                        <Text style={styles.ratingQuestion}>Avalie o serviço prestado por {guincheiro.name.split(' ')[0]}</Text>

                        <StarRating
                            rating={rating}
                            onChange={setRating}
                            maxStars={5}
                            starSize={45}
                            enableHalfStar={false}
                            style={styles.starStyle}
                        />

                        <Text style={styles.commentPrompt}>Gostaria de deixar um comentário?</Text>
                        <TextInput
                            placeholder="Adicionar comentário... (opcional)"
                            placeholderTextColor={'#999'}
                            style={styles.textInput}
                            multiline={true}
                            onChangeText={setComentario}
                            value={comentario}
                        />

                        <Button 
                            text={isLoading ? "Enviando..." : "Avaliar"} 
                            onPress={handleRating}
                            disabled={isLoading}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
