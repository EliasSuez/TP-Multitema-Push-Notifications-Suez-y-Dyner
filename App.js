import React, { useEffect, useState } from 'react';
import { Button, View, Text, TextInput, Platform, Alert, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { app } from './firebaseConfig';
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [destinationToken, setDestinationToken] = useState('');
  const [notification, setNotification] = useState(null);
  const [allTokens, setAllTokens] = useState([]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async token => {
      setExpoPushToken(token);

      // Guarda el token en Firestore
      if (token) {
        try {
          const db = getFirestore(app);
          await setDoc(doc(db, "expoTokens", token), {
            token,
            timestamp: Date.now(),
          });
          // Refresca la lista después de guardar
          fetchTokens();
        } catch (e) {
          console.log("Error guardando token en Firestore:", e);
        }
      } else {
        fetchTokens();
      }
    });

    const sub1 = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    return () => sub1.remove();
  }, []);

  const fetchTokens = async () => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(collection(db, "expoTokens"));
      const tokens = [];
      querySnapshot.forEach(doc => {
        tokens.push(doc.id);
      });
      setAllTokens(tokens);
    } catch (e) {
      console.log("Error leyendo tokens de Firestore:", e);
    }
  };

  // Envia la notificación push al backend para que la entregue al destino
  const sendPushNotification = async () => {
    if (!destinationToken) {
      Alert.alert('Error', 'Por favor, ingresa el token de destino.');
      return;
    }
    try {
      await fetch('http://192.168.0.100:3000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: destinationToken,
          title: '¡Push desde otro usuario!',
          body: 'Hola, esto es una notificación enviada por otro usuario.',
        }),
      });
      Alert.alert('Notificación enviada', 'Se envió la notificación al token destino.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la notificación.');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Tu token de dispositivo Expo:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 20 }}>{expoPushToken}</Text>

      <Text style={{ marginBottom: 5 }}>Token destino (puedes pegarlo o seleccionar uno):</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#aaa', marginVertical: 10, width: '100%', padding: 8 }}
        placeholder="ExponentPushToken[xxxxxxxxxxxxxx]"
        value={destinationToken}
        onChangeText={setDestinationToken}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {allTokens.length > 0 && (
        <View style={{ marginBottom: 10, width: '100%' }}>
          <Text style={{ fontWeight: 'bold' }}>Tokens registrados en Firebase:</Text>
          {allTokens
            .filter(token => token !== expoPushToken)
            .map(token => (
              <Text
                key={token}
                selectable
                style={{
                  fontSize: 10,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  marginVertical: 3,
                  padding: 4,
                  backgroundColor: destinationToken === token ? '#d0e8ff' : '#fff',
                }}
                onPress={() => setDestinationToken(token)}
              >
                {token}
              </Text>
            ))}
        </View>
      )}

      <Button title="Enviar notificación a otro usuario" onPress={sendPushNotification} />

      {notification && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Última notificación recibida:</Text>
          <Text>{notification.request?.content?.body}</Text>
        </View>
      )}
    </ScrollView>
  );
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('No se concedieron los permisos para notificaciones!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('¡Debes usar un dispositivo físico para recibir notificaciones push!');
  }
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}