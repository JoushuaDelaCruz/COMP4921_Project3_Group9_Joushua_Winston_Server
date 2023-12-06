import database from "../mySQLDatabaseConnection.js";

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
    return [];
  }
};

export const createGroup = async (group_name, user_id) => {
  const query = `
  INSERT INTO freedb_DB_calendar.group (group_name, created_datetime, owner_user_id)
  VALUES (:group_name, :date_created, :user_id);
  `;
  const params = { group_name, date_created: new Date(), user_id };
  try {
    const result = await database.query(query, params);
    const group_id = result[0].insertId;
    return group_id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const addGroupMembers = async (group_id, friends) => {
  const query = `
  INSERT INTO user_group (group_id, user_id)
  VALUES (:group_id, :user_id);
  `;
  try {
    for (const friend of friends) {
      const params = { group_id, user_id: friend.value };
      await database.query(query, params);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const searchAcceptedFriends = async (current_user, name) => {
  const query = `
  SELECT 
    user_id as value,
    username as label
  FROM users 
  JOIN friend ON requester_user_id = :current_user AND friend_user_id = user_id OR requester_user_id = user_id AND friend_user_id = :current_user AND accepted = 1
  WHERE username LIKE :name AND user_id != :current_user`;

  const params = { current_user, name: `%${name}%` };
  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getFriends = async (current_user) => {
  const query = `
  SELECT 
	  username,
    image,
    date_added,
    accepted
  FROM users
  JOIN friend ON 
    requester_user_id = :current_user AND friend_user_id = user_id OR 
    requester_user_id = user_id AND friend_user_id = :current_user AND accepted = 1
  ORDER BY date_added DESC;
  `;

  const params = { current_user };

  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getGroups = async (user_id) => {
  const query = `
  SELECT 
	  group_name,
    created_datetime,
    COUNT(user_group_id) as num_members
  FROM freedb_DB_calendar.group
  JOIN user_group USING (group_id)
  WHERE owner_user_id = :user_id
  GROUP BY group_id`;
  const params = { user_id };

  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};
