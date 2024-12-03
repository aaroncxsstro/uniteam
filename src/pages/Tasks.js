import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Nav from '../components/Nav';
import { format } from 'date-fns'; // Para formatear la fecha
import { es } from 'date-fns/locale'; // Importar la localización española
import './Tasks.css';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Leer los eventos desde las cookies (bajo la clave "events")
    const savedEvents = Cookies.get('events');
    if (savedEvents) {
      const tasksWithIds = JSON.parse(savedEvents).map((task, index) => ({
        ...task,
        id: task.id || `${task.date}-${index}`, // Asignamos un id único basado en la fecha y el índice
      }));
      setTasks(tasksWithIds);
    }
  }, []);

  useEffect(() => {
    // Guardar las tareas en las cookies cuando cambien
    if (tasks.length > 0) {
      Cookies.set('events', JSON.stringify(tasks), { expires: 7 }); // Expiran en 7 días
    }
  }, [tasks]);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const renderTasksByDate = () => {
    if (tasks.length === 0) {
      return <p>No hay tareas para mostrar. Puedes agregar nuevas tareas desde el calendario</p>;
    }

    // Agrupar los eventos (tareas) por fecha
    const groupedTasks = tasks.reduce((acc, task) => {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }
      acc[task.date].push(task);
      return acc;
    }, {});

    // Ordenar las fechas
    const dates = Object.keys(groupedTasks).sort((a, b) => new Date(a) - new Date(b));

    return dates.map((date) => (
      <div key={date} className="tasks-group">
        {/* Formateamos la fecha para mostrarla de forma legible */}
        <h3>{format(new Date(date), 'dd MMMM yyyy', { locale: es })}</h3>
        <ul>
          {groupedTasks[date].map((task) => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)} // Usamos el id aquí
                />
                <strong>{task.title}</strong>: {task.description}
              </label>
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div>
      <Nav />
      <div className="tasks-container">
        <h2>Mis Tareas</h2>
        {renderTasksByDate()}
      </div>
    </div>
  );
}

export default Tasks;
