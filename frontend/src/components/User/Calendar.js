import React, { useState, useEffect } from "react";
import axios from "../services/api";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("user/calendar")
      .then((response) => {
        const formattedEvents = response.data.map((log) => ({
          title: `${log.company_name} - ${log.method}`,
          date: log.date,
          extendedProps: { notes: log.notes },
        }));
        setEvents(formattedEvents);
      })
      .catch((error) => console.error("Error fetching calendar data:", error));
  }, []);

  return (
    <div className="calendar">
      <h1>Communication Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventContent={renderEventContent}
      />
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <div>
      <strong>{eventInfo.event.title}</strong>
      <p>{eventInfo.event.extendedProps.notes}</p>
    </div>
  );
}

export default Calendar;
