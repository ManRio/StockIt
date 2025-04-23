package com.stockit.repository;

import com.stockit.model.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Long> {
    // Si luego necesitas buscar por venta o producto, puedes añadir métodos como:
    // List<DetalleVenta> findByVentaId(Long ventaId);
}
