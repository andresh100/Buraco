import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

class GamePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingUsers: true,
      loadingRooms: true,
      users: [],
      rooms: [],
      suits: ["spades", "diamonds", "clubs", "hearts"],
      ranks: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
      deck: [],
    };
  }

  componentDidMount() {
    let deck = this.getDeck();
    this.setState({
      deck,
    });
    this.renderDeck(deck);
  }

  getDeck() {
    const { suits, ranks } = this.state;
    let deck = [];
    for (var i = 0; i < suits.length; i++) {
      for (var x = 0; x < ranks.length; x++) {
        var card = { Rank: ranks[x], Suit: suits[i] };
        deck.push(card);
      }
    }
    this.shuffle(deck);
    return deck;
  }

  shuffle(deck) {
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++) {
      var location1 = Math.floor(Math.random() * deck.length);
      var location2 = Math.floor(Math.random() * deck.length);
      var tmp = deck[location1];

      deck[location1] = deck[location2];
      deck[location2] = tmp;
    }
  }

  shuffleSave(deck) {
    console.log("test");
    this.shuffle(deck);
    this.setState({
      deck,
    });
    this.renderDeck(deck);
  }

  renderDeck(deck) {
    document.getElementById("deck").innerHTML = "";

    for (var i = 0; i < deck.length; i++) {
      let card = document.createElement("div");
      let rank = document.createElement("div");
      let suit = document.createElement("div");
      var icon = "";
      if (deck[i].Suit == "hearts") icon = "♥";
      else if (deck[i].Suit == "spades") icon = "♠";
      else if (deck[i].Suit == "diamonds") icon = "♦";
      else icon = "♣";

      card.className = "card";
      rank.className = "value";
      suit.className = "suit " + deck[i].Suit;

      suit.innerHTML = icon;
      rank.innerHTML = deck[i].Rank;
      card.appendChild(rank);
      card.appendChild(suit);
      document.getElementById("deck").appendChild(card);
    }
  }

  // card = (number, symbol) => (
  //   <div>
  //     ({number}
  //     {symbol})
  //   </div>
  // );

  render() {
    const {
      users,
      rooms,
      loadingRooms,
      loadingUsers,
      ranks,
      suits,
      deck,
    } = this.state;

    return (
      <div>
        {/* <div>{this.card(ranks[1], suits.hearts)}</div> */}
        <div>{console.log("deck", deck)}</div>
        <div class="deck">
          <h1>A Deck of Cards</h1>

          <button class="btn" onClick={() => this.shuffleSave(deck)}>
            Shuffle
          </button>
          <div id="deck"></div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(GamePage);
