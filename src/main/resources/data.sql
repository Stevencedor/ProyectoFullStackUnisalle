DROP TABLE IF EXISTS pago;
DROP TABLE IF EXISTS estudiante;

CREATE TABLE IF NOT EXISTS estudiante (
    id BIGINT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    programa_id VARCHAR(50) NOT NULL,
    foto VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS pago (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    cantidad DECIMAL(12,2) NOT NULL,
    tipo_pago INT NOT NULL, --('CREDITO', 'DEBITO', 'DEPOSITO', 'TRANSFERENCIA', 'EFECTIVO'),
    status INT NOT NULL DEFAULT 0, ---('CREADO', 'VALIDADO', 'RECHAZADO'),
    file VARCHAR(255),
    estudiante_id BIGINT NOT NULL,
    FOREIGN KEY (estudiante_id) REFERENCES estudiante(id)
);

-- Insertar estudiantes de prueba
INSERT INTO estudiante (id, nombre, apellido, codigo, programa_id, foto) VALUES
(1, 'Ana Maria', 'Gomez', '20251001', 'ING_SIS', 'ana_gomez.jpg'),
(2, 'Carlos', 'Martinez', '20251002', 'ADM_EMP', 'carlos_martinez.jpg'),
(3, 'Laura', 'Valencia', '20251003', 'ING_IND', 'laura_valencia.jpg'),
(4, 'Diego', 'Sanchez', '20251004', 'MED_VET', 'diego_sanchez.jpg'),
(5, 'Isabella', 'Rojas', '20251005', 'ARQ', 'isabella_rojas.jpg'),
(6, 'Alejandro', 'Ramírez', '20251006', 'ING_SIS', 'alejandro_ramirez.jpg'),
(7, 'Valentina', 'Herrera', '20251007', 'ING_SIS', 'valentina_herrera.jpg'),
(8, 'Mateo', 'Díaz', '20251008', 'ADM_EMP', 'mateo_diaz.jpg'),
(9, 'Sofía', 'López', '20251009', 'ARQ', 'sofia_lopez.jpg'),
(10, 'Emilio', 'Vargas', '20251010', 'MED_VET', 'emilio_vargas.jpg'),
(11, 'Gabriela', 'Torres', '20251011', 'ING_IND', 'gabriela_torres.jpg'),
(12, 'Nicolás', 'Mendoza', '20251012', 'ADM_EMP', 'nicolas_mendoza.jpg'),
(13, 'Luciana', 'Ortiz', '20251013', 'ARQ', 'luciana_ortiz.jpg'),
(14, 'Samuel', 'Jiménez', '20251014', 'ING_SIS', 'samuel_jimenez.jpg'),
(15, 'Camila', 'Castro', '20251015', 'ING_IND', 'camila_castro.jpg');

-- Insertar pagos de prueba (usando valores numéricos para los enums)
INSERT INTO pago (fecha, cantidad, tipo_pago, status, file, estudiante_id) VALUES
('2025-02-15', 3500000, 0, 0, 'pago_ana_1.pdf', 1),
('2025-03-20', 4200000, 1, 0, 'pago_carlos_1.pdf', 2),
('2025-04-10', 3800000, 2, 1, 'pago_laura_1.pdf', 3),
('2025-05-05', 4500000, 3, 0, 'pago_diego_1.pdf', 4),
('2025-06-01', 3900000, 1, 1, 'pago_isabella_1.pdf', 5),
('2025-03-10', 3450000, 2, 1, 'pago_alejandro_1.pdf', 6),
('2025-04-15', 3450000, 3, 1, 'pago_valentina_1.pdf', 7),
('2025-05-20', 3450000, 4, 0, 'pago_samuel_1.pdf', 14),
('2025-03-05', 4100000, 0, 0, 'pago_mateo_1.pdf', 8),
('2025-04-22', 4100000, 1, 1, 'pago_nicolas_1.pdf', 12),
('2025-02-28', 3950000, 2, 0, 'pago_sofia_1.pdf', 9),
('2025-03-18', 3950000, 3, 1, 'pago_luciana_1.pdf', 13),
('2025-04-05', 4500000, 0, 0, 'pago_emilio_1.pdf', 10),
('2025-03-25', 3800000, 1, 1, 'pago_gabriela_1.pdf', 11),
('2025-04-20', 3800000, 4, 0, 'pago_camila_1.pdf', 15);

-- Pagos adicionales para algunos estudiantes (segundos pagos)
INSERT INTO pago (fecha, cantidad, tipo_pago, status, file, estudiante_id) VALUES
('2025-05-15', 3450000, 1, 0, 'pago_alejandro_2.pdf', 6),
('2025-05-10', 4100000, 3, 1, 'pago_mateo_2.pdf', 8),
('2025-05-18', 3950000, 2, 0, 'pago_sofia_2.pdf', 9),
('2025-05-22', 4500000, 1, 0, 'pago_emilio_2.pdf', 10),
('2025-05-12', 3800000, 0, 1, 'pago_gabriela_2.pdf', 11);

CREATE INDEX IF NOT EXISTS idx_estudiante_codigo ON estudiante(codigo);
CREATE INDEX IF NOT EXISTS idx_pago_estudiante ON pago(estudiante_id);
CREATE INDEX IF NOT EXISTS idx_pago_fecha ON pago(fecha);
CREATE INDEX IF NOT EXISTS idx_pago_status ON pago(status);
CREATE INDEX IF NOT EXISTS idx_pago_tipo ON pago(tipo_pago);
