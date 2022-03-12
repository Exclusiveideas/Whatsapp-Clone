import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import  Constants  from 'expo-constants';
import Context from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { askForPermission, pickImage, uploadImage } from '../utils';
import { auth, db } from '../firebase'
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const [displayName, setDisplayName] = useState("")
    const [permissionStatus, setPermissionStatus] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const { theme: {colors} } = useContext(Context);
    const navigation = useNavigation();
  
  useEffect(() => {
      (async () => {
       const status = await askForPermission();
       setPermissionStatus(status)
      })();
  }, [])
  

  async function handlePress() {
     //original snippet >> const user = auth.currentUser;
    const currentUser = auth.currentUser;
    const user = currentUser.providerData[0];
      let photoURL;
      if(selectedImage) {
        const { url } = await uploadImage(
            selectedImage, 
            `images/${user.uid}`, 
            "profilePicture")
        photoURL = url;
      }
      const userData = {
          displayName, 
          email: user.email
      }
      if(photoURL) {
          userData.photoURL = photoURL;
      }
      await Promise.all([
          updateProfile(currentUser, userData),
          setDoc(doc(db, "users", currentUser.uid), {
              ...userData,
              uid: currentUser.uid
          }),
      ]);
      
      navigation.navigate("Home")
  }

  async function handleProfilePicture() {
      const result = await pickImage();
      if(!result.cancelled) {
          setSelectedImage(result.uri)
      }
  }

  if(!permissionStatus) {
      return <Text>Loading...</Text>
  }
  else if(permissionStatus !== "granted") {
    return <Text>You need to allow permission</Text>
}

  return (
    <React.Fragment>
        <StatusBar style='auto' />
        <View style={{
            alignItems: 'center',
            justifyContent: "center", 
            flex: 1, 
            paddingTop: Constants.statusBarHeight + 20 ,
            padding: 20}}>
            <Text style={{fontSize: 22, color: colors.foreground }}>
                Profile Info
            </Text>
            <Text style={{fontSize: 14, color: colors.text, marginTop: 20 }}>
                Please provide your name and an optional photo
            </Text>
            <TouchableOpacity 
            onPress={handleProfilePicture}
            style={{
                marginTop: 30, 
                borderRadius: 120, 
                width: 120, 
                height: 120, 
                backgroundColor: 
                colors.background, 
                alignItems: "center", 
                justifyContent: "center" }}
                >
                {!selectedImage ? (
                <MaterialCommunityIcons 
                name="camera-plus" 
                color={colors.iconGray}
                size={45} 
                />
                ) 
                :<Image source={{ uri: selectedImage}} style={{width: "100%", height: "100%", borderRadius: 120}} />}
            </TouchableOpacity>
            <TextInput
              placeholder='Type your name'
              value={displayName}
              onChangeText={setDisplayName}
              style={{borderBottomColor: colors.primary, marginTop: 40, borderBottomWidth: 2, width: "100%"}}
              />
              <View style={{marginTop: "auto", width: 80, }}>
                  <Button 
                  title='Next' 
                  color={colors.secondary} 
                  onPress={handlePress} 
                  disabled={!displayName}
                  />
              </View>
        </View>
    </React.Fragment>
  )
}

export default Profile
