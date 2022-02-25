import React, {ReactElement, useEffect} from 'react';
import {FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
// @ts-ignore
import CloseIcon from "../assets/icons/close-circle-icon.svg";
// @ts-ignore
import Volume from '../assets/icons/volume-up-circle-icon.svg'
import {RatedBird, Result} from "../App";
import Icon from "./components/Icon";
import {colors} from "./constants/colors";
import getColor from "./utils/getColors";

type ResultScreenProps = { showModal: boolean; onModalClose: () => void; result: Result, onPressVolume: () => void, isPlaying: boolean, ratedBirds: RatedBird[] }


const ResultScreen: React.FC<ResultScreenProps> = ({
                                                       showModal,
                                                       onModalClose,
                                                       result,
                                                       onPressVolume,
                                                       isPlaying,
                                                       ratedBirds
                                                   }: ResultScreenProps): ReactElement => {

    const renderItem = ({item}: { item: RatedBird }) =>  (
            <View style={{flexDirection: 'row', marginTop:10, backgroundColor: 'white', paddingVertical: 20, paddingHorizontal:50, borderRadius:10, justifyContent:'space-between'}}>
                <Text style={{color: colors.black, fontSize: 20, fontWeight:'bold'}}>{item.name}:</Text>
                <Text style={{color: getColor(Math.round(item.rate * 100)), marginLeft: 20, fontSize: 20}}>{Math.round(item.rate * 100)}%</Text>
            </View>
        );


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
                <View style={{alignSelf: 'center',  marginVertical: 50}}><Icon
                    onPress={() => onPressVolume()}><Volume fill={isPlaying ? colors.red : colors.black} width={60}
                                                            height={60}/></Icon>
                </View>

            </View>
            <SafeAreaView style={{flex: 1, backgroundColor:colors.gray, alignSelf:'stretch', alignItems:'center', paddingVertical: 30}}>
                <FlatList
                    data={ratedBirds}
                    renderItem={renderItem}
                    keyExtractor={item => item.latin}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default ResultScreen;

