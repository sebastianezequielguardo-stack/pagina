// ============================================
// CARRITO — Tablas El Cóndor
// ============================================
// Este archivo maneja todo lo relacionado con el carrito de compras:
// - Muestra los productos que el usuario agregó
// - Permite aumentar/disminuir cantidades
// - Permite eliminar productos del carrito
// - Calcula el total de la compra
// - Navega a la página de checkout para finalizar

// ============================================
// 1. CONEXIÓN CON LA PÁGINA HTML
// ============================================
// Guardamos referencias a los elementos del HTML para poder manipularlos:
// - listaProductos: donde se dibujan los items del carrito
// - carritoVacio: el mensaje que aparece cuando no hay productos
// - resumenSubtotal y resumenTotal: para mostrar los precios
// - btnFinalizar: el botón que lleva al checkout
const listaProductos = document.getElementById("lista-productos");
const carritoVacio = document.getElementById("carrito-vacio");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenTotal = document.getElementById("resumen-total");
const btnFinalizar = document.getElementById("btn-finalizar");

// ============================================
// 2. CARGAR Y MOSTRAR EL CARRITO
// ============================================
// Esta función es la principal. Se ejecuta cuando la página carga y cada vez
// que el carrito cambia. Lo que hace:
// 1. Busca el carrito en localStorage (si no existe, crea uno vacío)
// 2. Si está vacío, muestra el mensaje de "carrito vacío"
// 3. Si tiene productos, crea una tarjeta para cada uno con:
//    - Foto del producto
//    - Nombre y precio
//    - Botones para aumentar/disminuir cantidad
//    - Precio subtotal (precio × cantidad)
//    - Botón para eliminar
// 4. Calcula el total y actualiza el resumen
// 5. Agrega los eventos de click a todos los botones
function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        carritoVacio.style.display = "block";
        listaProductos.innerHTML = "";
        actualizarResumen(0);
        return;
    }

    carritoVacio.style.display = "none";
    listaProductos.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const itemHTML = `
            <div class="carrito-item">
                <div class="carrito-item__img">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="carrito-item__info">
                    <h4 class="carrito-item__nombre">${item.nombre}</h4>
                    <p class="carrito-item__precio">$${item.precio.toLocaleString("es-AR")}</p>
                </div>
                <div class="carrito-item__cantidad">
                    <button class="btn-cantidad btn-menos" data-index="${index}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad btn-mas" data-index="${index}">+</button>
                </div>
                <div class="carrito-item__subtotal">
                    <p>$${subtotal.toLocaleString("es-AR")}</p>
                </div>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            </div>
        `;

        listaProductos.innerHTML += itemHTML;
    });

    actualizarResumen(total);
    agregarEventosCarrito(carrito);
    if (window.actualizarContadorCarrito) {
        window.actualizarContadorCarrito();
    }
}

// ============================================
// 3. ACTUALIZAR EL RESUMEN DE PRECIOS
// ============================================
// Esta función simplemente actualiza los números que se ven en el resumen
// de compra a la derecha. Muestra el subtotal (precio de todos los productos)
// y el total (que en este caso es lo mismo, ya que el envío se calcula en checkout).
function actualizarResumen(total) {
    resumenSubtotal.textContent = `$${total.toLocaleString("es-AR")}`;
    resumenTotal.textContent = `$${total.toLocaleString("es-AR")}`;
}

// ============================================
// 4. CONECTAR LOS BOTONES CON SUS FUNCIONES
// ============================================
// Esta función agrega los eventos de click a todos los botones que se crearon
// dinámicamente para cada producto:
// - Botón "+": aumenta la cantidad en 1
// - Botón "-": disminuye la cantidad en 1 (mínimo 1)
// - Botón "Eliminar": saca el producto completamente del carrito
//
// Cada vez que se hace un cambio, se guarda en localStorage y se vuelve a
// dibujar el carrito para reflejar los cambios.
function agregarEventosCarrito(carrito) {
    // Botones de aumentar cantidad
    document.querySelectorAll(".btn-mas").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            carrito[index].cantidad += 1;
            guardarCarrito(carrito);
            cargarCarrito();
            if (window.actualizarContadorCarrito) {
                window.actualizarContadorCarrito();
            }
        });
    });

    // Botones de disminuir cantidad
    document.querySelectorAll(".btn-menos").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad -= 1;
                guardarCarrito(carrito);
                cargarCarrito();
                if (window.actualizarContadorCarrito) {
                    window.actualizarContadorCarrito();
                }
            }
        });
    });

    // Botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            carrito.splice(index, 1);
            guardarCarrito(carrito);
            cargarCarrito();
            if (window.actualizarContadorCarrito) {
                window.actualizarContadorCarrito();
            }
        });
    });
}

// ============================================
// 5. GUARDAR EL CARRITO EN EL NAVEGADOR
// ============================================
// Esta función guarda el estado actual del carrito en localStorage.
// localStorage es como una "memoria" del navegador que persiste aunque
// el usuario cierre la página. Así el carrito no se pierde.
//
// Convertimos el array del carrito a texto (JSON) porque localStorage
// solo puede guardar texto, no objetos directamente.
function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ============================================
// 6. BOTÓN PARA IR AL CHECKOUT
// ============================================
// Este evento controla el botón "Finalizar compra". Antes de dejar al usuario
// ir a la página de checkout, verifica que el carrito no esté vacío.
// Si está vacío, muestra un alerta y no deja avanzar.
// Si tiene productos, navega a la página de checkout.
btnFinalizar.addEventListener("click", () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
        return;
    }
    window.location.href = "/pages/checkout.html";
});

// ============================================
// 7. INICIALIZACIÓN
// ============================================
// Este código se ejecuta automáticamente cuando la página termina de cargar.
// Simplemente llama a la función cargarCarrito() para mostrar los productos
// que el usuario tenía guardados en localStorage.
document.addEventListener("DOMContentLoaded", cargarCarrito);
