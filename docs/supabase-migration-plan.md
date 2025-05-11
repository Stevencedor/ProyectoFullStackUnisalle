# Plan de Migración a Supabase

## 1. Configuración de Supabase

### 1.1 Crear proyecto en Supabase
1. Ir a [Supabase](https://supabase.com)
2. Registrarse y crear una cuenta gratuita
3. Crear un nuevo proyecto:
   - Nombre del proyecto: "sistema-pagos-unisalle"
   - Base de datos: Generar contraseña segura: dbUnisalle1905*
   - Región: Seleccionar la más cercana a Colombia: Brazil
   - Pricing Plan: Free tier

### 1.2 Configuración inicial
1. Guardar las credenciales de conexión:
   - Host
   - Database name
   - Port
   - User: 
   - Password: 
   - Project URL
   - anon/public API key

## 2. Modificaciones en el Proyecto

### 2.1 Actualizar pom.xml
```xml
<!-- Remover dependencia H2 -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Agregar dependencia PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2.2 Actualizar application.properties
```properties
# Comentar configuración H2
#spring.datasource.url=jdbc:h2:mem:pagosdb
#spring.datasource.username=sa
#spring.datasource.password=1234
#spring.datasource.driverClassName=org.h2.Driver
#spring.h2.console.enabled=true
#spring.h2.console.path=/h2-console

# Configuración Supabase PostgreSQL
spring.datasource.url=jdbc:postgresql://${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DATABASE}
spring.datasource.username=${SUPABASE_USER}
spring.datasource.password=${SUPABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=true

# Pool de conexiones
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
```

## 3. Migración de Datos

### 3.1 Preparar datos actuales
1. Acceder a la consola H2 (http://localhost:8081/h2-console)
2. Exportar datos de las tablas:
   - estudiante
   - pago

### 3.2 Migrar a Supabase
1. Usar el SQL Editor de Supabase para:
   - Verificar estructura de tablas
   - Importar datos usando scripts INSERT
2. Verificar las secuencias (IDs) estén correctamente configuradas

## 4. Seguridad y Políticas de Acceso

### 4.1 Configurar Políticas RLS
```sql
-- Ejemplo de política para la tabla pago
ALTER TABLE pago ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso público a pagos" ON pago
  FOR SELECT USING (true);

CREATE POLICY "Solo administradores pueden modificar" ON pago
  FOR ALL USING (auth.role() = 'admin');
```

### 4.2 Configurar Variables de Entorno
1. Crear archivo .env en la raíz del proyecto:
```
SUPABASE_HOST=db.xxxxxxxxxxxxx.supabase.co
SUPABASE_PORT=5432
SUPABASE_DATABASE=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=tu-password
```

2. Actualizar .gitignore:
```
.env
```

## 5. Verificación y Pruebas

### 5.1 Pruebas Locales
1. Ejecutar la aplicación con la nueva configuración
2. Verificar operaciones CRUD
3. Probar transacciones y concurrencia

### 5.2 Monitoreo
1. Usar el Dashboard de Supabase para:
   - Monitorear consultas
   - Verificar uso de almacenamiento
   - Revisar métricas de rendimiento

## 6. Ventajas de Supabase

1. **Panel de Administración**
   - Interface gráfica para gestionar datos
   - SQL Editor integrado
   - Visor de tablas intuitivo

2. **Funcionalidades Adicionales**
   - Autenticación lista para usar
   - API REST automática
   - Backups automáticos
   - Soporte para tiempo real

3. **Escalabilidad**
   - 500MB de almacenamiento gratuito
   - Hasta 50MB de almacenamiento de archivos
   - 50,000 filas en base de datos
   - Respaldos semanales

## 7. Plan de Contingencia

1. **Backups**
   - Configurar respaldos automáticos en Supabase
   - Mantener copia local periódica

2. **Monitoreo**
   - Revisar cuotas de uso
   - Monitorear rendimiento
   - Alertas de límites de uso

3. **Plan de Escalamiento**
   - Documentar proceso de upgrade a plan Pro
   - Mantener métricas de crecimiento