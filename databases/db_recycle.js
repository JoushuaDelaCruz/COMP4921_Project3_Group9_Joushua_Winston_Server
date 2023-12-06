import database from "../mySQLDatabaseConnection.js";

export const getRecycleBin = async (user_id, username) => {
    const query = `
        SELECT 
          title,
          start_datetime,
          end_datetime,
          event.created_datetime,
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
          recycle_datetime,
          group_name
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
        AND recycle_datetime IS NOT NULL;
      `;
    const params = { user_id, username };
  
    const result = await database.query(query, params);
    return result[0];
  };
  
  export const restoreEvent = async (user_id, uuid) => {
    const query = `
      UPDATE event_user SET recycle_datetime = null
      WHERE user_id = :user_id
      AND event_id = (SELECT event_id FROM event WHERE uuid = :uuid);
    `;
  
    const result = await database.query(query, {user_id, uuid});
    return result[0].affectedRows !== 0;
  }
  
  export const recycleDeleteEvent = async (user_id, uuid) => {
    const query = `
      DELETE FROM event_user
      WHERE event_id = (SELECT event_id FROM event WHERE uuid = :uuid)
      AND user_id = :user_id;
    `;
    database.query(query, {uuid, user_id});
    return true;
  }