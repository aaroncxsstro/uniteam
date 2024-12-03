import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  format,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useSwipeable } from 'react-swipeable'; // Importar la biblioteca
import Nav from '../components/Nav';
import './Calendar.css';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [events, setEvents] = useState(() => {
    const savedEvents = Cookies.get('events');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  useEffect(() => {
    const savedEvents = Cookies.get('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    Cookies.set('events', JSON.stringify(events), { expires: 7 });
  }, [events]);

  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
  const endDate = endOfWeek(addMonths(startOfMonth(currentDate), 1), { weekStartsOn: 1 });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    const localDate = new Date(date);
    localDate.setHours(0, 0, 0, 0);
    setSelectedDate(localDate);
    setShowModal(true);
  };

  const handleAddEventClick = () => {
    setEventTitle('');
    setEventDescription('');
    setShowModal(false);
    setShowAddEventModal(true);
  };

  const handleEventSubmit = () => {
    const newTitle = eventTitle.trim() === '' ? '(sin título)' : eventTitle;
    const newDescription = eventDescription.trim() === '' ? '(sin descripción)' : eventDescription;

    if (newTitle && newDescription) {
      const newEvent = {
        date: selectedDate.toLocaleDateString('en-CA'),
        title: newTitle,
        description: newDescription,
        completed: false,
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      setShowAddEventModal(false);
      setEventTitle('');
      setEventDescription('');
    } else {
      alert('Por favor, completa ambos campos.');
    }
  };

  const toggleEventCompletion = (eventIndex) => {
    const updatedEvents = events.map((event, index) => {
      if (index === eventIndex) {
        return { ...event, completed: !event.completed };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const renderDays = () => {
    const days = [];
    let currentDay = startDate;

    while (currentDay <= endDate) {
      const currentDayISO = format(currentDay, 'yyyy-MM-dd');
      const hasEvent = events.some((event) => event.date === currentDayISO);

      const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === currentDayISO;
      const day = new Date(currentDay);

      days.push(
        <div
          key={currentDayISO}
          className={`calendar-day ${isToday(currentDay) ? 'today' : ''} ${
            hasEvent ? 'with-event' : ''
          } ${isSelected ? 'selected' : ''} ${
            isSameMonth(currentDay, currentDate) ? '' : 'outside-month'
          }`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{format(currentDay, 'd')}</span>
          {hasEvent && <div className="event-indicator"></div>}
        </div>
      );

      currentDay = addDays(currentDay, 1);
    }

    return days;
  };

  const renderModalContent = () => {
    const selectedDateISO = selectedDate.toLocaleDateString('en-CA');
    const dayEvents = events.filter((event) => event.date === selectedDateISO);

    if (dayEvents.length > 0) {
      return (
        <div>
          <h3>Eventos del {format(selectedDate, 'dd/MM/yyyy', { locale: es })}</h3>
          <ul>
            {dayEvents.map((event, index) => (
              <li key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={event.completed}
                    onChange={() => toggleEventCompletion(events.indexOf(event))}
                  />
                  <strong>{event.title}</strong>: {event.description}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
          <button onClick={handleAddEventClick}>Agregar Nuevo Evento</button>
        </div>
      );
    } else {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEventSubmit();
          }}
        >
          <h3>Agregar Evento</h3>
          <label>
            Título:
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
          </label>
          <label>
            Descripción:
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </label>
          <button type="submit">Agregar Evento</button>
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cerrar
          </button>
        </form>
      );
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextMonth,
    onSwipedRight: handlePrevMonth,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  return (
    <div>
      <Nav />
      <div {...swipeHandlers} className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>&lt;</button>
          <h2>{format(currentDate, 'MMMM yyyy', { locale: es })}</h2>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">{renderDays()}</div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">{renderModalContent()}</div>
          </div>
        )}

        {showAddEventModal && (
          <div className="modal-overlay">
            <div className="modal">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEventSubmit();
                }}
              >
                <h3>Agregar Evento</h3>
                <label>
                  Título:
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </label>
                <label>
                  Descripción:
                  <textarea
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </label>
                <button type="submit">Agregar Evento</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddEventModal(false);
                    setEventTitle('');
                    setEventDescription('');
                  }}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
