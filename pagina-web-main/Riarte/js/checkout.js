// ============================================
// CHECKOUT — Tablas El Cóndor
// ============================================
// Este archivo maneja la página final de compra donde el usuario:
// - Elige entre retiro en tienda o envío a domicilio
// - Calcula el costo de envío según su código postal
// - Completa sus datos de contacto y dirección
// - Ve el resumen final de su compra
// - Confirma la compra

// ============================================
// 1. CONEXIÓN CON LA PÁGINA HTML
// ============================================
// Guardamos referencias a todos los elementos importantes del HTML:
// - Elementos del resumen: para mostrar productos y totales
// - Elementos de envío: radio buttons, input de código postal, botones
// - Elementos del formulario: campos de contacto y dirección
// - Variables para guardar el estado: costo de envío, subtotal, carrito
const resumenProductos = document.getElementById("resumen-productos");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenEnvio = document.getElementById("resumen-envio");
const filaEnvio = document.getElementById("fila-envio");
const resumenTotal = document.getElementById("resumen-total");
const envioRadios = document.querySelectorAll('input[name="envio"]');
const codigoPostalContainer = document.getElementById("codigo-postal-container");
const codigoPostalInput = document.getElementById("codigo-postal");
const btnCalcularEnvio = document.getElementById("btn-calcular-envio");
const envioPrecio = document.getElementById("envio-precio");
const envioMensaje = document.getElementById("envio-mensaje");
const datosEnvio = document.getElementById("datos-envio");
const btnConfirmar = document.getElementById("btn-confirmar");

let costoEnvio = 0;        // Aquí guardamos el costo calculado del envío
let subtotalProductos = 0;  // El precio total de los productos sin envío
let carrito = [];            // Array con los productos del carrito

// ============================================
// 2. CARGAR EL CARRITO Y MOSTRAR RESUMEN
// ============================================
// Esta función se ejecuta cuando la página de checkout carga.
// Primero verifica que el carrito no esté vacío (si lo está, redirige a productos).
// Luego muestra todos los productos en el resumen a la derecha con su información.
// Calcula el subtotal de productos y actualiza el resumen de precios.
function cargarCarrito() {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Serás redirigido a la página de productos.");
        window.location.href = "/pages/productos/productos.html";
        return;
    }

    // Renderizar productos en el resumen
    resumenProductos.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const productoHTML = `
            <div class="resumen-producto">
                <div class="resumen-producto__img">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="resumen-producto__info">
                    <h4 class="resumen-producto__nombre">${item.nombre}</h4>
                    <p class="resumen-producto__cantidad">Cantidad: ${item.cantidad}</p>
                    <p class="resumen-producto__precio">$${subtotal.toLocaleString("es-AR")}</p>
                </div>
            </div>
        `;

        resumenProductos.innerHTML += productoHTML;
    });

    subtotalProductos = total;
    actualizarResumen();
}

// ============================================
// 3. ACTUALIZAR TOTALES DE PRECIO
// ============================================
// Esta función actualiza los números que se ven en el resumen:
// - Subtotal: precio de todos los productos
// - Total: subtotal + costo de envío
//
// Se llama cada vez que cambia algo (se agrega envío, se cambia código postal, etc.)
function actualizarResumen() {
    resumenSubtotal.textContent = `$${subtotalProductos.toLocaleString("es-AR")}`;

    const totalConEnvio = subtotalProductos + costoEnvio;
    resumenTotal.textContent = `$${totalConEnvio.toLocaleString("es-AR")}`;
}

// ============================================
// 4. CALCULAR COSTO DE ENVÍO POR CÓDIGO POSTAL
// ============================================
// Esta función toma un código postal argentino y calcula cuánto costaría el envío.
// La lógica es:
// 1. Validar que sea un código postal válido (4 dígitos)
// 2. Determinar la zona geográfica según el rango del código postal
// 3. Asignar un precio base según la zona (más caro cuanto más lejos)
// 4. Sumar $1.000 extra por cada tabla adicional al primero (por el peso)
// 5. Devolver el costo total
//
// Las zonas están basadas en códigos postales reales de Argentina.
function calcularCostoEnvio(codigoPostal) {
    const cp = parseInt(codigoPostal);

    if (!cp || cp < 1000 || cp > 9999) {
        return null; // Código postal inválido
    }

    // Base de costo según zona geográfica
    let baseCosto = 0;

    if (cp >= 1000 && cp <= 1499) {
        baseCosto = 3500; // Capital Federal y GBABA
    } else if (cp >= 1500 && cp <= 1999) {
        baseCosto = 4500; // Buenos Aires interior
    } else if (cp >= 2000 && cp <= 2999) {
        baseCosto = 5500; // Centro del país
    } else if (cp >= 3000 && cp <= 3999) {
        baseCosto = 6500; // Litoral
    } else if (cp >= 4000 && cp <= 4999) {
        baseCosto = 7000; // Cuyo
    } else if (cp >= 5000 && cp <= 5999) {
        baseCosto = 7500; // Noroeste
    } else if (cp >= 6000 && cp <= 6999) {
        baseCosto = 8000; // Patagonia norte
    } else if (cp >= 7000 && cp <= 7999) {
        baseCosto = 8500; // Patagonia sur
    } else if (cp >= 8000 && cp <= 8999) {
        baseCosto = 6000; // Sur de Buenos Aires
    } else if (cp >= 9000 && cp <= 9999) {
        baseCosto = 9000; // Tierra del Fuego
    } else {
        baseCosto = 5000; // Precio por defecto
    }

    // Ajuste por cantidad de productos (tablas de madera son pesadas)
    const cantidadProductos = carrito.reduce((total, item) => total + item.cantidad, 0);

    // Agregar costo adicional por cada producto adicional al primero
    const costoPorProductoExtra = 1000;
    const costoTotal = baseCosto + (Math.max(0, cantidadProductos - 1) * costoPorProductoExtra);

    return costoTotal;
}

// ============================================
// 5. CAMBIAR ENTRE RETIRO Y ENVÍO
// ============================================
// Este evento controla cuando el usuario cambia la opción de entrega:
// - Si elige "Retiro presencial": el envío es gratis, se ocultan los campos
//   de dirección y se muestra $0 de envío
// - Si elige "Envío a domicilio": se muestra el campo de código postal para
//   que el usuario calcule el costo, y se muestran los campos de dirección
//
// También actualiza el total para reflejar si hay envío o no.
envioRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
        const valor = e.target.value;

        if (valor === "retiro") {
            // Retiro en tienda - envío gratis
            costoEnvio = 0;
            codigoPostalContainer.style.display = "none";
            envioPrecio.textContent = "Gratis";
            filaEnvio.style.display = "none";
            datosEnvio.style.display = "none";
            envioMensaje.textContent = "";
        } else if (valor === "domicilio") {
            // Envío a domicilio - mostrar campo de código postal
            codigoPostalContainer.style.display = "flex";
            envioPrecio.textContent = "Calcular";
            filaEnvio.style.display = "flex";
            datosEnvio.style.display = "flex";
            costoEnvio = 0; // Resetear hasta que calcule
        }

        actualizarResumen();
    });
});

// ============================================
// 6. CALCULAR ENVÍO CUANDO EL USUARIO INGRESA CP
// ============================================
// Este evento controla el botón "Calcular" de envío:
// 1. Toma el código postal que el usuario ingresó
// 2. Valida que no esté vacío
// 3. Llama a la función de cálculo de envío
// 4. Si el código es inválido, muestra un error
// 5. Si es válido, guarda el costo, lo muestra en pantalla y actualiza el total
//
// También permite calcular con la tecla Enter para mayor comodidad.
btnCalcularEnvio.addEventListener("click", () => {
    const codigoPostal = codigoPostalInput.value.trim();

    if (!codigoPostal) {
        alert("Por favor, ingresa un código postal");
        return;
    }

    const costo = calcularCostoEnvio(codigoPostal);

    if (costo === null) {
        alert("Código postal inválido. Debe tener 4 dígitos numéricos.");
        return;
    }

    costoEnvio = costo;
    envioPrecio.textContent = `$${costo.toLocaleString("es-AR")}`;
    resumenEnvio.textContent = `$${costo.toLocaleString("es-AR")}`;
    envioMensaje.textContent = `El envío costará $${costo.toLocaleString("es-AR")}`;
    actualizarResumen();
});

// Permitir calcular envío con Enter
codigoPostalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        btnCalcularEnvio.click();
    }
});

// ============================================
// 7. VALIDAR FORMULARIO Y CONFIRMAR COMPRA
// ============================================
// Esta función controla el botón "Confirmar compra". Hace varias validaciones:
// 1. Verifica que los campos de contacto estén completos
// 2. Valida que el email tenga formato correcto
// 3. Si el usuario eligió envío a domicilio:
//    - Verifica que haya calculado el costo de envío
//    - Verifica que los campos de dirección estén completos
// 4. Si todo está bien, muestra un resumen de la compra
// 5. Limpia el carrito y redirige al inicio
//
// En una versión real, aquí se enviaría la información a un servidor.
btnConfirmar.addEventListener("click", () => {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Validar campos obligatorios
    if (!nombre || !email || !telefono) {
        alert("Por favor, completa todos los campos de contacto.");
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingresa un email válido.");
        return;
    }

    // Verificar opción de envío seleccionada
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked').value;

    if (envioSeleccionado === "domicilio") {
        // Validar que se haya calculado el envío
        if (costoEnvio === 0) {
            alert("Por favor, calcula el costo de envío ingresando tu código postal.");
            return;
        }

        // Validar campos de dirección
        const calle = document.getElementById("calle").value.trim();
        const localidad = document.getElementById("localidad").value.trim();
        const provincia = document.getElementById("provincia").value.trim();

        if (!calle || !localidad || !provincia) {
            alert("Por favor, completa todos los campos de dirección de envío.");
            return;
        }
    }

    // Si todo está validado, mostrar confirmación
    const totalFinal = subtotalProductos + costoEnvio;
    const metodoEnvio = envioSeleccionado === "retiro" ? "Retiro en tienda" : "Envío a domicilio";

    const mensaje = `
¡Gracias por tu compra, ${nombre}!

Resumen del pedido:
- Productos: $${subtotalProductos.toLocaleString("es-AR")}
- Envío (${metodoEnvio}): $${costoEnvio.toLocaleString("es-AR")}
- Total: $${totalFinal.toLocaleString("es-AR")}

Te contactaremos al ${email} para coordinar los detalles.
    `;

    alert(mensaje);

    // Aquí podrías agregar la lógica para enviar el pedido a un servidor
    // o limpiar el carrito

    // Por ahora, solo mostramos el mensaje y redirigimos al inicio
    setTimeout(() => {
        localStorage.removeItem("carrito");
        window.location.href = "/index.html";
    }, 2000);
});

// ============================================
// 8. INICIALIZACIÓN DE LA PÁGINA
// ============================================
// Este código se ejecuta automáticamente cuando la página de checkout
// termina de cargar. Simplemente llama a la función cargarCarrito() para
// mostrar los productos y permitir que el usuario complete el proceso de compra.
document.addEventListener("DOMContentLoaded", cargarCarrito);
