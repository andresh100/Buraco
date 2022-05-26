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
      users: [
        {
          id: "Andre",
          hand: [],
        },
        {
          id: "Cris",
          hand: [],
        },
        {
          id: "Gaby",
          hand: [],
        },
        {
          id: "Rafa",
          hand: [],
        },
      ],
      rooms: [],
      suits: ["spades", "diamonds", "clubs", "hearts"],
      ranks: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
      deck: [],
      cardsPerHand: 11,
      numberOfCardSets: 2,
    };
  }

  componentDidMount() {
    let cards = [];
    for (let i = 0; i < this.state.numberOfCardSets; i++) {
      let deck = this.getDeck();
      cards = [...cards, ...deck];
    }
    this.handCards(cards);
  }

  handCards(deck) {
    const { users, cardsPerHand } = this.state;
    users.forEach((user) => {
      const hand = [];
      for (let i = 0; i < cardsPerHand; i++) {
        let randomIndex = Math.floor(Math.random() * deck.length);
        let card = deck[randomIndex];
        hand.push(card);
        deck.splice(randomIndex, 1);
      }
      user.hand = hand;
    });
    this.setState({
      deck,
      users,
    });
    this.renderDeck(deck);
    this.renderHands(users);
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
      if (deck[i].Suit === "hearts") icon = "♥";
      else if (deck[i].Suit === "spades") icon = "♠";
      else if (deck[i].Suit === "diamonds") icon = "♦";
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

  renderHands(users) {
    document.getElementById("hands").innerHTML = "";
    users.forEach((user) => {
      const cards = user.hand;
      let hand = document.createElement("div");
      hand.innerHTML = `${user.id}: `;
      for (var i = 0; i < cards.length; i++) {
        let card = document.createElement("div");
        let rank = document.createElement("div");
        let suit = document.createElement("div");
        var icon = "";
        if (cards[i].Suit === "hearts") icon = "♥";
        else if (cards[i].Suit === "spades") icon = "♠";
        else if (cards[i].Suit === "diamonds") icon = "♦";
        else icon = "♣";

        hand.className = "hand";
        card.className = "card";
        rank.className = "value";
        suit.className = "suit " + cards[i].Suit;

        suit.innerHTML = icon;
        rank.innerHTML = cards[i].Rank;
        hand.appendChild(card);
        card.appendChild(rank);
        card.appendChild(suit);
      }
      document.getElementById("hands").appendChild(hand);
    });
  }

  render() {
    const {
      users,
      rooms,
      loadingRooms,
      loadingUsers,
      ranks,
      suits,
      deck,
      numberOfCardSets,
    } = this.state;

    return (
      <div>
        <div class="deck">
          <h1>{numberOfCardSets} Deck of Cards</h1>
          <button class="btn" onClick={() => this.shuffleSave(deck)}>
            Shuffle
          </button>
          <div id="deck"></div>
          <div id="hands"></div>
        </div>
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(GamePage);
