import { Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Context from '../context/Context';
import { Grid, Row, Col } from "react-native-easy-grid"
import Avatar from "./Avatar";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

const ListItem = ({ type, description, user, style, time, image, room }) => {
    const navigation = useNavigation();
    const userB = user
    const { theme: { colors } } = useContext(Context);


    const handleNavigate = async () => {
        // const fRoom = [];

        // const queryRef = query(collection(db, "room"))
        // const querySnapshot = await getDocs(queryRef)
        // querySnapshot.forEach((doc) => {
        //     fRoom.push(doc.data())
        // });

        // for (let i = 0; i < fRoom.length; i++) {
        //     if (fRoom[i].participantsArray.includes(contact.contactName)) {
        //         navigation.navigate("Chat", { userB, image, room: fRoom[i] })
        //     }
        // }

        navigation.navigate("Chat", { userB, image, room })
    }

    return (
        <TouchableOpacity style={{ height: 80, ...style }} onPress={handleNavigate}>
            <Grid style={{ maxHeight: 80 }}>
                <Col style={{ width: 80, alignItems: "center", justifyContent: "center" }}>
                    <Avatar user={user} size={type === "contacts" ? 40 : 65} />
                </Col>
                <Col style={{ marginLeft: 10 }}>
                    <Row style={{ alignItems: "center" }}>
                        <Col>
                            <Text style={{ fontWeight: "bold", fontSize: 16, color: colors.text }}>
                                {user.contactName || user.displayName}
                            </Text>
                        </Col>
                        {time && (
                            <Col style={{ alignItems: "flex-end" }}>
                                <Text style={{ color: colors.secondaryText }}>
                                    {new Date(time.seconds * 1000).toLocaleDateString()}
                                </Text>
                            </Col>
                        )}
                    </Row>
                    <Row>
                        {description && (
                            <Row style={{ marginTop: -5 }}>
                                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>{description}</Text>
                            </Row>
                        )}
                    </Row>
                </Col>
            </Grid>
        </TouchableOpacity>
    )
}

export default ListItem