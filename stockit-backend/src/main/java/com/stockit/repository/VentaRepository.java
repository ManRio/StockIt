package com.stockit.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.stockit.model.Usuario;
import com.stockit.model.Venta;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    List<Venta> findByUsuarioId(Long usuarioId);
    List<Venta> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Venta> findByUsuarioAndFechaBetween(Usuario usuario, LocalDateTime inicio, LocalDateTime fin);
    List<Venta> findByUsuarioIdAndFechaBetween(Long usuarioId, LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT d.producto.nombre, SUM(d.cantidad) " +
           "FROM DetalleVenta d " +
           "GROUP BY d.producto.nombre " +
           "ORDER BY SUM(d.cantidad) DESC")
    List<Object[]> encontrarProductosMasVendidos();

    @Query("SELECT v.usuario.nombre, SUM(v.total) " +
           "FROM Venta v " +
           "WHERE v.fecha BETWEEN :inicio AND :fin " +
           "GROUP BY v.usuario.nombre " +
           "ORDER BY SUM(v.total) DESC")
    List<Object[]> obtenerRankingMensual(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT v FROM Venta v WHERE v.usuario.id = :usuarioId ORDER BY v.fecha DESC")
    List<Venta> findUltimasVentasPorUsuario(@Param("usuarioId") Long usuarioId, Pageable pageable);
}

