import {  StyleSheet,Button,View,Text, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import React, { useEffect, useState,useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NodeRowProps, TreeNode, TreeView,TreeViewRef} from "react-native-tree-multi-select"
import {ScrollView} from "react-native-gesture-handler"
import CustomNodeRowView from "@/components/CustomNodeRowView"
import symbolicateStackTrace from 'react-native/Libraries/Core/Devtools/symbolicateStackTrace';

export default function TabOneScreen() {
  const [search,setSearch] = useState<string>()
  const [treeData,setTreeData] = useState<TreeNode[]>()
  const [drugCount,setDrugCount]=useState<{[key:string]:number}>({})
  const [leafDrugs,setleafDrugs]=useState<{[key:string]:Set<string>}>({})
  const [MedCol,setMedCol]=useState(0)
  const treeViewRef = useRef<TreeViewRef | null>(null);
  const screenWidth = Dimensions.get("screen").width
  const handleSelectionChange = (
    _checkedIds: string[],
    _indeterminateIds: string[]
) => {
  //leaf with cords as i,j
  let activeBranch:string[] = []
  //active symptom read those from set Symtom for leaf
  for(const check of _checkedIds){
    if(check.indexOf(",")!==-1){
      //is a leaf node
      activeBranch.push(check)
      console.log(check)
    }
  }
  // setAleaf(activeBranch)
};
  // Debounced Function for Searching
  function triggerSearch(text: string) {
    treeViewRef.current?.setSearchText(text, ["name"]);
    setSearch(text)
  }
  const onUnSelectAllPress = () => treeViewRef.current?.unselectAll?.();
  useEffect(()=>{
    (async () => {
      let LeafValues = await AsyncStorage.getItem("MedColumn")
      let TreeColumns = await AsyncStorage.getItem("SymptomColumn")
      TreeColumns = JSON.parse(TreeColumns!)
      //Making Tree Struct
      let dt:string[][] =  JSON.parse((await AsyncStorage.getItem("recent"))!)
      const LeafValueIndex = dt[0].findIndex((v)=>v==LeafValues)
      setMedCol(LeafValueIndex)
      //Headers 
      const cols:number[]=[]
      for(const col of TreeColumns!){
        cols.push(dt[0].findIndex((v)=>v==col))
      }
      let TreeNodes:TreeNode[] = []
      let j=0;
      for(const row of dt.slice(1)){
        let rootVal =row[cols[0]] 
        j += 1
        if (rootVal != undefined && row[LeafValueIndex] != undefined) {//if the row is empty just pass
            let rootNodeIndex = TreeNodes.findIndex((v) => v.name == rootVal)
            if (rootNodeIndex == -1) {//Found New root Node 
              let rootNode: TreeNode = {
                id: `${(j + 1) / 2}`,
                name: row[cols[0]], children: []
              }
              let lastNode: TreeNode = rootNode
              for (let i = 1; i < cols.length; i++) {
                let name = row[cols[i]]
                if (i != cols.length - 1) {//Intermidiate Notes 
                  let node: TreeNode = { id: `${((i + j) * (i + j + 1) / 2) / j}`, name: name, children: [] }
                  lastNode.children?.push(node)
                  lastNode = node
                } else {//leaf Node only this one are set into active 
                  //every leaf Node associtate with meds in first col
                  const id = `${i},${j}`
                  let node: TreeNode = { id:id , name: name, value: row[LeafValueIndex] }
                  leafDrugs[name] = new Set()
                  for(const lv of row[LeafValueIndex].split(",")){
                    leafDrugs[name].add(lv)
                  }
                  lastNode.children?.push(node)
                }
              }
              TreeNodes.push(rootNode)
            } else {//Duplicated Node 
              let rootNode = TreeNodes[rootNodeIndex]
              console.log(rootNode)
              let lastNode: TreeNode = rootNode
              for (let i = 1; i < cols.length; i++) {
                let name = row[cols[i]]
                let oldIndex =lastNode.children?.findIndex((node)=>node.name==name)
                if (i != cols.length - 1) {//Intermidiate New Notes 
                  if (oldIndex==-1) {
                    let node: TreeNode = { id: `${((i + j) * (i + j + 1) / 2) / j}`, name: name, children: [] }
                    lastNode.children?.push(node)
                    lastNode = node!
                  }
                } else {//LeafNode 
                  let leafValue = row[LeafValueIndex]
                  if(oldIndex==-1){//New LeafNode
                    let node: TreeNode = { id: `${i},${j}`, name: name, value:LeafValues  }
                    lastNode.children?.push(node)
                    leafDrugs[node.name] = new Set()
                    for(const lv of leafValue.split(",")){
                      leafDrugs[node.name].add(lv)
                    }
                  }else{
                    lastNode.value += row[LeafValueIndex]
                    for(const lv of leafValue.split(",")){
                        leafDrugs[lastNode.name].add(lv)
                    }
                  }
                }
              }
            }
          }
      }
      setTreeData(TreeNodes)
    })()
  },[])
  return (
    <View style={styles.container}>
      <TextInput label="Search : " style={styles.search} value={search} onChangeText={(v) => triggerSearch(v)} />
      <ScrollView>
          {treeData?
            <TreeView
              data={treeData}
              ref={treeViewRef}
              treeFlashListProps={{ renderScrollComponent: ScrollView }}
              onCheck={handleSelectionChange}
              CustomNodeRowComponent={(props: NodeRowProps) => {
                return (
                  <CustomNodeRowView
                    {...props}
                    onCheck={()=>{
                      console.log(props.checkedValue)
                      const drugs = leafDrugs[props.node.name]
                      console.log(drugs)
                      for(const drug of drugs){
                        drugCount[drug]+=1
                      }
                      props.checkedValue=!props.checkedValue
                      setDrugCount(drugCount)
                      }}
                  />)
              }
              } />
            : <></>
          }
      </ScrollView>
      <View style={{ width: screenWidth, ...styles.Unselect }}>
        <View style={{ flexGrow: 1 }}>
          <Button title='Unselect All' color="#841584" onPress={onUnSelectAllPress} />
        </View>
        <View style={{ flexGrow: 1 }}>
          <Button title='Analyze' color="#4059AD" onPress={async() => {
           }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
