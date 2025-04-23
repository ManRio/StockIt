package com.stockit.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.stockit.dto.VentaDTO;
import com.stockit.dto.VentaRequestDTO;
import com.stockit.model.DetalleVenta;
import com.stockit.model.Producto;
import com.stockit.model.Usuario;
import com.stockit.model.Venta;
import com.stockit.repository.DetalleVentaRepository;
import com.stockit.repository.ProductoRepository;
import com.stockit.repository.UsuarioRepository;
import com.stockit.repository.VentaRepository;

import jakarta.transaction.Transactional;

@Service
public class VentaService {

    @Autowired private VentaRepository ventaRepository;
    @Autowired private DetalleVentaRepository detalleVentaRepository;
    @Autowired private ProductoRepository productoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    public List<VentaDTO> listarVentasDTO() {
        return ventaRepository.findAll().stream().map(this::mapearAVentaDTO).toList();
    }

    public Optional<Venta> obtenerVentaPorId(Long id) {
        return ventaRepository.findById(id);
    }

    public void eliminarVenta(Long id) {
        ventaRepository.deleteById(id);
    }

    public List<VentaDTO> buscarPorRangoFechaDTO(LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByFechaBetween(inicio, fin).stream().map(this::mapearAVentaDTO).toList();
    }

    public List<VentaDTO> obtenerVentasPorUsuarioDTO(Long usuarioId) {
        return ventaRepository.findByUsuarioId(usuarioId).stream().map(this::mapearAVentaDTO).toList();
    }

    public List<VentaDTO> buscarPorUsuarioYRangoFechaDTO(Long usuarioId, LocalDateTime inicio, LocalDateTime fin) {
        return ventaRepository.findByUsuarioIdAndFechaBetween(usuarioId, inicio, fin).stream().map(this::mapearAVentaDTO).toList();
    }

    public List<Venta> obtenerVentasDelMesActual(Usuario usuario) {
        LocalDateTime inicioMes = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime finMes = inicioMes.plusMonths(1);

        return "ADMIN".equalsIgnoreCase(usuario.getRol().toString())
            ? ventaRepository.findByFechaBetween(inicioMes, finMes)
            : ventaRepository.findByUsuarioAndFechaBetween(usuario, inicioMes, finMes);
    }

    public List<Object[]> obtenerRankingMensual() {
        LocalDateTime inicio = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime fin = inicio.plusMonths(1);
        return ventaRepository.obtenerRankingMensual(inicio, fin);
    }

    public List<Map<String, Object>> obtenerProductosMasVendidos() {
        List<Object[]> resultados = ventaRepository.encontrarProductosMasVendidos();
        List<Map<String, Object>> lista = new ArrayList<>();

        for (Object[] fila : resultados) {
            Map<String, Object> map = new HashMap<>();
            map.put("nombre", fila[0]);
            map.put("cantidad", fila[1]);
            lista.add(map);
        }
        return lista;
    }

    public List<Venta> obtenerUltimasVentasPorUsuario(Long usuarioId, int limite) {
        return ventaRepository.findUltimasVentasPorUsuario(usuarioId, PageRequest.of(0, limite));
    }

    @Transactional
    public Venta crearVentaDesdeDTO(VentaRequestDTO dto) {
        Venta venta = new Venta();
        venta.setFecha(LocalDateTime.now());

        if (dto.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getUsuarioId()));
            venta.setUsuario(usuario);
        }

        if (dto.getCliente() != null) {
            VentaRequestDTO.ClienteDTO c = dto.getCliente();
            venta.setClienteNombre(c.getNombre());
            venta.setClienteCif(c.getCif());
            venta.setClienteDireccion(c.getDireccion());
            venta.setClienteTelefono(c.getTelefono());
        }

        double total = 0.0;
        for (VentaRequestDTO.DetalleVentaDTO d : dto.getDetalles()) {
            Producto producto = productoRepository.findById(d.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + d.getProductoId()));

            if (producto.getStock() < d.getCantidad()) {
                throw new RuntimeException("No hay suficiente stock para: " + producto.getNombre());
            }

            producto.setStock(producto.getStock() - d.getCantidad());
            productoRepository.save(producto);

            DetalleVenta detalle = new DetalleVenta();
            detalle.setProducto(producto);
            detalle.setVenta(venta);
            detalle.setCantidad(d.getCantidad());
            detalle.setSubtotal(producto.getPrecio() * d.getCantidad());

            total += detalle.getSubtotal();
            venta.getDetalles().add(detalle);
        }

        venta.setTotal(total);
        Venta ventaGuardada = ventaRepository.save(venta);
        detalleVentaRepository.saveAll(venta.getDetalles());
        return ventaGuardada;
    }

    private VentaDTO mapearAVentaDTO(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setFecha(venta.getFecha());
        dto.setTotal(venta.getTotal());
        dto.setUsuario(venta.getUsuario());
        dto.setDetalles(venta.getDetalles());

        VentaDTO.ClienteDTO c = new VentaDTO.ClienteDTO();
        c.setNombre(venta.getClienteNombre());
        c.setCif(venta.getClienteCif());
        c.setDireccion(venta.getClienteDireccion());
        c.setTelefono(venta.getClienteTelefono());
        dto.setCliente(c);

        return dto;
    }
}
