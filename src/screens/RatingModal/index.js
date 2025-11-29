import React, { useState, useEffect } from "react";
import { Modal, View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import StarRating from "react-native-star-rating-widget";
import Button from "../../components/Button/index"; 
import styles from './style';
import { ratingCall } from '../../services/calls'; 

export default function RatingModal({ visible, onClose, guincheiro, vehicle, callId, navigation, guincheiroInfo, route }) {
    // Se route.params existir, usa os dados de lá (compatibilidade)
    const params = route?.params || {};
    const finalGuincheiro = guincheiro || params.guincheiro;
    const finalVehicle = vehicle || params.vehicle;
    const finalCallId = callId || params.callId;
    const finalGuincheiroInfo = guincheiroInfo || params.guincheiroInfo;
    
    const [rating, setRating] = useState(0);
    const [comentario, setComentario] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasRated, setHasRated] = useState(false);

    useEffect(() => {
        if (visible) {
            setRating(0);
            setComentario('');
            setHasRated(false);
        }
    }, [visible]);

    const handleRating = async () => {
        if (isLoading || hasRated) return; // Previne múltiplas submissões
        
        if (rating === 0) {
            alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        
        setIsLoading(true);
        try {
            await ratingCall({ nota: rating, comentario, chamado_id: finalCallId });
            setHasRated(true);
            
            // Apenas fecha o modal - a navegação será feita pelo botão Finalizar
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            const errorMessage = error?.response?.data?.error || error?.message || "Não foi possível enviar sua avaliação. Tente novamente.";
            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    console.log('guincheiroInfo', finalGuincheiroInfo?.media_avaliacoes);  

    if (!finalGuincheiro || !finalVehicle) {
        return null;
    }

    const handleClose = () => {
        if (onClose && typeof onClose === 'function') {
            onClose();
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalOverlay}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {!isLoading && <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} />}

                    <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                        <Text style={styles.title}>Avaliação</Text>
                        
                        <View style={styles.guincheiroContainer}>
                            <Image
                                style={styles.guincheiroImage}
                                source={{ uri: finalGuincheiro.photo }}
                            />
                            <View style={styles.guincheiroInfo}>
                                <View style={styles.nameRatingRow}>
                                    <Text style={styles.guincheiroName} numberOfLines={1}>{finalGuincheiro.name}</Text>
                                    <View style={styles.ratingBadge}>   
                                        <Text style={styles.ratingText}>{finalGuincheiroInfo?.media_avaliacoes || 'N/A'} ★</Text>
                                    </View>
                                </View>
                                <Text style={styles.vehicleModel}>{finalVehicle.model} - {finalVehicle.color}</Text>
                                <Text style={styles.licensePlate}>Placa: {finalVehicle.licensePlate}</Text>
                            </View>
                        </View>

                        <Text style={styles.ratingQuestion}>Avalie o serviço prestado por {finalGuincheiro.name.split(' ')[0]}</Text>

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
