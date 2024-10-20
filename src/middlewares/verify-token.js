import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorized - no token provide",
      });
    }

    const TOKEN = process.env.JWT_SECRET;
    const decodeToken = await jwt.verify(token, TOKEN);
    if (!decodeToken) {
      return res.status(401).json({
        success: false,
        message: "unauthorized - invalid token",
      });
    }

    req.userId = decodeToken?.userId;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error?.message,
    });
  }
};
