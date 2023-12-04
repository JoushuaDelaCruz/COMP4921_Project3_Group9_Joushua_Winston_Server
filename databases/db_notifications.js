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

export const declineFriendRequest = async (user_id, friend_id) => {
  const query = `
        DELETE FROM friend
        WHERE friend_id = :friend_id AND friend_user_id = :user_id;
        `;
  const params = { user_id, friend_id };

  try {
    const results = await database.query(query, params);
    return results[0].affectedRows > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getEventInvites = async (current_user) => {
  const query = `
  SELECT 
	event_user_id,
    username as inviter,
    image,
    created_datetime,
    start_datetime,
    end_datetime,
    title as event_title
  FROM event
  JOIN event_user eu USING (event_id)
  JOIN users u ON original_user_id = u.user_id
  WHERE original_user_id != :user_id AND eu.user_id = :user_id AND accepted = 0
  ORDER BY created_datetime DESC;
  `;
  const params = { user_id: current_user };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};
