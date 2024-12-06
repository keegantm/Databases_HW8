import { useState, useEffect } from 'react'

function App() {
  //displayed messages
  const [messages, setMessages] = useState([]);
  //input field 
  const [input, setInput] = useState("");

  //get messages on page load
  useEffect(() => {
    getMessages()
  }, [])

  //use endpoint to populate messages use state var
  const getMessages = async () => {
    try {
      console.log("Started get");
      const messageResponse = await fetch('http://localhost:4000/api/getMessages');

      if (!messageResponse.ok) {
        throw new Error('Failed to fetch messages');
      }

      const messageData = await messageResponse.json();
      console.log(messageData)

      setMessages(messageData)
    }
    catch (Error) {
      console.error("Error retrieving members :", Error)
    };
  }

  //send the input to the backend with a post request
  const postMessage = async (content) => {
    try {
      console.log("Started Post");
      const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const postResponse = await fetch('http://localhost:4000/api/postMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content, time: time})
      });
      
      console.log(postResponse.status);

      if (!postResponse.ok) {
        //don't do anything if rejected from invalid input
        if (postResponse.status === 400) {
          console.log("400 response")
          return;
        }
        else {
          throw new Error('Error in post');
        }
      }
      else {
        console.log("POST SUCCESS")
        //update messages to include this new msg
        getMessages()
        setInput("")
      }

    } 
    catch (Error) {
      console.error("Error posting message :", Error)
    }
  }

  return (
    <>
      <div>
        <input id="input" type="text" value={input} onChange={(e) => setInput(e.target.value)}></input>
        <button onClick={() => postMessage(input)}>Add Message</button>
      </div>

      {messages.map((msg, index) => (
        <div key={index}> {msg.content} : {msg.timestamp} </div>
      ))}

    </>
  )
}

export default App
