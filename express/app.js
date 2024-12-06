const express = require('express')
const cors = require('cors');
const app = express()
const port = 4000
const mysql = require('mysql')

//cors for requests
app.use(cors());
//needed for recieved json parsing
app.use(express.json());

//connect to SQL db
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'MessageDb'
})

/*
Endpoint for getting all messages in the DB
*/
app.get('/api/getMessages', (request, response) => {

  //console.log('connected as id ' + connection.threadId);
  
  //query db for all messages
  connection.query('SELECT * FROM `messages`', function (error, results, fields) {
    
    //if there's an error, return an error response
    if (error) {
      console.error('error querying messages: ' + error.stack);
      response.status(500).json({ error: 'Database query failed' });
      return;
    }
    
    //return query results as a json
    response.status(200).json(results)
    
  });
});

/*
Endpoint for adding messages to the DB
*/
app.post('/api/postMessage', (request, response) => {
  console.log("IN POST");

  //get data from frontend
  const data = request.body;
  const msg = data.content;
  const time = data.time;
  console.log(data);

  //if invalid inputs, throw an error
  if (!msg || !time) {
    console.log("No msg or no time");
    response.status(400).json();
    return;
  }

  //don't insert empty messages
  if (msg == '') {
    console.log("msg is empty")
    response.status(400).json();
    return;
  }

  var post  = {content: msg, timestamp: time};
  connection.query('INSERT INTO messages SET ?', post, function (error, results, fields) {
    if (error) {
      console.log("FAIL");
      console.error('error posting message: ' + error.stack);
      response.status(500).json({ error: 'Database post failed' });
      return;
    } 
    else {
      console.log("SUCCESS");
      //response success
      response.status(200).json();
    }

  });
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

