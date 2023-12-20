import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";

function DisplayView({ navigation }) {
  const [users, setUsers] = useState();
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // This effect makes sure that if searchtext is set we filter out(or reset) the filter for displayed items in the list
  useEffect(() => {
    if (!searchText) {
      setFilteredUsers(userArray); // Reset to full list if search text is empty
    } else {
      // This filters according to the input text
      setFilteredUsers(
        userArray.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.vare.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [users, searchText]);

  // This creates a ref and keeps a snapshot of the UserData
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "UserData");

    // Listen for changes in the 'UserData' node
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsers(data);
      }
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(usersRef);
    };
  }, []); // Effect runs only once

  // If data is not yet loaded
  if (!users) {
    return <Text>Loading...</Text>;
  }

  // The eventHandler for when an item is clicked.
  const handleSelectUser = (id) => {
    const user = Object.entries(users).find((user) => user[0] === id);
    console.log(user)
    navigation.navigate("UserEditView", { user }); // Navigate to details of the selected user
  };

  // Convert the users object into an array for FlatList
  const userArray = Object.values(users);
  const userKeys = Object.keys(users);

  // Textinput is the searchbar and the list shows the filtered items
  return (
    <>
      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchText}
        value={searchText}
        placeholder="Search"
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => userKeys[index]}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={() => handleSelectUser(userKeys[index])}
            >
              <Image style={styles.image} source={{ uri: item.pictureURL }} />
              <Text>
                {item.firstName} - {item.vare}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 5,
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"

  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    margin: 10,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
  },
  image: {
    width: 45,
    height: 45,
    margin: 10,
  },
});

export default DisplayView;
