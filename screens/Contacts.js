import { FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react';
import useContacts from '../hooks/useHooks';
import Context from '../context/Context';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import ListItem from '../components/ListItem';
import { useRoute } from '@react-navigation/native';

const Contacts = () => {
    const contacts = useContacts();
    const route = useRoute();
    const image = route.params && route.params.image
    return (
        <FlatList
            style={{ flex: 1, padding: 10 }}
            data={contacts}
            keyExtractor={(_, i) => i}
            renderItem={({ item }) => <ContactPreview contact={item} image={image} />}
        />
    )
}

export default Contacts;

function ContactPreview({ contact, image }) {
    const { unfilteredRooms } = useContext(Context);
    const [user, setUser] = useState(contact);
    const [room, setRoom] = useState(null);
    //const me = unfilteredRooms.find(room => room.participantsArray.includes(contact.contactName));
    //console.log(unfilteredRooms)
    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("email", "==", contact.email)
        )

        const unsubscribe = onSnapshot(q, snapshot => {
            if (snapshot.docs.length) {
                const userDoc = snapshot.docs[0].data();
                setUser((prevUser) => ({ userDoc, ...prevUser, }))
            }
        });

        for(let i = 0; i < unfilteredRooms.length; i++) {
            if(unfilteredRooms[i].participantsArray.includes(contact.contactName)){
                setRoom(unfilteredRooms[i])
            }
        }

        return () => unsubscribe();
    }, [])


    return (
        <ListItem style={{ marginTop: 7 }} type="contact" user={user} image={image} room={room} />
    )

}