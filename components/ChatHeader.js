import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import Avatar from './Avatar'
import { useRoute } from '@react-navigation/native'
import Context from '../context/Context';

const ChatHeader = () => {
    const { theme: {colors} } = useContext(Context);
    const route = useRoute();
    const  user  = route.params.userB

  return (
    <View style={{flexDirection: "column"}}>
      <View>
          <Avatar size={40} user={user} />
      </View>
      <View style={{marginLeft: 15, alignItems: "center", justifyContent: "center"}}>
          <Text style={{color: colors.white, fontSize: 18}}>{user.contactName || user.displayName}</Text>
      </View>
    </View>
  )
}

export default ChatHeader