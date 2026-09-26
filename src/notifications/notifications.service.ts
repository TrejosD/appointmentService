import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDevice, UserDeviceDocument } from './entities/user-device.entity';
import { SaveTokenDto } from './dto/save-token.dto';
import {
  Appointment,
  AppointmentDocument,
} from 'src/appointment/entities/appointment.entity';
import { User, UserDocument } from 'src/auth/entities/user.entity';
import {
  Bussiness,
  BussinessDocument,
} from 'src/bussiness/entities/bussiness.entity';
import {
  Follower,
  FollowerDocument,
} from 'src/bussiness/entities/follower.entity';
import { Product } from 'src/bussiness/entities/product.entity';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private firebaseApp!: App;
  constructor(
    @InjectModel(UserDevice.name)
    private readonly userDeviceModel: Model<UserDeviceDocument>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Bussiness.name)
    private readonly bussinessModel: Model<BussinessDocument>,
    @InjectModel(Follower.name)
    private readonly followerModel: Model<FollowerDocument>,
  ) {}
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
  // todo este metodo no sera necesario nunca. Ya que el objeto pushToken en DB es un array de tokens no uno solo
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

  // metodo envia una mensajes a una coleccion de tokens
  async sendPushNotificationToColecction(
    userId: string,
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
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        // todo esto deberia eliminar los token invalidos
        if (failedTokens.length > 0) {
          const setEliminar = new Set(failedTokens);
          const tokensUpdated = tokens.filter(
            (token) => !setEliminar.has(token),
          );
          console.log(`TOkens que se mantienen `, tokensUpdated);
          await this.userDeviceModel.updateOne(
            { userId: userId },
            { pushToken: tokensUpdated },
          );
        }
      }
      return { success: true, response };
    } catch (error) {
      if (error instanceof Error) return { success: false, error };
    }
  }

  async savePushToken(
    saveTokenDto: SaveTokenDto,
  ): Promise<{ success: boolean }> {
    const { userId, pushToken } = saveTokenDto;
    await this.userDeviceModel.findByIdAndUpdate(userId, {
      pushToken: pushToken,
    });
    return { success: true };
  }

  async newAppointmentNotification(appointmentId: string) {
    const appointmentInfo = await this.appointmentModel.findById(appointmentId);
    if (!appointmentInfo)
      throw new NotFoundException('Appointment informacion not found');
    const userDevice = await this.userDeviceModel.findById(
      appointmentInfo?.customerID,
    );
    const customer = await this.userModel.findById(appointmentInfo?.customerID);
    // este metodo va a llamar al metodo
    // metodo necesita token, titulo, body, record? string,string
    const response = await this.sendPushNotificationToColecction(
      appointmentInfo.customerID,
      userDevice!.pushToken,
      'Nueva cita',
      `${customer?.fullName}: agendó una cita ${appointmentInfo.startTime.toISOString()}`,
    );
    return response;
  }

  async newFollowerNotification(userId: string, bussId: string) {
    // todo necesito una correlacion entre el bussiness y el user, dueño de ese bussiness.
    const userInfo = await this.userModel.findById(userId);
    if (!userInfo) throw new NotFoundException('User informacion not found');
    const buss = await this.bussinessModel.findById(bussId);
    if (!buss) throw new NotFoundException('Bussiness information not found');
    // todo el user device, lo debo buscar con el userID, guardado en el modelo del bussiness
    const userDevice = await this.userDeviceModel.findById(buss.userId);
    // este metodo va a llamar al metodo
    // metodo necesita token, titulo, body, record? string,string
    const response = await this.sendPushNotificationToColecction(
      userId,
      userDevice!.pushToken,
      'Nuevo Seguidor',
      `${userInfo?.fullName} es ahora un nuevo seguidor}`,
    );
    return response;
  }
  async sentAddNotification(bussId: string, product: Product) {
    // todo aca voy a necesitar tambien un producto
    const followers = await this.followerModel.findById({
      bussinessId: bussId,
    });
    if (!followers)
      throw new NotFoundException('Follower informacion not found');
    const buss = await this.bussinessModel.findById(bussId);
    if (!buss) throw new NotFoundException('Bussiness information not found');
    const followersIds = followers.userFollower;
    // aca tengo una lista de UserIds. Con cada uno de estos ids, debo, buscar el user, y de ahi si, obtengo los pushToken y toda la info
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    followersIds.map(async (follower) => {
      const user = await this.userModel.findById(follower.id);
      if (!user) throw new NotFoundException('User not found');
      const userDevice = await this.userDeviceModel.findById(user.id);
      const response = await this.sendPushNotificationToColecction(
        user.id,
        userDevice!.pushToken,
        'Producto en Promoción',
        `${product.name} se encuentra en promoción ahora}`,
      );
      return response;
    });
    // todo necesito para aca userID, buscar el pushToken. Puede que nesite crear algun otro metodo adicional
    // metodo necesita token, titulo, body, record? string,string
  }
}
