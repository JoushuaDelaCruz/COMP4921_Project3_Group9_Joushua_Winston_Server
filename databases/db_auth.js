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

export const checkEmailExists = async (email) => {
  const query = `
  SELECT
    email
  FROM users
  WHERE email = :email
  `;
  const params = { email };

  const result = await database.query(query, params);
  return result[0].length === 1;
};

export const checkUsernameExists = async (username) => {
  const query = `
  SELECT
    username
  FROM users
  WHERE username = :username
  `;
  const params = { username };

  const result = await database.query(query, params);
  return result[0].length === 1;
};
