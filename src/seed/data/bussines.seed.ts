import { Contact } from 'src/bussiness/entities/contact.entity';
import { Schedule } from 'src/bussiness/entities/schedule.entity';

export const BUSSINESS_SEED: {
  name: string;
  description: string;
  address: string;
  urlGPS: string;
  positions: object[];
  products: object[];
  schedule: Schedule;
  defaultAppointmentTime: number;
  followers: number;
  doneServices: number;
  rate: number;
  contactInfo: Contact;
  customerComments: string[];
}[] = [
  {
    name: 'Barberia Machis',
    description: 'Barberia y peluqueria con estilo',
    urlGPS: 'asdasdasda',
    address: '100 metros sur iglesia',
    positions: [
      {
        name: 'juan',
        products: [
          { name: 'Corte', time: 30, price: 5000 },
          { name: 'Barva', time: 15, price: 2000 },
        ],
      },
    ],
    products: [
      { name: 'Corte', time: 30, price: 5000 },
      { name: 'Barva', time: 15, price: 2000 },
      { name: 'Cejas', time: 15, price: 2000 },
    ],
    schedule: { days: [1, 2, 3, 4, 5, 6], startYourney: 9, endYourney: 17 },
    defaultAppointmentTime: 30,
    followers: 17,
    doneServices: 22,
    rate: 3.7,
    contactInfo: {
      email: 'barberiapelos@email.com',
      social: ['instagram', 'facebook'],
      number: '4568-8956',
    },
    customerComments: [
      'Casi me corta las orejas',
      'Me gusto el corte',
      'Buen servicio',
    ],
  },
  {
    name: 'Salon Divinas',
    description: 'Salon de belleza profesional',
    urlGPS: 'asdasdl;kas',
    address: '250 metros este McDonals',
    positions: [
      {
        name: 'Karen',
        products: [
          { name: 'Corte', time: 30, price: 5000 },
          { name: 'Alisado', time: 60, price: 15000 },
        ],
      },
      {
        name: 'Maria',
        products: [
          { name: 'Corte', time: 30, price: 5000 },
          { name: 'Cejas', time: 15, price: 2000 },
          { name: 'Alisado', time: 60, price: 15000 },
        ],
      },
    ],
    products: [
      { name: 'Corte', time: 30, price: 5000 },
      { name: 'Barva', time: 15, price: 2000 },
      { name: 'Cejas', time: 15, price: 2000 },
      { name: 'Alisado', time: 60, price: 15000 },
    ],
    schedule: { days: [1, 2, 3, 4, 5], startYourney: 9, endYourney: 15 },
    defaultAppointmentTime: 60,
    followers: 23,
    doneServices: 42,
    rate: 4.2,
    contactInfo: {
      email: 'divinas@email.com',
      social: ['instagram', 'tiktok'],
      number: '1254-2587',
    },
    customerComments: ['Trabajo Rapido', 'Me gusto el corte', 'Buen servicio'],
  },
  {
    name: 'Uñas karla',
    description: 'Uñas con estilo moderno',
    urlGPS: 'asldjalsdj',
    address: 'frente al parque de copan',
    positions: [
      {
        name: 'Miriam',
        products: [
          { name: 'Gel', time: 60, price: 15000 },
          { name: 'Esmalte', time: 30, price: 8000 },
        ],
      },
    ],
    products: [
      { name: 'Gel', time: 60, price: 15000 },
      { name: 'Esmalte', time: 30, price: 8000 },
      { name: 'Manicure', time: 90, price: 25000 },
    ],
    schedule: { days: [1, 2, 3, 4, 5, 6], startYourney: 8, endYourney: 17 },
    defaultAppointmentTime: 30,
    followers: 8,
    doneServices: 15,
    rate: 4.1,
    contactInfo: {
      email: 'kaarlita@email.com',
      social: ['instagram', 'facebook'],
      number: '8456-4682',
    },
    customerComments: [
      'Buen trabajo',
      'Muy limpio',
      'Me gusto el corte',
      'Buen servicio',
    ],
  },
];
