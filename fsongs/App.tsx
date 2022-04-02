import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, Text, useWindowDimensions, View, Image} from 'react-native';
import {RNCamera, TrackedTextFeature} from "react-native-camera";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import axios from "axios";
import {stringSimilarity} from "string-similarity-js";
import Sound from 'react-native-sound';
import ResultScreen from "./src/ResultScreen";
import ScanInfo from "./src/components/ScanInfo";
import {colors} from "./src/constants/colors";
import {labels} from "./src/constants/labels";

// @ts-ignore
import CloseIcon from "./assets/icons/close-circle-icon.svg";
import SkeletonLayer from "./src/components/SkeletonLayer";
import {skeletons} from "./src/constants/skeleton";

export type Result = {
    name: string;
    latin: string;
}

type Song = {
    fileName: string;
    sono: string;
}
type Bird = {
    name: string;
    latin: string;
    song?: Song;
}

export type RatedBird = Bird & {
    rate: number;
}

const getSoundFile = (song: Song): string => {
    const baseUrl = song.sono.split("ffts");
    return `https:${baseUrl[0]}${song.fileName}`
}

const App = () => {

    const [scanned, setScanned] = useState<boolean>(false);
    const [scanResult, setScanResult] = useState<Result | null>(null);
    const [bird, setBird] = useState<Bird | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [rate, setRate] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const [ratedBirds, setRatedBirds] = useState<RatedBird[]>([]);
    const [birdData, setBirdData] = useState<any>(null);
    const [sound, setSound] = useState<Sound | null>(null);
    const [skeletonIndex, setSkeletonIndex] = useState<number>(Math.floor(Math.random() * (skeletons.length)));
    const {width} = useWindowDimensions();
    // Calc the camera view
    const maskRowHeight = hp('10%');
    const maskColWidth = (width - 300) / 2;

    useEffect(() => {
        const url = 'https://ballonfabrik.org/wp-content/uploads/birds.json'
        axios.get(url)
            .then(function (response) {
                setBirdData(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    useEffect(() => {
            if (!bird && scanResult?.name && birdData) {
                const bird = checkBirdList(scanResult.name)
                if (bird) {
                    const query = `https://xeno-canto.org/api/2/recordings?query=${bird.latin}+q:A`;
                    axios.get(query)
                        .then(function (response) {
                            if (response.data.numRecordings > 0) {
                                const song = {
                                    fileName: response?.data.recordings[0]["file-name"],
                                    sono: response?.data.recordings[0].sono.small
                                }
                                setBird({
                                    name: bird.name, latin: bird.latin, song
                                })
                                loadSong(song)
                            } else {
                                setBird(null)
                                setScanResult({name: `No songs found for: ${bird.name}`, latin: ''})
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        }
        ,
        [scanResult?.name]
    );

    const onPressItem = (name: string) => {
        stopSound()
        setScanResult({name, latin: ''})
        setBird(null)
    }


    const loadSong = (song: Song) => {
        const soundFile = getSoundFile(song)
        Sound.setCategory('Playback');
        const whoosh = new Sound(soundFile, '', (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            whoosh.play();

        });
        setSound(whoosh)
        setIsPlaying(true)
    }

    const playSong = () => {
        sound?.play()
        setIsPlaying(true)
    }

    const recognizeText = ({textBlocks}: {
        textBlocks:
            TrackedTextFeature[]
    }) => {
        const ocrElements: Array<any> = [];
        textBlocks.forEach(textBlock => {
            textBlock.components.forEach((textLine, index) => {
                if (index < 2 && textLine.value.length > 5) {
                    ocrElements.push({
                        bounds: textLine.bounds, text: textLine.value
                    });

                }
            });
        });
        if (ocrElements.length > 2 && !scanned) {
            setScanned(true)
            setShowModal(true)
            setTimeout(() => setScanResult({name: ocrElements[0]?.text, latin: ocrElements[1]?.text}), 2000)
        }
    }

    const checkBirdList = (name: string): Bird | null => {
        const matchingRate = 0.7
        let matchingBird = null;
        let matching = 0;
        const birdsArray: RatedBird[] = []
        birdData.birds.map((bird: any) => {
            const ratedBird = {...bird, rate: stringSimilarity(bird?.name?.trim(), name)}
            birdsArray.push(ratedBird)

            if (matching < stringSimilarity(bird?.name?.trim(), name)) {
                matching = stringSimilarity(bird?.name?.trim(), name)

                if (matching > matchingRate) {
                    matchingBird = bird
                }
            }

        })
        if (matching < matchingRate) {
            setTimeout(() => clearScan(), 1800)
        }

        setRate(Math.round(matching * 100))
        setRatedBirds(birdsArray)
        return matchingBird
    }

    const clearScan = () => {
        setScanResult(null)
        setScanned(false)
    }

    const onModalClose = () => {
        setShowModal(false)
        setBird(null)
        clearScan()
        stopSound()
        setSkeletonIndex(Math.floor(Math.random() * (skeletons.length)))
    }


    const onPressVolume = () => {
        isPlaying && stopSound()
        !isPlaying && bird?.song && playSong()
    }

    const stopSound = () => {
        sound?.stop()
        setIsPlaying(false)
    }

    const styles = StyleSheet.create({
        maskOutter: {
            flex: 1,
            alignItems: 'center',
            opacity: 0.95
        },
        maskInner: {
            width: width - 40,
            backgroundColor: 'transparent',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 10
        },
        maskFrame: {
            backgroundColor: 'white',
            opacity: 0.9
        },
        maskRow: {
            width: '100%',
        },
        maskCenter: {flexDirection: 'row'},
    });


    return (
        <SafeAreaView style={{flex: 1}}>
            {bird ?
                <ResultScreen ratedBirds={ratedBirds.sort((a, b) => b.rate - a.rate)} isPlaying={isPlaying}
                              onPressVolume={onPressVolume} result={bird} showModal={showModal}
                              onPressItem={onPressItem}
                              onModalClose={onModalClose}/> :
                <RNCamera
                    onTextRecognized={recognizeText}
                    style={{flex: 1}}
                    captureAudio={false}>

                    < View style={styles.maskOutter}>
                        <View style={[{flex: 10}, styles.maskRow, styles.maskFrame]}>
                            {scanResult && !bird && <ScanInfo rate={rate} result={scanResult} retry={clearScan}/>}
                            {!scanResult && !bird &&
                            <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                                <ActivityIndicator size="large" color={colors.brown}/>
                                <Text style={{
                                    color: colors.brown,
                                    alignSelf: 'center',
                                    fontSize: wp('5%'),
                                    marginLeft: 20
                                }}>{labels.scan}</Text>
                            </View>}
                        </View>
                        <View style={[{flex: 20}, styles.maskCenter]}>
                            <View style={[{width: maskColWidth}, styles.maskFrame]}/>
                            <View style={styles.maskInner}/>
                            <View style={[{width: maskColWidth}, styles.maskFrame]}/>
                        </View>
                        <SkeletonLayer additionalStyles={styles} maskRowHeight={maskRowHeight}
                                       bird={skeletons[skeletonIndex]}/>

                    </View>

                </RNCamera>}
        </SafeAreaView>
    );
};

export default App;
