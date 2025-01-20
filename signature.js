// Resolución del canvas (2x las dimensiones visuales)
const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const scale = 2; // Factor de escala para aumentar resolución
canvas.width = 600 * scale; // Duplicar ancho
canvas.height = 180 * scale; // Duplicar alto

// Ajustar tamaño visual del canvas
canvas.style.width = "600px";
canvas.style.height = "180px";

// Crear la imagen base
const baseImage = new Image();
baseImage.src = "./firma_original.jpg"; // Ruta local de la imagen base

// Cargar la imagen base al cargar la página
baseImage.onload = () => {
    renderSignature();
};

// Función para dibujar la firma en el canvas
function renderSignature() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la imagen base
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Obtener los valores de los campos
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    // Configuración específica para cada campo
    const styles = {
        name: {
            font: "bold 40px 'Montserrat', sans-serif", // Fuente y tamaño
            color: "#562b16", // Color
            position: { x: canvas.width - 420, y: 100 }, // Posición
        },
        position: {
            font: "30px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 420, y: 135 },
        },
        phone: {
            font: "bold 25px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 467, y: 190 },
        },
        email: {
            font: "bold 25px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 467, y: 230 },
        },
    };

    // Dibujar cada campo con su estilo independiente
    if (name) {
        ctx.font = styles.name.font;
        ctx.fillStyle = styles.name.color;
        ctx.textAlign = "right";
        ctx.fillText(name, styles.name.position.x, styles.name.position.y);

        // Dibujar línea de subrayado debajo del nombre
        const textWidth = ctx.measureText(name).width; // Ancho del texto
        const underlineOffset = 5; // Espacio entre el texto y la línea
        ctx.beginPath();
        ctx.moveTo(
            styles.name.position.x - textWidth,
            styles.name.position.y + underlineOffset
        ); // Inicio de la línea
        ctx.lineTo(
            styles.name.position.x,
            styles.name.position.y + underlineOffset
        ); // Fin de la línea
        ctx.lineWidth = 2; // Grosor de la línea
        ctx.strokeStyle = styles.name.color; // Color de la línea
        ctx.stroke();
    }

    if (position) {
        ctx.font = styles.position.font;
        ctx.fillStyle = styles.position.color;
        ctx.textAlign = "right";
        ctx.fillText(position, styles.position.position.x, styles.position.position.y);
    }

    if (phone) {
        ctx.font = styles.phone.font;
        ctx.fillStyle = styles.phone.color;
        ctx.textAlign = "right";
        ctx.fillText(phone, styles.phone.position.x, styles.phone.position.y);
    }

    if (email) {
        ctx.font = styles.email.font;
        ctx.fillStyle = styles.email.color;
        ctx.textAlign = "right";
        ctx.fillText(email, styles.email.position.x, styles.email.position.y);
    }

    // Actualizar el enlace de descarga
    const downloadLink = document.getElementById("downloadLink");
    const imageUrl = canvas.toDataURL("image/png"); // Convertir canvas a imagen PNG
    downloadLink.href = imageUrl; // Establecer la URL del enlace
    downloadLink.download = "firma.png"; // Nombre del archivo
}

// Agregar eventos al formulario para renderizar en tiempo real
document.getElementById("signatureForm").addEventListener("input", renderSignature);

document.getElementById("signatureForm").addEventListener("input", function (e) {
    const name = document.getElementById("name");
    const position = document.getElementById("position");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

    // Validación de Nombre y Cargo (máximo 30 caracteres)
    if (name.value.length > 28) {
        alert("El nombre no puede tener más de 28 caracteres.");
        name.value = name.value.substring(0, 28);
    }

    if (position.value.length > 30) {
        alert("El cargo no puede tener más de 22 caracteres.");
        position.value = position.value.substring(0, 30);
    }

    // Validación de Teléfono (números, paréntesis, guiones y espacios)
    if (!/^[0-9()\-\s]*$/.test(phone.value)) {
        alert("El teléfono solo puede contener números, paréntesis, guiones y espacios.");
        phone.value = phone.value.replace(/[^0-9()\-\s]/g, ""); // Elimina caracteres no permitidos
    }
});

// Validación del correo cuando el usuario termina de escribir
document.getElementById("email").addEventListener("blur", function () {
    const email = document.getElementById("email");
    const errorMessage = document.getElementById("emailError");

    // Verifica si el correo es válido
    if (email.value.trim() !== "" && email.validity.typeMismatch) {
        errorMessage.textContent = "Por favor, ingresa un correo válido.";
    } else {
        errorMessage.textContent = ""; // Limpia el mensaje si es válido
    }
});
