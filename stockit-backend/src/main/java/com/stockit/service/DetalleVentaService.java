package com.stockit.service;

import com.stockit.model.DetalleVenta;
import com.stockit.model.Producto;
import com.stockit.repository.DetalleVentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetalleVentaService {

    @Autowired
    private DetalleVentaRepository detalleVentaRepository;

    public List<DetalleVenta> listarDetalles() {
        return detalleVentaRepository.findAll();
    }

    public DetalleVenta guardarDetalle(DetalleVenta detalle) {
        return detalleVentaRepository.save(detalle);
    }

    public void eliminarDetalle(Long id) {
        detalleVentaRepository.deleteById(id);
    }

    public void validarStockDisponible(DetalleVenta detalle, Producto producto) {
    if (producto.getStock() < detalle.getCantidad()) {
        throw new RuntimeException("No hay suficiente stock para el producto: " + producto.getNombre());
    }
}
}
