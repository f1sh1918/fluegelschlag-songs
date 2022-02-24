import React, {ReactElement, useEffect} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native'
// @ts-ignore
import CloseIcon from "../assets/icons/close-circle-icon.svg";
// @ts-ignore
import Volume from '../assets/icons/volume-up-circle-icon.svg'
import {Result} from "../App";
import Icon from "./components/Icon";
import SoundPlayer from "react-native-sound-player";
import {colors} from "./constants/colors";

type ResultScreenProps = { showModal: boolean; onModalClose: () => void; result: Result, onPressVolume: ()=>void }




const ResultScreen: React.FC<ResultScreenProps> = ({
                                                       showModal,
                                                       onModalClose,
                                                       result,
    onPressVolume
                                                   }: ResultScreenProps): ReactElement => {

    return (
        <Modal visible={showModal}>
            <View
                style={{backgroundColor: colors.gray, flexDirection: 'row', paddingVertical: 15}}>
                <Icon onPress={onModalClose}>
                    <CloseIcon/>
                </Icon>

            </View>
            <View style={{marginTop: 20}}>
                <View>
                    <Text style={{fontSize: 32, textAlign: 'center', color: colors.black}}>{result.name} </Text>
                    <Text style={{fontSize: 16, textAlign: 'center', color: colors.black}}>{result.latin}</Text>
                </View>
               <View style={{alignSelf:'center', flex:1, marginTop: 80}}><Icon onPress={()=>onPressVolume()}><Volume fill={colors.black} width={60} height={60}/></Icon>
               </View>
            </View>
        </Modal>
    );
};

export default ResultScreen;

