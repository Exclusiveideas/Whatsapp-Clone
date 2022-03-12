import { StyleSheet, Text, TextInput, Image, View, Button, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import Context from '../context/Context';
import { signIn, signUp } from '../firebase';

const SignIn = () => {
    const {theme: {colors}} = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mode, setMode] = useState("signUp");

    async function handlePress() {
        if(mode === "signUp") {
            await signUp(email, password)
        }
        else if(mode === "signIn") {
            await signIn(email, password)
        }
    }


  return (
    <View style={[styles.container, { backgroundColor: colors.white}]}>
      <Text style={{ color: colors.foreground, fontSize: 24, marginBottom: 20}}>Welcome to Whatsapp</Text>
      <Image source={ require('../assets/welcome-img.png')} style={{width: 180, height: 180}} resizeMode= "cover" />
      <View style={{marginTop: 20}}>
          <TextInput 
          value={email}
          onChangeText={setEmail}
          placeholder='email'
          style={{borderBottomColor: colors.primary, borderBottomWidth: 2, width: 200}}
          />
          <TextInput 
          value={password}
          onChangeText={setPassword}
          placeholder='password'
          style={{borderBottomColor: colors.primary, borderBottomWidth: 2, width: 200, marginTop: 20}} 
          secureTextEntry={true}
          />
          <View style={{marginTop: 20}}>
              <Button 
              disabled={!password || !email}
              color={colors.secondary}
              title={mode === "signUp" ? "Sign Up" : "Sign In" }
              onPress={handlePress}
            />
          </View>
          <TouchableOpacity 
          style={{marginTop: 15}} 
          onPress={() => mode ==="signUp" ? setMode("signIn") : setMode("signUp")
            }
           >
              <Text style={{color: colors.secondaryText}} >
                  {mode ==="signUp" 
                  ? "Already have an account? Sign in" 
                  : "Don't have an account? Sign Up"}
              </Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignIn

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    }
})