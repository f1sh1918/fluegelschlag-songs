import React, {ReactElement} from 'react';
import {FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

// @ts-ignore
import CloseIcon from "../assets/icons/close-circle-icon.svg";
// @ts-ignore
import Volume from '../assets/icons/volume-up-circle-icon.svg'
import {RatedBird, Result} from "../App";
import Icon from "./components/Icon";
import {colors} from "./constants/colors";
import getColor from "./utils/getColors";
import {labels} from "./constants/labels";

type ResultScreenProps = { showModal: boolean; onModalClose: () => void; result: Result, onPressVolume: () => void, isPlaying: boolean, ratedBirds: RatedBird[], onPressItem: (name: string) => void }


const ResultScreen: React.FC<ResultScreenProps> = ({
                                                       showModal,
                                                       onModalClose,
                                                       result,
                                                       onPressVolume,
                                                       isPlaying,
                                                       ratedBirds,
                                                       onPressItem
                                                   }: ResultScreenProps): ReactElement => {


    const renderItem = ({item}: { item: RatedBird }) => (
        <TouchableOpacity style={{
            flexDirection: 'row',
            marginTop: 8,
            backgroundColor: 'white',
            paddingVertical: wp('4%'),
            paddingHorizontal: 30,
            borderRadius: 10,
            width: wp('90%'),
            justifyContent: 'space-between'
        }} onPress={() => onPressItem(item.name)} disabled={result.name === item.name}>
            <Text style={{color: colors.black, fontSize: wp('4%'), fontWeight: 'bold'}}>{item.name}</Text>
            <Text style={{
                color: getColor(Math.round(item.rate * 100)),
                marginLeft: 20,
                fontSize: wp('4%')
            }}>{Math.round(item.rate * 100)}%</Text>
        </TouchableOpacity>
    );


    return (
        <Modal visible={showModal}>
            <SafeAreaView
                style={{backgroundColor: colors.gray, flexDirection: 'row'}}>
                <Icon onPress={onModalClose} style={{padding: 15}}>
                    <CloseIcon/>
                </Icon>

            </SafeAreaView>
            <View style={{marginTop: 20}}>
                <View>
                    <Text style={{fontSize: wp('6%'), textAlign: 'center', color: colors.black}}>{result.name} </Text>
                    <Text style={{fontSize: wp('4%'), textAlign: 'center', color: colors.black}}>{result.latin}</Text>
                </View>
                <View style={{alignSelf: 'center', marginVertical: wp('10%')}}><Icon
                    onPress={() => onPressVolume()}><Volume fill={isPlaying ? colors.red : colors.black} width={60}
                                                            height={60}/></Icon>
                </View>

            </View>
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: colors.gray,
                alignSelf: 'stretch',
                alignItems: 'center',
                paddingVertical: 10
            }}>
                <Text style={{
                    color: colors.black,
                    margin: wp('4%'),
                    fontSize: wp('5%'),
                    fontWeight: 'bold'
                }}>{labels.furtherResults}</Text>
                <FlatList
                    data={ratedBirds.filter(bird => bird.rate > 0)}
                    renderItem={renderItem}
                    keyExtractor={item => item.latin}
                />
            </SafeAreaView>
        </Modal>
    );
};

export default ResultScreen;

