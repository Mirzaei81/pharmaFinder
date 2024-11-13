import { Alert, Button, Platform, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React, {useEffect, useState} from "react"
import { Text, View } from '@/components/Themed';
import {getDocumentAsync}from "expo-document-picker"
import {readAsStringAsync,EncodingType} from "expo-file-system"
import {ActivityIndicator, DataTable, MD2Colors} from "react-native-paper"
import XLS from "xlsx"
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

function _arrayBufferToBase64( buffer:ArrayBuffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}


export default function index() {
  const rowPerPage = 10
  const [SymptomMeds,setSymptomMed] =useState<{[key:string]:string[]}>()
  const [FileName,setFileName]= useState("")
  const [dispData,setDispData] = useState<string[][]>([])
  const [maindata,setMainData]= useState<string[][]>([])
  const [loading,setLoading]=useState(false)
  const [page,setPage] = useState(0)
  const [recent,setRecent] = useState<string|null>("")
  useEffect(()=>{
    (async () => {
      setRecent(await AsyncStorage.getItem("recent"))
    })()
  },[])
  const importFile= async()=>{
      const res = await getDocumentAsync({
        copyToCacheDirectory: true,
        type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      })
      let fileNames = ""
      let xlsString:string|ArrayBuffer = ""
      if (Platform.OS == "web") {
        if (!res.output) {
          Alert.alert("Somthing Wrong happen couldn't find you're file")
          return
        }
        setLoading(true)
        xlsString = _arrayBufferToBase64(await res.output.item(0)?.arrayBuffer()!)
      } else {
        if (res.assets === null) {
          Alert.alert("Somthing Wrong happen couldn't find you're file")
          return
        }
        setLoading(true)
        xlsString =await readAsStringAsync(res.assets[0].uri,{encoding:EncodingType.Base64})
      }
      const wb = XLS.read(xlsString,{raw:true})
      const wsName = wb.SheetNames[0]
      const ws = wb.Sheets[wsName]
      let dt:string[][] =  XLS.utils.sheet_to_json(ws,{header:1,blankrows:false})
      setMainData(dt)
      setDispData(dt.slice(0,rowPerPage))
      setFileName(fileNames)
      setLoading(false)
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ImportBtn}>
        {FileName==="" ? <Button onPress={importFile} title="Import data from a spreadsheet" color="#841584" />:
          <Text>
            {FileName}
          </Text>
        }
      </View>
      <ActivityIndicator animating={loading} color="#841584" size="large" />
      <View style={styles.DataTable}>
        <ScrollView horizontal>
          <DataTable style={styles.table}>
            <DataTable.Header>
              {dispData.length > 0 && dispData[0].map((header: any, idx: number) => (
                <DataTable.Title key={idx}>{header}</DataTable.Title>
              ))}
            </DataTable.Header>

            {dispData.length > 0 && dispData.slice(1).map((item, idx) => (
              <DataTable.Row key={idx}>
                {item.map((cell, idx) => (
                  <DataTable.Cell style={{marginHorizontal:2}} key={idx}>{cell}</DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
            <DataTable.Pagination
              page={page}
              numberOfPages={Math.ceil(dispData.length / rowPerPage)}
              onPageChange={(page) =>{setPage(page),setDispData(maindata.slice(page*rowPerPage,(page+1)*rowPerPage))}}
              label={`${page * 10 + 1}-${page + 1 * 10} of ${dispData.length}`}
              numberOfItemsPerPage={20}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
            />
          </DataTable>
        </ScrollView>
        {/* @ts-ignore */}
        <Button
          color="#841584"
          title='Configure'
          onPress={async() => {
            if (maindata.length!=0) {
              await AsyncStorage.setItem("recent",JSON.stringify(maindata))
              router.push({ pathname: `/Analyze/(tabs)/Configure`, params: { "data": JSON.stringify(maindata[0]) } });
            }else{
              Alert.alert("Error","DataSheet not found")
            }
        }}/>
        {recent &&
          <Button onPress={()=>router.push("/Analyze/(tabs)/")}  color="#9A879D"  title='Analyze Latest Saved' />}
      </View >
    </SafeAreaView>

  );
}
const styles = StyleSheet.create({
  ImportBtn: {
    position: "absolute",
    top: 0,
    marginTop: 10,
    padding:2,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  bolded: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontWeight: "bold"
  },

  thead: {
    height: 40,
    backgroundColor: '#f1f8ff'
  },

  tr: { height: 30 },

  text: {
    marginLeft: 5,
  },

  table: { width: "100%", color: "#FFFFFF", opacity: 1 },

  image: {
    height: 16,
    width: 16
  },
  DataTable:{
    width:Dimensions.get("window").width,
    flex:1,
    height:100,
    bottom:0,
    marginBottom:0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:"100%",
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
