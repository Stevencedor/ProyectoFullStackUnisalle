package com.systempaymentsunisalle.sistema_pagos_backend_unisalle.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.entities.Pago;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.PagoStatus;
import com.systempaymentsunisalle.sistema_pagos_backend_unisalle.enums.TypePago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    // metodo que me devuelva los pagos asociados a un estudiante
    List<Pago> findByEstudianteCodigo(String codigo);

    List<Pago> findByStatus(PagoStatus status);
    
    List<Pago> findByTipoPago(TypePago type);
}
