import React, { useEffect, useState} from "react";
import * as Contacts from 'expo-contacts';

export default function useContacts() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if(status === "granted") {
                const { data } = await Contacts.getContactsAsync({
                    pageSize: 3,
                    fields: [Contacts.Fields.Emails]
                })
                
                if(data.length > 0) {
                    setContacts(data.map(mapContactToUser))
                }
            }
        })()
    },[])
        return contacts
}

function mapContactToUser(contact) {
    return  {
        contactName: contact.firstName ? (contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.firstName) : "No name",
        email: contact.emails && contact.emails[0].email ? contact.emails[0].email : "unavailable email"
    }
}