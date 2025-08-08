import React from 'react';
import './CalendarView.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CalendarViewProps {
  events: any[];
  onEventAdd: (eventData: any) => void;
  onEventUpdate?: (eventId: string, eventData: any) => void;
  onEventDelete?: (eventId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onEventAdd, 
  onEventUpdate, 
  onEventDelete 
}) => {
  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter a title for your event:');
    if (title) {
      const eventData = {
        title,
        start_date: selectInfo.startStr,
        end_date: selectInfo.endStr,
        event_type: 'booking'
      };
      onEventAdd(eventData);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    if (onEventDelete && window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      onEventDelete(clickInfo.event.id);
    }
  };

  // Convert events to FullCalendar format
  const formattedEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start_date,
    end: event.end_date,
    className: `event-type-${event.event_type}`
  }));

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={formattedEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  );
};

export default CalendarView;
