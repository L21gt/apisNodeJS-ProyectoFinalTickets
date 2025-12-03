const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar si el usuario tiene un Token válido.
 * Si no tiene token, devuelve 401.
 */
exports.verifyToken = (req, res, next) => {
  try {
    // 1. Obtener el token del header "Authorization: Bearer <token>"
    const bearerHeader = req.headers['authorization'];
    
    if (!bearerHeader) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    // Separar "Bearer" del token real
    const token = bearerHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    // 2. Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Guardar los datos del usuario en la request para usarlos luego
    req.user = decoded; // { id: 1, role: 'admin', ... }
    
    next(); // Dejar pasar al siguiente paso

  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

/**
 * Middleware para verificar si el usuario es Administrador.
 * Debe usarse DESPUÉS de verifyToken.
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Es admin, pase adelante
  } else {
    return res.status(403).json({ message: 'Acceso prohibido. Se requieren permisos de administrador.' });
  }
};