package com.stockit.controller;

import com.stockit.model.DetalleVenta;
import com.stockit.service.DetalleVentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalle-ventas")
public class DetalleVentaController {

    @Autowired
    private DetalleVentaService detalleVentaService;

    @GetMapping
    public List<DetalleVenta> listar() {
        return detalleVentaService.listarDetalles();
    }

    @PostMapping
    public DetalleVenta guardar(@RequestBody DetalleVenta detalle) {
        return detalleVentaService.guardarDetalle(detalle);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        detalleVentaService.eliminarDetalle(id);
    }
}
