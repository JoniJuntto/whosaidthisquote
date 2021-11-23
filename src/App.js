import './App.css';
import React, { useState, useEffect } from 'react';
import {  db } from "./firebase";
import { Button, TextField, Paper, Avatar, Typography } from "@material-ui/core";
import { Alert, Stack } from '@mui/material';
import { collection, addDoc, doc, getDoc, onSnapshot } from "@firebase/firestore";
import kanye from './assets/kanye.jpg';
import trump from './assets/trump.jpg';
import random from './assets/random.jpg';

function App() {

  const [quoteOnScreen, setQuoteOnScreen] = useState('');
  const [rightQuess, setRightQuess] = useState('');
  const [points, setPoints] = useState(0);
  const [tries, setTries] = useState(0);
  const [textOnScreen, setTextOnScreen] = useState('');
  const [isVisibleStart, setIsVisibleStart] = useState('visible');
  const [highscoreList, setHighscoreList] = useState([]);
  const [username, setUsername] = useState('');
  const [isVisible, setIsVisible] = useState('hidden');
  const [alertSeverity, setAlertSeverity] = useState('');
  const [sortedList, setSortedList] = useState([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "highscores"), (snapshot) =>
        setHighscoreList(snapshot.docs.map(doc => doc.data()))
      ),
    []
  );

  useEffect(() => {
    sortHighscores();
  });

  const getKanye = async () => {
    const url = "https://api.kanye.rest/";
    try {
      const response = await fetch(url);
      var data = await response.json();
      setQuoteOnScreen(data.quote);

      setRightQuess('kanye');
    } catch (error) {

    }
  }

  const getTrump = async () => {
    const url = "https://api.whatdoestrumpthink.com/api/v1/quotes/random";
    try {
      const response = await fetch(url);
      var data = await response.json();
      setQuoteOnScreen(data.message);
      setRightQuess('trump');
    } catch (error) {
      
    }
  }

  const getRandom = async () => {
    setIsVisibleStart('hidden');
    setIsVisible('visible')
    const url = "https://api.quotable.io/random";
    try {
      const response = await fetch(url);
      var data = await response.json();
      setQuoteOnScreen(data.content);
      setRightQuess('random')
    } catch (error) {
      console.log(error);
    }
  }

  const getTheQuotes = () => {
    const randomNumber = Math.floor(Math.random() * 3);

    switch (randomNumber) {
      case 0: getKanye();
        break;
      case 1: getTrump();
        break;
      case 2: getRandom();
        break;
    }
  }

  const handleUsernameChange = e => {
    setUsername(e.target.value)
  };

  const choose = (who) => {

    if (who === rightQuess) {
      setPoints(points + 1);
      setTries(tries + 1);
      setTextOnScreen("Correct answer");
      setAlertSeverity('success')
      getTheQuotes();
    } else {
      setTries(tries + 1);
      setTextOnScreen("Wrong answer");
      setAlertSeverity('error')
      getTheQuotes();
    }
  }

  const tryAgain = () => {
    window.location.reload(false)
  }

  const handleSubmit = async () => {
    const docRef = await addDoc(collection(db, "highscores"), {
      username: username,
      score: points
    });
    window.location.reload(false)
    alert(`high-score submitted by username ${username}!`)
  }

  
  const sortHighscores = ()=>{
    const sorted = highscoreList.sort(function(a,b) {return b.score - a.score});
    setSortedList(sorted);
  }


  if (tries >= 30) {
    return (
      <div className='App'>
        <Typography variant='h2'>Game over</Typography>
        <p></p>
          <div>
            {points > sortedList[0].score
              ?<Typography style={{color: 'green'}} variant='h3'>NEW HIGH-SCORE!</Typography>
              :<Typography variant='h4'>Score</Typography>
            }
          </div>
          
          <Typography variant='h4'>{points}</Typography>
          <br/>
          <Typography variant='h5'> Enter username</Typography>
        <TextField 
        value={username} 
        variant='outlined' 
        onChange={handleUsernameChange} 
        />
        <p></p>
        <Button  size="large" variant='contained' color="primary" onClick={tryAgain}>Try again</Button>
        <Button style={{marginLeft:'1%'}} size="large" variant='contained' color="primary" onClick={handleSubmit}>Submit score</Button>
        <h1>High-scores</h1>
        {sortedList.map((person) => (
          <div>
            <Typography variant='h5'>{person.username} <br/>
            Score: {person.score}</Typography>
            <p></p>
          </div>
        ))}
      </div>
    );
  }



  return (
    <div className="App">
      <Typography variant='h2'>Who said this?</Typography>
      <h1>Points {points}</h1>
        <h1>Tries {tries}</h1>
      <Button size="large" variant='contained' color="primary" style={{ visibility: isVisibleStart }} onClick={getTheQuotes}>Start the game</Button>
      <Typography variant='h5' style={{visibility: isVisibleStart}}>If game doesn't load just keep pressing the button :D </Typography>
      <div style={{ visibility: isVisible }}>
        <Paper color='primary' style={{ height: '600px', backgroundColor: 'khaki', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', marginRight: '10px' }}>
          <h1>{quoteOnScreen}</h1>
        </Paper>
        <Alert severity={alertSeverity}>{textOnScreen}</Alert>

        <Stack style={{ alignItems: 'center', justifyContent: 'center' }} direction="row" spacing={2}>
        <Stack direction="column" spacing={2} >
          <Avatar
            alt='Kanye'
            onClick={() => { choose('kanye') }}
            src={kanye}
            style={{ width: 130, height: 130 }} />
            <Typography variant='h5'>Kanye</Typography>
            </Stack>
          <Stack direction="column" spacing={2} >
            <Avatar
              alt='Trump'
              onClick={() => { choose('trump') }}
              src={trump}
              style={{ width: 130, height: 130 }} />

            <Typography variant='h5'>Trump</Typography>
          </Stack>
          <Stack direction="column" spacing={2} >

          <Avatar
            alt='Random'
            onClick={() => { choose('random') }}
            src={random}
            style={{ width: 130, height: 130 }} />
            <Typography variant='h5'>Other</Typography>
            </Stack>
        </Stack>
      </div>
      <div>
      </div>
    </div>
  );
}

export default App;
