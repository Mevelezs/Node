https://docs.nestjs.com


# -----> Documentación con swageer <--------

pasos ==> Documentación nestjs openapi

1. Instalar el paquete de npm: `npm install --save @nestjs/swagger`
2. Copiar en el main.ts la configuración de la documentación antes del listen.
3. Editar e importar las dependencias
3. El enpoint donde va a salir toda la documentación es este`SwaggerModule.setup('api', app, document);`,(en la parte donde dice 'api') lo modificamos por 'docs' y quedaría en /docs
3. Configuración para que aparezcan los dtos
4. En la documentación en la parte de POENAPI => CLI plugin => Using the CLI plugin vemos que hay que configurar el archivo nest-cli.json agreandole precisamente el plugin de swager
 ` "compilerOptions": {
    "plugins": ["@nestjs/swagger"]
  }
`  
5. Cambiar las importaciones de los partialTypes `import { PartialType } from '@nestjs/mapped-types';` que estan en los dtos por `import { PartialType } from '@nestjs/swagger';`,
esto para que no tenga problemas para documentar los Updates que extienden de los Create

6. Agerganso mas detalles a los atributos => importamos ApiProperty de @nestjs/swagger y lo usamos como decorador en el atriduto ej: `@ApiProperty({ description: 'this atribute is an email of user' })` muchas vaces innecesario...

7. Agrupar los enpoins por categoría ==> importtamos ApiTags en cada Controlador y lo usamos como decorador pasandole el nombre del controlador ej: `@ApiProperty({ description: 'this atribute is an email of user' })`

8. Se puede agregar una descripción a acada endpoin con el decorador `@ApiOperation({summary : 'aqeí va la descripción'})`, importado igual que ApiTags

alternativa para deploy con render https://www.youtube.com/watch?v=bZlP1C9q14E&t=1272s

-- deshabilitar las cors ==> en el main.ts antes del listen colocar `app.enableCors()`
-
--------------------------------------------

# ---> Tips para clonación <---

- git clone [url] [nombreCarpeta]
- cd nombreCarpeta
- npm i
- code . (abrir carpeta en vscode)
- git remote -v (muestra las ramas remotas a las que es ligado el repo)
- git remote rm origin (si se quiere desligar del original)
- git remote add origin [nuevaUrl] (nuevaUrl => mi repo de gutHub)
-
--------------------------------------------

---> Docker <---

- instalar docker y docker compose
- crear un archivo llamado docker-compose.yml en la raiz del proyecto
- agregar lo siguiente en el docker-compose.yml
- correr `docker-compose up` para levantar el contenedor & `docker-compose up -d pgAdmin`

- `docker ps`
`docker inspect 'dbName'` para mirar las propiedades de la db y sacar el id para el pdAdmin

- `docker-compose exec postgres bash`  (postgres =>> es el nombre que se le pone al servicio en el yml (en este caso se llama "postgres_nest"))
`root@bb993ed98bca:-- > psql -h localhost -d nombredb -U userName` para abrir la db en la terminal (el userNeme es el que se pone en el yml)

- `docker-compose exec mysql bash` ( mysql) ==> `mysql -h localhost -U dbName -p` ==> 
 `Enter password:`

- `\q` salir de la db
- `exit` salir del contenedor
-
-------------------------------------------

# ---> Conección con db <----

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
------------------------------------------------

# ---> ORM <------------
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
-
-----------------------------------------------------

# ---> Migraciones <-------
1. se necesita crear una conexioción propia de typeorm 
 1.1 se craea el archivo datasouce en y se procede a hacer la configuración
2. configuramos los comandos en el package.json
3. para que la url no quede expuesta en el datasource instalamos dotenv porque congig no es  capaz de leer las variables de entorno para las migraciones 

4. cambios https://typeorm.io/migrations#how-migrations-work
-
------------------------------------------------------


# --------> Relaciones <----------

## --> Uno a Uno 1:1
  1. desde la entidad que queremos hacer la relación importamos OneToOne y JoinColumn de typeorm y además la otra entidad

  2. se crea un atributo con el tipo de la entidad traída

  3. se le colocan los decoradores al atributo nuevo (esto estaría en la tabla de users)  ej: 
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
 1. Esta relación se hará tomando como referancia las tablas brands y poruducts (un producto tiene una marce, pero una marca tiene varios productos )

 2.En esta relación la entidad 'debil' es al que tiene que tener la relación (un producto solo puede tener una marca es el debil), la relación siempre queda en el lado debil y no es necesario el JoinColumn

 3. Agragamos en la tabla de products el import de la entidad Brand y seteamos el nuevo atriburo
 `@ManyToOne(()=>Brand, (brand) => brand.products)`
 `brand: Brand`

 4. Para establecer la relación bidireccional, en la entidad de productos seteamos
 `@OneToMany(() => Product, (product) => product.brand)`
 `products: Product[]` ==> ya que las marcas tienen varios productos

 5. Creamos el atributo en el userDto => brandId => no opcional

 6. Inyectamos el servicio de customer en userService (para buscar antes de crear( si viene el id)) en este caso es obligatorio pro validamos si sí viene para que pasen las pruevas unitarias
 7. lo mimo que 1:1
 8. Para traer la data desde el fuarte es preferible de uno en uno, en brand se usa el método findOne en lugar del findOneBy porque brinda la posibilidad de traer las relaciones con para una brand de in id dado.
 
 ## --> Muchos a Muchos N:N