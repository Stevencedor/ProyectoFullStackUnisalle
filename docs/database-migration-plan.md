# Plan de Migración a PostgreSQL

## 1. Requisitos Previos

### 1.1 Instalación de PostgreSQL
1. Descargar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Instalar PostgreSQL con las siguientes configuraciones:
   - Puerto: 5432 (por defecto)
   - Password para usuario postgres: (definir una contraseña segura)
   - Locale: es_ES o según preferencia

### 1.2 Crear Base de Datos
```sql
CREATE DATABASE pagosdb;
CREATE USER pagosapp WITH ENCRYPTED PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE pagosdb TO pagosapp;
```

## 2. Cambios en el Proyecto

### 2.1 Modificaciones en pom.xml
```xml
<!-- Remover dependencia H2 -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2.2 Actualizar application.properties
```properties
# Configuración PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/pagosdb
spring.datasource.username=pagosapp
spring.datasource.password=tu_contraseña
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## 3. Migración de Datos

### 3.1 Backup de Datos Actuales
1. Exportar datos actuales de H2 usando la consola H2
2. Guardar scripts SQL de datos importantes

### 3.2 Verificación
1. Ejecutar la aplicación con la nueva configuración
2. Verificar que las tablas se crean correctamente
3. Importar datos desde el backup

## 4. Optimización

### 4.1 Índices Recomendados
```sql
-- Índice para búsquedas por fecha en pagos
CREATE INDEX idx_pago_fecha ON pago(fecha);

-- Índice para búsquedas por estudiante
CREATE INDEX idx_pago_estudiante ON pago(estudiante_id);
```

### 4.2 Pool de Conexiones
```properties
# HikariCP settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
```

## 5. Respaldos

### 5.1 Script de Backup
```bash
pg_dump -U pagosapp -d pagosdb > backup_$(date +%Y%m%d).sql
```

### 5.2 Programar Respaldos
1. Crear tarea programada para ejecutar el script de backup
2. Configurar retención de respaldos (últimos 30 días)

## 6. Monitoreo
- Utilizar pgAdmin 4 para monitoreo básico
- Configurar logs de PostgreSQL para queries lentos
- Monitorear el uso de conexiones y espacio en disco

## 7. Rollback Plan
1. Mantener la configuración H2 como fallback
2. Guardar backup completo antes de la migración
3. Documentar pasos para revertir cambios si es necesario