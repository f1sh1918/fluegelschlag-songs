import React, {ReactElement} from 'react';
import {Text, View} from 'react-native'
import Icon from "./Icon";
// @ts-ignore
import RetryIcon from "../../assets/icons/repeat-icon.svg";
import {Result} from "../../App";
import {colors} from "../constants/colors";
import getColor from '../utils/getColors';

type ScanInfoProps = { result: Result, retry: () => void, rate: number }

const ScanInfo: React.FC<ScanInfoProps> = ({result, retry,rate}: ScanInfoProps): ReactElement => {
    return (
        <View
            style={{backgroundColor: colors.gray, flexDirection: 'row', paddingVertical:15}}>
            <Icon onPress={retry}><RetryIcon fill={colors.black} width={40} height={40}/></Icon>
            <View style={{flex:1}}><Text style={{fontSize: 24, textAlign: 'center', color:colors.black}}>{result.name} </Text>
            </View>
            <Text style={{color:getColor(rate), fontSize:28, paddingRight:15, alignSelf:'center'}}>{rate}%</Text>
        </View>
    );
};

export default ScanInfo;
