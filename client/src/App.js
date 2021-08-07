import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [response, setResponse] = useState('');
  const [post, setPost] = useState('');
  const [resToPost, setResToPost] = useState('');

  useEffect(() => {
    callApi()
      .then((data) => {
        //console.log(`Data: ${data}`);
        setResponse(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const callApi = async () => {
    const res = await fetch('/api/hello');
    const body = await res.json();
    if (res.status !== 200) throw Error(body.message);
    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      //body: JSON.stringify(state.post),
      body: JSON.stringify({ post: post }),
    });
    const body = await res.text();
    setResToPost(body);
    setPost('');
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Concurrent App by Sir Pfaira
        </a>
        <p>{response}</p>
        <form onSubmit={handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type='text'
            value={post || ''}
            onChange={(e) => setPost(e.target.value)}
          />
          <button type='submit'>Submit</button>
        </form>
        <p>{resToPost}</p>
      </header>
    </div>
  );
}

export default App;
