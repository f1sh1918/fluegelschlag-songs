/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
    SafeAreaView,
    StyleSheet

} from 'react-native';
import {RNCamera} from "react-native-camera";

const App = () => {
    return (
        <SafeAreaView style={{flex:1}}>
            <RNCamera
                onTextRecognized={({textBlocks})=>console.log(textBlocks)}
                style={{flex: 1}}
                captureAudio={false}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({});

export default App;
