# -----------> Docker - Mongo <---------------
1. agregar documento con configuaracion 
2. Desplegar contenedor
3. Verificar que el servicio esté corriendo en docker
 ```
  docker-compose up -d mongo
  docker-compose ps

  ```
4. Conección
 4.1 Desde mongoDB Compass al contenedor
  4.1.1 New conecction ==> general (localhost:27017) ==> Authentication > userName/Password (llenar data del contenedor) ==> connect ==> create database => collection name
 
 4.2 Desde vsCode al contenedor
  4.2.1 Abrimos la extensión => Conecction + ==> Advanced Connection Settings ==>(localhost:27017) ==> Authentication => userName/Password (llenar data del contenedor)

 4.3 Desde la terminal (sirve para conectar al local y a la nube)
  4.3.1
   ```sh
    docker-compose exec `nombre_del_servicio` bash

   ```
   para entrar (la url se saca del mongo compass ó click derecho en la conección de vscode y copy string connection) // ojo con la imagen que no está cogiendo el mongosh => la que sirve actualmente es la `image: mongo:5.0`
   ```sh
    mongosh 'url'
   ```
   ```sh
    show dbs
    show collections
   ```
    ```sh
    use ("nombre_db")
    db.nombre_de_collection.find()
   ```

# ----> conectando el projecto con mongo <----
1. Instalamos el driver oficial de mongo para node `npm i mongodb` y el tipado 
 `npm i @types/mongodb -D`

1.1 De forma nativa
 1.1.1 importamos el driver de conección con mongo `MongoClient`

 1.1.2 En el modulo global que tenemos que es el de database hacemos un nuevo provider y una useFactory para la conección ==> la pasamos la url y la instancia del cliente y esperamos la coneccion. ==> retornamos la conección para que sea global

 1.1.3 Inyectamos en el app.service y creamos un request

# ----------------> Mongoose <----------------
1. Es un orm para mejor manejo de la conección a la bd ,validación y facilita la construcción de schemas y maneja mejor la queries

https://docs.nestjs.com/techniques/mongodb

2. `npm i @nestjs/mongoose mongoose` 

3. Importamos el MogoseModule en el data module, lo configuramos y exportamos la conección

## ---------------> Schemas <------------------

1. Mongoose se maneja con active records por tanto necesita schemas para funcionar
2. Se le conlocan los diferentes decoradores a las entities para convertirlas en schemas
3. La clase debe extender de Document =>
`import { Document } from 'mongoose';`
`import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';`

 `@Schema()` => le dice a la clase que es una schema
 `export class Product extends Document {...`

 `@Prop()` => Indica que el atributo es una propiedad (va en todos), es un string por defecto. => `@Prop({type : Number})`

 4. Definimos el esquema`export const ProductSchema = SchemaFactory.createForClass(Product);`

## Confugurando el modulo principal
1. En el modulo principal de cada isla importamos las schemas, la entidad en sí y el MongooseModule que se usan en ellas y lo seteamos de esta manera
```sh
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  ...})
  ```
  ## Trabajando con el servicio

  1. Inyectamos los modelos
  ```sh
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';

  export class ProductsService {
  constructor (@InjectModel( Product.name) private productModel: Model<Product>){}
   .
   .
   .
  }
  ```
  ## validación con Pipe
  1. Una vez creadas las operaciones básicas de crud, pasamos a validarlas

  2. Para esto usaremos pipes, los cuales son como middlewares.

  3. creamos nuestro propio Pipe desde la line ade comando
   ```sh
    nest g pi common/mongoId
              nombreCarpeta/nombrePipe
   ```
 4. Usamos la bilioteca de class-validator => tiene las funciones para los decoradores y además funciones validadoras; la diferencia es que las de los decoradores tienen la primera letra en mayuscula
 - vamos a validar que lo que se pasa por parámetro sea un id de mongo
 - en el Pipe 
  ```sh
  import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common
  import { isMongoId } from 'class-validator';

  ```

## ------> Filtros e Indexadores <------------
1. Los filtero se tipan desde el dto de la entidad con una clase aparte

2. Se le pone los campos requeridos como opcionales

3. Casi siempre para estos métodos de filtrado las condiciones del filtro vienen por query,
hay que requerirlos en el controller con `@Quety()` y tiparlo y pasarlos al método

4. Támbien hay que pasarlos al servicio (estos flujo por le regular es de atrás para adelante), tiparlos y empezar con las condicioneles por si viene o no.

5. Siempre que un dato viene por query es un string, se necesita hacer un parceo global para estos datos => desde el main en el validador global ==> 
app.useGlobalPipes (
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      ``transformOptions: {``
       `` enableImplicitConversion: true,``
    ``  },``
    })

6. Para indexsar un campo solo se requiere que en su Schema en la parte del decorador @Prop asignemos la indxación `@Prop({type: number, index : true})`

7. Se puede crear una indexacion compuesta para que resporda con dos o más campos a la vez, para esto fuara de la tabla ponemos `NombreSchema.index({atributo: 1, atributo: -1})` el 1 y -1 en el atributo indica si se organiza la información de forma ascendente o descendente
https://www.mongodb.com/docs/manual/indexes/

# -----> Relaciones uno a uno embebidas <-----
1. La relación es entre dos documentos de mongodb, pero no hay referencia a al otro documento
2. No se puede hacer consultas ni buscar por ella, solo puedes acceder
3. Para crearla hacemos lo siguiente ==> vamos a usa como ejemplo los Products y Categories => importamos raw de nestjs/mongooose en la tabla te products => Creamoc un nuevo atributo en esta tabla y lo tipamos, agregamos el decorador Prop y dentro le pasamos el raw con laos atributos de la categoría 
```sh
 @Prop(
    raw({
      name: { type: String },
      image: { type: String },
    }),
  )
  category: Record<string, any>;
```
==> en el dto le decimos que necesitamo una nueva category => importamos el categoryDto ==> agregamos el tributo el el dto y lo tipamos con el dto de la categoria => usamos el decorador ValidateNested para que valide en cascada. (la categoría solo se crea para ese producto, pero como es un db noSQL la repeticio de datos no es mala)

# ---> Relaciones uno a uno referenciadas <---

