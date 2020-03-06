import React, {useEffect, useState} from 'react';

import MapView, { Marker, Callout } from 'react-native-maps';

import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';

import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';

function Main({ navigation }) {

    const [position, setPosition] = useState(null);
    const [devs, setDevs] = useState([]);
    const [techs, setTechs] = useState('');

    useEffect(() => {

        async function get_start_location() {
            const { granted } = await requestPermissionsAsync();

            if (granted) {

                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude,longitude } = coords;

                setPosition({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }
        
        get_start_location();
    }, []);

    async function loadDevs(){

        const {latitude, longitude} = position;

        console.log('exibindo parametros de busca:');
        console.log({
            latitude: latitude,
            longitude: longitude,
            techs: techs
        });

        const response = await api.get('/search',{
            params: {
                latitude,
                longitude,
                techs
            }
        });

        setDevs(response.data.devs);
        console.log(devs);
    }

    function handleRegionChanged(region) {
        setPosition(position);
        return null;
    }

    if(!position){
        return null;
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChanged} initialRegion={position} style={styles.map}>
                {devs.map(dev => (
                    <Marker
                        key={dev._id}
                        coordinate={{
                            latitude: dev.location.coordinates[1],
                            longitude: dev.location.coordinates[0],
                        }}
                    >
                        <Image
                            style={styles.avatar}
                            source={{ uri: dev.avatar_url }}
                        />

                        <Callout onPress={ () => {navigation.navigate('Profile', {github_username : dev.github_username});}}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder='Buscar devs por techs...'
                    placeholderTextColor='#999'
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={techs}
                    onChangeText={setTechs}
                />

                <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
                    <MaterialIcons name='my-location' size={20} color='#FFF'/>
                </TouchableOpacity>

            </View>
        </>
    );
}

//  styles

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },

    callout: {
        width: 260,
    },

    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio: {
        color: '#665',
        marginTop: 5,
    },

    devTechs: {
        marginTop: 5,
    },

    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: "row",
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8e4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
})

export default Main;