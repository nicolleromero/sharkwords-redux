const { Provider, useSelector, useDispatch } = ReactRedux;

const initialState = {
  numWrong: 0,
  guessedLetters: [],
  word: 'hello',
};

const GUESS_LETTER = 'GUESS_LETTER';
const RESET = 'RESET';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function reducer(state = initialState, action) {
  // Check to see if the reducer cares about this action.

  switch (action.type) {
    case GUESS_LETTER: {
      const letter = action.payload;
      const correct = state.word.includes(letter);

      return {
        ...state,
        guessedLetters: [...state.guessedLetters, letter],
        numWrong: state.numWrong + (correct ? 0 : 1),
      };
    }

    case RESET: {
      return initialState;
    }

    // Otherwise, return the existing state unchanged.
    default:
      return state;
  }
}

const Word = () => {
  const guessedLetters = useSelector(state => state.guessedLetters);
  const word = useSelector(state => state.word);

  const charDivs = [];
  for (const [i, letter] of Object.entries(word)) {
    let displayLetter = null;
    if (guessedLetters.includes(letter)) {
      displayLetter = letter;
    }

    charDivs.push(
      <div
        key={i}
        className="letter-box"
      >
        {displayLetter}
      </div>
    );
  }

  return (
    <section className="word-container">
      {charDivs}
    </section>
  )
};

const Letters = () => {
  // Hook that returns the dispatch function to the store
  const dispatch = useDispatch();
  const guessedLetters = useSelector(state => state.guessedLetters);
  const numWrong = useSelector(state => state.numWrong);
  const word = useSelector(state => state.word);

  const letterBtns = [];
  for (const letter of ALPHABET) {
    const handleClick = () => {
      // props.handleGuessLetter(letter);

      // The dispatch function sends an action w/ a payload (letter) to the store
      // This is what updates the state
      dispatch({
        type: GUESS_LETTER,
        payload: letter,
      });
    };

    letterBtns.push(
      <button
        key={letter}
        disabled={guessedLetters.includes(letter)}
        onClick={handleClick}
      >
        {letter}
      </button>
    );
  }

  return (
    <React.Fragment>
      <section className="letter-buttons">
        {letterBtns}
      </section>
      {numWrong === 5 && (
        <div>
          <p
            id="play-again"
            onClick={() => dispatch({ type: RESET })}
          >
            "I'm sorry – the shark ate you. Would you like to play again?"
          </p>
        </div>
      )}
      {word.split('').every(letter => guessedLetters.includes(letter)) && (
        <div>
          <p
            id="you-won"
            onClick={() => dispatch({ type: RESET })}
          >
            "You won! Would you like to play again?"
          </p>
        </div>
      )}
    </React.Fragment>
  )
};



const Sharkwords = (props) => {

  // Use useSelector (hook) to access the part of the state you're interested in
  const numWrong = useSelector(state => state.numWrong);

  return (
    <div>
      <section id="shark-img">
        <img
          src={`/static/images/guess${numWrong}.png`}
        />
      </section>
      <Word />
      <Letters />
    </div>
  );
}

// Create a Redux store holding the state of your app.
const store = Redux.createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Wrap entire <App /> in <Provider> tags to access the store
ReactDOM.render(
  <Provider store={store}>
    <Sharkwords />
  </Provider>,
  document.querySelector('#root')
);
