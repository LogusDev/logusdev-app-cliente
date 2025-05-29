import React,{useEffect, useState} from "react";
import { StyleSheet,View,Text, StatusBar,Image } from "react-native";
import Button from "../../components/Button";
import styles from "../Register3/styles";
import PickerSelect from "../../components/PickerSelect";
import axios from "axios";
import Logo from "../../components/Logo";

export default function Register2({navigation,route}){
    const [marcas,setMarcas] = useState([]);
    const [modelos,setModelos] = useState([]);
    const [anos,setAnos] = useState([]);

    const [marcaSelecionada,setMarcaSelecionada] = useState(null);
    const [modeloSelecionado,setModeloSelecionado] = useState(null);
    const [anoSelecionado,setAnoSelecionado] = useState(null);

      const { email, password, name, cpf: unmaskedCpf, phone: unmaskedPhone, cnh_num } = route.params;


    useEffect(()=>{
        axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas')
        .then(response=>{
            const lista = response.data.map(item=>({
                label:item.nome,
                value:item.codigo
            }));
            setMarcas(lista);
        })
    },[]);

    console.log(`o carro é de ${anoSelecionado}`);
    console.log(`o modelo é ${modeloSelecionado}`)



    useEffect(()=>{
        if(marcaSelecionada){
            setModelos([]);
            axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos`)
            .then(response=>{
                const lista = response.data.modelos.map(item=>({
                    label:item.nome,
                    value:item.codigo
                }));
                setModelos(lista);
            })
        }
    },[marcaSelecionada]);

    useEffect(()=>{
        if(modeloSelecionado){
            setAnos([]);
            axios.get(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaSelecionada}/modelos/${modeloSelecionado}/anos`)
            .then(response=>{
                const lista = response.data.map(item=>({
                    label:item.nome,
                    value:item.codigo
                }));
                setAnos(lista);
            })
        }
    },[modeloSelecionado]);

    function handleSignIn(){
        if(!marcaSelecionada || !anoSelecionado || !modeloSelecionado){
            alert("Campo inválido")
        }

        navigation.navigate('Register3', {email,password,name,cpf: unmaskedCpf,phone: unmaskedPhone,cnh_num,anoSelecionado,modeloSelecionado,marcaSelecionada})
    }


    return(
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
            <Logo/>
            <Image source={require('../../assets/images/register.png')} />
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
            <Button text={'Proximo'} onPress={handleSignIn}/>
        </View>
    )
}