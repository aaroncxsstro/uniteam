import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './Forum.css';
import Nav from '../components/Nav';

function Forum() {
  const [threads, setThreads] = useState(() => {
    const savedThreads = Cookies.get('threads');
    try {
      return savedThreads ? JSON.parse(savedThreads) : [];
    } catch (error) {
      console.error('Error al parsear los hilos desde las cookies:', error);
      return [];
    }
  });

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Actualiza las cookies cada vez que cambian los hilos
  useEffect(() => {
    Cookies.set('threads', JSON.stringify(threads), { expires: 7 });
  }, [threads]);

  const handleCreateThread = () => {
    if (newThreadTitle.trim() === '' || newThreadContent.trim() === '') return;

    const newThread = {
      id: threads.length + 1,
      title: newThreadTitle.trim(),
      content: newThreadContent.trim(),
      comments: [],
    };

    setThreads([...threads, newThread]);
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
  };

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    const updatedThread = {
      ...selectedThread,
      comments: [...selectedThread.comments, newComment.trim()],
    };

    setThreads(threads.map((thread) => (thread.id === updatedThread.id ? updatedThread : thread)));
    setSelectedThread(updatedThread);
    setNewComment('');
  };

  return (
    <div>
      <Nav />
      <div className="forum-container">
        <div className="thread-list">
          <h3>Foro</h3>
          <ul>
            {threads.map((thread) => (
              <li key={thread.id} onClick={() => handleSelectThread(thread)}>
                {thread.title}
              </li>
            ))}
          </ul>

          <div className="new-thread">
            <h4>Crear nuevo hilo</h4>
            <input
              type="text"
              placeholder="Título"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
            <textarea
              placeholder="Contenido"
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
            />
            <button onClick={handleCreateThread}>Publicar</button>
          </div>
        </div>

        <div className="thread-view">
          {threads.length === 0 ? (
            <div className="placeholder">
              <h3>No hay hilos aún</h3>
              <p>¿Por qué no creas uno tú mismo?</p>
            </div>
          ) : selectedThread ? (
            <>
              <div className="thread-content">
                <h3>{selectedThread.title}</h3>
                <p>{selectedThread.content}</p>
              </div>

              <div className="comments">
                <h4>Comentarios</h4>
                <ul>
                  {selectedThread.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>

                <div className="new-comment">
                  <textarea
                    placeholder="Agregar un comentario"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button onClick={handleAddComment}>Comentar</button>
                </div>
              </div>
            </>
          ) : (
            <div className="placeholder">
              <h3>No has seleccionado ningún hilo</h3>
              <p>Por favor, selecciona uno para ver su contenido.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;
