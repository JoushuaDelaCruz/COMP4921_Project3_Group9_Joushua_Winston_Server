import database from "../mySQLDatabaseConnection.js";


export const getEventsById = async (user_id) => {
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
          recurrence_id,
          recurrence_rule,
          recurrence_exception,
          uuid
        FROM event
        WHERE original_user_id = :user_id
    `;
  const params = { user_id };

  const result = await database.query(query, params);
  return result[0];
};

export const createEvent = async (eventData) => {
  const query = `
    INSERT INTO event (original_user_id, title, start_datetime, end_datetime, event_colour, created_datetime, is_all_day, start_timezone, end_timezone, location, description, recurrence_rule, recurrence_exception, uuid) 
    VALUES (:user_id, :title, :start_datetime, :end_datetime, :event_colour, :created_datetime, :is_all_day, :start_timezone, :end_timezone, :location, :description, :recurrence_rule, :recurrence_exception, :uuid);

    `;

  const params = eventData;

  const result = await database.query(query, params);
  return result[0].insertId !== undefined;
}


export const deleteEvent = async (eventData) => {
  const query = `
      DELETE FROM event 
      WHERE uuid = :uuid
    `;

  const params = eventData;

  const result = await database.query(query, params);
  return result[0].affectedRows !== 0;
}

export const updateEvent = async (eventData) => {
  const query = `
    UPDATE event SET title = :title, start_datetime = :start_datetime, end_datetime = :end_datetime, 
    event_colour = :event_colour, is_all_day = :is_all_day, start_timezone = :start_timezone, end_timezone = :end_timezone, location = :location, 
    description = :description, recurrence_id = :recurrence_id, following_id = :following_id, recurrence_rule = :recurrence_rule, 
    recurrence_exception = :recurrence_exception 
    WHERE (uuid = :uuid);
    `;

  const params = eventData;

  const result = await database.query(query, params);
  return result[0].affectedRows !== 0;
}