const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento temporal
// Multer guardará el archivo en la memoria RAM temporalmente antes de subirlo a Cloudinary
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Only images format allowed (jpeg, jpg, png, webp)"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB
  fileFilter: fileFilter,
});

module.exports = upload;
