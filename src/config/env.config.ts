// este EnvConfi. se usa como un service que se inserta en el constructor. y de ahi tomo los valores
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
});
