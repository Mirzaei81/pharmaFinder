import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { CheckboxValueType, NodeRowProps } from "react-native-tree-multi-select";
import {FontAwesome} from '@expo/vector-icons';
import { Button, Checkbox } from "react-native-paper";
import { Dimensions } from "react-native";

const CustomNodeRowViewDisplay = React.memo(_CustomNodeRowView);
export default CustomNodeRowViewDisplay;

const VerticalLine = () => (
    <View style={styles.verticalLineStyle} />
);

const Levels = ({
    levels
}: {
    levels: number;
}) => {
    return (
        <View style={styles.levelsStyle}>
            {
                Array(levels).fill(null).map((_, i) => <VerticalLine key={i} />)
            }
        </View>
    );
};

function _CustomNodeRowView(props:NodeRowProps) {
    const { 
      node,
      level, 
      checkedValue, 
      isExpanded, 
      onCheck, 
      onExpand, 
    } = props;
                
    const iconColor = isExpanded ? "black" : "#a1a1a1";
    const screenWidth = Dimensions.get('window').width
    function customCheckboxValueTypeToRNPaperType(
        customCheckboxValueType: CheckboxValueType
    ) {
        return customCheckboxValueType === 'indeterminate'
            ? 'indeterminate'
            : customCheckboxValueType
                ? 'checked'
                : 'unchecked';
    }
    return (
        <View  style={styles.rowView}>
            <View style={styles.innerRowView}>
                <Levels levels={level} />
                <TouchableOpacity style={styles.touchableOpacity} onPress={onExpand}>
                    <View style={
                        level === 0
                            ? styles.textViewMarginNegative
                            : styles.textView
                    }>
                        <Text style={{maxWidth:screenWidth*.8}}
                            >{node&&node.name}</Text>
                    </View>
                </TouchableOpacity>

                {
                    (node&&
                    node.children?.length)? (
                        <TouchableOpacity
                            style={styles.iconTouchableView}
                            onPress={onExpand}>
                            <FontAwesome
                                name={
                                    isExpanded
                                        ? 'angle-double-up'
                                        : 'angle-double-down'
                                }
                                size={25}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                    ) :<Text>Hello World</Text>
                }

            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    verticalLineStyle: {
        borderLeftWidth: 1,
        height: '110%',
        marginStart: 25,
        borderColor: "grey",
    },
    levelsStyle: {
        flexDirection: 'row',
        marginEnd: 10
    },
    rowView: {
        direction:"rtl",
        marginHorizontal: 10,
        paddingEnd: 10,
        marginVertical: 0.5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        borderColor: "lightgrey",
        borderTopWidth: 1,
        borderTopColor: "#dedede"
    },
    innerRowView: {
        flexDirection: "row",
        flex:1
    },
    touchableOpacity: {
        padding: 4,
        paddingVertical: 8,
    },
    textView: {
        flexDirection: "row"
    },
    textViewMarginNegative: {
        flexDirection: "row",
        marginStart: -5
    },
    iconTouchableView: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
    }
});
