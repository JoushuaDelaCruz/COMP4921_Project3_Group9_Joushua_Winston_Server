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

export const addFriend = async (current_user, username_to_add) => {
  const { user_id: friend_id } = await getIDByName(username_to_add);
  if (friend_id === undefined) {
    return { success: false, message: "User does not exist", status: 404 };
  }
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
