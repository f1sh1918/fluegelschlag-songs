import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {RNCamera, TrackedTextFeature} from "react-native-camera";
import birdData from './assets/data/birds.json';
import axios from "axios";
import {stringSimilarity} from "string-similarity-js";
import SoundPlayer from 'react-native-sound-player';


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


    useEffect(() => {
            if (!bird && scanResult?.name) {
                const bird = checkBirdList(scanResult.name)
                if (bird) {
                    const query = `https://xeno-canto.org/api/2/recordings?query=${bird.latin}+q:A`;
                    axios.get(query)
                        .then(function (response) {
                            setBird({
                                name: bird.name, latin: bird.latin, song: {
                                    fileName: response?.data.recordings[0]["file-name"],
                                    sono: response?.data.recordings[0].sono.small
                                }
                            })
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            }
        }
        ,
        [scanResult?.name]
    )
    ;

    useEffect(() => {
        if (bird?.song) {
            playSong(bird.song)
        }
    }, [bird?.song]);

    const playSong = (song: Song) => {
        const soundFile = getSoundFile(song)
        if (soundFile) {
            try {
                SoundPlayer.playUrl(soundFile)

            } catch (e) {
                console.log(`cannot play the sound file`, e)
            }
            setIsPlaying(true)
        }
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
            setTimeout(() => setScanResult({name: ocrElements[0]?.text, latin: ocrElements[1]?.text}), 1000)
        }
    }

    const checkBirdList = (name: string): Bird | null => {
        const matchingRate = 0.7
        let matchingBird = null;
        let matching = 0;
        const birdsArray: RatedBird[] = []
        birdData.birds.map(bird => {
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
    }

    const onModalClose = () => {
        setShowModal(false)
        setBird(null)
        clearScan()
        stopSound()
    }


    const onPressVolume = () => {
        isPlaying && stopSound()
        !isPlaying && bird?.song && playSong(bird.song)
    }

    const stopSound = () => {
        SoundPlayer.stop()
        setIsPlaying(false)
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            {scanResult && !bird && <ScanInfo rate={rate} result={scanResult} retry={clearScan}/>}
            {bird ?
                <ResultScreen ratedBirds={ratedBirds.sort((a, b) => b.rate-a.rate)} isPlaying={isPlaying}
                              onPressVolume={onPressVolume} result={bird} showModal={showModal}
                              onModalClose={onModalClose}/> :
                <RNCamera
                    onTextRecognized={recognizeText}
                    style={{flex: 1}}
                    captureAudio={false}/>}
        </SafeAreaView>
    );
};
// TODO add styles here
const styles = StyleSheet.create({});

export default App;
