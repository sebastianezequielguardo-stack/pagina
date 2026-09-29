// ============================================
// PRODUCTOS — Tablas El Cóndor
// ============================================
// Este archivo maneja todo lo relacionado con la página de productos:
// - Muestra los productos en una grilla con sus fotos y precios
// - Permite filtrar por precio, tipo de madera y tipo de tabla
// - Abre un modal con detalles cuando hacés click en un producto
// - Agrega productos al carrito de compras

// ============================================
// 1. BASE DE DATOS DE PRODUCTOS
// ============================================
// Acá están todos los productos que vendemos. Cada uno tiene:
// - id: número único para identificarlo
// - nombre: cómo se llama el producto
// - precio: cuánto cuesta en pesos argentinos
// - madera: de qué madera está hecho (roble, guayubira, eucalipto)
// - tabla: para qué sirve (asado, cocina, picada, plato)
// - imagen: la ruta de la foto del producto
// - descripcion: texto explicativo sobre el producto
//
// IMPORTANTE: Los valores de "madera" y "tabla" tienen que coincidir
// exactamente con los botones de radio que están en el HTML para que
// los filtros funcionen bien.
const productos = [
      {
        id: 1,
        nombre: "Tabla de asado Guayubira 50x30",
        precio: 40000,
        madera: "guayubira",
        tabla: "asado",
        imagen: "../images/asado grande guayubira.webp",
        descripcion: "Tabla de asado grande ideal para cortar carnes y servir. Hecha de madera de guayubira resistente y duradera. Medidas 50x30 cm."
    },
    {
        id: 2,
        nombre: "Tabla de asado (chico) Guayubira 40x30",
        precio: 35000,
        madera: "guayubira",
        tabla: "asado",
        imagen: "../images/asado chico guayubira.webp",
        descripcion: "Tabla de asado tamaño mediano perfecta para asados familiares. Madera de guayubira de alta calidad. Medidas 40x30 cm."
    },
    {
        id: 3,
        nombre: "Tabla de cocina simple Guayubira 40x25",
        precio: 20000,
        madera: "guayubira",
        tabla: "cocina",
        imagen: "../images/cocina guayubira.webp",
        descripcion: "Tabla de cocina versátil para preparación diaria. Madera de guayubira resistente a humedad. Medidas 40x25 cm."
    },
    {
        id: 4,
        nombre: "Tabla de cocina colgable Guayubira 40x25",
        precio: 20000,
        madera: "guayubira",
        tabla: "cocina",
        imagen: "../images/cocina guayubira cuelga.webp",
        descripcion: "Tabla de cocina con agujero para colgar, ideal para ahorrar espacio. Madera de guayubira premium. Medidas 40x25 cm."
    },
    {
        id: 5,
        nombre: "Tabla de cocina simple Eucalipto 40x25",
        precio: 15000,
        madera: "eucalipto",
        tabla: "cocina",
        imagen: "../images/",
        descripcion: "Tabla de cocina económica y funcional. Madera de eucalipto tratada. Medidas 40x25 cm."
    },
    {
        id: 6,
        nombre: "Tabla de cocina colgable Eucalipto 40x25",
        precio: 15000,
        madera: "eucalipto",
        tabla: "cocina",
        imagen: "../images/",
        descripcion: "Tabla de cocina colgable de eucalipto. Perfecta para cocinas pequeñas. Medidas 40x25 cm."
    },
    {
        id: 7,
        nombre: "Tabla de asado chico Eucalipto 40x30",
        precio: 20000,
        madera: "eucalipto",
        tabla: "asado",
        imagen: "../images/productos/picada-eucalipto.webp",
        descripcion: "Tabla de asado compacta de eucalipto. Ideal para asados íntimos. Medidas 40x30 cm."
    },
    {
        id: 8,
        nombre: "Tabla de asado Eucalipto 50x30",
        precio: 25000,
        madera: "eucalipto",
        tabla: "asado",
        imagen: "../images/asado grande eucalipto.webp",
        descripcion: "Tabla de asado grande de eucalipto resistente. Perfecta para cortes grandes de carne. Medidas 50x30 cm."
    },
    {
        id: 9,
        nombre: "Tabla de picada Eucalipto 50x17",
        precio: 25000,
        madera: "eucalipto",
        tabla: "picada",
        imagen: "../images/picada eucalipto.webp",
        descripcion: "Tabla alargada ideal para picadas y aperitivos. Madera de eucalipto de calidad. Medidas 50x17 cm."
    },
     {
        id: 10,
        nombre: "plato de Eucalipto 25x25",
        precio: 8000,
        madera: "eucalipto",
        tabla: "plato",
        imagen: "../images/plato eucalipto.webp",
        descripcion: "Plato de madera cuadrado ideal para servir. Madera de eucalipto tratada. Medidas 25x25 cm."
    }
    // Agregá acá el resto de tus productos, con la misma estructura
];

// ============================================
// 2. CONEXIÓN CON LA PÁGINA HTML
// ============================================
// Acá estamos guardando referencias a los elementos de la página
// para poder usarlos en el código JavaScript. Es como tener "accesos directos"
// a los botones, inputs y contenedores del HTML.
//
// - grilla: el contenedor donde van a aparecer los productos
// - inputMin y inputMax: los campos para filtrar por precio mínimo y máximo
// - btnAplicar y btnReset: los botones de aplicar y restablecer filtros
// - Las variables del modal: para controlar la ventana emergente con detalles
// - productoActual: guardamos temporalmente qué producto está viendo el usuario
const grilla = document.querySelector(".productos-grilla");
const inputMin = document.getElementById("precio-min");
const inputMax = document.getElementById("precio-max");
const btnAplicar = document.querySelector(".btn-aplicar");
const btnReset = document.querySelector(".btn-reset");

// Modal references
const modal = document.getElementById("producto-modal");
const modalClose = document.querySelector(".modal-close");
const modalImg = document.getElementById("modal-img");
const modalTitulo = document.getElementById("modal-titulo");
const modalPrecio = document.getElementById("modal-precio");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalMadera = document.getElementById("modal-madera");
const modalTipo = document.getElementById("modal-tipo");
const btnAgregarCarrito = document.getElementById("modal-agregar-carrito");

let productoActual = null; // Aquí guardamos el producto que el usuario está viendo en el modal

// ============================================
// 3. MOSTRAR PRODUCTOS EN LA PÁGINA
// ============================================
// Esta función toma una lista de productos y los dibuja en la grilla de la página.
// Primero limpia todo lo que había antes, y luego crea una tarjeta para cada producto
// con su foto, nombre y precio. Cada tarjeta tiene un evento de click para abrir
// el modal con más detalles.
//
// Si la lista está vacía (porque los filtros no encontraron nada), muestra un
// mensaje diciendo que no hay resultados.
function renderProductos(lista) {
    grilla.innerHTML = "";

    if (lista.length === 0) {
        grilla.innerHTML = "<p class='sin-resultados'>No se encontraron productos con esos filtros.</p>";
        return;
    }

    lista.forEach(producto => {
        const card = document.createElement("div");
        card.className = "producto-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
            <div class="producto-card__img-wrap">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="producto-card__info">
                <h3 class="producto-card__nombre">${producto.nombre}</h3>
                <p class="producto-card__precio">$${producto.precio.toLocaleString("es-AR")}</p>
            </div>
        `;

        // Agregar evento click para abrir el modal
        card.addEventListener("click", () => abrirModal(producto));

        grilla.appendChild(card);
    });
}

// ============================================
// 4. CONTROLAR EL MODAL DE DETALLES
// ============================================
// El modal es esa ventana emergente que aparece cuando hacés click en un producto.
// Tiene funciones para abrirlo, cerrarlo, y responder a diferentes formas de cerrarlo
// (botón X, click afuera, tecla ESC).
//
// abrirModal(): Toma los datos del producto seleccionado y los pone en el modal,
//              luego hace visible el modal y bloquea el scroll de la página.
//
// cerrarModal(): Oculta el modal, restaura el scroll de la página, y limpia
//               la variable del producto actual.
function abrirModal(producto) {
    productoActual = producto;
    if (modalImg) modalImg.src = producto.imagen;
    if (modalImg) modalImg.alt = producto.nombre;
    if (modalTitulo) modalTitulo.textContent = producto.nombre;
    if (modalPrecio) modalPrecio.textContent = `$${producto.precio.toLocaleString("es-AR")}`;
    if (modalDescripcion) modalDescripcion.textContent = producto.descripcion;
    if (modalMadera) modalMadera.textContent = producto.madera.charAt(0).toUpperCase() + producto.madera.slice(1);
    if (modalTipo) modalTipo.textContent = producto.tabla.charAt(0).toUpperCase() + producto.tabla.slice(1);

    if (modal) modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Evitar scroll del body
}

function cerrarModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restaurar scroll
    productoActual = null;
}

// Evento para cerrar modal con el botón X
if (modalClose) {
    modalClose.addEventListener("click", cerrarModal);
}

// Evento para cerrar modal haciendo clic fuera del contenido
if (modal) {
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
}

// Evento para cerrar con tecla ESC
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
        cerrarModal();
    }
});

// ============================================
// 5. AGREGAR PRODUCTOS AL CARRITO
// ============================================
// Esta función maneja la lógica de agregar productos al carrito de compras.
// Usa localStorage para guardar el carrito en el navegador, así si el usuario
// cierra la página y vuelve, el carrito sigue ahí.
//
// El proceso es:
// 1. Verificar si hay un producto seleccionado en el modal
// 2. Buscar el carrito actual en localStorage (o crear uno vacío si no existe)
// 3. Verificar si el producto ya está en el carrito
// 4. Si ya está, aumentar la cantidad en 1
// 5. Si no está, agregarlo como nuevo item con cantidad 1
// 6. Guardar el carrito actualizado en localStorage
// 7. Mostrar una confirmación visual cambiando el botón por 1.5 segundos
function agregarAlCarrito() {
    if (!productoActual) return;

    // Obtener carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito
    const existe = carrito.find(item => item.id === productoActual.id);

    if (existe) {
        // Si existe, incrementar cantidad
        existe.cantidad += 1;
    } else {
        // Si no existe, agregar nuevo item
        carrito.push({
            id: productoActual.id,
            nombre: productoActual.nombre,
            precio: productoActual.precio,
            imagen: productoActual.imagen,
            cantidad: 1
        });
    }

    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar contador del carrito
    actualizarContadorCarrito();

    // Mostrar confirmación visual
    if (btnAgregarCarrito) {
        const btnOriginal = btnAgregarCarrito.textContent;
        btnAgregarCarrito.textContent = "¡Agregado!";
        btnAgregarCarrito.style.background = "#4a7c23";

        setTimeout(() => {
            btnAgregarCarrito.textContent = btnOriginal;
            btnAgregarCarrito.style.background = "#6b3e1a";
        }, 1500);
    }
}

// Evento para agregar al carrito
if (btnAgregarCarrito) {
    btnAgregarCarrito.addEventListener("click", agregarAlCarrito);
}

// ============================================
// 6. FILTRAR PRODUCTOS
// ============================================
// Esta función aplica los filtros que el usuario seleccionó en el sidebar.
// Filtra por:
// - Precio: entre el mínimo y máximo que el usuario ingresó
// - Tipo de madera: si seleccionó algún radio button de madera
// - Tipo de tabla: si seleccionó algún radio button de tabla
//
// Devuelve solo los productos que cumplen con TODOS los filtros activos
// y vuelve a dibujar la grilla con los resultados.
function aplicarFiltros() {
    const min = parseFloat(inputMin.value) || 0;
    const max = parseFloat(inputMax.value) || Infinity;

    const maderaSeleccionada = document.querySelector('input[name="madera"]:checked');
    const tablaSeleccionada = document.querySelector('input[name="tabla"]:checked');

    const filtrados = productos.filter(producto => {
        const cumplePrecio = producto.precio >= min && producto.precio <= max;
        const cumpleMadera = !maderaSeleccionada || producto.madera === maderaSeleccionada.value;
        const cumpleTabla = !tablaSeleccionada || producto.tabla === tablaSeleccionada.value;

        return cumplePrecio && cumpleMadera && cumpleTabla;
    });

    renderProductos(filtrados);
}

// ============================================
// 7. LIMPIAR LOS FILTROS
// ============================================
// Esta función "resetea" todos los filtros a su estado original:
// - Borra los campos de precio mínimo y máximo
// - Desmarca todos los radio buttons de madera y tabla
// - Vuelve a mostrar TODOS los productos sin filtrar
//
// Es útil cuando el usuario quiere empezar de nuevo con la búsqueda.
function resetearFiltros() {
    inputMin.value = "";
    inputMax.value = "";

    document.querySelectorAll('input[name="madera"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('input[name="tabla"]').forEach(radio => radio.checked = false);

    renderProductos(productos);
}

// ============================================
// 8. EVENTOS DE BOTONES Y TECLAS
// ============================================
// Acá conectamos las funciones con los botones y teclas:
// - Click en "Aplicar": ejecuta la función de filtrar
// - Click en "Restablecer": ejecuta la función de limpiar filtros
// - Tecla Enter en los campos de precio: también filtra (para comodidad del usuario)
//
// Esto hace que la página sea interactiva y responda a las acciones del usuario.
if (btnAplicar) {
    btnAplicar.addEventListener("click", aplicarFiltros);
}
if (btnReset) {
    btnReset.addEventListener("click", resetearFiltros);
}

// Aplicar filtros al apretar Enter en cualquier campo de filtro
// (no están dentro de un <form>, así que el Enter no hace nada por defecto)
if (inputMin && inputMax) {
    [inputMin, inputMax].forEach(input => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault(); // Prevenir comportamiento por defecto
                aplicarFiltros();
            }
        });
    });
}

// Aplicar filtros al apretar Enter en los radio buttons de madera y tabla
document.querySelectorAll('input[name="madera"], input[name="tabla"]').forEach(radio => {
    radio.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            aplicarFiltros();
        }
    });
});

// Aplicar filtros al apretar Enter en cualquier parte de la sección de filtros
const filtrosSidebar = document.querySelector(".filtros-sidebar");
if (filtrosSidebar) {
    filtrosSidebar.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            aplicarFiltros();
        }
    });
}

// ============================================
// 9. FILTROS DESDE LA URL
// ============================================
// Esta función permite que otros enlaces en el sitio puedan filtrar productos
// automáticamente. Por ejemplo, si desde la página de inicio alguien hace click
// en "Tablas de Asado", el enlace puede ser: productos.html?tabla=asado
//
// Esta función lee esos parámetros de la URL y:
// - Busca el radio button correspondiente y lo marca
// - Aplica automáticamente el filtro
// - Así el usuario llega directo a los productos que le interesan
function aplicarFiltrosDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    const tablaURL = params.get("tabla");
    const maderaURL = params.get("madera");

    let hayFiltroEnURL = false;

    if (tablaURL) {
        const radioTabla = document.querySelector(`input[name="tabla"][value="${tablaURL}"]`);
        if (radioTabla) {
            radioTabla.checked = true;
            hayFiltroEnURL = true;
        }
    }

    if (maderaURL) {
        const radioMadera = document.querySelector(`input[name="madera"][value="${maderaURL}"]`);
        if (radioMadera) {
            radioMadera.checked = true;
            hayFiltroEnURL = true;
        }
    }

    return hayFiltroEnURL;
}

// ============================================
// 10. INICIALIZACIÓN DE LA PÁGINA
// ============================================
// Este código se ejecuta automáticamente cuando la página termina de cargar.
// Primero verifica si hay filtros en la URL (por ejemplo, si alguien vino de
// un enlace externo con filtros preseleccionados). Si hay filtros, los aplica.
// Si no hay filtros, simplemente muestra todos los productos.
//
// Es el punto de partida que hace que todo funcione cuando el usuario abre la página.
document.addEventListener("DOMContentLoaded", () => {
    const hayFiltroEnURL = aplicarFiltrosDesdeURL();

    if (hayFiltroEnURL) {
        aplicarFiltros();
    } else {
        renderProductos(productos);
    }
});
