import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View,StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
interface Meds{
  id:number
  name:string,
  FullName:string,
  ShortDesc:string,
  desc:string
  descDetail:string[]
}
function DelimerExistIndex(delimeter:string,source:string[]){
  let res = []
  for(let i=0;i<source.length;i++){
    const s=source[i]
    if(s.indexOf(delimeter)!=-1){
      res.push(i)
    }
  }
  return res

}
export default function TabOneScreen() {
    const { name } = useLocalSearchParams()
    const db = useSQLiteContext();
    const [detail,setDetail] = useState<Meds>()

    useEffect(() => {
        (async () => {
          const res:Meds|null = await db.getFirstAsync("Select * from MedsTable")
          let items =res?.desc.split("\n")
          const ItemIndecies = DelimerExistIndex("--",items!)
          let j=0
          let descItems = []
          for (let i = 0; i < ItemIndecies.length; i++) {
            let s = ""
            for (j; j < ItemIndecies[i]!; j++) {
              s+=items![j].trim();
            }
            descItems.push(s)
          }
          if (res) {
            res.descDetail = descItems
            setDetail(res)
          }
        })()
    }, [])
    return (
        <View style={styles.container}>
        <Text style={styles.title}>{detail?.FullName}</Text>
        <Text style={styles.title}>{detail?.ShortDesc}</Text>
        <ScrollView contentContainerStyle={styles.desc} style={styles.desc}>{detail?.descDetail.map((d, id) => {
          return(
            <Text key={id}>
              {d}
            </Text>
          )
        }
        )}</ScrollView>
      </View>
    );
}
const styles = StyleSheet.create({
  desc:{
    padding:10,
    flex:1,
    gap:20,

  },
  search:{
    height:20,
    color:"orange"

  },
  Unselect: {
    flexDirection:"row",
  },
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginTop:10,
    fontWeight: 'bold',
    color:"red",
    textAlign:"center"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});