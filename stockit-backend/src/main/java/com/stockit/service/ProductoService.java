package com.stockit.service;

import com.stockit.model.Producto;
import com.stockit.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    public Producto crearProducto(Producto producto) {
        return productoRepository.save(producto);
    }

    public Producto actualizarProducto(Long id, Producto nuevoProducto) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(nuevoProducto.getNombre());
                    producto.setDescripcion(nuevoProducto.getDescripcion());
                    producto.setPrecio(nuevoProducto.getPrecio());
                    producto.setStock(nuevoProducto.getStock());
                    producto.setImagenUrl(nuevoProducto.getImagenUrl());
                    producto.setUbicacion(nuevoProducto.getUbicacion());
                    return productoRepository.save(producto);
                }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public void eliminarProducto(Long id) {
        productoRepository.deleteById(id);
    }

    @Transactional
public boolean descontarStock(Long productoId, int cantidad) {
    Optional<Producto> optProducto = productoRepository.findById(productoId);

    if (optProducto.isPresent()) {
        Producto producto = optProducto.get();
        if (producto.getStock() >= cantidad) {
            producto.setStock(producto.getStock() - cantidad);
            productoRepository.save(producto);
            return true;
        }
    }
    return false;
}

public boolean hayStockDisponible(Long productoId, int cantidad) {
    return productoRepository.findById(productoId)
            .map(p -> p.getStock() >= cantidad)
            .orElse(false);
}
}
