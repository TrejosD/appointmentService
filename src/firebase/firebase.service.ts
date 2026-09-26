import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp!: App;
  // metodo inicia el FCM app, con sus credenciales
  onModuleInit() {
    if (getApps.length === 0) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n',
      );
      this.firebaseApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('FireBase Admin SDK inicializado correctamente');
    } else {
      this.firebaseApp = getApps()[0];
    }
  }

  //   metodo para enviar una notificacion a un unico dispositivo (Token)
  async sendPushNotificationToSingleDevice(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
    };
    try {
      const response = await getMessaging(this.firebaseApp).send(message);
      return { success: true, messageId: response };
    } catch (error) {
      if (error instanceof Error)
        return { success: false, error: error.message };
    }
  }

  // todo necesito el metodo para obtener el pushToken
  // metodo envia una mensajes a una coleccion de tokens
  async sendPushNotificationToColecction(
    tokens: string[],
    title: string,
    body: string,
  ) {
    const message = {
      notification: { title, body },
      tokens: tokens,
    };
    try {
      const response = await getMessaging(
        this.firebaseApp,
      ).sendEachForMulticast(message);
      return { success: true, response };
    } catch (error) {
      if (error instanceof Error) return { success: false, error };
      // todo cuando un pushToken retorna error, inhabilitado algo asi, se debe de borrar de la DB
    }
  }
}
