import database from "../mySQLDatabaseConnection.js";

export const register = async (credentials) => {
  const query = `
        INSERT INTO users (username, email, password)
        VALUES (:username, :email, :password)
    `;
  const params = credentials;

  const result = await database.query(query, params);
  return result[0].insertId !== undefined;
};

export const getUserByEmail = async (email) => {
  const query = `
        SELECT 
          user_id,
          username,
          password 
        FROM users
        WHERE email = :email
    `;
  const params = { email };

  const result = await database.query(query, params);
  return result[0][0];
};
