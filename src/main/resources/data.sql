-- Insertar estudiantes de prueba
INSERT INTO estudiante (id, nombre, apellido, codigo, programa_id, foto)
VALUES
(1, 'Juan', 'Pérez', '20201001', 'ING001', 'foto1.jpg'),
(2, 'María', 'González', '20201002', 'ING001', 'foto2.jpg'),
(3, 'Carlos', 'Rodríguez', '20201003', 'ING002', 'foto3.jpg');

-- Insertar algunos pagos de prueba (usando valores numéricos para los enums)
INSERT INTO pago (fecha, cantidad, tipo_pago, status, file, estudiante_id)
VALUES
('2025-04-22', 1500000, 0, 1, 'pago1.pdf', 1),  -- CREDITO, VALIDADO
('2025-04-22', 2000000, 3, 0, 'pago2.pdf', 2),  -- TRANSFERENCIA, CREADO
('2025-04-22', 1800000, 1, 1, 'pago3.pdf', 3);  -- DEBITO, VALIDADO