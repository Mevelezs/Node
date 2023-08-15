import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
type message = {
  body: string
  from:string
}
const socket = io('http://localhost:3002');

function App() {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<message[]>([]);

  const handleonChange = (e: { target: { value: string; }; }) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    socket.emit('message', message);
    const newMessage: message = {
      body: message,
      from: 'Me',
    };
    setMessages([newMessage, ...messages]);
    setMessage('');
  };

  useEffect(() => {
    const reciveMessage = (message:message) => {
    setMessages([message, ...messages]);
    };

    socket.on('message', reciveMessage); // para refrescar cuando otro cliente mande un mensaje
  }, [messages]);
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
      {messages?.map((messa, index) => (
        <div key={index}>{messa.from}: {messa.body}</div>
      ))}
    </>
  );
}

export default App;
