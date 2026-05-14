-- ============================================================
-- OPMI - Tablas para datos del sistema Invierte.pe / OFI5
-- Generado: 2026-05-12
-- ============================================================

CREATE DATABASE IF NOT EXISTS opmi
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE opmi;

-- ------------------------------------------------------------
-- Tabla principal: una fila por CUI (inversión)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inversiones (
    cui                                     VARCHAR(20)     NOT NULL,
    codigo_snip                             INT             NULL,
    nombre_inversion                        TEXT            NOT NULL,
    pliego                                  VARCHAR(400)    NULL,
    unidad_ejecutora                        VARCHAR(400)    NULL,
    unidad_formuladora                      VARCHAR(400)    NULL,
    beneficiarios                           INT             NULL,
    estado                                  VARCHAR(50)     NULL,
    situacion                               VARCHAR(100)    NULL,
    fecha_viabilidad                        VARCHAR(20)     NULL,
    tipo_inversion                          VARCHAR(100)    NULL,
    tipo_ioarr                              VARCHAR(100)    NULL,
    ds_emergencia                           VARCHAR(10)     NULL,
    monto_viable                            DECIMAL(18,2)   NULL,
    funcion                                 VARCHAR(200)    NULL,
    division_funcional                      VARCHAR(200)    NULL,
    grupo_funcional                         VARCHAR(200)    NULL,
    costo_inversion_total                   DECIMAL(18,2)   NULL,
    devengado_acumulado_anio_anterior       DECIMAL(18,2)   NULL,
    pia_2026                                DECIMAL(18,2)   NULL,
    pim_2026                                DECIMAL(18,2)   NULL,
    certificado_2026                        DECIMAL(18,2)   NULL,
    compromiso_2026                         DECIMAL(18,2)   NULL,
    devengado_2026                          DECIMAL(18,2)   NULL,
    devengado_acumulado                     DECIMAL(18,2)   NULL,
    avance_financiero_acumulado             DECIMAL(8,4)    NULL,
    pmi                                     VARCHAR(10)     NULL,
    pmi_2026                                DECIMAL(18,2)   NULL,
    pmi_2027                                DECIMAL(18,2)   NULL,
    pmi_2028                                DECIMAL(18,2)   NULL,
    pmi_2029                                DECIMAL(18,2)   NULL,
    f12b                                    VARCHAR(10)     NULL,
    ultima_actualizacion_f12b               VARCHAR(50)     NULL,
    avance_ejecucion_pct                    DECIMAL(8,4)    NULL,
    avance_fisico_pct                       DECIMAL(8,4)    NULL,
    ultima_declaracion_avance               VARCHAR(100)    NULL,
    situacion_general                       VARCHAR(300)    NULL,
    fecha_situacion                         VARCHAR(20)     NULL,
    f8                                      VARCHAR(10)     NULL,
    ultima_seccion_f8                       VARCHAR(300)    NULL,
    ultima_actualizacion_f8                 VARCHAR(50)     NULL,
    fecha_inicio_f8                         VARCHAR(20)     NULL,
    fecha_fin_f8                            VARCHAR(20)     NULL,
    f9                                      VARCHAR(10)     NULL,
    tipo_f9                                 VARCHAR(100)    NULL,
    fecha_registro_f9                       VARCHAR(20)     NULL,
    cartera_priorizada                      VARCHAR(10)     NULL,
    created_at                              TIMESTAMP       NULL DEFAULT NULL,
    updated_at                              TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (cui)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- ET_DE: Expediente Técnico / Documento Equivalente
-- Un CUI puede tener múltiples registros
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS et_de (
    id                                      INT             NOT NULL AUTO_INCREMENT,
    cui                                     VARCHAR(20)     NOT NULL,
    nombre_inversion                        TEXT            NULL,
    descripcion                             VARCHAR(300)    NULL,
    modalidad_ejecucion                     VARCHAR(300)    NULL,
    etapa                                   VARCHAR(200)    NULL,
    ultimo_hito                             VARCHAR(300)    NULL,
    fecha_ultimo_hito                       VARCHAR(20)     NULL,
    estado_hito                             VARCHAR(100)    NULL,
    comentario_hito                         TEXT            NULL,
    created_at                              TIMESTAMP       NULL DEFAULT NULL,
    updated_at                              TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_et_de_cui FOREIGN KEY (cui) REFERENCES inversiones(cui) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_et_de_cui (cui)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Avance Físico: seguimiento de ejecución física
-- Un CUI puede tener múltiples líneas de seguimiento
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avance_fisico (
    id                                          INT             NOT NULL AUTO_INCREMENT,
    cui                                         VARCHAR(20)     NOT NULL,
    nombre_inversion                            TEXT            NULL,
    fecha_ultima_actualizacion                  VARCHAR(20)     NULL,
    linea_seguimiento                           VARCHAR(300)    NULL,
    modalidad_ejecucion                         VARCHAR(400)    NULL,
    objeto_contractual                          VARCHAR(200)    NULL,
    tipo_proceso                                VARCHAR(200)    NULL,
    ultima_etapa                                VARCHAR(300)    NULL,
    ultimo_hito_cumplido                        VARCHAR(400)    NULL,
    fecha_ultimo_hito                           VARCHAR(20)     NULL,
    estado_ultimo_hito                          VARCHAR(100)    NULL,
    ultimo_periodo_registrado                   INT             NULL,
    programado_acumulado_pct                    DECIMAL(8,4)    NULL,
    real_acumulado_pct                          DECIMAL(8,4)    NULL,
    valorizacion_acumulada_adicional            DECIMAL(18,2)   NULL,
    valorizacion_acumulada_mayores_metrados     DECIMAL(18,2)   NULL,
    valorizacion_acumulada_mayores_gg           DECIMAL(18,2)   NULL,
    estado_situacional                          VARCHAR(300)    NULL,
    comentarios                                 TEXT            NULL,
    riesgos_problematica                        TEXT            NULL,
    fecha_fin_ultimo_cronograma                 VARCHAR(20)     NULL,
    total_dias_ampliados                        INT             NULL,
    nueva_fecha_termino                         VARCHAR(20)     NULL,
    created_at                                  TIMESTAMP       NULL DEFAULT NULL,
    updated_at                                  TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_avance_fisico_cui FOREIGN KEY (cui) REFERENCES inversiones(cui) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_avance_fisico_cui (cui)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Contratos: procesos de contratación asociados al CUI
-- Un CUI puede tener múltiples contratos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contratos (
    id                          INT             NOT NULL AUTO_INCREMENT,
    cui                         VARCHAR(20)     NOT NULL,
    nombre_inversion            TEXT            NULL,
    descripcion_proceso         TEXT            NULL,
    numero_proceso              VARCHAR(100)    NULL,
    descripcion_item            TEXT            NULL,
    monto_referencial           DECIMAL(18,2)   NULL,
    fecha_convocatoria          VARCHAR(20)     NULL,
    objeto_contractual          VARCHAR(200)    NULL,
    estado_item                 VARCHAR(100)    NULL,
    fecha_buena_pro             VARCHAR(20)     NULL,
    nombre_contratista          VARCHAR(400)    NULL,
    numero_contrato             VARCHAR(100)    NULL,
    fecha_suscripcion           VARCHAR(20)     NULL,
    monto_contratado_total      DECIMAL(18,2)   NULL,
    created_at                  TIMESTAMP       NULL DEFAULT NULL,
    updated_at                  TIMESTAMP       NULL DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_contratos_cui FOREIGN KEY (cui) REFERENCES inversiones(cui) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_contratos_cui (cui)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
