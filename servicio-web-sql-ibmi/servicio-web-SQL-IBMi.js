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
server.get("/consulta/", async function (req, res) {
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
