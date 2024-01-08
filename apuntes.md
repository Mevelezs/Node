https://docs.nestjs.com

# -----> Documentación con swageer <--------

pasos ==> Documentación nestjs openapi

1. Instalar el paquete de npm: `npm install --save @nestjs/swagger`
2. Copiar en el main.ts la configuración de la documentación antes del listen.
3. Editar e importar las dependencias
4. El enpoint donde va a salir toda la documentación es este`SwaggerModule.setup('api', app, document);`,(en la parte donde dice 'api') lo modificamos por 'docs' y quedaría en /docs
5. Configuración para que aparezcan los dtos
6. En la documentación en la parte de POENAPI => CLI plugin => Using the CLI plugin vemos que hay que configurar el archivo nest-cli.json agreandole precisamente el plugin de swager
   `"compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }`
7. Cambiar las importaciones de los partialTypes `import { PartialType } from '@nestjs/mapped-types';` que estan en los dtos por `import { PartialType } from '@nestjs/swagger';`,
   esto para que no tenga problemas para documentar los Updates que extienden de los Create

8. Agerganso mas detalles a los atributos => importamos ApiProperty de @nestjs/swagger y lo usamos como decorador en el atriduto ej: `@ApiProperty({ description: 'this atribute is an email of user' })` muchas vaces innecesario...

9. Agrupar los enpoins por categoría ==> importtamos ApiTags en cada Controlador y lo usamos como decorador pasandole el nombre del controlador ej: `@ApiProperty({ description: 'this atribute is an email of user' })`

10. Se puede agregar una descripción a acada endpoin con el decorador `@ApiOperation({summary : 'aqeí va la descripción'})`, importado igual que ApiTags

alternativa para deploy con render https://www.youtube.com/watch?v=bZlP1C9q14E&t=1272s

## -- deshabilitar las cors ==> en el main.ts antes del listen colocar `app.enableCors()`

---

# ---> Tips para clonación <---

- git clone [url] [nombreCarpeta]
- cd nombreCarpeta
- npm i
- code . (abrir carpeta en vscode)
- git remote -v (muestra las ramas remotas a las que es ligado el repo)
- git remote rm origin (si se quiere desligar del original)
- git remote add origin [nuevaUrl] (nuevaUrl => mi repo de gutHub)
- ***

  ---> Docker <---

- instalar docker y docker compose
- crear un archivo llamado docker-compose.yml en la raiz del proyecto
- agregar lo siguiente en el docker-compose.yml
- correr `docker-compose up` para levantar el contenedor & `docker-compose up -d pgAdmin`

- `docker ps`
  `docker inspect 'dbName'` para mirar las propiedades de la db y sacar el id para el pdAdmin

- `docker-compose exec postgres bash` (postgres =>> es el nombre que se le pone al servicio en el yml (en este caso se llama "postgres_nest"))
  `root@bb993ed98bca:-- > psql -h localhost -d nombredb -U userName` para abrir la db en la terminal (el userNeme es el que se pone en el yml)

- `docker-compose exec mysql bash` ( mysql) ==> `mysql -h localhost -U dbName -p` ==>
  `Enter password:`

- `\q` salir de la db
- `exit` salir del contenedor
- ***

# -----> Conección con db <-------

1. Se instala el driver de oficial de node para postgres (node-postgres) `npm i pg` o el de mysl `npm i mysql2` o ambos, tambien se instalan los tipos `npm i @types/pg -D`

1.1 Primera forma ()
1.1.1 Importamos el Cliente de pg en un modulo global(en este caso database.module.ts)
1.1.2 Hacemos una instencia del cliente con los datos (user, host, database, password, port)
1.1.3 Conectamos el cliente ==> `client.connect()`
1.1.4 Seteamos la configuración en el provider => `{ provider: 'NOMBRE_SERVICIO', useValue: cliente }` aquí se puede usar el useValue porque el client es un objeto estático
1.1.6 Exportamos el cliete ==> `exports: [NOMBRE_SERVICIO]`
1.1.5 Ejecutamos cualquier consulta ==> `client.query('')` en cualquera de los services; no sin antes inyectar el nombre del provider al constructor del servicio ej: `constructor (@Inject('NOMBRE:SERVICIO) private nombreServicio: Client)` para este último paso tamdermos en cuenta que el tipado viene de la importación del cliente `import {Client} from 'pg'`
-- hay que tener en cuenta que al hacer un query nativo en el segundo parámetro hay una función de callback que devuelve la respuesta; como en los servicios se requiere un retorno directo, de encapsula la consulta en una promesa nativa
-- Usando la configuración ==> agregamos las variables al .env ==> validamos en el app.module con Joi ==> seteamos las variables en el la carpeta de anvirements (esto tipa las variables) ==> injectamos en database.module usando useFactory (recordar que este permite injección de dependencias y usar codigo ascincrono)

---

# -------> ORM <------------

https://docs.nestjs.com/techniques/database

1. Istalar el paquete mas el driver de bd `npm install --save @nestjs/typeorm typeorm pg` ó `npm install --save @nestjs/typeorm typeorm mysql2`
2. Importamos el module de typeorm al module de database `import { TypeOrmModule } from '@nestjs/typeorm'` y lo colocamos dentro del imports (porque es un modulo) y no dentro de los providers => pasamos (al `useFactory` ) e injectamos (`inject:[config.KEY]`) la configuración => luego se exporta con el nombre del module `exports: [TypermModule]` (el nombre es el que trae el module por defecto, no hay que darle uno) => de la coneccion se encarga el orm

3. Creamos las entyties de forma que lo pueda leer el orm (schemas), cada module debe tener sus schemas
   3.1 decoradores para los elementos de las Schemas
   3.1.1 importamos desde typeorm los decoradores para los elementos
   `@Column(), @Entity(), @PrimaryGeneratedColumn()` https://typeorm.io/entities

4. Importamos las entyties en los modulos que las van a usar y dentro del modulo en sus imports le decimos que typeorm va a administrar las entidade `imports : [TypeOrmModule.forFeature([NombreDeLaEntidad,...])`

5.Elegimos patrones para manejar los modelos
5.1 --> active record (anti-patron de diseño) https://es.wikipedia.org/wiki/Active_record
5.1.1 La interfaz de un cierto objeto debe incluir funciones como por ejemplo insertar (INSERT), actualizar (UPDATE), eliminar (DELETE) y propiedades que correspondan de cierta manera directamente a las columnas de la base de datos asociada.
5.2 --> repository
5.2.1 El patron Repository es uno de los patrones más clásicos en Enterprise Design Pattern. Este patrón hace referencia a como persistir un objeto en una base de datos . Por el ejemplo si disponemos de la clase Factura como podemos persistir esta de forma sencilla . Para ello el patrón de diseño se encarga de agrupar todas las operaciones en una única clase que las gestiona.
https://www.arquitecturajava.com/el-patron-repository-y-la-explosion-de-metodos/
vamos a usar el patron d repository

6. importamos en el servicio injectrepository de typeorm `import {InjectRepository} from '@nestjs/typeorm'`
7. Tipamos con Repository de typeorm `ìmport {Repository} from 'typeorm'`
8. Inyectamos el repositorio en el constructor del servicio ej:
   `constuctor (@InjectRepository (nameEntity) private nameRepo: Repository <nameEntity>)`
9. Utilizamos el repo para hacer operaciones sobre la BD

10. En un principio para que se vayan creando las tablas debemos activar en el modulo de configuración de la base de datos la opción `synchronize : true` y `autoLoadEntities :true`

- ***

# ---> Migraciones <-------

1. se necesita crear una conexioción propia de typeorm
   1.1 se craea el archivo datasouce en y se procede a hacer la configuración
2. configuramos los comandos en el package.json
3. para que la url no quede expuesta en el datasource instalamos dotenv porque congig no es capaz de leer las variables de entorno para las migraciones

4. cambios https://typeorm.io/migrations#how-migrations-work

- ***

# --------> Relaciones <----------

## --> Uno a Uno 1:1

1. desde la entidad que queremos hacer la relación importamos OneToOne y JoinColumn de typeorm y además la otra entidad

2. se crea un atributo con el tipo de la entidad traída

3. se le colocan los decoradores al atributo nuevo (esto estaría en la tabla de users) ej:
   `@OneToOne (() => Customer, (user) => customer.user, { nullable: true})`
   `@JoinColumn`
   `customer: Customer` con esto basta para una relación unidireccional. En esta relación un usuario puede existir sin ser customer

4. para una relación bidireccional en la otra entidad se importan los métodos y la otra entidad; se crea un atributo, se le colocan los mismos decoradores pero a este tambien se le tiene que pasar la referancia de quien resuelve o tiene la referancia (esto estaría en la tabla de customers )
   ej:
   `@OneToOne (() => User, (user) => user.customer)`
   `user: User`
   acá todo customer tiene que ser usuario. esot depende de la lógica.
   El JoinColumn maneja la referencia en la db solo debe ir en el principal.

5. Para que se pueda mandar un customerId al crear el usuario hay que crear el parametro en el userdto.

6. Inyectamos el servicio de customer en userService (para buscar antes de crear( si viene el id))

7. Lo usamos el el controller; para que traiga la relación tenemos que indicarle en el servicio que este listando los usuarios que traiga la relación
   `return this.userRepo.find({ relation: ['customer]})`, se pueden listar lantas relaciones con haya

## --> Uno a Muchos 1:N

1.  Esta relación se hará tomando como referancia las tablas brands y poruducts (un producto tiene una marce, pero una marca tiene varios productos )

2.En esta relación la entidad 'debil' es al que tiene que tener la relación (un producto solo puede tener una marca es el debil), la relación siempre queda en el lado debil y no es necesario el JoinColumn

3.  Agragamos en la tabla de products el import de la entidad Brand y seteamos el nuevo atriburo
    `@ManyToOne(()=>Brand, (brand) => brand.products)`
    `brand: Brand`

4.  Para establecer la relación bidireccional, en la entidad de productos seteamos
    `@OneToMany(() => Product, (product) => product.brand)`
    `products: Product[]` ==> ya que las marcas tienen varios productos

5.  Creamos el atributo en el userDto => brandId => no opcional

6.  Inyectamos el servicio de customer en userService (para buscar antes de crear( si viene el id)) en este caso es obligatorio pro validamos si sí viene para que pasen las pruevas unitarias
7.  lo mimo que 1:1
8.  Para traer la data desde el fuarte es preferible de uno en uno, en brand se usa el método findOne en lugar del findOneBy porque brinda la posibilidad de traer las relaciones con para una brand de in id dado.

## --> Muchos a Muchos N:N

1.  Se manejará la ralación N:N entre productos y categorías
2.  al igual que en la relación anterior se pone un nuevo atributo en ambas entidades, esta vez con un arreglo de la otra y se especifica en que atributo vamona encontrar la relacion
3.  Se coloca el decorador @ManyToMany en ambos lados y el @JoinColumn en uno solo; el lado de join no importa
4.  no olvidar importar la otra entidad
    ej:
    `@ManyToMany(() => Categories, (category) => category.product)`
    `category: Category[];`

---

`@ManyToMany(() => Product, (product) => product.category)`
`@JoinTable()`
`product: Products[]`
El JoinColumn es el que crea la tabla intermedia

5.  Para traer la data relacionada hay varias formas; en esta ocación injectamos directamente el repositorio de categories a products y en la en método de creación con el método `findBy (id: In (data.categoryIds))` que es un arreglo de actegorias podemos crear el producto con una o más. no olvidar crear el item para el arreglo de actegorias en el productDto
    `@IsNotEmpty()`
    `@IsArray()`
    `readOnly categoriesIds: number[]`
6.  Cuando se crea un producto está llegando el producto, la marca de ese producto y los productos que tiene esa marca; para remediar esto cambiamos en el produc.service el uso del brandSerivice que por defecto el metodo que busca trae la relacion y usamos directamente la injección del repo para usar los métodos directos de la entity de brand. (tambien se prodria dejar como estaba y resolver la relaciones como opcioneles)

## ------> Más relaciones <----------

1. Si se necesita tener una tabla intermedia que relacione dos entidades N:N y a parte tener más atributos en ella nos toca crearla desde cero.

2. Para este caso una orden de compra puede tener muchos productos y un producto puede pertenecer a varias ordenes de compra; se podría hacer de la misma forma que la anterio pero en este caso queremos traer cuantos productos hay por cada compra hay, esto necesita una tabla a parte que haga de tabla intermedia entre las dos anteriores y en esta podemos tener más atributos.

3. Establecemos la relación uno a muchos de customers a orders

4. Creamos la entity(tabla) intermedia OrderItems. Para establecer la relación muchos a muchos, desde esta tabla establecemos una ralación uno a muchos con las otras dos.

5. El atributo o item extra se coloca con el decorador `@Column`

6. En la inyaccion de dependescias desde otro modulo se tienen que exponer los servicios que se desean ser consultados desde otra isla(modulo); si se quiere exponer todos los servicios y clases como estan envueltos por TypeOrmModule se tiene que exportar este mismo. Exportar una sola clase en particular como ProductService tambien sirve, pero es más comodo injectar el modulo completo

- ***

# ---------> Paginación <------------

1. Creamos un dto para este fin con limit y offset
2. En la funcion que trae la data masiva ( en este caso los productos) usamos el decorador query y le asignamos un parámetro, luego le pasamos ese parametro al metodo que llama los datos ej:
   `@Query params: FilterProductDto`
   `...return ....find(params)`
   esto es en el controlador
   en los sercicios hay que decirle que recibe parámetros
   `finAll(params: FilterProductDto)` , se cvalidan si vienen, se saca el limit y el offet de la variable y se setea en el find take:limit, skipt: offset

3. Los datos que vienen pro query siempre son stings, el limit y el offset deben transformarse en enteros ==> si seteamos en el main => useGlobalPipes => new validationPipe => transformOptions => `enableImplicitConversion: true` todo lo que venga por query y sea mutable a entero lo pasará

- ***

# -----------> Filtrado <-------------

1. opciones avanzadas de filtado https://typeorm.io/find-options#advanced-options
2. En el mismo dto de paginación adicionamos los atributos para filtrado
3. `@ValidateIf((item) => item.minPrice)` establece una oblogatoriedad respecto a minPrice

4. Seteamos un where dináminco como un objeto vacío para que tenga todas las opciones que vienen por query y lo tipamos con FindptionsWhere esto garantizaque el where tenga los tipos de la entidad.
   ej: `const where: FindOptionsWhere<Products> = {}`

5. en este caso filtramos por un rango de precio pero puede ser por eso y más oopciones a la vez

- ***

# ----------> Indexaciones <------------

1.Se emplea un índice SQL para poder recuperar datos de una base de datos de una manera más rápida. El indexar una tabla o la vista es sin lugar a dudas, una de las mejores opciones de poder mejorar el rendimiento de las consultas y aplicaciones.
Un índice SQL es una tabla de búsqueda rápida para poder encontrar los registros que los usuarios necesitan buscar con mayor frecuencia.

2. Se agrega el decorador `@Index()` sobre el atributo que se quiere que esté indexado

3. Si son varios en una misma tabla se puede agregar el decorador en la parte de arriba de la tabla y pasarle los atributos a indexar por in arreglo (todo esto se hace en una Entity)
   ej :
   `@Entity()`
   `@Index(['atributo1', 'atributo2'])`

- ***

# ----------> Nameing <----------------

1. Hay un patrṕon de buenas practicas con los nombres de las tablas y los atributos par auna base de datos relacional.

2.Para el código se usa camellCase pero para labase de dato no; hay decoradores dependiendo del atributo y las relaciones para corregir los nombres

2.1 Para los nombres de las tables en el decorador entity se le pasa el nombre `@Entity({name: 'products'})`en minuscula y casi siempre al plural.

2.2 Para los atributos poe ejemplo el createdAt se le indica en el createDataColumn

@CreateDateColumn(
{
  `name: 'create_at'`,
  type: 'timestamptz',
  default: () => 'CURRENT_TIMESTAMP'
})
createAt: Date;

2.3 Para las relaciones 1:1 como el que lleva la relación es el que tiene el join, dentro de este agregamos el nombre. Esto para el atributo que se crea

@OneToOne(() => Customer, (customer) => customer.user, { nullable: true })
@JoinColumn(`{name : 'customer_id'`)
customer: Customer;

2.4 Para 1:N La qu elleva la relación es la que tiene el decorador ManyToOne, ahí es donde se nombra el atributo que se crea. En este caso se debe agregar el decorador JoinColumn

@ManyToOne(() => Brands, (brand) => brand.product)
`@JoinColumn({name : 'brand_id'})`
brand: Brands;

2.5 En la relacion de N:N como se crea una tabla automaticamente hay que especificarle desde la entidad que lleva la relación, como la va a crear

así le indicamos como debe crear los nombres:

@ManyToMany(() => Products, (product) => product.category)
  @JoinTable({
    `name: 'categories_products'`, ==> nombre de la tabla que va acrear
    `joinColumn: {`                ==> nombre del atributo de la entidad en donde estoy
      `name: 'categoryId',`
   ` },`
    `inverseJoinColumn: {`         ==> nombre del atributo otra entidad
      `name: 'productId',`
   ` },`                           
  })
  product: Products[];

 3. No hay migración que cambie nombres y deje la data intacta; hay que hacer esto desde el inicio

- ***

# ----------> Serialización <-------------

1.Es transformar la información antes de que el controlador la retorne al servicio. Podemos excluir o agregar información

2. En el main se importa desde @nestjs/common ClassSerializerInterceptor y lo aplicamos de forma global `app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));`
cons esto se puede serializar en cualquier parte de la aplicación;

3. En la entidad seleccionada `import { Exclude } from 'class-transformer';`
4. Si queremos excluir un campo pero no todos podemos usar `@Exclude()` en el atributo y como está hecha la configuración global, no se necesita más

5. Para filtrar la data y reorganizarla en la entity se puede usar un decorador `@Expose()`
y una funcion que filtre. Dentro de las ordenes cuando se trae por id tara un objeto de este tipo:
 {
	"id": 2,
	"createAt": "2024-01-03T03:30:51.442Z",
	"updateAt": "2024-01-03T03:30:51.442Z",
	"items": [
		{
			"id": 7,
			"quantity": 43,
			"products": {
				"id": 2,
				"name": "product 2",
				"description": "asdvasfva",
				"price": 432,
				"stock": 43000,
				"image": "image.com"
			}
		},
  ]
}

vamos a cambiar esto desde la entity

6. exponemos filtramos y sacamos los null o undefine, mapeamos y pasamos la data que requerimos

@Expose()
get products() { // esto es un getter
  if (this.items) {
    return this.items
      .filter((item) => !!item) // item difernte de null & unefine
      .map((item) => ({
        ...item.products,
        quantity: item.quantity,
      }));
    }
    return [];
  }

7. Esto es lo que se optiene (excluyendo el array de items)
  {
    "id": 2,
    "createAt": "2024-01-03T03:30:51.442Z",
    "updateAt": "2024-01-03T03:30:51.442Z",
    "products": [
      {
        "id": 2,
        "name": "product 2",
        "description": "asdvasfva",
        "price": 432,
        "stock": 43000,
        "image": "image.com",
        "createAt": "2024-01-03T03:28:02.475Z",
        "updateAt": "2024-01-03T03:28:02.475Z",
        "quantity": 43
      },
    ]
  }

8. Calculando el total

  @Expose()
  get total() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((total, item) => {
          const totalItem = item.quantity * item.products.price;
          return total + totalItem;
        }, 0);
    }
    return 0;
  }

-
--------------------------------------------------------

# ----------> Solución de referencia circular <----------

Solución 1: entidades en un Global Module

Una de las soluciones es poner todas las entidades de tu proyecto en el DatabaseModule de manera global haciendo que cada uno de los demás módulos pueda usar estas entidades sin tener problemas de referencia circular.

Solución 2:  Referencia directa

Una de las formas que tiene NestJS para resolver la referencia circular es tener una referencia directa por ejemplo, si AService y BService dependen el uno del otro, ambos lados de la relación pueden usar @Inject () y la utilidad forwardRef () para resolver la dependencia circular, ejemplo:

```
@Injectable()
export class AService {
  constructor(
    @Inject(forwardRef(() => BService ))
    private service: BService ,
  ) {}
}
```
De la misma manera en el otro servicio.

```
@Injectable()
export class BService {
  constructor(
    @Inject(forwardRef(() => AService ))
    private service: AService ,
  ) {}
}
```
También puedes aplicar lo mismo entre módulos

```
@Module({
  imports: [forwardRef(() => AModule)],
})
export class BModule{}

```
```
@Module({
  imports: [forwardRef(() => BModule)],
})
export class AModule{}

```
-
---------------------------------------------------------

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

# ----> Hashing de contraseñas en TypeORM <----
1. instalamos bcript
2. instalamos los tipos `npmi i @types/bcrypt`
3. importamos en el servicio => en el endpoind que guarda el password le aplicamos el hashing => `const hasPassword = await bcypt.has(user.password, 10)` => asignamos al password antes de salvar
4. Excluimos el dato de los valores retornados => hay dos formas => Pasandole los valores  que queremos retornar en un select dentro de las condiciones del servicio
 ```sh 
 const user = await this.userRepo.findOne({
      where: { id },
      select: ['id', 'email', 'password', 'role'],
    });
```
ó excluyendo el dato en la entity `@Exclude()` (en mejor forma)

# ------> Autenticación con Passport.js <------

https://docs.nestjs.com/security/authentication  <!--TODO Hacer la demo de la doc -->

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
# -----> Conectando Passport con JWT <---------
https://docs.nestjs.com/security/authentication#jwt-token  <!--TODO Hacer la demo de la doc -->
1. inatalamos Jwt `npm install --save @nestjs/jwt passport-jwt` 
 `npm install --save-dev @types/passport-jwt`
2. En el auth servicie hacer que cuando se hace login genere un token
 2.1 => inyectamos JwtService => metodo para generar el token

 ```sh
  generateJwt(user: User) {
    const payload = { role: user.role, sub: user.password }; > sub es el atributo particular
    return {
      access_token: this.jwtService.sign(payload), > sing es la firma
      user,
    };
  }
 ```
 3. Como buena practica tipamos el payload => creamos una carpeta models => creamos el dto del payload
 4. Importamos el JwtModule al authModule => lo configuramos para recibir el secreto
  ```sh
    imports: [
    JwtModule.register({
      secret: ' El secreto',
      signOptions: {
        expiresIn: '10d',  
      },
    }),
    ]
   ```
5. lo usamos en el método que trae el usuario validado (si pasó lea signa el token) en AuthController

# --------->Implementando JWT Guard <----------
1. Vamos a hacer un strategy que verifique en los demás endpoints si el token es valido o no para permitir el acceso interceptandolos con un guardian

```sh
 @Injectable()
  export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
    constructor(
      @Inject(config.KEY) private configService: ConfigType<typeof config>, // así se inyecta directamente con variables de entorno
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // tipo de tokrn
        ignoreExpiration: false, // si está expirado no pasa
        secretOrKey: configService.jtwKey, // el secreto para desencriptar
      });
    }

    validate(payload: PayloadToken) {
      // expone el role y el sub para usar
      return payload;
    }
  }

```
2. Creamos el guardian para recibir los heders o usar la estrategia anterior directamente sobre las rutas con @UseGuards `@UseGuards(AuthGuard('jwt'))` => si se coloca encima del cotrolador, cubre todas las rutas => aplicado en products

3. Guardian para que no oculte todas las rutas de un controlador.
 3.1 creamos el guardian `nest g gu auth/guards/jwt-auth --flat `
 3.2 quitamon la implemntación que trae por defecto y extendemos de nuestro guardian `AuthGuard('jwt')`
 3.3 Importamos reflector para leer la metadata => lo inyectamos al constructor
 3.4 Implementamos el canActivate y le pasamos la data que tre el decorador customizado isPublic ( este lo hicimos) => usado Producs y reemplazando el anterior.

---------------------------------------------------------------------- TODO
Para obtener el token de los heders // NO PROBADO
  constructor(
    @Inject(config.KEY)
    privatereadonly configService: ConfigType<typeof config>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'), // 🗨️ Donde dice [token] puedes poner el nombre del header que quieres obtener
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }
---------------------------------------------------------------------------- 

# -------> Control de roles en NestJS <--------
1. Definimos los roles en un documento aparte => auth/models
2. Creamos un decorador para los roles
3. Dentro del decorador importamos el modelo de roles para tiparlos y se los pasamos como parametros 
4. Creamos un guardian para que recoja la metadata 
5. Pasamos el guardian, Roles y Role al controlador, se pueden pasar más de un guardian...
6. Aplicamos el decorador @Roles(Role.ADMIN) por ejemplo encima de los endpoints que se quieren solo para el admin