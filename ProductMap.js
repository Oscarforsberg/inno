import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";

function ProductMap({ location }) {
  const mapRef = useRef(null);
  const [loc, setLoc] = useState({});

  useEffect(() => {
    if (location && mapRef.current) {
      const { latitude, longitude } = location;

      setLoc(location);

      // Change the region of the map to the new location with animation
      setTimeout(() => {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 4,
            longitudeDelta: 4,
          },
          0
        );
      }, 1500);
    }
  }, [location]);

  // The initial region is set to a default value, the actual region will be
  // updated via useEffect when `location` prop is provided.
  const initialRegion = {
    latitude: 55.676098,
    longitude: 12.568337,
    latitudeDelta: 4,
    longitudeDelta: 4,
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        provider="google"
        style={styles.map}
        showsUserLocation
        ref={mapRef}
        initialRegion={initialRegion}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Marker
          coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}
          title="Product"
          description="Pickup"
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  map: {
    flex: 1,
  },
});

export default ProductMap;
