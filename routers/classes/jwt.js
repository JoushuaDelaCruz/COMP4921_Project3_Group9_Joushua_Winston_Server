import jwt from "jsonwebtoken";

const expireTime = "1hr";

export const login = async (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: expireTime },
      (err, token) => {
        if (err) {
          reject(err);
        }
        resolve(token);
      }
    );
  });
};

const _verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        throw err;
      }
      resolve(decoded);
    });
  });
};

export const verify = async (token) => {
  try {
    const data = await _verify(token);
    return { is_valid: true, status: "valid", data: data };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { is_valid: false, status: "expired" };
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return { is_valid: false, status: "tampered" };
    }
    return { is_valid: false, status: "invalid" };
  }
};
