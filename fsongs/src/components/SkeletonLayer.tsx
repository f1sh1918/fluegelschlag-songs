import React, {ReactElement} from 'react';
import {Image, Text, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {colors} from "../constants/colors";
import {labels} from "../constants/labels";
import {SkeletonBird} from "../constants/skeleton";


type SkeletonLayerProps = { additionalStyles: any, maskRowHeight: number, bird: SkeletonBird }

const SkeletonLayer: React.FC<SkeletonLayerProps> = ({
                                                         additionalStyles,
                                                         maskRowHeight, bird
                                                     }: SkeletonLayerProps): ReactElement => {

    return (
        <View style={[{flex: maskRowHeight, opacity: 0.9}, additionalStyles.maskRow, additionalStyles.maskFrame]}>
            <Text style={{
                fontSize: wp('6%'),
                textAlign: 'center',
                color: colors.darkgray,
                padding: 20,
                fontWeight: 'bold'
            }}>{labels.example}{bird.name}</Text>
            <View style={{
                height: '60%',
                justifyContent: 'center',
                flexDirection: 'row',
                flex: 1
            }}>

                <Image source={bird.image}
                       style={{alignSelf: 'center', width: '70%', height: '90%'}}
                       resizeMode={"contain"}/>
            </View>
            <View style={{backgroundColor: bird.color, height: '25%', justifyContent: 'center', opacity: 0.7}}>
                <Text style={{
                    fontSize: wp('6%'),
                    textAlign: 'center',
                    color: colors.black,
                    paddingHorizontal: 30
                }}>{bird.capability}</Text>
            </View>
            <View style={{justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 30}}>
                <Image source={require('../../assets/icons/map.png')}
                       style={{
                           alignSelf: 'center',
                           justifyContent: 'center',
                           width: 50,
                           height: 50,
                           marginLeft: 20
                       }} resizeMode={"contain"}/>
                <Text style={{
                    fontSize: wp('4%'),
                    textAlign: 'center',
                    color: colors.darkgray,
                    padding: 20,
                    fontStyle: 'italic'
                }}>{bird.description}</Text>
            </View>
        </View>
    );
};

export default SkeletonLayer;
