import { useState, useEffect, useContext } from 'react';
import { Text, LogBox } from 'react-native';
import { useAssets } from 'expo-asset'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SignIn from './screens/SignIn';
import ContextWrapper from './context/ContextWrapper';
import Context from './context/Context';
import Profile from './screens/Profile';
import Photo from './screens/Photo';
import Chats from './screens/Chats';
import { Ionicons } from "@expo/vector-icons"
import Contacts from './screens/Contacts';
import Chat from './screens/Chat';
import ChatHeader from './components/ChatHeader';

LogBox.ignoreLogs([
  "Setting a timer",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release."
]);

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function App() {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme: { colors } } = useContext(Context)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setLoading(false)
      if (user) {
        setCurrUser(user)
      }
    })

    return () => unsubscribe();

  }, []);

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignIn} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: colors.foreground,
            shadowOpacity: 0,
            elevation: 0
          },
          headerTintColor: colors.white
        }}>
          {!currUser.displayName && (
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
          )}

          <Stack.Screen name="Home" component={Home} options={{ title: "Whatsapp" }} />
          <Stack.Screen name="Contacts" component={Contacts} options={{ title: "Select Contacts" }} />
          <Stack.Screen name="Chat" component={Chat} options={{ headerTitle: (props) => <ChatHeader {...props} /> }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function Home() {
  const { theme: { colors } } = useContext(Context);

  return (
    <Tab.Navigator screenOptions={{
      tabBarShowIcon: true,
      tabBarLabelStyle: {
        color: colors.white
      },
      TabBarIndicatorStyle: {
        backgroundColor: colors.white
      },
      tabBarStyle: {
        backgroundColor: colors.foreground
      },
    }}
      initialRouteName="Chats"
    >
      <Tab.Screen name="Photo" component={Photo} options={{
        tabBarLabel: () => <Ionicons name="camera" size={20} color={colors.white} />
      }} />
      <Tab.Screen name="Chats" component={Chats} options={{
        tabBarLabel: () => <Text style={{ color: colors.white }}>CHATS</Text>
      }} />
    </Tab.Navigator>
  )
}


export default function Main() {
  const [assets] = useAssets(
    require("./assets/icon-square.png"),
    require("./assets/chatbg.png"),
    require("./assets/user-icon.png"),
    require("./assets/welcome-img.png"),
  );

  if (!assets) {
    return <Text>Loading...</Text>
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  )
}


//create a "users" collection in the database (not required, it automatically created in the video)
//add the permission to firestore rules : if request.auth != null