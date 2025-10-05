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

    const [categoria,setCategoria] = useState(null);
    const [marcaSelecionada,setMarcaSelecionada] = useState(null);
    const [modeloSelecionado,setModeloSelecionado] = useState(null);
    const [anoSelecionado,setAnoSelecionado] = useState(null);

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

    function handleSignIn(){
        if(!marcaSelecionada || !anoSelecionado || !modeloSelecionado){
            alert("Campo inválido")
        }

        navigation.navigate('Register3', {email,password,name,cpf: unmaskedCpf,phone: unmaskedPhone,cnh_num,anoSelecionado,modeloSelecionado,marcaSelecionada,categoria});
    }


    return(
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} />
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
            <Button style={{marginTop: 12}} text={'Proximo'} onPress={handleSignIn}/>
        </View>
    )
}