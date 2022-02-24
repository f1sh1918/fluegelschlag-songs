import React, {ReactElement} from 'react';
import {Text, View} from 'react-native'
import Icon from "./Icon";
// @ts-ignore
import RetryIcon from "../../assets/icons/repeat-icon.svg";
import {Result} from "../../App";
import {colors} from "../constants/colors";

type ScanInfoProps = { result: Result, retry: () => void, rate: number }

const getColor = (rate:number):string=> {
    if(rate< 50) {
        return 'red'
    }
    if( rate > 50 && rate< 75){
        return 'yellow'
    }
    return 'green'
}

const ScanInfo: React.FC<ScanInfoProps> = ({result, retry,rate}: ScanInfoProps): ReactElement => {
    return (
        <View
            style={{backgroundColor: colors.gray, flexDirection: 'row', paddingVertical:15}}>
            <Icon onPress={retry}><RetryIcon fill={colors.black} width={40} height={40}/></Icon>
            <View style={{flex:1}}><Text style={{fontSize: 24, textAlign: 'center', color:colors.black}}>{result.name} </Text>
                <Text style={{fontSize: 18, textAlign: 'center', color:colors.black}}>{result.latin}</Text>
            </View>
            <Text style={{color:getColor(rate), fontSize:28, paddingRight:15, alignSelf:'center'}}>{rate}%</Text>
        </View>
    );
};

export default ScanInfo;
