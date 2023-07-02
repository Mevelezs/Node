import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3002');

function App() {
  const [message, setMessage] = useState('');

  const handleonChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    socket.emit('message', message);
  };
  useEffect(() => {

    const reciveMessage = (message) => {
      console.log(message);
    }

    socket.on('message', reciveMessage); // para refrescar cuando otro cliente mande un mensaje
  }, []);
  return (
    <>
      <h1>App Socket</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter your message...'
          value={message}
          onChange={handleonChange}
        />
        <button onClick={handleSubmit}>Send Message</button>
      </form>
      <label>{message}</label>
    </>
  );
}

export default App;
