import database from "../mySQLDatabaseConnection.js";

export const getEventsById = async (user_id, username) => {
  const query = `
      SELECT 
        title,
        start_datetime,
        end_datetime,
        event_colour,
        is_all_day,
        start_timezone,
        end_timezone,
        location,
        description,
        recurrence_rule,
        uuid,
        event_friends.friends,
        username,
        group_id
      FROM event
      JOIN event_user USING (event_id)
      JOIN users ON (event.original_user_id = users.user_id)
      LEFT JOIN (SELECT GROUP_CONCAT(username) as friends, event_id
        FROM event_user
        JOIN users USING (user_id)
        WHERE username != :username
        GROUP BY(event_id)) as event_friends USING (event_id)
      LEFT JOIN event_group USING (event_id)
      LEFT JOIN freedb_DB_calendar.group USING (group_id)
      WHERE event_user.user_id = :user_id
      AND accepted = 1
      AND recycle_datetime IS NULL;
    `;
  const params = { user_id, username };

  const result = await database.query(query, params);
  return result[0];
};

export const createEvent = async (eventData) => {
  const query = `
    INSERT INTO event (original_user_id, title, start_datetime, end_datetime, event_colour, created_datetime, is_all_day, start_timezone, end_timezone, location, description, recurrence_rule, uuid) 
    VALUES (:user_id, :title, :start_datetime, :end_datetime, :event_colour, :created_datetime, :is_all_day, :start_timezone, :end_timezone, :location, :description, :recurrence_rule, :uuid);
    `;

  const params = eventData;

  const result = await database.query(query, params);
  return result[0].insertId !== undefined;
};

export const deleteEvent = async (uuid, user_id) => {
  const deleteDate = new Date();
  const query = `
      UPDATE event_user SET recycle_datetime = :delete_date
      WHERE user_id = :user_id
      AND event_id = (SELECT event_id FROM event WHERE uuid = :uuid);
    `;

  const result = await database.query(query, {
    delete_date: deleteDate,
    uuid: uuid,
    user_id: user_id
  });
  return result[0].affectedRows !== 0;
};

export const updateEvent = async (eventData) => {
  const query = `
    UPDATE event SET title = :title, start_datetime = :start_datetime, end_datetime = :end_datetime, 
    event_colour = :event_colour, is_all_day = :is_all_day, start_timezone = :start_timezone, end_timezone = :end_timezone, location = :location, 
    description = :description, recurrence_rule = :recurrence_rule
    WHERE (uuid = :uuid);
    `;

  const params = eventData;

  const result = await database.query(query, params);
  return result[0].affectedRows !== 0;
};

export const sendEventRequest = async (uuid, friends) => {
  const query = `
    INSERT INTO event_user (event_id, user_id) 
    VALUES (
      (SELECT event_id FROM event WHERE uuid = :uuid), 
      (SELECT user_id from users WHERE username = :username)
      );
  `;
  await friends.forEach((friend) => {
    try {
      database.query(query, { uuid: uuid, username: friend });
    } catch {
      console.log("ERROR SENDING EVENT REQUESTS");
      return false;
    }
  });

  return true;
};

export const removeEventRequest = async (uuid, friends) => {
  const query = `
    DELETE FROM event_user
    WHERE event_id = (SELECT event_id FROM event WHERE uuid = :uuid)
    AND user_id = (SELECT user_id FROM users WHERE username = :username);
  `;

  await friends.forEach((friend) => {
    try {
      database.query(query, { uuid: uuid, username: friend });
    } catch {
      console.log("ERROR REMOVING EVENT REQUESTS");
      return false;
    }
  });

  return true;
};

export const getGroups = async (user_id) => {
  const query = `
    SELECT owned_groups.group_id, owned_groups.group_name FROM
    (SELECT 
      group_id, group_name, user_id
    FROM freedb_DB_calendar.group
    JOIN user_group USING (group_id)
    UNION
    SELECT group_id, group_name, owner_user_id
    FROM freedb_DB_calendar.group) AS owned_groups
    WHERE owned_groups.user_id = :user_id;
  `;
  const params = { user_id };

  try {
    const result = await database.query(query, params);
    return result[0];
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const createGroupEvent = async (uuid, group_id, user_id) => {
  const query = `
  INSERT INTO event_group (event_id, group_id) 
  VALUES (
    (SELECT event_id FROM event WHERE uuid = :uuid), 
    :group_id
    );
`;

  const result = await database.query(query, { uuid: uuid, group_id: group_id });

  const sendResult = await sendGroupEvent(uuid, group_id, user_id);


  if(!sendResult) return false;

  return result[0].insertId !== undefined;
};


export const sendGroupEvent = async (uuid, group_id, user_id) => {
  const query = `
      INSERT INTO event_user (user_id, event_id)
      SELECT groupInfo.user_id, groupInfo.event_id
      FROM (SELECT user_id, event_id
            FROM freedb_DB_calendar.group
            JOIN user_group USING (group_id)
            JOIN event_group USING (group_id)
            JOIN event USING (event_id)
            WHERE group_id = :group_id
            AND event_id = (SELECT event_id FROM event WHERE uuid = :uuid)
            UNION
            SELECT owner_user_id, (SELECT event_id FROM event WHERE uuid = :uuid)
            FROM freedb_DB_calendar.group
            WHERE group_id = :group_id
            ) as groupInfo
      WHERE user_id != :user_id
    `
  const result = await database.query(query, { uuid: uuid, group_id: group_id, user_id: user_id });

  return result[0].insertId !== undefined;
};