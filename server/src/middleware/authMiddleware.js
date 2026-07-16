import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized: No token provided" 
    });
  }

  
  if (!process.env.JWT_SECRET) {
    console.error("[AUTH ERROR]: JWT_SECRET is missing from environment variables.");
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
      req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };

    return next();
  } catch (error) {
    console.error(`[AUTH WARN]: Token verification failed - ${error.message}`);
    
    return res.status(401).json({ 
      success: false, 
      error: "Unauthorized: Invalid or expired token" 
    });
  }
};

export default authMiddleware;