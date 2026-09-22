// ============================================
// SCRIPT GLOBAL — Tablas El Cóndor
// ============================================
// Este archivo maneja la funcionalidad global del sitio:
// - Actualiza el contador del carrito en el header
// - Se ejecuta en todas las páginas del sitio

// ============================================
// ACTUALIZAR CONTADOR DEL CARRITO
// ============================================
// Esta función cuenta cuántos productos hay en el carrito
// y actualiza el contador que se ve en el icono del carrito
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("carrito-contador");
    
    if (contador) {
        // Calcular total de productos (sumando cantidades)
        const totalProductos = carrito.reduce((total, item) => total + item.cantidad, 0);
        
        // Actualizar el contador
        contador.textContent = totalProductos;
        
        // Ocultar el contador si está vacío
        if (totalProductos === 0) {
            contador.style.display = "none";
        } else {
            contador.style.display = "flex";
        }
    }
}

// Hacer la función disponible globalmente
window.actualizarContadorCarrito = actualizarContadorCarrito;

// ============================================
// INICIALIZACIÓN
// ============================================
// Ejecutar cuando la página carga
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);

// También actualizar cuando cambie el localStorage (por si otra página modifica el carrito)
window.addEventListener("storage", actualizarContadorCarrito);