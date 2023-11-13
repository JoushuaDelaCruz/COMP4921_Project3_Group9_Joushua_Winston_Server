import database from "../mySQLDatabaseConnection.js";

export const register = async (credentials) => {
  const query = `
        INSERT INTO users (username, email, password)
        VALUES (:username, :email, :password)
    `;
  const params = credentials;

  try {
    const result = await database.query(query, params);
    return result.insertId !== undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
};
