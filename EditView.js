import React, { useState, useEffect } from "react";
import { View, Text, Platform, StyleSheet, Button, Alert } from "react-native";
import { getDatabase, ref, remove } from "firebase/database";
import ProductMap from "./ProductMap";

function UserEditView({ route, navigation }) {
  const [user, setUser] = useState({});
  const [userFields, setUserFields] = useState({});
  const [location, setLocation] = useState({});

  useEffect(() => {
    const { location, ...fields } = route.params.user[1];

    setUser(route.params.user[1])
    setUserFields(fields)
    setLocation(location)

    // Clean up function
    return () => {
      setUser({});
      setUserFields({});
      setLocation({});
    };
  }, [route.params.user]);

  // This is the handler that reroutes to out InputView but with the alternative route EditUser
  const handleEdit = () => {
    const user = route.params.user;
    navigation.navigate("EditUser", { user });
  };

  // To make sure that the user are sure that they want to delete an item
  const confirmDelete = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert("Are you sure?", "Do you want to delete this user?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDelete() },
      ]);
    }
  };

  // Deletes the requested entry from the database
  const handleDelete = async () => {
    const id = route.params.user[0];
    const db = getDatabase();
    const userRef = ref(db, `UserData/${id}`);

    await remove(userRef)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  if (!user) {
    return <Text>No data</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={handleEdit} />
      <Button title="Delete" onPress={confirmDelete} />

      {Object.entries(userFields).map((item, index) => {
        return (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>{item[0]}</Text>
            <Text style={styles.value}>{item[1]}</Text>
          </View>
        );
      })}

      <ProductMap location={location} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
  },
  label: {
    width: 150, // Increased width for label due to possibly long field names for users
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
});

export default UserEditView;
