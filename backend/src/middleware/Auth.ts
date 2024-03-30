import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

// jwtcheck is a middleware that we created to check the JWT token and verify that it is valid.
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

// jwtParse is a middleware that we created to parse the JWT token and set the auth0Id and userId properties on the request object.
export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decoded.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error parsing token" });
  }
};
