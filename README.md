# IBM-i-WEB-CONSULTA-SQL
Ejemplo sencillo de Servicio Web en Node.js y aplicación JavaScript sobre Express usando datos de IBM i

1º Creamos una Carpeta: "IBM i Web Consulta SQL"
2º Creamos dentro otra Carpeta: "Servicio Web Consulta SQL"
3º Nos cambiamos a esa carpeta e inicializamos aplicación Node.js:

PS C:\DESARROLLO\IBM i WEB CONSULTA SQL> cd '.\Servicio Web Consulta SQL\'
PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\Servicio Web Consulta SQL> npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (servicio-web-consulta-sql)
version: (1.0.0)
description: Servicio Web que lanza consulta SQL a IBM i
entry point: (index.js)
test command:
git repository:
keywords:
author: Juan Carlos Morán
license: (ISC)
About to write to C:\DESARROLLO\IBM i WEB CONSULTA SQL\Servicio Web Consulta SQL\package.json:

{
  "name": "servicio-web-consulta-sql",
  "version": "1.0.0",
  "description": "Servicio Web que lanza consulta SQL a IBM i",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Juan Carlos Morán",
  "license": "ISC"
}


Is this OK? (yes)
PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\Servicio Web Consulta SQL>

4º Añadimos los packages de ODBC y RESTIFY para que los ueda usar nuestro Servicio Web: npm install odbc restify --save

PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\Servicio Web Consulta SQL> npm install odbc restify --save
npm WARN deprecated formidable@1.2.6: Please upgrade to latest, formidable@v2 or formidable@v3! Check these notes: https://bit.ly/2ZEqIau

added 168 packages, and audited 169 packages in 17s

17 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

El resultado final: añade los módulos necesarios en la Carpeta "node_modules" y modifica "package.json":

{
  "name": "servicio-web-consulta-sql",
  "version": "1.0.0",
  "description": "Servicio Web que lanza consulta SQL a IBM i",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Juan Carlos Morán",
  "license": "ISC",
  "dependencies": {
    "odbc": "^2.4.8",
    "restify": "^11.1.0"
  }
}

5º Creamos un archivo "servicio-web-SQL-IBMi.js":
```javascript
const restify = require("restify");
const odbc = require("odbc");
const server = restify.createServer();
let _connection;

//Deshabilitamos CORS
server.use(function crossOrigin(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

//Definimos una operación de consulta que usa GET y devuelve el contenido de una sentencia SQL
server.get("/tabla/", async function (req, res) {
  const result = await _connection.query(
    //'SELECT * FROM QIWS.QCUSTCDT'
    //'SELECT CUSNUM AS "ID de Cliente", LSTNAM AS "Apellido", INIT AS "Inicial", STREET AS "Calle", CITY AS "Ciudad", STATE AS "Estado", ZIPCOD AS "Código Postal", CDTLMT AS "Límite de Crédito", CHGCOD AS "Código de Cambio", BALDUE AS "Préstamos" , CDTDUE AS "Crédito Vencido" FROM QIWS.QCUSTCDT'
    'SELECT EMPNO AS "Nº Empleado", FIRSTNME AS "Nombre", MIDINIT AS "Inicial", LASTNAME AS "Apellido", WORKDEPT AS "Departamento", PHONENO AS "Teléfono", HIREDATE AS "Fecha Contrato", JOB AS "Cargo", EDLEVEL AS "Planta", SEX AS "Género", BIRTHDATE AS "Fecha de Nacimiento", SALARY AS "Salario", BONUS AS "Bono", COMM AS "Comisión" FROM SAMPLE.EMPLOYEE'
    //'SELECT SALES_DATE AS "Fecha de Venta", SALES_PERSON AS "Comercial", REGION AS "Región", SALES AS "Ventas" FROM SAMPLE.SALES'
  );
  if (result.length === 0) {
    res.send("No hay DATOS");
  } else {
    res.send(result);
  }
});

//Conexión ODBC con nuestra Base de Datos
odbc.connect(
  // Desplegando en el PC, utilizamos una conexión ODBC definida previamente en nuestro Windows.
  //"DSN=SAYTEL40;UID=JCMORAN;PWD=SAYTEL",
  //Si desplegamos en IBM i:
  "DSN=*LOCAL;UID=JCMORAN;PWD=SAYTEL",
  function (error, connection) {
    if (error) {
      console.error(`No hemos podido conectar con la Base de Datos: ${error}`);
      process.abort();
    }
    _connection = connection;
    server.listen(8033, async function () {
      console.log("%s escuchando en %s", server.name, server.url);
    });
  }
);

6º Arrancamos el Servicio web: node servicio-web-SQL-IBMi.js
PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\Servicio Web Consulta SQL> node .\servicio-web-SQL-IBMi.js
(node:23276) [DEP0111] DeprecationWarning: Access to process.binding('http_parser') is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
restify escuchando en http://[::]:8033
```
7º Probamos en el Navegador. Como es un GET no necesitamso más: http://localhost:8033/consulta/

[{"Nº Empleado":"000010","Nombre":"CHRISTINE","Inicial":"I","Apellido":"HAAS","Departamento":"A00","Teléfono":"3978","Fecha Contrato":"1965-01-01","Cargo":"PRES    ","Planta":18,"Género":"F","Fecha de Nacimiento":"1933-08-24","Salario":52750,"Bono":1000,"Comisión":4220},{"Nº Empleado":"000020","Nombre":"MICHAEL","Inicial":"L","Apellido":"THOMPSON","Departamento":"B01","Teléfono":"3476","Fecha Contrato":"1973-10-10","Cargo":"MANAGER ","Planta":18,"Género":"M","Fecha de Nacimiento":"1948-02-02","Salario":41250,"Bono":800,"Comisión":3300},...,{"Nº Empleado":"200340","Nombre":"ROY","Inicial":"R","Apellido":"ALONZO","Departamento":"E21","Teléfono":"5698","Fecha Contrato":"1947-05-05","Cargo":"FIELDREP","Planta":16,"Género":"M","Fecha de Nacimiento":"1926-05-17","Salario":23840,"Bono":500,"Comisión":1907}]

8º Ahora creamos una palicación Web que muestre los resultado en forma de Tabla. Usamos para ello Vue.js como Framework JavaScript, Vuetify como biblioteca de componentes gráficos y axios como vehículo de llamada al Servicio Web.
Para ello nos posicionamos en el directorio raiz y creamos una aplicación Vue.js. (Utilizamos --no-git porque no queremos que nos cree un repositorio local Git):

PS C:\DESARROLLO\IBM i WEB CONSULTA SQL> vue create web-app-tabla-consulta --no-git


? Please pick a preset: Default ([Vue 2] babel, eslint)


Vue CLI v5.0.8
✨  Creating project in C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta.
⚙️  Installing CLI plugins. This might take a while...


added 866 packages, and audited 867 packages in 53s

97 packages are looking for funding
  run `npm fund` for details       

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
🚀  Invoking generators...
📦  Installing additional dependencies...


added 94 packages, and audited 961 packages in 8s

109 packages are looking for funding
  run `npm fund` for details

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project web-app-tabla-consulta.
👉  Get started with the following commands:

 $ cd web-app-tabla-consulta
 $ npm run serve

8º Podemos probar la alicación para ver cómo se ve:
PS C:\DESARROLLO\IBM i WEB CONSULTA SQL> cd .\web-app-tabla-consulta\
PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta> npm run serve

  App running at:
  - Local:   http://localhost:8080/
  - Network: http://10.128.138.81:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

9º Añadimos soporte de Vuetify a nuestra aplicación: vue add vuetify



To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
✔  Successfully installed plugin: vue-cli-plugin-vuetify

? Choose a preset: (Use arrow keys)
  Vuetify 2 - Configure Vue CLI (advanced)
> Vuetify 2 - Vue CLI (recommended)
  Vuetify 2 - Prototype (rapid development)
  Vuetify 3 - Vite (preview)
  Vuetify 3 - Vue CLI (preview)

? Choose a preset: Vuetify 2 - Vue CLI (recommended)

🚀  Invoking generator for vue-cli-plugin-vuetify...
📦  Installing additional dependencies...


added 15 packages, and audited 986 packages in 7s

113 packages are looking for funding
  run `npm fund` for details

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
⚓  Running completion hooks...

✔  Successfully invoked generator for plugin: vue-cli-plugin-vuetify
 vuetify  Discord community: https://community.vuetifyjs.com
 vuetify  Github: https://github.com/vuetifyjs/vuetify
 vuetify  Support Vuetify: https://github.com/sponsors/johnleider

9º Añadimos Axios a nuestra aplicación: vue add axios:


PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta> vue add axios

📦  Installing vue-cli-plugin-axios...


added 1 package, and audited 987 packages in 4s

113 packages are looking for funding
  run `npm fund` for details

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
✔  Successfully installed plugin: vue-cli-plugin-axios


🚀  Invoking generator for vue-cli-plugin-axios...
📦  Installing additional dependencies...


added 5 packages, and audited 992 packages in 3s

114 packages are looking for funding
  run `npm fund` for details

6 vulnerabilities (4 moderate, 2 high)

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
⠋  Running completion hooks...
C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta\src\plugins\axios.js
  42:32  error  'options' is defined but never used  no-unused-vars

✖ 1 problem (1 error, 0 warnings)

Para solucionar el error, editamos "package.json" y añadimos dentro de "eslintconfig" en el apartado rules: {}:

"rules": {
  "no-console": "off",
  "no-unused-vars": "off"
}

Si ahora repetimos la carga con vue add axios ya no veremos ningún error

10º dentro de ./src/App.vue vemos que muestra el componente HelloWorld
    ...
    <v-main>
      <HelloWorld/>
    </v-main>
    ...
Modificaremos este componente para quemuestre nuestra el resultado de nuestra Consulta en fomra de Tabla.

11º Borramos el contenido ./src/components/HelloWorld.vue y lo sustituimos por esto:
```vue
<template>
  <v-container>
    <v-data-table
      :headers="cabeceras"
      :items="registros"
      :items-per-page="10"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      cabeceras: [],
      info: [],
      propiedades: [],
    };
  },
  computed: {
    encabezado() {
      return this.cabeceras;
    },
  },
  mounted() {
    //Elegimos la dirección IP del Servidor IBM i (en mi caso 172.16.210.40)
    //axios.get("http://localhost:8033/tabla/").then((response) => {
    axios.get("http://localhost:8033/consulta/").then((response) => {
      this.registros = response.data;
      this.propiedades = Object.keys(response.data[0]);
      let miarray = [];
      this.propiedades.forEach(function (elemento, indice, array) {
        miarray.push({ text: elemento, value: elemento });
      });
      this.cabeceras = miarray;
    });
  },
};
</script>
``` 
12º Cuidemos la Estética. Podemos cambiar el Logotipo y el enlace de la parte superior. Todo ello se realiza en ./src/App.vue

13º Desplegamos en IBM i: cambiamos parámetros de mi PC por los de mi IBM i
Modificameos el Servicio Web para que utilice los parámetros de IBM i : *LOCALHOST
Modificamos las llamadas al servicio web: cambiamos Localhost por la dirección IP de nuestro IBM i

14º Construimos nuestra aplicación web: npm run build

PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta>npm run build

> web-app-tabla-consulta@0.1.0 build
> vue-cli-service build

All browser targets in the browserslist configuration have supported ES module.
 WARNING  Compiled with 3 warnings                                                              11:20:01     

 warning  

asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets: 
  css/chunk-vendors.bfb07987.css (380 KiB)
  js/chunk-vendors.6d38068b.js (281 KiB)

 warning  

entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  app (665 KiB)
      css/chunk-vendors.bfb07987.css
      js/chunk-vendors.6d38068b.js
      js/app.1133304c.js


 warning

webpack performance recommendations:
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/

  File                                   Size                          Gzipped

  dist\js\chunk-vendors.6d38068b.js      281.10 KiB                    84.82 KiB
  dist\js\app.1133304c.js                3.81 KiB                      1.81 KiB
  dist\css\chunk-vendors.bfb07987.css    380.09 KiB                    45.18 KiB

  Images and other types of assets omitted.
  Build at: 2023-10-17T09:20:01.983Z - Hash: 8951a2022c7320a6 - Time: 33468ms

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html

PS C:\DESARROLLO\IBM i WEB CONSULTA SQL\web-app-tabla-consulta>

Nuestra aplicación se posiciona en un directorio ./dist.

15º Creamos un Servidor Web para servir nuestra aplicación. Usamos Express. Para ello creamos otro directorio que cuelgue del raiz "express-web-server". Hacemos un npm init dentro del directorio, añadimos express (npm install express) y creamos un archivo "servidor-express.js" con el contenido siguiente:

var express = require("express");
var path = require("path");
var serveStatic = require("serve-static");
app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
var hostname = "127.0.0.1";

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

16º Copiamos la Carpeta ./dist de nuestra aplicación web al directorio de nuestro servidor web express

17ª Nos lo llevamos al IBM i
- Creamos una Carpeta "IBM i WEB CONSULTA SQL"
- Dentro de esta carpeta nos creamos otras 2: "servicio-web-sql-ibmi" y "servidor-web-express"
- Dentro de "servicio-web-sql-ibmi" copiamos los archivos del servicio web menos ./node_modules
- Dentro de "servidor-web-express" copiamos los archivos del servicio web menos ./node_modules

18º Abrimos una sesión SSH en nuestro IBM i, nos posicionamos en cada directorio y ejecutamos en ambos "npm install".
Esto hace que se carguen los módulos necesarios que no copiamos antes.

19ª Instalamos pm2
20º Añadimos el Path para que encuentre pm2
-bash-5.1$ node -v
v14.19.1
-bash-5.1$CD PATH=/QOpenSys/pkgs/lib/nodejs14/bin:$PATH

20º Arrancamos el servicio web desde su Carpeta: pm2 start servicio-web-SQL-IBMi.js --watch --> Si se modifica lo rearranca
21º Arrancamos el servidor web apache desde su Carpeta: pm2 start servidor-express.js 

22º Comprbamos que aparece ambos servicios arrancados: pm2 ls

23º Arrancamos un navegador y comprobamos que funciona: http://172.16.210.40:8099/ 
Usamos la dirección IP y el puerto que usamo en "servidor-express.js"

24º Podemos editar el servicio web (con nano, por ejemplo) y modificar la sentencia SQL






