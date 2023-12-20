import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, push, update } from "firebase/database"; //Ekskluderet child
import * as Location from "expo-location";
import { Accuracy } from "expo-location";

function InputView({ navigation, route }) {
  const [hasLocationPermission, setlocationPermission] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const db = getDatabase();

  // Ask location
  const getLocationPermission = async () => {
    await Location.requestForegroundPermissionsAsync().then((item) => {
      setlocationPermission(item.granted);
    });
  };

  useEffect(() => {
    // Make sure to ask for location permission of the user
    getLocationPermission();
  });

  // Update location and pan to it
  const updateLocation = async () => {
    if (!hasLocationPermission) {
      return
    }

    await Location.getCurrentPositionAsync({
      accuracy: Accuracy.Balanced,
    }).then((item) => {
      setCurrentLocation(item.coords);
    });
  };

  // This is what we want for each entry
  const initialState = {
    firstName: "",
    vare: "",
    pictureURL: "",
  };

  const [userData, setUserData] = useState(initialState);

  // This checks if it's the main route for new items or alternative for editing an item
  const isEditUser = route.name === "EditUser";

  // We set the userdata from params if we were redirected from another route
  useEffect(() => {
    if (isEditUser) {
      const user = route.params.user[1];
      setUserData(user);
    }
    return () => {
      setUserData(initialState);
    };
  }, []);

  // Changes the input of the text
  const changeTextInput = (name, event) => {
    setUserData({ ...userData, [name]: event });
  };

  // This handles the save to the database
  const handleSave = async () => {
    const { firstName, vare, pictureURL } = userData;

    // Checks if fields are set
    if (!firstName || !vare || !pictureURL ) {
      return Alert.alert("One or more fields are empty!");
    }

    const location = currentLocation

    // This is the route if we're in edit mode
    if (isEditUser) {
      const id = route.params.user[0];
      const userRef = ref(db, `UserData/${id}`);
      const updatedFields = {
        firstName,
        vare,
        pictureURL,
        location,
      };

      await update(userRef, updatedFields)
        .then(() => {
          Alert.alert("Information updated!");
          navigation.goBack();
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    } else {
      // This is the route if we're creating a new entry
      const usersRef = ref(db, "UserData");
      const newUserData = {
        firstName,
        vare,
        pictureURL,
        location,
      };

      try {
        await push(usersRef, newUserData);
        Alert.alert("Saved");
        setUserData(initialState);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }
  };

  updateLocation()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                value={userData[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
              />
            </View>
          );
        })}
        <Text style={styles.centerText}>Location is set automatically</Text>
        <Button
          title={isEditUser ? "Save changes" : "Add data"}
          onPress={() => handleSave()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    height: 40,
    margin: 10,
  },
  centerText: {
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 20
  },
  label: {
    fontWeight: "bold",
    width: 120,
    textAlign: "right",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
});

export default InputView;
