import {useState} from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';
import { Text, View } from './Themed';
import FileSystem from "expo-file-system"
import {getDocumentAsync} from "expo-document-picker"
import { Platform } from 'react-native';

interface ISymptomTable {
  Medicine: string
  disease:string
}
export default function EditScreenInfo({ path }: { path: string }) {
  const [fname,setFname ] = useState("")
  const selectFile = ()=>{
    (async () => {
      const res = await getDocumentAsync({
        copyToCacheDirectory:true,
        type:["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel","txt/csv"]
      })
      let filenames = ""
      if (Platform.OS=="web" && res.output!=null) {
        for(const f of res.output){
          filenames += f.name
        }

      }
      else if(res.assets!=null){
        for (const f of res.assets) {
            filenames +=f.name
        }
        setFname(filenames)
      }
    })()
  }
  return (
    <View>
      <Button title="
        Choose the Excel File
" onPress={selectFile}>
      </Button>
      <Text>
      {fname}
      </Text>
      <TextInput>
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
