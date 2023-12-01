import database from "../mySQLDatabaseConnection.js";

export const getFriendRequests = async (user_id) => {
  const query = `
    SELECT 
        friend_id,
        username,
        image,
        date_added,
        accepted
    FROM users
    JOIN friend ON requester_user_id = user_id AND friend_user_id = :user_id AND accepted = 0
    ORDER BY date_added DESC;
    `;
  const params = { user_id };

  try {
    const results = await database.query(query, params);
    return results[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const acceptFriendRequest = async (user_id, friend_id) => {
  const query = `
        UPDATE friend
        SET accepted = 1, date_added = :date_added
        WHERE friend_id = :friend_id AND friend_user_id = :user_id;
        `;
  const params = { user_id, friend_id, date_added: new Date() };

  try {
    const results = await database.query(query, params);
    return results[0].affectedRows > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
};
