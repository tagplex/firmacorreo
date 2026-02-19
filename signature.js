// Resolución del canvas
const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const LOGICAL_WIDTH = 550;
const LOGICAL_HEIGHT = 165;
const scale = window.devicePixelRatio || 1;
canvas.width = LOGICAL_WIDTH * scale;
canvas.height = LOGICAL_HEIGHT * scale;
canvas.style.width = LOGICAL_WIDTH + "px";
canvas.style.height = LOGICAL_HEIGHT + "px";
ctx.scale(scale, scale);
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Imagen base con teléfono (por defecto)
const baseImage = new Image();
baseImage.src = "./firma_original.jpg";

// Imagen base sin teléfono
const baseImageNoPhone = new Image();
baseImageNoPhone.src = "./firma_original_sintelefono.jpg";

// Logo Municipalidad de Quemchi
const logoMuni = new Image();
logoMuni.src = "./logo_muni.png";

// Configuración del logo Municipalidad (ancho fijo, alto según proporción real de la imagen)
const LOGO_MUNI_WIDTH = 120;
const LOGO_MUNI_X = LOGICAL_WIDTH - LOGO_MUNI_WIDTH - 30; // 30px margen derecho

// Logo Salud
const logoSalud = new Image();
logoSalud.src = "./logo_salud.png";

// Configuración del logo Salud
const LOGO_SALUD_WIDTH = 95;
const LOGO_SALUD_X = LOGICAL_WIDTH - LOGO_SALUD_WIDTH - 43; // centrado en panel derecho

// Reduce una imagen en pasos del 50% hasta el tamaño objetivo.
// Produce mejor nitidez que un único drawImage de grande a pequeño.
function prescaleImage(img) {
    const targetW = LOGICAL_WIDTH;
    const targetH = LOGICAL_HEIGHT;
    const srcW = img.naturalWidth || targetW;
    const srcH = img.naturalHeight || targetH;

    // Si la imagen no es significativamente más grande, no hay ganancia
    if (srcW <= targetW * 1.5) return img;

    let canvas = document.createElement('canvas');
    canvas.width = srcW;
    canvas.height = srcH;
    canvas.getContext('2d').drawImage(img, 0, 0);

    // Reducir a la mitad repetidamente hasta quedar a un paso del tamaño final
    while (canvas.width > targetW * 1.5) {
        const nextW = Math.max(Math.round(canvas.width / 2), targetW);
        const nextH = Math.max(Math.round(canvas.height / 2), targetH);
        const tmp = document.createElement('canvas');
        tmp.width = nextW;
        tmp.height = nextH;
        const tmpCtx = tmp.getContext('2d');
        tmpCtx.imageSmoothingEnabled = true;
        tmpCtx.imageSmoothingQuality = 'high';
        tmpCtx.drawImage(canvas, 0, 0, nextW, nextH);
        canvas = tmp;
    }
    return canvas;
}

let prescaledBase = null;
let prescaledBaseNoPhone = null;

let imagesLoaded = 0;
const checkImagesLoaded = () => {
    imagesLoaded++;
    if (imagesLoaded === 4) {
        prescaledBase = prescaleImage(baseImage);
        prescaledBaseNoPhone = prescaleImage(baseImageNoPhone);
        renderSignature();
    }
};

baseImage.onload = checkImagesLoaded;
baseImageNoPhone.onload = checkImagesLoaded;
logoMuni.onload = checkImagesLoaded;
logoSalud.onload = checkImagesLoaded;

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

function getCurrentImage() {
    if (noPhoneCheckbox.checked) {
        return prescaledBaseNoPhone || baseImageNoPhone;
    }
    return prescaledBase || baseImage;
}

// Dibuja el contenido de la firma sobre cualquier contexto.
// El contexto debe tener aplicado ctx.scale(ratio, ratio) antes de llamar esta función,
// de modo que las coordenadas lógicas (LOGICAL_WIDTH x LOGICAL_HEIGHT) se mapeen correctamente.
function drawSignatureContent(tCtx, imageToUse) {
    const institution = document.getElementById("institution").value;
    const name = document.getElementById("name").value;
    const position = document.getElementById("position").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const noPhone = noPhoneCheckbox.checked;

    tCtx.drawImage(imageToUse, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    // Logo según institución (respeta proporción original de la imagen)
    if (institution === "I. Municipalidad de Quemchi" || institution === "") {
        let logoW = LOGO_MUNI_WIDTH;
        let logoH = logoW * (logoMuni.naturalHeight / logoMuni.naturalWidth);
        if (logoH > LOGICAL_HEIGHT) {
            logoH = LOGICAL_HEIGHT;
            logoW = logoH * (logoMuni.naturalWidth / logoMuni.naturalHeight);
        }
        const logoX = LOGO_MUNI_X + (LOGO_MUNI_WIDTH - logoW) / 2;
        const logoY = (LOGICAL_HEIGHT - logoH) / 2;
        tCtx.drawImage(logoMuni, logoX, logoY, logoW, logoH);
    } else {
        const logoH = LOGO_SALUD_WIDTH * (logoSalud.naturalHeight / logoSalud.naturalWidth);
        const logoY = (LOGICAL_HEIGHT - logoH) / 2;
        tCtx.drawImage(logoSalud, LOGO_SALUD_X, logoY, LOGO_SALUD_WIDTH, logoH);
    }

    const styles = {
        name: {
            font: "bold 18.5px 'Montserrat', sans-serif",
            normalFont: "18.5px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 192.5,
            y: 36,
        },
        position: {
            font: "bold 12px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 192.5,
            y: 53,
        },
        institution: {
            font: "12px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 192.5,
            y: 68,
        },
        phone: {
            font: "bold 11.5px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 214.5,
            y: 87,
        },
        email: {
            font: "bold 11.5px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 214.5,
            y: noPhone ? 85 : 104,
        },
        web: {
            font: "bold 11.5px 'Montserrat', sans-serif",
            color: "#562b16",
            x: LOGICAL_WIDTH - 214.5,
            y: noPhone ? 104 : 123,
        },
    };

    if (name) {
        const spaceIndex = name.indexOf(' ');
        const firstName = spaceIndex !== -1 ? name.substring(0, spaceIndex) : name;
        const restOfName = spaceIndex !== -1 ? name.substring(spaceIndex) : '';

        tCtx.fillStyle = styles.name.color;
        tCtx.textAlign = "right";

        tCtx.font = styles.name.font;
        const firstNameWidth = tCtx.measureText(firstName).width;
        tCtx.font = styles.name.normalFont;
        const restNameWidth = restOfName ? tCtx.measureText(restOfName).width : 0;
        const totalWidth = firstNameWidth + restNameWidth;

        if (restOfName) {
            tCtx.font = styles.name.normalFont;
            tCtx.fillText(restOfName, styles.name.x, styles.name.y);
        }

        tCtx.font = styles.name.font;
        tCtx.fillText(firstName, styles.name.x - restNameWidth, styles.name.y);

        const underlineOffset = 2.2;
        tCtx.beginPath();
        tCtx.moveTo(styles.name.x - totalWidth, styles.name.y + underlineOffset);
        tCtx.lineTo(styles.name.x, styles.name.y + underlineOffset);
        tCtx.lineWidth = 0.9;
        tCtx.strokeStyle = styles.name.color;
        tCtx.stroke();
    }

    if (position) {
        tCtx.font = styles.position.font;
        tCtx.fillStyle = styles.position.color;
        tCtx.textAlign = "right";
        tCtx.fillText(position, styles.position.x, styles.position.y);
    }

    if (institution) {
        tCtx.font = styles.institution.font;
        tCtx.fillStyle = styles.institution.color;
        tCtx.textAlign = "right";
        tCtx.fillText(institution, styles.institution.x, styles.institution.y);
    }

    if (!noPhone && phone) {
        tCtx.font = styles.phone.font;
        tCtx.fillStyle = styles.phone.color;
        tCtx.textAlign = "right";
        tCtx.fillText(phone, styles.phone.x, styles.phone.y);
    }

    if (email) {
        tCtx.font = styles.email.font;
        tCtx.fillStyle = styles.email.color;
        tCtx.textAlign = "right";
        tCtx.fillText(email, styles.email.x, styles.email.y);
    }

    tCtx.font = styles.web.font;
    tCtx.fillStyle = styles.web.color;
    tCtx.textAlign = "right";
    tCtx.fillText("www.muniquemchi.cl", styles.web.x, styles.web.y);
}

function renderSignature() {
    const imageToUse = getCurrentImage();

    // --- Preview canvas (coordenadas lógicas, ctx ya tiene scale aplicado) ---
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    drawSignatureContent(ctx, imageToUse);

    // --- Canvas de descarga al mismo tamaño lógico (550×165) ---
    const dlCanvas = document.createElement('canvas');
    dlCanvas.width = LOGICAL_WIDTH;
    dlCanvas.height = LOGICAL_HEIGHT;
    const dlCtx = dlCanvas.getContext('2d');
    dlCtx.imageSmoothingEnabled = true;
    dlCtx.imageSmoothingQuality = 'high';
    drawSignatureContent(dlCtx, imageToUse);

    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = dlCanvas.toDataURL("image/png");
    downloadLink.download = "firma.png";
}

// Función para generar firma HTML con enlaces clickeables
function generateHtmlSignature(name, position, institution, phone, email) {
    const imageToUse = getCurrentImage();
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = imageToUse.naturalWidth || LOGICAL_WIDTH;
    tempCanvas.height = imageToUse.naturalHeight || LOGICAL_HEIGHT;
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
    const lowercaseWords = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'e', 'en', 'a', 'al', 'con', 'por', 'para', 'sin'];

    return str.toLowerCase().replace(/(^|\s)(\S+)/g, function(match, space, word) {
        if (space === '') {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        if (lowercaseWords.includes(word.toLowerCase())) {
            return space + word.toLowerCase();
        }
        return space + word.charAt(0).toUpperCase() + word.slice(1);
    });
}

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
