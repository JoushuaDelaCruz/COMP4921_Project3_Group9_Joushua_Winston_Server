import database from "../mySQLDatabaseConnection.js";

export const register = async (username, password) => {
  const query = `
        INSERT INTO users (username, password)
        VALUES (:username, :password)
    `;
  const params = { username, password };

  try {
    const result = await database.query(query, params);
    return result.insertId !== undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
};
