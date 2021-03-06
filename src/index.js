import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
     return (
       <button className="square" onClick={props.onClick}>
         {props.value}
       </button> // Board.renderSquare()メソッドから受けっとった引数を表示
     );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
        value={this.props.squares[i]}
        onClick= {() => {this.props.onClick(i)}}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        isXnext: true,
        stepnumber: 0,
      };
    }

    jumpTo(step) {
      this.setState({
        isXnext: (step % 2) === 0,
        stepnumber: step,
      })
    };

    handleClick(i) {
      const history = this.state.history;
      const current = history[this.state.stepnumber];
      const squares = current.squares.slice(0, this.state.stepnumber + 1);
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.isXnext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        isXnext: !this.state.isXnext,
        stepnumber: history.length,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[history.length - 1];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const decs = move ? 
        'Go To move #' + move :
        'Game Start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{decs}</button>
          </li>
        );
      })

      let status;
      if (winner) {
        status =  'Winner is ' + winner;
      }else{
        status = 'Next player: ' + (this.state.isXnext ? 'X' : 'O'); 
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i) => this.handleClick(i)} 
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for(let i=0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if(squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };
  
  // ========================================
  
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container);
  root.render(<Game />);
  