// Resolución del canvas
const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const scale = 1;
canvas.width = 550 * scale;
canvas.height = 165 * scale;
canvas.style.width = "550px";
canvas.style.height = "165px";

// Imágenes para I. Municipalidad de Quemchi
const baseImageMuni = new Image();
baseImageMuni.src = "./firma_original.jpg";

const baseImageMuniNoPhone = new Image();
baseImageMuniNoPhone.src = "./firma_original_sintelefono.jpg";

// Imágenes para otras instituciones (Salud)
const baseImageSalud = new Image();
baseImageSalud.src = "./firma_original_s.jpg";

const baseImageSaludNoPhone = new Image();
baseImageSaludNoPhone.src = "./firma_original_sintelefono_s.jpg";

let imagesLoaded = 0;
const checkImagesLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        renderSignature();
    }
};

baseImageMuni.onload = checkImagesLoaded;
baseImageMuniNoPhone.onload = checkImagesLoaded;
baseImageSalud.onload = checkImagesLoaded;
baseImageSaludNoPhone.onload = checkImagesLoaded;

const noPhoneCheckbox = document.getElementById("noPhone");
const phoneGroup = document.getElementById("phoneGroup");
noPhoneCheckbox.addEventListener("change", () => {
    if (noPhoneCheckbox.checked) {
        phoneGroup.style.display = "none";
        document.getElementById("phone").value = "";
    } else {
        phoneGroup.style.display = "flex";
    }
    renderSignature();
});

function renderSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Determinar qué imagen usar según la institución y el checkbox
    const institution = document.getElementById("institution").value;
    const isMunicipalidad = institution === "I. Municipalidad de Quemchi" || institution === "";

    let imageToUse;
    if (isMunicipalidad) {
        imageToUse = noPhoneCheckbox.checked ? baseImageMuniNoPhone : baseImageMuni;
    } else {
        imageToUse = noPhoneCheckbox.checked ? baseImageSaludNoPhone : baseImageSalud;
    }

    ctx.drawImage(imageToUse, 0, 0, canvas.width, canvas.height);

    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    const styles = {
        name: {
            font: "bold 18.5px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 192.5, y: 36 },
        },
        position: {
            font: "12px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 192.5, y: 53 },
        },
        institution: {
            font: "12px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 192.5, y: 68 },
        },
        phone: {
            font: "bold 11.5px 'Montserrat', sans-serif",
            color: "#562b16",
            position: { x: canvas.width - 214.5, y: 87 },
        },
        email: {
            font: "bold 11.5px 'Montserrat', sans-serif",
            color: "#562b16",
            position: {
                x: canvas.width - 214.5,
                y: noPhoneCheckbox.checked ? (institution ? 87 : 87) : 106, // Ajustar según teléfono
            },
        },
    };

    if (name) {
        // Dividir el nombre en primer nombre y resto
        const spaceIndex = name.indexOf(' ');
        const firstName = spaceIndex !== -1 ? name.substring(0, spaceIndex) : name;
        const restOfName = spaceIndex !== -1 ? name.substring(spaceIndex) : '';

        ctx.fillStyle = styles.name.color;
        ctx.textAlign = "right";

        // Medir el ancho total del texto
        ctx.font = styles.name.font;
        const firstNameWidth = ctx.measureText(firstName).width;
        ctx.font = "18.5px 'Montserrat', sans-serif"; // Fuente normal para el resto
        const restNameWidth = restOfName ? ctx.measureText(restOfName).width : 0;
        const totalWidth = firstNameWidth + restNameWidth;

        // Dibujar el resto del nombre (fuente normal)
        if (restOfName) {
            ctx.font = "18.5px 'Montserrat', sans-serif";
            ctx.fillText(restOfName, styles.name.position.x, styles.name.position.y);
        }

        // Dibujar el primer nombre en negrita (después, para que quede a la izquierda del resto)
        ctx.font = styles.name.font;
        ctx.fillText(firstName, styles.name.position.x - restNameWidth, styles.name.position.y);

        // Subrayar todo el nombre
        const underlineOffset = 2.2;
        ctx.beginPath();
        ctx.moveTo(styles.name.position.x - totalWidth, styles.name.position.y + underlineOffset);
        ctx.lineTo(styles.name.position.x, styles.name.position.y + underlineOffset);
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = styles.name.color;
        ctx.stroke();
    }

    if (position) {
        ctx.font = styles.position.font;
        ctx.fillStyle = styles.position.color;
        ctx.textAlign = "right";
        ctx.fillText(position, styles.position.position.x, styles.position.position.y);
    }

    // Dibujar institución (siempre, si está seleccionada)
    if (institution) {
        ctx.font = styles.institution.font;
        ctx.fillStyle = styles.institution.color;
        ctx.textAlign = "right";
        ctx.fillText(institution, styles.institution.position.x, styles.institution.position.y);
    }

    // Dibujar número de teléfono (solo si no está marcado el checkbox)
    if (!noPhoneCheckbox.checked && phone) {
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

    const downloadLink = document.getElementById("downloadLink");
    const imageUrl = canvas.toDataURL("image/png");
    downloadLink.href = imageUrl;
    downloadLink.download = "firma.png";
}

// Función para generar firma HTML con enlaces clickeables
function generateHtmlSignature(name, position, institution, phone, email) {
    // Convertir la imagen actual del canvas a base64
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Determinar qué imagen usar según la institución y el checkbox
    const isMunicipalidad = institution === "I. Municipalidad de Quemchi" || institution === "";
    let imageToUse;
    if (isMunicipalidad) {
        imageToUse = noPhoneCheckbox.checked ? baseImageMuniNoPhone : baseImageMuni;
    } else {
        imageToUse = noPhoneCheckbox.checked ? baseImageSaludNoPhone : baseImageSalud;
    }

    // Dibujar solo la imagen de fondo
    tempCtx.drawImage(imageToUse, 0, 0, tempCanvas.width, tempCanvas.height);
    const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.9);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0; }
        .signature {
            position: relative;
            width: 600px;
            height: 180px;
            background-image: url('${imageBase64}');
            background-size: cover;
        }
        .signature-text {
            position: absolute;
            right: 180px;
            top: 40px;
            text-align: right;
            color: #562b16;
        }
        .name { font-size: 40px; font-weight: bold; text-decoration: underline; }
        .position { font-size: 30px; font-weight: bold; margin-top: 5px; }
        .institution { font-size: 30px; font-weight: bold; margin-top: 15px; }
        .contact { position: absolute; right: 133px; bottom: ${noPhoneCheckbox.checked ? '50px' : '10px'}; text-align: right; color: #562b16; }
        .contact a { color: #562b16; text-decoration: none; font-weight: bold; font-size: 25px; display: block; }
        .contact a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="signature">
        <div class="signature-text">
            <div class="name">${name || ''}</div>
            <div class="position">${position || ''}</div>
            <div class="institution">${institution || ''}</div>
        </div>
        <div class="contact">
            ${!noPhoneCheckbox.checked && phone ? `<a href="tel:${phone}">${phone}</a>` : ''}
            ${email ? `<a href="mailto:${email}">${email}</a>` : ''}
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const downloadHtmlLink = document.getElementById("downloadHtmlLink");
    downloadHtmlLink.href = url;
    downloadHtmlLink.download = "firma.html";
}

// Función para capitalizar la primera letra de cada palabra
function capitalizeWords(str) {
    // Palabras que no deben capitalizarse (excepto al inicio)
    const lowercaseWords = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'en', 'a', 'al', 'con', 'por', 'para', 'sin'];

    return str.toLowerCase().replace(/(^|\s)(\S+)/g, function(match, space, word) {
        // Siempre capitalizar la primera palabra
        if (space === '') {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        // No capitalizar palabras comunes (de, del, la, etc.)
        if (lowercaseWords.includes(word.toLowerCase())) {
            return space + word.toLowerCase();
        }
        // Capitalizar otras palabras
        return space + word.charAt(0).toUpperCase() + word.slice(1);
    });
}

// Capitalizar automáticamente en los campos nombre y cargo
document.getElementById("name").addEventListener("input", function(e) {
    const cursorPos = this.selectionStart;
    const value = this.value;
    const capitalizedValue = capitalizeWords(value);

    if (value !== capitalizedValue) {
        this.value = capitalizedValue;
        this.setSelectionRange(cursorPos, cursorPos);
    }
});

document.getElementById("position").addEventListener("input", function(e) {
    const cursorPos = this.selectionStart;
    const value = this.value;
    const capitalizedValue = capitalizeWords(value);

    if (value !== capitalizedValue) {
        this.value = capitalizedValue;
        this.setSelectionRange(cursorPos, cursorPos);
    }
});

document.getElementById("signatureForm").addEventListener("input", renderSignature);

document.getElementById("signatureForm").addEventListener("input", function (e) {
    const name = document.getElementById("name");
    const position = document.getElementById("position");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");

    if (name.value.length > 30) {
        alert("El nombre no puede tener más de 30 caracteres.");
        name.value = name.value.substring(0, 30);
    }

    if (position.value.length > 60) {
        alert("El cargo no puede tener más de 60 caracteres.");
        position.value = position.value.substring(0, 60);
    }

    if (!/^[0-9()\-\s]*$/.test(phone.value)) {
        alert("El teléfono solo puede contener números, paréntesis, guiones y espacios.");
        phone.value = phone.value.replace(/[^0-9()\-\s]/g, "");
    }
});

document.getElementById("email").addEventListener("blur", function () {
    const email = document.getElementById("email");
    const errorMessage = document.getElementById("emailError");

    if (email.value.trim() !== "" && email.validity.typeMismatch) {
        errorMessage.textContent = "Por favor, ingresa un correo válido.";
    } else {
        errorMessage.textContent = "";
    }
});
