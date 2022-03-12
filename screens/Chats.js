import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import Context from '../context/Context'
import ContactsFloating from '../components/ContactsFloating'
import ListItem from '../components/ListItem'
import useContacts from '../hooks/useHooks'

const Chats = () => {
    const user = auth.currentUser;
    const currentUser = user.providerData[0];
    const { rooms, setRooms, setUnfilteredRooms } = useContext(Context);
    const contacts = useContacts();
    const chatsQuery = query(  
        collection(db, "room"),
        where("participantsArray", "array-contains", currentUser.displayName)
    );

    useEffect(() => {
      const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
          const parsedChats = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              userB: doc.data().participants.find((p) => p.displayName !== currentUser?.displayName)
          }));
          setUnfilteredRooms(parsedChats)
          setRooms(parsedChats.filter(doc => doc.lastMessage))
      });

      return () => unsubscribe();
    }, [])

    function getUserB(user, contacts) {
        const userContact = contacts.find(c => c?.email === user?.email)
        if(userContact && userContact.contactName) {
            return {...user, contactName: userContact.contactName }
        } 
        return user;
    }
    

  return (
    <View style={{flex: 1, padding: 5, paddingRight: 10,}}>
        {rooms.length > 0 ? (rooms.map((room) => 
        <ListItem 
        type="chat" 
        description={room.lastMessage.text}
        key={room.id} 
        room={room} 
        time={room.lastMessage.createdAt} 
        user={getUserB(room.userB, contacts)}
        />)) : (
          <Text>No messages</Text>
        )}
      <ContactsFloating />
    </View>
  )
}

export default Chats;