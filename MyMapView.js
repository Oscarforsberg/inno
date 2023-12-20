import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Accuracy } from 'expo-location';
import { getDatabase, ref, onValue, off } from 'firebase/database';

function MyMapView({ navigation, route }) {
  const [hasLocationPermission, setlocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [userMarkerCoordinates, setUserMarkerCoordinates] = useState([]);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const mapRef = React.useRef(null);

  // Products location
  const [users, setUsers] = useState([]);

  // Ask location
  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync().then((item) => {
      setlocationPermission(item.granted);
    });
  };

  useEffect(() => {
    // Make sure to ask for location permission of the user
    getLocationPermission();
  }); // Effect runs only once

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, 'UserData');

    // Listen for changes in the 'UserData' node
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // some values might not have location, so we make sure only to create markers for those who have
        const products = Object.values(data).filter((e) =>
          e.hasOwnProperty('location')
        );
        setUsers(products);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(usersRef);
    };
  }, []); // Effect runs only once

  // The function that handles the selected markers
  const handleSelectMarker = async (coordinate) => {
    setSelectedCoordinate(coordinate);

    await Location.reverseGeocodeAsync(coordinate).then((data) => {
      setSelectedAddress(data);
    });
  };

  // Update location and pan to it
  const updateLocation = async () => {
    await Location.getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    }).then((item) => {
      setCurrentLocation(item.coords);

      mapRef.current.animateToRegion(
        {
          latitude: item.coords.latitude,
          longitude: item.coords.longitude,
          latitudeDelta: 0.092,
          longitudeDelta: 0.042,
        },
        2500
      );
    });
  };

  // This closes the info box
  const closeInfoBox = () =>
    setSelectedCoordinate(null) && setSelectedAddress(null);

  // This sets a new marker if you long press
  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setUserMarkerCoordinates((oldArray) => [...oldArray, coordinate]);
  };

  // The function that renders the view of the location-button´
  const RenderCurrentLocation = (props) => {
    if (props.hasLocationPermission === null) {
      return null;
    }
    if (props.hasLocationPermission === false) {
      return <Text>No location access. Go to settings to change</Text>;
    }
    return (
      <View>
        <Button style title="update location" onPress={updateLocation} />
        {currentLocation && (
          <Text>
            {`lat: ${currentLocation.latitude},\nLong:${currentLocation.longitude}\nacc: ${currentLocation.accuracy}`}
          </Text>
        )}
      </View>
    );
  };

  // The rendered view of the map
  {
    return (
      <SafeAreaView style={styles.container}>
        <RenderCurrentLocation
          props={{
            hasLocationPermission: hasLocationPermission,
            currentLocation: currentLocation,
          }}
        />
        <MapView
          provider="google"
          style={styles.map}
          showsUserLocation
          onLongPress={handleLongPress}
          ref={mapRef}
        >
          <Marker
            coordinate={{ latitude: 55.676195, longitude: 12.569419 }}
            title="Rådhuspladsen"
            description="blablabal"
          />
          <Marker
            coordinate={{ latitude: 55.673035, longitude: 12.568756 }}
            title="Tivoli"
            description="blablabal"
          />
          <Marker
            coordinate={{ latitude: 55.674082, longitude: 12.598108 }}
            title="Christiania"
            description="blablabal"
          />

          {/* Product Markers */}
          {users.length != 0 &&
            users.map((user) => (
              <Marker
                coordinate={{
                  latitude: user.location.latitude,
                  longitude: user.location.longitude,
                }}
                title={user.vare}
                description={user.firstName}
              />
            ))}

          {userMarkerCoordinates.map((coordinate, index) => (
            <Marker
              coordinate={coordinate}
              key={index.toString()}
              onPress={() => handleSelectMarker(coordinate)}
            />
          ))}
        </MapView>
        {selectedCoordinate && selectedAddress && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {selectedCoordinate.latitude}, {selectedCoordinate.longitude}
            </Text>
            <Text style={styles.infoText}>
              name: {selectedAddress[0].name} region:{' '}
              {selectedAddress[0].region}
            </Text>
            <Button title="close" onPress={closeInfoBox} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  map: { flex: 1 },
  infoBox: {
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    height: 40,
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
    width: 120,
    textAlign: 'right',
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
});

export default MyMapView;
