import React,{useEffect, useState} from "react";
import { StyleSheet,View,Text, StatusBar,Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Button from "../../components/Button";
import styles from "./styles";
import PickerSelect from "../../components/PickerSelect";
import TextInputComponent from "../../components/TextInput";
import axios from "axios";
import Logo from "../../components/Logo";

export default function Register2({navigation,route}){
    const [marcas,setMarcas] = useState([]);
    const [modelos,setModelos] = useState([]);
    const [anos,setAnos] = useState([]);

    const [categoria,setCategoria] = useState(null);
    const [marcaSelecionada,setMarcaSelecionada] = useState(null);
    const [modeloSelecionado,setModeloSelecionado] = useState(null);
    const [anoSelecionado,setAnoSelecionado] = useState(null);
    const [corSelecionada,setCorSelecionada] = useState(null);
    const [placa, setPlaca] = useState('');
    const [cor, setCores] = useState([
        {label:'Branco', value:'Branco'},
        {label:'Preto', value:'Preto'},
        {label:'Prata', value:'Prata'},
        {label:'Cinza', value:'Cinza'},
        {label:'Vermelho', value:'Vermelho'}, 
    ]);


    const { email, password, name, cpf: unmaskedCpf, phone: unmaskedPhone, cnh_num } = route.params;

    useEffect(()=>{
        axios.get('https://fipe.parallelum.com.br/api/v2/cars/brands/')
        .then(response=>{
            console.log(response.data)
            const lista = response.data.map(item=>({
                label:item.name,
                value:item.code
            }));
            setMarcas(lista);
        })
    },[]);

    console.log(`o carro é de ${anoSelecionado}`);
    console.log(`o modelo é ${modeloSelecionado}`)



    useEffect(()=>{
        if(marcaSelecionada){
            setModelos([]);
            axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models`)
            .then(response=>{
                const lista = response.data.map(item=>({
                    label:item.name,
                    value:item.code
                }));
                setModelos(lista);
            })
        }
    },[marcaSelecionada]);

    useEffect(()=>{
        if(modeloSelecionado){
            setAnos([]);
            axios.get(`https://fipe.parallelum.com.br/api/v2/cars/brands/${marcaSelecionada}/models/${modeloSelecionado}/years`)
            .then(response=>{
                const lista = response.data.map(item=>({
                    label:item.name,
                    value:item.code,
                }));
                setAnos(lista);
            })
        }
    },[modeloSelecionado]);

    console.log(categoria);
    console.log(corSelecionada);


    // Função para formatar a placa (ABC-1234)
    const formatarPlaca = (text) => {
        let formatted = text.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        if (formatted.length > 3) {
            formatted = formatted.slice(0, 3) + "-" + formatted.slice(3);
        }
        if (formatted.length > 8) {
            formatted = formatted.slice(0, 8);
        }
        return formatted;
    };

    function handleSignIn(){
        if(!marcaSelecionada || !anoSelecionado || !modeloSelecionado || !placa || placa.trim() === ''){
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Preencha todos os campos obrigatórios',
                position: 'bottom',
                visibilityTime: 2000,
            });
            return;
        }

        // Validação básica da placa (deve ter 8 caracteres com hífen: ABC-1234)
        const placaLimpa = placa.replace(/-/g, '');
        if (placaLimpa.length < 7) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Placa inválida. Digite uma placa válida (ex: ABC-1234)',
                position: 'bottom',
                visibilityTime: 2000,
            });
            return;
        }

        navigation.navigate('Register3', {
            email,
            password,
            name,
            cpf: unmaskedCpf,
            phone: unmaskedPhone,
            cnh_num,
            anoSelecionado,
            modeloSelecionado,
            marcaSelecionada,
            categoria,
            cor: corSelecionada,
            placa: placa.toUpperCase()
        });
    }


    return(
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle={'light-content'} />
            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Logo/>
                <Image style={{height: 270, width: 270}} source={require('../../assets/images/register.png')} />
                <Text style={styles.texto}>Dados do veículo</Text>
                <PickerSelect
                 placeholder={{label:"Selecione a marca...",value:null}}
                 items={marcas}
                 value={marcaSelecionada}
                 name={"car-sport-outline"}
                 onValueChange={setMarcaSelecionada}
                />
                <PickerSelect
                 placeholder={{label:"Selecione o modelo...",value:null}}
                 items={modelos}
                 value={modeloSelecionado}
                 name={"car-outline"}
                 onValueChange={setModeloSelecionado}
                />
                <PickerSelect
                 placeholder={{label:"Selecione o ano...",value:null}}
                 items={anos}
                 value={anoSelecionado}
                 name={"calendar-outline"}
                 onValueChange={setAnoSelecionado}
                />
                <PickerSelect
                placeholder={{label:"Selecione a cor...",value:null}}
                    items={cor}
                    value={corSelecionada}
                    name={"color-palette-outline"}
                    onValueChange={setCorSelecionada}
                />
                <PickerSelect
                 placeholder={{label:"Selecione a categoria...",value:null}}
                 items={[
                    {label:'Sedan', value:1},
                    {label:'Hatch', value:2},
                    {label:'SUV', value:3},
                    {label:'Picape', value:4},
                 ]}
                 value={categoria}
                 name={"filter-outline"}
                 onValueChange={setCategoria}
                />
                <TextInputComponent
                    placeholder="Placa do veículo (ex: ABC-1234)"
                    name="pricetag-outline"
                    value={placa}
                    onChangeText={(text) => setPlaca(formatarPlaca(text))}
                    maxLength={8}
                    keyboardType="default"
                    autoCapitalize="characters"
                />
                <Button style={{marginTop: 12, marginBottom: 30}} text={'Proximo'} onPress={handleSignIn}/>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}