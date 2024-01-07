# -----------> Docker - Mongo <----------------
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

# ----> conectando el projecto con mongo <-----
1. Instalamos el driver oficial de mongo para node `npm i mongodb` y el tipado 
 `npm i @types/mongodb -D`

1.1 De forma nativa
 1.1.1 importamos el driver de conección con mongo `MongoClient`

 1.1.2 En el modulo global que tenemos que es el de database hacemos un nuevo provider y una useFactory para la conección ==> la pasamos la url y la instancia del cliente y esperamos la coneccion. ==> retornamos la conección para que sea global

 1.1.3 Inyectamos en el app.service y creamos un request

# ----------------> Mongoose <-----------------
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

## ------> Filtros e Indexadores <-------------
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

# -----> Relaciones uno a uno embebidas <------
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

# ---> Relaciones uno a uno referenciadas <----
1. Se usa cuando se tienen dos colecciones precontuidas y se quiere adicionar atributos de una a la otra. Esta relación queda similar a la de un db relacional. se construye de la siguiente forma:

==> Adicionamos como atributo el id de una tabla en la otra y hacemos una especie de join para referenciar y traer el documento desde la otra colección
1. Vamos a usar los Products y Brands
1.1 Importamos Brand entity `import { Brand } from './brand.entity';`
1.2 Creamos el atributo y lo tipamos como Brands o como objecId
1.3 En el decorador Prop le indicamos el tipo y le decimos que es una referencia a la otra entidada
```sh
@Prop({ type: Types.ObjectId, ref: Brand.name })
brand: Brand | Types.ObjectId;
```
1.4 En el products dto creamos un nuevo campo para que cuando se cree un product tengamos que mandarle el id de referencia a la otro entidad (esto es aoarte del atributo que se construyó para la relación embebida); como lo que se espera es un mongoId que es un string, el tipo tiene que ser string y dejamos que calss-validator la valide como mongoId ==>
```sh
  @IsNotEmpty()
  @IsMongoId()
  readonly brand: string;
```

1.5 Al hacer el get de los productos trae el producto y contiene un campo con el brandId;
para que se muestre la data tenemos que decirle que resuelva la relación en el metodo que trae el producto ==> agregar `populate('brand')` ==> el nombre que va dentro del populate es el mismo de la relacion.

# ---> Relaciones uno a muchos embebidas <-----
==> El mismo paso que la relacion anterior solo que esta vez adicionamos como atributo de la entidad un arrego ==> lo tipamos ==> 
```sh
 @Prop({
    type: [{ name: { type: String }, color: { type: String } }],
  })
  skill: Types.Array<Record<string, any>>;
```
==> agragamos el atributo al dto para que sea requrido u opcionl cuando se cree
```sh
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => Skills)
  readonly skills: Skills[];
```
==> El tipo Skills es una clase particular agregada po mí.
==> Esta forma funciona pero se puede hacer mejor siguiendo el patron modular que traemos ==> Lo primero es que vamos a crear un esquema para ese documento embebido, de esta manera:
 ```sh 
  // src/products/entities/sub-doc.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SubDoc {
  @Prop()
  name: String;

  @Prop()
  description: String;
}

export const SubDocSchema = SchemaFactory.createForClass(SubDoc);

 ```
 ==> Con su respectivo DTO:

 ```sh
  // src/products/dtos/sub-doc.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateSubDocDto {
  @IsString()
  @IsNotEmpty()
  readonly name: String;

  @IsString()
  @IsNotEmpty()
  readonly description: String;
}

export class UpdateSubDocDto extends PartialType(CreateSubDocDto) {}
 ```
 ==> Luego importamos este SubDoc dentro de la entidad que queramos que maneje la relación, así:

 ```sh
  // src/products/entities/product.entity.ts

import { SubDoc, SubDocSchema } from './sub-doc.entity'; // 👈 import

...
export class Product extends Document {
  ...
  
  @Prop({ type: SubDocSchema })
  subDoc: SubDoc;  // 👈 new field (1:1)

  @Prop({ type: [SubDocSchema] })
  subDocs: Types.Array<SubDoc>;  // 👈 new field (1:N)
}
...
 ```
 ==> Debes tener en cuenta que este SubDoc no va a estar declarado en el módulo, ya que es un documento embebido y no una colección.

Con esto ya tienes el objeto embebido con tipado y además lo puedes incluir en tus DTOS para una validación más poderosa, de la siguiente manera:

```sh
  // src/products/dtos/products.dtos.ts

import { ..., IsArray } from 'class-validator';
import { Type } from 'class-transformer'; // 👈 transform

import { CreateSubDocDto } from './sub-doc.dto'; // 👈 import

export class CreateProductDto {
  ...

  @IsNotEmpty()
  @ValidateNested()
  readonly subDoc: CreateSubDocDto;  // 👈 1:1

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDocDto)
  readonly subDocs: CreateSubDocDto[];  // 👈 1:N
}

```
# --> Relaciones uno a muchos referenciadas <--
1. Como en la 1:1 refernciada esta contiene idsd e referencia, poero esta vez son varios y dentro de un arreglo

1.1: preparación del esquema
Prepara la propiedad correspondiente en tu esquema que contendrá el array de referencias.

```sh
// users/order.entity.ts
import { Document, Types } from 'mongoose';
import { Product } from '../../products/entities/product.entity';

@Schema()
export class Order extends Document {

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
  products: Types.Array<Product>;
}
```
Observa que el decorador ``@Prop()`` recibe como tipo un Types.ObjectId que a su vez se encuentra encerrado por un ``array []``. También, tienes que tipar la propiedad con Types.Array<> proveniente desde mongoose.
De esta simple manera, Mongoose sabe que la propiedad ``products`` contiene un array de MongoID.

1.2: preparar el DTO para la validación de datos
El DTO solo necesita recibir un array de ``string[]`` que es el equivalente para un array de MongoID.

```sh
 // users/order.dto.ts
import { IsMongoId, IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {

  @IsArray()
  @IsNotEmpty()
  readonly products: string[];
}
```
Utiliza el decorador ``@IsArray()`` para validar que efectivamente se trate de un array.

1.3: GET de documentos referenciados
Realizar un “Join” o, como se lo conoce en MongoDB, un “Populate” es muy sencillo. Basta con agregar la configuración después del método de búsqueda indicando el nombre de la propiedad a popular.

```sh
  // users/orders.service.ts

  export class OrdersService {

    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

    findAll() {
      return this.orderModel
        .find()
        .populate('products')
        .exec();
    }
  }
```
Mongoose sabrá a qué colección ir a buscar los documentos al estar referenciado y tipado desde el esquema.

De esta manera, tu base de datos está lista para manipular grandes volúmenes de datos con los mejores tipos de relaciones que existen. Utiliza el tipo de relación más apropiado para cada escenario.

# ----> Manipulación de arrays en MongoDB <----
1. Los esquemas que contienen propiedades tipo Array deben manipularse de una forma especial. Haciendo los típicos push/pullpara agregar/quitar elementos, pero considerando la asincronía y que estos arrays se guardan en una base de datos.

Agregar y quitar elementos en un array
Veamos cómo es posible agregar/quitar elementos de un array que forma parte de un documento en MongoDB:

# -----> Operadores especiales de MongoDB <----
Si trabajas directamente con MongoDB, tienes que conocer los operadores que implementa para la manipulación de arrays. Estos son:

``$addToSet`` para agregar items en un array
``$pull para`` eliminar items en un array
``$pullAll`` para eliminar todos los items en un array
De esta manera, tu mismo puedes crear las consultas a tu base de datos necesarias para manipular un array dentro de un documento, sin necesidad de que herramientas como Mongoose implementen una capa de abstracción que facilite la tarea.


# -----> Auntentificación y validación <-------

# ---------> Introducción a Guards <-----------
1. Validan y dan autorización en los endpoints dependiendo de los atributos que triga la petició y las condicioneles que se les haya puesto dentro

==> Creamos un modulo nuevo para estos `nest g mo auth` (CLI)
==> Creamos el primer guardian `ǹest g gu auth/guards/apiKey --flat`

==> importamos el guardian en el controlador que queremos protejer y lo poneon encima de la ruta con el decorador `@UseGuard(NombreGuardian)` 

==> Ejemplo de ejecición estatica y directa en el app <==

2. Pasos para hacer la validación de forma programática

==> Pasamos el `@UseGuard(NombreGuardian)` para la cabeza del controlador

==> importamos `SetMetadata`, le pasamos la condicion para que sea público y se lo colocamos a las rutas que requerimos exponer 
```sh
@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SetMetadata('isPublic', true)
  getHello(): string {
    return this.appService.getHello();
  }
  ...
}
```

==> Para que funcione tenemos que => capturar la metadata en el guardian con Reflector => leerla y retornar true;

==> Para no rener el `@SetMetadata('isPublic', true)` en los endpoins, creamos nuestro propio decorador para que sea más comodo.
  => Creamos una carpeta nuava => creamos el documento que va atener el decoredor  => imprtamos `ßetadata` => 
  ```sh
   import { SetMetadata } from '@nestjs/common';
   export const IS_PUBLIC_KEY = 'isPublic';
   export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
  ```
  => importamos en el controler y lo usamos como `@Public()`

==> Para no tener la apyKey quemada en el guardian, la pasamos a variables de entrono, así hay dos ventajas; 1. mejoramos la seguridad, 2. podemos cambiar la key de forma dinamica dependiendo el entorno en el que estemos desarrollando (staying, dev o prod)
 
  => importamos nuestro config => lo tipamos con ConfigTypes => inyectamos en el constructor => camniamos la variable quemada
 ```sh
  No olvidar que para el cambio de entorno de ejecucion => NODE_ENV=prod npm run start:dev
 ```

# ----> Hashing de contraseñas en MongoDB <----
1. Instalamos el paquete `npm i bcrypt`.
2. instalamos los tipos
3. importamos en el servicio => en el endpoind que guarda el password le aplicamos el hashing => `const hasPassword = await bcypt.has(user.password, 10)` => asignamos al password antes de salvar
4. Excluimos el dato de los valores retornados
  => instalamos `npm i nestjs-mongoose-exclude` => en su Entity utilizar el decorador `@ExcludeProperty()` sobr el atributo => utilizar un Interceptor a nivel de ruta o del controlador completo.

  ```sh
   @ExcludeProperty()
   password: string;
  ```
  ```sh
  @UseInterceptors(
    new SanitizeMongooseModelInterceptor({
      excludeMongooseId: false, ==> para el _id (el de la base de datos)
      excludeMongooseV: true, ==> para la version
      }),
    )
  @Controller('users')
  ```
 => Otra forma (mejor) => en el Entity
  @Prop({ required: true, `select: false` })
  password: string;  => asi nigun método podrá traerlo

# ------> Autenticación con Passport.js <------ 
https://docs.nestjs.com/security/authentication  <!-- Hacer la demo de la doc -->

1. Instalamos passport ` npm install --save @nestjs/passport passport passport-local`
2. Instalamos los tipos `npm install --save-dev @types/passport-local`
3. Creamos un servicio de autenticacion => `nest g s auth/services/auth --flat`,
4. Importamos el servicio a que recibe la data a validar (en este caso el UserService) tanto en el servicio que acabamos de crear, en el provider se importa el `UserModule` (recordar que si no está en el provider no funciona)
5. Creamos el método de validación en el auth.service => en el metodo => traemos el usuario por el emai => desencriptamos y validamos el password => retornamos si es valido o no
```sh
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return user;
    }
    return null;
  }
```
6. Creamos la estrategia => `nest g s auth/strategies/local.strategy --flat` => importamos PassprotStrategy => extendemos nuestra estrategia del anterior => le decimo cual es nuestra estrategia; para eso importamos la Strategy de passport-local y se la pasamos al PassportStrategy. => Inyectamos el AuthService en el constructor => llamamos al super => cramos el método que valide el usuario => retornamos el resultado
```sh 
 @Injectable()
  export class LocalStrategyService extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
      super();
    }

    async validate(email: string, password: string) {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    }
 
```
 `Por defecto el primer parametro se llama username, no importa si lo llamamos email aquí, cuando hagamos la petición tiene que ser con username (mas adelante lo customizamos)`
7. Importar en el provider (auth.module) PassportModule

8. Crear la ruta para provar la validación => creamos el controller `nest g co auth/controllers/auth --flat` => creamos el metodo que recibe los datos => usamos los guards para validar con la estrategia 

```sh
@Controller('auth')
export class AuthController {
  
  @UseGuards(AuthGuard('local'))
  @Post()
  login(@Req() req: Request) {
    return req.user;
  }
}
```
9. Cambiando el nombre de los atributos => en el supr de la clase que llama al validate renombramos las variables que vienen pro defecto
```sh
 export class LocalStrategyService extends PassportStrategy(Strategy, 'local') {
    constructor(private authService: AuthService) {
      super({
        usernameField: 'email', // por defecto es 'username'
        passwordField : 'password'
      });
    }
   ...
```
NOTA ( le select : false en el user entity impide las validaciones )
