// @refresh reset
import { View, ImageBackground, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'
import { useRoute } from '@react-navigation/native';
import "react-native-get-random-values";
import { nanoid } from 'nanoid';
import Context from '../context/Context';
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { GiftedChat, Actions, InputToolbar, Bubble } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons"
import { pickImage, uploadImage } from '../utils';
import ImageView from "react-native-image-viewing";

const randomId = nanoid();


const Chat = () => {
    const [roomHash, setRoomHash] = useState("");
    const [messages, setMessages] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageView, setSelectedImageView] = useState("");

    const { theme: { colors } } = useContext(Context)
    const currentUser = auth.currentUser.providerData[0];
    const route = useRoute();
    const { userB, room } = route.params;
    const selectedImage = route.params.image;

    const senderUser = {
        name: currentUser.displayName,
        _id: currentUser.uid,
        avatar: currentUser.photoURL
    }

    if (currentUser.photoURL) {
        senderUser.avatar = currentUser.photoURL
    }

    const roomId = room === null ? randomId : room.id 

    const roomRef = doc(db, "room", roomId);
    const roomMessagesRef = collection(db, "rooms", roomId, "messages")



    useEffect(() => {
        (async () => {
            if (room === null) {
                const currentUserData = {
                    displayName: currentUser.displayName,
                    email: currentUser.email
                }
                if (currentUser.photoURL) {
                    currentUserData.photoURL = currentUser.photoURL
                }
                const userBData = {
                    displayName: userB.contactName || userB.displayName || "No name",
                    email: userB.email
                }
                if (userB.photoURL) {
                    userBData.photoURL = userB.photoURL
                }
                const roomData = {
                    id: roomId,
                    participants: [currentUserData, userBData],
                    participantsArray: [currentUser.displayName, userBData.displayName]
                }

                try {
                    await setDoc(roomRef, roomData)
                } catch (error) {
                    console.log(error);
                }
            }

            const emailHash = `${currentUser.email}:${userB.email}`
            setRoomHash(emailHash);
            if (selectedImage && selectedImage.uri) {
                await sendImage(selectedImage.uri, emailHash)
            }
        })()
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(roomMessagesRef, querySnapshot => {
            const messagesFirestore = querySnapshot.docChanges().filter(({ type }) => type === "added").map(({ doc }) => {
                const message = doc.data();
                return { ...message, createdAt: message.createdAt.toDate() }
            }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            appendMessages(messagesFirestore)
        });

        return () => unsubscribe();
    }, []);

    const appendMessages = useCallback((messages) => {
        setMessages((prevMessages) => GiftedChat.append(prevMessages, messages)
        )
    }, []);

    async function onSend(messages = []) {
        const writes = messages.map(m => addDoc(roomMessagesRef, m));
        const lastMessage = messages[messages.length - 1]
        writes.push(updateDoc(roomRef, { lastMessage }));
        await Promise.all(writes)
    }

    async function sendImage(uri, roomPath) {
        const { url, fileName } = await uploadImage(
            uri,
            `images/rooms/${roomPath || roomHash}`
        );
        const message = {
            _id: fileName,
            text: "",
            createdAt: new Date(),
            user: senderUser,
            image: url
        }
        const lastMessage = {
            ...message,
            text: "image"
        }
        await Promise.all([
            addDoc(roomMessagesRef, message),
            updateDoc(roomRef, { lastMessage })
        ])

    }

    async function handlePhotoPicker() {
        const result = await pickImage();
        if (!result.cancelled) {
            await sendImage(result.uri)
        }
    }


    return (
        <ImageBackground
            resizeMode='cover'
            source={require('../assets/chatbg.png')}
            style={{ flex: 1 }}
        >
            <GiftedChat
                onSend={onSend}
                messages={messages}
                user={senderUser}
                renderAvatar={null}
                onPressActionButton={handlePhotoPicker}
                renderActions={(props) => (
                    <Actions {...props} containerStyle={{ position: "absolute", right: 50, bottom: 5, zIndex: 9999 }}
                        icon={() => (<Ionicons name="camera" size={30} color={colors.iconGray} />
                        )}
                    />
                )}
                timeTextStyle={{ right: { color: colors.iconGray } }}
                renderSend={(props) => {
                    const { text, messageIdGenerator, user, onSend } = props;
                    return (
                        <TouchableOpacity style={{
                            height: 40, width: 40,
                            borderRadius: 40,
                            backgroundColor: colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 5
                        }}
                            onPress={() => {
                                if (text && onSend) {
                                    onSend({
                                        text: text.trim(),
                                        user,
                                        _id: messageIdGenerator(),
                                    }, true)
                                }
                            }}
                        >
                            <Ionicons name="send" size={20} color={colors.white} />
                        </TouchableOpacity>
                    )
                }}
                renderInputToolbar={(props) => (
                    <InputToolbar {...props}
                        containerStyle={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginBottom: 2,
                            borderRadius: 20,
                            paddingTop: 5
                        }}
                    />
                )}
                renderBubble={(props) => (
                    <Bubble {...props}
                        textStyle={{
                            right: { color: colors.text }
                        }}
                        wrapperStyle={{
                            left: { backgroundColor: colors.white },
                            right: { backgroundColor: colors.tertiary }
                        }}
                    />
                )}
                renderMessageImage={(props) => {
                    return (
                        <View style={{ borderRadius: 15, padding: 2 }}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(true);
                                setSelectedImageView(props.currentMessage.image)
                            }}>
                                <Image source={{ uri: props.currentMessage.image }}
                                    resizeMode="contain"
                                    style={{ width: 200, height: 200, padding: 6, borderRadius: 15, resizeMode: "cover" }}
                                />
                                {selectedImageView ? (
                                    <ImageView
                                        imageIndex={0}
                                        visible={modalVisible}
                                        onRequestClose={() => setModalVisible(false)}
                                        images={[{ uri: selectedImageView }]}
                                    />
                                ) : (
                                    null
                                )}
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </ImageBackground>
    )
}

export default Chat