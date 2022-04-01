import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {RNCamera, TrackedTextFeature} from "react-native-camera";
import axios from "axios";
import {stringSimilarity} from "string-similarity-js";
import Sound from 'react-native-sound';

// @ts-ignore
import RetryIcon from './assets/icons/repeat-icon.svg'
// @ts-ignore
import CloseIcon from "./assets/icons/close-circle-icon.svg";
import ResultScreen from "./src/ResultScreen";
import ScanInfo from "./src/components/ScanInfo";


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
    const [bounds, setBounds] = useState<any>(null);
    const [birdData, setBirdData] = useState<any>(null);
    const [sound, setSound] = useState<Sound | null>(null);

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
            setBounds(ocrElements[0].bounds)
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
            setTimeout(() => clearScan(), 5000)
        }

        setRate(Math.round(matching * 100))
        setRatedBirds(birdsArray)
        return matchingBird
    }

    const clearScan = () => {
        setScanResult(null)
        setScanned(false)
        setBounds(null)
    }

    const onModalClose = () => {
        setShowModal(false)
        setBird(null)
        clearScan()
        stopSound()
    }


    const onPressVolume = () => {
        isPlaying && stopSound()
        !isPlaying && bird?.song && playSong()
    }

    const stopSound = () => {
        sound?.stop()
        setIsPlaying(false)
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            {scanResult && !bird && <ScanInfo rate={rate} result={scanResult} retry={clearScan}/>}
            {bird ?
                <ResultScreen ratedBirds={ratedBirds.sort((a, b) => b.rate - a.rate)} isPlaying={isPlaying}
                              onPressVolume={onPressVolume} result={bird} showModal={showModal}
                              onModalClose={onModalClose}/> :
                <RNCamera
                    onTextRecognized={recognizeText}

                    style={{flex: 1}}
                    captureAudio={false}>
                    {bounds && <View
                        style={{
                            borderWidth: 2,
                            borderColor: '#fcba03',
                            position: 'absolute',
                            left: bounds?.origin.x - 20,
                            top: bounds?.origin.y - 10,
                            height: bounds?.size.height * 4,
                            width: bounds?.size.width * 3
                        }}
                    />}
                    {!scanResult && !bird &&
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                        <ActivityIndicator size="large" color="#fcba03"/>
                        <Text style={{color: '#fcba03', alignSelf: 'center', fontSize: 24, marginLeft: 20}}>Scanning
                            ...</Text>
                    </View>}
                </RNCamera>}
        </SafeAreaView>
    );
};
// TODO add styles here
const styles = StyleSheet.create({});

export default App;
