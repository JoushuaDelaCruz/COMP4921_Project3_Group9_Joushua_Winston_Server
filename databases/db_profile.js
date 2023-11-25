import database from "../mySQLDatabaseConnection.js";

export const getProfileByName = async (username, current_user) => {
  const query = `
  SELECT 
	  username,
    CASE WHEN friend_id IS NOT NULL THEN 1 ELSE 0 END AS is_added
  FROM users
  LEFT JOIN friend ON requester_user_id = :current_user AND friend_user_id = user_id OR requester_user_id = user_id AND friend_user_id = :current_user
  WHERE username = :username
  `;
  const params = { username, current_user };
  const result = await database.query(query, params);
  return result[0];
};

export const getIDByName = async (username) => {
  const query = `
    SELECT 
        user_id
    FROM users
    WHERE username = :username
          `;
  const params = { username };

  const result = await database.query(query, params);
  return result[0][0];
};

export const addFriend = async (current_user, friend_id) => {
  const query = `
    INSERT INTO friend (requester_user_id, friend_user_id, date_added)
    VALUES (:current_user, :friend_id, :date_created)
    `;
  const params = { current_user, friend_id, date_created: new Date() };
  try {
    const result = await database.query(query, params);
    if (result[0].affectedRows > 0) {
      return { success: true, status: 200 };
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { success: false, message: "Friend already added", status: 409 };
    }
    return { success: false, message: "Error adding friend", status: 500 };
  }
};

export const getRandomUsers = async (current_user) => {
  const query = `
  SELECT 
	user_id,
    username,
    date_created,
    image
  FROM users 
  LEFT JOIN friend ON requester_user_id = :current_user AND friend_user_id = user_id OR requester_user_id = user_id AND friend_user_id = :current_user
  WHERE friend_id IS NULL AND user_id != :current_user
  LIMIT 3;`;

  const params = { current_user };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const searchFriends = async (current_user, name) => {
  const query = `
  SELECT 
  user_id,
    username,
    date_created,
    image
  FROM users 
  LEFT JOIN friend ON requester_user_id = :current_user AND friend_user_id = user_id OR requester_user_id = user_id AND friend_user_id = :current_user
  WHERE username LIKE :name AND friend_id IS NULL AND user_id != :current_user
  LIMIT 3;`;

  const params = { current_user, name: `%${name}%` };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};
