import React, { useEffect, useState } from 'react';
import { Button, View, Text, TextInput, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    return () => subscription.remove();
  }, []);

  // Envia la notificación push al backend para que la entregue al destino
  const sendPushNotification = async () => {
    if (!destinationToken) {
      Alert.alert('Error', 'Por favor, ingresa el token de destino.');
      return;
    }
    // Cambia la URL por la de tu backend local o remoto
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
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Tu token de dispositivo Expo:</Text>
      <Text selectable style={{ fontSize: 12, marginBottom: 20 }}>{expoPushToken}</Text>
      <Text style={{ marginBottom: 5 }}>Token destino (pega aquí el token de otro dispositivo):</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#aaa', marginVertical: 10, width: '100%', padding: 8 }}
        placeholder="ExponentPushToken[xxxxxxxxxxxxxx]"
        value={destinationToken}
        onChangeText={setDestinationToken}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Enviar notificación a otro usuario" onPress={sendPushNotification} />
      {notification && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold' }}>Última notificación recibida:</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
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