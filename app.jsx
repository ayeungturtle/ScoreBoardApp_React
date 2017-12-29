var PLAYERS = [
  {
    name: "Andy",
    score: 49,
    id: 1,
  },
  {
    name: "Boogieman",
    score: 31,
    id: 2,
  },
  {
    name: "yayay",
    score: 22,
    id: 3,
  },
];



var StopWatch = React.createClass({
  getInitialState: function() {
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0,
    }
  },
  componentDidMount: function() {
    this.interval = setInterval(this.onTick, 100);
    this.setState({previousTime: Date.now()})
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  onTick: function() {
    if(this.state.running) {
      var now = Date.now();
      this.setState({
        elapsedTime: (this.state.elapsedTime + (now - this.state.previousTime)), 
        previousTime: Date.now()
      });
    };
  },
  onStop: function() {
    this.setState({running: false})
  },
  onStart: function() {
    this.setState({
      running: true,
      previousTime: Date.now(),
    });
  },
  onReset: function() {
    this.setState({
      elapsedTime: 0,
      previousTime: Date.now(),
    });
  },
  render: function() {
    var seconds = Math.floor(this.state.elapsedTime / 1000);
    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{seconds}</div>
        {this.state.running ? 
          <button onClick={this.onStop}>Stop</button> 
          : 
          <button onClick={this.onStart}>Start</button>
        }
        <button onClick={this.onReset}>Reset</button>
      </div>
    );
  }
});






var AddPlayerForm = React.createClass({
  getInitialState: function() {
    return {
      name: "",
    };
  },
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },
  onSubmit: function(e) {
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  },
  onNameChange: function(e) {
    this.setState({name: e.target.value});
  },
  render: function () {
    return(
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input id="addPlayerField" type="text" value={this.state.name} onChange={this.onNameChange}/>
          <input type="submit" value="Add Player" />
        </form>
      </div>
    ); 
  }
});




function Stats(props) {
  return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players:</td>
          <td>{props.totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{props.totalPoints}</td>
        </tr>
      </tbody>
    </table>
  )
}
Stats.propTypes = {
}

function Header (props) {
  return (
    <div className="header">
        <Stats totalPlayers={props.totalPlayers} totalPoints={props.totalPoints}/>
        <h1>{props.title}</h1>
        <StopWatch />
    </div>
  )
}
Header.propTypes = {
    title: React.PropTypes.string.isRequired,
  };



function Counter(props) {
  return (
    <div className="player-score">
      <div className="counter"> 
        <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
          <div className="counter-score"> {props.score} </div>
        <button className="counter-action increment"  onClick={function() {props.onChange(1);}}> + </button>
      </div>
    </div>
  );
}
Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  // decrementOnClick: React.PropTypes
  // incrementOnClick:
}




function Player(props) {
  return  (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>✖</a>
        {props.name}
      </div>
      <Counter score={props.score} onChange={function(delta) {props.onScoreChange(delta)}} />
    </div>
  )
}
Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
}





var Application = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired,
    })).isRequired,
  },
  getDefaultProps: function() {
    return {
        title: "Scoreboardy",
    }
  },
  getInitialState: function() {
    return {
      players: this.props.initialPlayers,
      curId: 4,
    };
  },
  handleScoreChange: function(index, delta) {
    console.log('onScoreChange', index, delta);
    var tempPlayers = this.state.players;
    tempPlayers[index].score += delta;
    this.setState({players: tempPlayers})
  },
  handleAddName: function(name) {
    var tempPlayers = this.state.players;
    tempPlayers.push(
      {name: name,
      score: 0,
      id: this.state.curId,
      }
    )
    this.setState({players: tempPlayers, curId: this.state.curId + 1})
  },
  handlePlayerRemove: function(index) {
    var tempPlayers = this.state.players;
    tempPlayers.splice(index, 1);
    this.setState({players: tempPlayers});    
  },
  findTotalPlayers: function() {
    return this.state.players.length;
  },
  findTotalPoints: function() {
    var totalPoints = this.state.players.reduce(function(total, player){
      return total + player.score;
    }, 0)
    return totalPoints;
  },
  render: function() {
    return (
    <div className="scoreboard">
      <Header 
        title={this.props.title} 
        totalPlayers={this.findTotalPlayers()}
        totalPoints={this.findTotalPoints()}
      />
    
      <div className="players">
        {this.state.players.map(function(player, index) {
          return (
            <Player 
              name={player.name} 
              score={player.score} 
              key={player.id} 
              onScoreChange={function (delta) {this.handleScoreChange(index, delta)}.bind(this)} 
              onRemove={function() {this.handlePlayerRemove(index)}.bind(this)}
            />
          );
        }.bind(this))}
      </div>  
      <AddPlayerForm onAdd={this.handleAddName}/>
    </div>
    );
  }
})






ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));