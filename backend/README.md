# Sistema de Pagos Universidad de La Salle

## Descripción General
Este sistema permite gestionar los pagos realizados por los estudiantes de la Universidad de La Salle. La aplicación está construida con Spring Boot y proporciona una API RESTful que permite realizar diversas operaciones relacionadas con estudiantes y sus pagos.

## Funcionalidades Principales

### 1. Gestión de Estudiantes
- **Consulta de Estudiantes**
  - Listar todos los estudiantes registrados
  - Buscar estudiante por código
  - Filtrar estudiantes por programa académico
- **Información del Estudiante**
  - Código único
  - Nombre y apellido
  - Programa académico
  - Foto del estudiante

### 2. Gestión de Pagos
- **Registro de Pagos**
  - Subir comprobante de pago en formato PDF
  - Registrar monto del pago
  - Seleccionar tipo de pago
  - Asociar pago con estudiante
  - Fecha de realización

- **Tipos de Pago Disponibles**
  - Crédito
  - Débito
  - Depósito
  - Transferencia
  - Efectivo

- **Estados de Pago**
  - CREADO: Estado inicial al registrar un pago
  - VALIDADO: Cuando el pago ha sido verificado y aprobado
  - RECHAZADO: Cuando el pago no cumple con los requisitos o tiene alguna inconsistencia

### 3. Consultas y Filtros
- Visualizar todos los pagos registrados
- Filtrar pagos por estudiante
- Filtrar pagos por estado (Creado/Validado/Rechazado)
- Filtrar pagos por tipo (Crédito/Débito/Depósito/etc.)
- Descargar comprobantes de pago

## Endpoints Disponibles (Swagger UI)

### Endpoints de Estudiantes
```
GET /estudiantes
- Descripción: Obtiene la lista completa de estudiantes
- Respuesta: Lista de estudiantes con sus datos básicos

GET /estudiantes/{codigo}
- Descripción: Busca un estudiante específico por su código
- Parámetro: código del estudiante
- Respuesta: Datos completos del estudiante

GET /estudiantesPorPrograma
- Descripción: Filtra estudiantes por programa académico
- Parámetro: ID del programa
- Respuesta: Lista de estudiantes del programa especificado
```

### Endpoints de Pagos
```
GET /pagos
- Descripción: Lista todos los pagos registrados
- Respuesta: Lista completa de pagos con sus detalles

POST /pagos
- Descripción: Registra un nuevo pago
- Parámetros: 
  * file: Archivo PDF del comprobante
  * cantidad: Monto del pago
  * type: Tipo de pago
  * date: Fecha del pago
  * codigoEstudiante: Código del estudiante
- Respuesta: Detalles del pago registrado

GET /Estudiantes/{codigo}/pagos
- Descripción: Lista los pagos de un estudiante específico
- Parámetro: código del estudiante
- Respuesta: Lista de pagos asociados al estudiante

GET /pagosPorStatus
- Descripción: Filtra pagos por estado
- Parámetro: status (CREADO/VALIDADO/RECHAZADO)
- Respuesta: Lista de pagos en el estado especificado

GET /pagosPorTipo
- Descripción: Filtra pagos por tipo
- Parámetro: type (CREDITO/DEBITO/DEPOSITO/etc.)
- Respuesta: Lista de pagos del tipo especificado

POST /pagos/{id}/status
- Descripción: Actualiza el estado de un pago
- Parámetros: 
  * id: Identificador del pago
  * status: Nuevo estado
- Respuesta: Pago actualizado con su nuevo estado

GET /pagoFile/{pagoId}
- Descripción: Descarga el comprobante de un pago
- Parámetro: ID del pago
- Respuesta: Archivo PDF del comprobante
```

## Estructura del Sistema

### Entidades Principales
1. **Estudiante**
   - Almacena información básica del estudiante
   - Identificador único
   - Datos personales y académicos

2. **Pago**
   - Registro de transacciones
   - Relación Many-to-One con Estudiante
   - Almacena detalles del pago y estado actual

### Flujo de Trabajo
1. El estudiante realiza un pago y obtiene un comprobante
2. Se registra el pago en el sistema a través del endpoint POST /pagos
3. El pago queda en estado CREADO
4. El personal administrativo revisa el pago
5. Se actualiza el estado del pago a VALIDADO o RECHAZADO según la revisión
6. El sistema mantiene un registro histórico de todos los pagos

### Seguridad y Validaciones
- Validación de formatos de archivo (PDF)
- Verificación de existencia del estudiante
- Control de estados de pago
- Cross-Origin Resource Sharing (CORS) habilitado

## Acceso a la Documentación
La documentación detallada de la API está disponible en:
```
http://localhost:8081/swagger-ui/index.html
```
Aquí podrás probar todos los endpoints y ver los esquemas de datos utilizados.

## Instrucciones de Inicio
1. Asegúrate de que no haya ninguna aplicación usando el puerto 8081
2. Inicia la aplicación con el comando: `.\mvnw spring-boot:run`
3. Accede a Swagger UI en http://localhost:8081/swagger-ui/index.html
4. También puedes acceder a la consola de H2 en http://localhost:8081/h2-console
   - URL JDBC: jdbc:h2:mem:pagosdb
   - Usuario: sa
   - Contraseña: (dejar en blanco)