import { Text, View } from '@/components/Themed';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet,Button } from 'react-native';
import {  useState } from 'react';
import { MultiSelectDropdown, Dropdown, Option } from 'react-native-paper-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ConfigureScreen() {
    const params:Option[]= JSON.parse(useLocalSearchParams().data as string).map((v:string)=>({"label":v,"value":v}))
    const [medicHeader,setMedic]=useState<string>("")
    const [symsHeader,setSympomts]=useState<string[]>([])
    // const multiSelect = useRef<>(null)
    return (
        <View style={styles.container}>
            <Text style={{textAlign:"center",fontSize:22}}>Select Appropiate columns</Text>
            <View style={styles.Item}>
                <Text>Medicine : </Text>
            {/* @ts-ignore */}
                <Dropdown 
                    label="Medicne"
                    placeholder='Medicene'
                    options={params}
                    value={medicHeader||""}
                    onSelect={(v)=>setMedic(v!)}
                />
            </View>
            <View style={styles.Item}>
                <Text>Symptoms: </Text>
                <MultiSelectDropdown
                          value={symsHeader}
                          label={"Symptoms"}
                          menuContentStyle={{maxWidth:200}}
                          placeholder="Select Symptoms"
                          options={params}
                          onSelect={setSympomts}
                />
            </View>
            <Button onPress={async()=>{
                await AsyncStorage.setItem("MedColumn",medicHeader)
                await AsyncStorage.setItem("SymptomColumn",JSON.stringify(symsHeader))
                router.push("/Analyze/(tabs)/")

            }} color="#841584" title='Analyze' />
        </View>
    );
}
const styles =StyleSheet.create({
    Item:{
        flex:1,
        justifyContent:"center",
        flexDirection:"row",
        alignItems:"center"
    },
    container:{
        flex:1,
        justifyContent:"space-around",
        alignContent:"center",
        height:100,
        paddingTop:10,
    },
    InputTxt:{
        textAlign:"center"
    },
    dropdownButtonStyle: {
      width: 200,
      height: 50,
      backgroundColor: '#E9ECEF',
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: '#E9ECEF',
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '500',
      color: '#151E26',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });