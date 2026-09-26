import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SaveTokenDto } from './dto/save-token.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  savePushToken(@Body() saveTokenDto: SaveTokenDto) {
    return this.notificationsService.savePushToken(saveTokenDto);
  }
}

// ### Paso 4: Crear el controlador de Notificaciones
// Crearemos un endpoint HTTP para poder gatillar el envío de pruebas utilizando una petición `POST`.

// Genera un nuevo módulo para las notificaciones:
// ```bash
// nest g module notifications
// nest g controller notifications
// ```

// Configura el controlador en `src/notifications/notifications.controller.ts`:

// ```typescript
// import { Controller, Post, Body } from '@nestjs/common';
// import { FirebaseService } from '../firebase/firebase.service';

// @Controller('notifications')
// export class NotificationsController {
//   constructor(private readonly firebaseService: FirebaseService) {}

//   @Post('send')
//   async sendNotification(
//     @Body() body: { token: string; title: string; message: string },
//   ) {
//     return await this.firebaseService.sendPushNotification(
//       body.token,
//       body.title,
//       body.message,
//     );
//   }
// // }
//  ```

// // ---

// // ### Paso 5: Probar la integración
// // 1. Levanta tu servidor NestJS:
// //    ```bash
//    npm run start:dev
//    ```
// 2. Realiza una petición `POST` utilizando herramientas como Postman o Insomnia a la dirección `http://localhost:3000/notifications/send` con el siguiente cuerpo JSON:

// ```json
// {
//   "token": "AQUÍ_VA_EL_TOKEN_FCM_DEL_DISPOSITIVO_CLIENTE",
//   "title": "¡Hola desde NestJS!",
//   "message": "Esta es una notificación push de prueba."
// }
// ```

// Si el token es válido y está activo en un dispositivo físico o emulador, recibirás de inmediato la alerta en pantalla.

// <FollowUp>
// ¿Qué prefieres hacer a continuación?
// * Te ayudo a adaptar el código para **enviar notificaciones masivas** (Multicast) o por **temas** (Topics).
// * Te muestro cómo estructurar el **Data Transfer Object (DTO)** para validar que el formato de los datos entrantes sea correcto usando `class-validator`.
// </FollowUp>
