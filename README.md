<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Pasos desarrollo

1. Clonar el repositorio.
2. Cargar la Base de datos.

```
docker-compose up -d
```

3. Levantar la app de nest.

```
yarn start:dev
```

4. Clonar el archivo **.env.template**, renombrarlo como **.env** y rellenar las variables de entorno faltantes.

5. Reconstruir la base de datos semilla @Get

```
localhost:3000/citas/seed/
```
