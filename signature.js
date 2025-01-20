// Referencia al canvas y contexto
const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

// Crear la imagen base
const baseImage = new Image();
baseImage.src = "./formato_firma.png"; // Ruta local de la imagen base

// Cargar la imagen base al cargar la página
baseImage.onload = () => {
    renderSignature(); // Dibujar la imagen al cargar
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
            font: "bold 18px Arial", // Fuente y tamaño
            color: "#6e2c00", // Color
            position: { x: canvas.width - 210, y: 60 }, // Posición
        },
        position: {
            font: "bold 14px Arial",
            color: "#6e2c00",
            position: { x: canvas.width - 210, y: 75 },
        },
        phone: {
            font: "bold 12px Arial",
            color: "#6e2c00",
            position: { x: canvas.width - 220, y: 105 },
        },
        email: {
            font: "bold 12px Arial",
            color: "#6e2c00",
            position: { x: canvas.width - 220, y: 127 },
        },
    };

    // Dibujar cada campo con su estilo independiente
    if (name) {
        ctx.font = styles.name.font;
        ctx.fillStyle = styles.name.color;
        ctx.textAlign = "right";
        ctx.fillText(name, styles.name.position.x, styles.name.position.y);
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
    if (name.value.length > 30) {
        alert("El nombre no puede tener más de 30 caracteres.");
        name.value = name.value.substring(0, 30);
    }

    if (position.value.length > 30) {
        alert("El cargo no puede tener más de 30 caracteres.");
        position.value = position.value.substring(0, 30);
    }

     // Validación de Teléfono (números, paréntesis, guiones y espacios)
     if (!/^[0-9()\-\s]*$/.test(phone.value)) {
        alert("El teléfono solo puede contener números, paréntesis, guiones y espacios.");
        phone.value = phone.value.replace(/[^0-9()\-\s]/g, ""); // Elimina caracteres no permitidos
    }

    // Validación de Correo (HTML5 lo maneja, pero puedes agregar validaciones adicionales)
    if (email.validity.typeMismatch) {
        alert("Por favor, ingresa un correo válido.");
    }
});
