"use client";

import { useEffect, useState } from 'react';

export default function GamePage() {
  const [dailyCard, setDailyCard] = useState(null);
  const [localDailyCard, setLocalDailyCard] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guessedCards, setGuessedCards] = useState([]);
  const [allCardNames, setAllCardNames] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [filteredNames, setFilteredNames] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintOption, setHintOption] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const [easyMode, setEasyMode] = useState(false);

  const maxGuesses = 8;


  useEffect(() => {   
    fetch('/api/dailycard')
      .then(response => response.json())
      .then(data => setDailyCard(data))
      .catch(error => console.error('Error fetching daily card:', error));

    fetch('/api/cards')
      .then(response => response.json())
      .then(data => setAllCardNames(data.map(card => card.Name)))
      .catch(error => console.error('Error fetching card options:', error));

    const localCard = JSON.parse(localStorage.getItem('localDailyCard'));
    if (localCard) {
      setLocalDailyCard(localCard);
    }
    
    const savedGuesses = JSON.parse(localStorage.getItem('guessedCards'));
    if (savedGuesses) {
      setGuessedCards(savedGuesses);
    }

    const savedGameOver = JSON.parse(localStorage.getItem('gameOver'));
    if (savedGameOver) {
      setGameOver(savedGameOver);
    }

    const savedWin = JSON.parse(localStorage.getItem('win'));
    if (savedWin) {
      setWin(savedWin);
    }

    const savedHintOption = JSON.parse(localStorage.getItem('hintOption'));
    if (savedHintOption) {
      setHintOption(savedHintOption);
    }

    const savedShowHint = JSON.parse(localStorage.getItem('showHint'));
    if (savedShowHint) {
      setHintOption(savedShowHint);
    }

    const savedEasyMode = JSON.parse(localStorage.getItem('easyMode'));
    if (savedEasyMode) {
      setEasyMode(savedEasyMode);
    }

    
  }, []);

  useEffect(() => {
    localStorage.setItem('guessedCards', JSON.stringify(guessedCards));
    localStorage.setItem('gameOver', JSON.stringify(gameOver));
    localStorage.setItem('win', JSON.stringify(win));
    localStorage.setItem('hintOption', JSON.stringify(hintOption));
    localStorage.setItem('showHint', JSON.stringify(showHint));
  }, [guessedCards, gameOver, win, hintOption, showHint]);

  useEffect(() => {
    // check if daily card has changed
    if (dailyCard && localDailyCard && dailyCard.Name !== localDailyCard.Name) {
      resetDay();
    } 

    if (dailyCard) {
      localStorage.setItem('localDailyCard', JSON.stringify(dailyCard));
    }
  }, [dailyCard, localDailyCard]);

  const handleGuessChange = (e) => {
    let guess = e.target.value.toLowerCase();
    setCurrentGuess(guess);

    let filtered = allCardNames.filter((name) =>
      name.toLowerCase().includes(guess)
    );
    filtered.sort((a, b) => { 
      if (a.toLowerCase().startsWith(guess) && !b.toLowerCase().startsWith(guess)) {
        return -1;
      } else if (!a.toLowerCase().startsWith(guess) && b.toLowerCase().startsWith(guess)) {
        return 1;
      } else {
        return 0;
      }
    });

    setFilteredNames(filtered);
  };

  const handleGuessSubmit = async (e) => {
    e.preventDefault();
    if (!dailyCard) {
      displayMessage('Error: Lost connection to server.');
      return;
    }

    // not a valid card name
    if (!allCardNames.some(name => name.toLowerCase() === currentGuess.toLowerCase())) {
      displayMessage('Not a valid card');
      setCurrentGuess('');
      return;
    }

    // already been guessed
    if (guessedCards.some(card => card.Name.toLowerCase() === currentGuess.toLowerCase())) {
      displayMessage('You already guessed that card');
      setCurrentGuess('');
      return;
    }


    try {
      const response = await fetch('/api/card?name=${currentGuess}');
      const guessedCard = await response.json();

      setGuessedCards([...guessedCards, guessedCard]);
      setCurrentGuess('');

      if (guessedCard.Name === dailyCard.Name) {
        setGameOver(true);
        setWin(true);
      } else if (guessedCards.length >= maxGuesses - 1) {
        setGameOver(true);
        setWin(false);
      } else if (guessedCards.length >= maxGuesses - 3) {
        setHintOption(true);
      }

    } catch (error) {
      console.error('Error fetching guessed card:', error);
      displayMessage('Error fetching guessed card. Please try again.');
    }
  };

  const handleNameClick = (name) => {
    setCurrentGuess(name);
    setFilteredNames([]);
  };

  const handleHintClick = () => {
    setShowHint(!showHint);
  };

  const handleShareClick = () => {
    let results = "Snapdle "
    const dateString = new Date(dailyCard.Date).toLocaleDateString('en-us', { year: "numeric", month: "numeric", day: "numeric"});
    results += dateString;
    results += ": " + guessedCards.length +  "/"  + maxGuesses + "\n";; 

    for (let card of guessedCards) {
      results += card.Name === dailyCard.Name ? '🟩' : easyMode && card.Name.slice(0, 1) === dailyCard.Name.slice(0, 1) ? '🟨' : '⬜';
      results += card.Cost === dailyCard.Cost ? '🟩' : easyMode && Math.abs(card.Cost - dailyCard.Cost) === 1 ? '🟨' : '⬜';
      results += card.Power === dailyCard.Power ? '🟩' : easyMode && Math.abs(card.Power - dailyCard.Power) === 1 ? '🟨' : '⬜';
      results += card.SeriesAdjusted === dailyCard.SeriesAdjusted ? '🟩' : easyMode && Math.abs(card.SeriesAdjusted - dailyCard.SeriesAdjusted) === 1 ? '🟨' : '⬜';
      results += dailyCard.AbilityType.includes(card.AbilityType) || card.AbilityType.includes(dailyCard.AbilityType) ? '🟩' : '⬜';
      results += card.ReleaseMonth === dailyCard.ReleaseMonth ? '🟩' : easyMode && Math.abs(card.ReleaseMonth - dailyCard.ReleaseMonth) === 1 ? '🟨' : '⬜';
      results += card.ReleaseYear === dailyCard.ReleaseYear ? '🟩' : easyMode && Math.abs(card.ReleaseYear - dailyCard.ReleaseYear) === 1 ? '🟨' : '⬜';

      results += "\n";
      
    }
    if (showHint) {
      results += "(hint used)";
    }

    results += "https://snap-dle.onrender.com/";


    navigator.clipboard.writeText(results);
    displayMessage("Results copied to clipboard");
  };

  // helper functions
  const displayMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  }

  const resetDay = () => {
    setGuessedCards([]);
    setGameOver(false);
    setWin(false);
    setHintOption(false);
    setShowHint(false);
  }



  return (
    <div className="flex flex-col content-center text-center px-2" >
      <h1 className="text-2xl mt-10">Guess the Marvel Snap Card!</h1>

      {dailyCard && (
      <div>
          {/* <button disabled={!dailyCard} onClick={() => resetDay()} className='bg-blue-600 text-white px-4 py-2 mt-2 rounded'>
            Reset
          </button> */}
        {(hintOption && !gameOver && !showHint) &&
          <button disabled={!dailyCard || showHint} onClick={() => handleHintClick()} className='bg-blue-600 text-white px-4 py-2 mt-2 rounded'>
            Hint: Ability Text
          </button>
        }
        {(showHint && !gameOver) && 
          <div className='dark:bg-neutral-600 bg-neutral-300 px-2 py-2 mt-2 rounded '>
            <p>Ability: {dailyCard.AbilityText}</p>
          </div>
        }
        {!gameOver ? (
          <form onSubmit={handleGuessSubmit} className="mt-2 flex">
            <input
              type="text"
              value={currentGuess}
              onChange={handleGuessChange}
              className="grow border rounded p-2 mr-2"
              placeholder="Enter your guess"
            />
            <button type="submit" disabled={!dailyCard} className='text-white rounded p-2 bg-blue-600'>
              {`Guess ${guessedCards.length + 1} / ${maxGuesses}`}
            </button>
          </form>
        ) : (
          <div className={`${win ? showHint ? 'bg-yellow-500' : 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 rounded shadow-md mt-4 z-50`}>
            {win ? (
              showHint ? (
                <p>Correct. You guessed <em className='font-bold text-yellow-800'>{dailyCard.Name}</em> in {guessedCards.length} guesses (with a hint)</p>
              ) : (
                <p>Nice! You guessed <em className='font-bold text-green-800'>{dailyCard.Name}</em> in {guessedCards.length} guess{guessedCards.length > 1 && 'es'}</p>
              )
            ) : (
              <p>Unlucky, today&apos;s card was <em className='font-bold text-red-900'>{dailyCard.Name}</em></p>
            )}
            
          </div>
        )}
        
      {filteredNames.length > 0 && (
        <ul className="border border-neutral-600 rounded mt-1 w-full max-h-48 overflow-y-auto">
          {filteredNames.map(name => (
            <li
              key={name}
              onClick={() => handleNameClick(name)}
              className="p-2 cursor-pointer hover:bg-neutral-200 hover:text-black"
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      {(showMessage) && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-purple-800 text-white px-4 py-2 rounded shadow-md mt-4 z-50">
          {message}
        </div>
      )}
      <table className="mt-2 w-full border-collapse border dark:border-black border-white text-[10px] table-auto">
        <thead className='text-white'>
          <tr>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Name</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Cost</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Power</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Series</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Ability Type</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Release Month</th>
            <th className="border dark:border-black border-white bg-purple-700 p-[2px] h-8">Release Year</th>
          </tr>
        </thead>
        
          <tbody>
          {guessedCards.map((g, index) => (
            <tr key={index} className="text-center">
              <td className={`border dark:border-black border-white p-[2px] h-10 text-ellipsis 
                ${g.Name === dailyCard.Name ? 'bg-green-500' : easyMode && g.Name.slice(0, 1) === dailyCard.Name.slice(0, 1) ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.Name}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${g.Cost === dailyCard.Cost ? 'bg-green-500' : easyMode && Math.abs(g.Cost - dailyCard.Cost) === 1 ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.Cost}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${g.Power === dailyCard.Power ? 'bg-green-500' : easyMode && Math.abs(g.Power - dailyCard.Power) === 1 ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.Power}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${g.SeriesAdjusted === dailyCard.SeriesAdjusted ? 'bg-green-500' : easyMode && Math.abs(g.SeriesAdjusted - dailyCard.SeriesAdjusted) === 1 ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.SeriesAdjusted}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${dailyCard.AbilityType.includes(g.AbilityType) || g.AbilityType.includes(dailyCard.AbilityType) ? 'bg-green-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.AbilityType}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${g.ReleaseMonth === dailyCard.ReleaseMonth ? 'bg-green-500' : easyMode && Math.abs(g.ReleaseMonth - dailyCard.ReleaseMonth) === 1 ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.ReleaseMonth}</td>
              <td className={`border dark:border-black border-white p-[2px] h-10 
                ${g.ReleaseYear === dailyCard.ReleaseYear ? 'bg-green-500' : easyMode && Math.abs(g.ReleaseYear - dailyCard.ReleaseYear) === 1 ? 'bg-yellow-500' : 'dark:bg-neutral-800 bg-neutral-200'}`}>{g.ReleaseYear}</td>
            </tr>
          ))}
          </tbody>
       
        
        </table>

        {(gameOver) &&
          <button onClick={() => handleShareClick()} className='bg-purple-700 text-white w-full py-2 mt-2 rounded'>
            Share
          </button>
        }
        
      </div>
      )}

      
    
    </div>
  );
}
