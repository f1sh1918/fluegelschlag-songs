import React, {ReactElement} from 'react';
import {Text, View} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from "./Icon";
import {Result} from "../../App";
import {colors} from "../constants/colors";
import getColor from '../utils/getColors';
// @ts-ignore
import RetryIcon from "../../assets/icons/repeat-icon.svg";

type ScanInfoProps = { result: Result, retry: () => void, rate: number }

const ScanInfo: React.FC<ScanInfoProps> = ({result, retry, rate}: ScanInfoProps): ReactElement => {
    return (
        <View
            style={{backgroundColor: colors.gray, flexDirection: 'row'}}>
            <Icon onPress={retry}><RetryIcon fill={colors.black} width={40} height={40}/></Icon>
            <View style={{flex: 1}}><Text style={{
                fontSize: wp('5%'),
                textAlign: 'center',
                color: colors.black,
                paddingVertical: 20
            }}>{result.name} </Text>
            </View>
            <Text style={{color: getColor(rate), fontSize: 24, paddingRight: 15, alignSelf: 'center'}}>{rate}%</Text>
        </View>
    );
};

export default ScanInfo;
