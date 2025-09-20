import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(400).json({
        success: false,
        message: "You Are UnAuthorize",
      });

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    req.userId = userId;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "isAuth error",
    });
  }
};
