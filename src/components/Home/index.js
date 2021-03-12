import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import { AuthUserContext } from "../Session";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static defaultProps = {
    match: "",
  };

  render() {
    const {} = this.state;

    return (
      <div class="container">
        <AuthUserContext.Consumer>
          {(authUser) => (
            <Home
              authUser={authUser}
              match={this.props.match}
              history={this.props.history}
            />
          )}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class HomeBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingUsers: true,
      loadingRooms: true,
      users: [],
      rooms: [],
    };
  }

  componentDidMount() {
    this.unsubscribeUsers = this.props.firebase
      .users()
      .onSnapshot((snapshot) => {
        let users = [];
        snapshot.forEach((doc) => users.push({ ...doc.data(), uid: doc.id }));
        this.setState({
          users,
          loadingUsers: false,
        });
      });

    this.unsubscribeRooms = this.props.firebase
      .rooms()
      .onSnapshot((snapshot) => {
        let rooms = [];
        snapshot.forEach((doc) => rooms.push({ ...doc.data(), rid: doc.id }));
        this.setState({
          rooms,
          loadingRooms: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribeUsers();
    this.unsubscribeRooms();
  }

  joinGame(e, rid) {
    const { authUser, history } = this.props;
    e.preventDefault();
    if (rid !== "") {
      this.props.firebase
        .appendArray(`rooms/${rid}`, "players", authUser.uid)
        .then(() => {
          history.push(ROUTES.ROOM + "/" + rid);
        })
        .catch(() => {
          console.log("Something went Wrong");
        });
    }
  }

  createRoom() {
    this.props.firebase.db
      .collection("rooms")
      .add({
        name: "",
        onlineUsers: [],
        players: [],
      })
      .then((docRef) => {
        this.props.firebase.rooms.set(
          {
            rid: docRef.id,
          },
          { merge: true }
        );
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  render() {
    const { users, rooms, loadingRooms, loadingUsers } = this.state;

    return (
      <div class="container">
        {loadingRooms || loadingUsers ? (
          <div className="loader-wrapper is-active">
            <div className="loader is-loading"></div>
          </div>
        ) : (
          <>
            <button onClick={() => this.createRoom()}>Create Room</button>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <abbr title="Room Name">Room</abbr>
                  </th>
                  <th>
                    <abbr title="Number of players in this Room">
                      # of Players
                    </abbr>
                  </th>
                  <th>
                    <abbr title="Join">Join</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room, index) => (
                  <tr>
                    <td>{room && room.name && room.name}</td>
                    <td>
                      {room &&
                        room.players &&
                        room.players.length &&
                        room.players.length}
                      /4
                    </td>
                    <td>
                      <button
                        className="button is-primary"
                        disabled={
                          room &&
                          room.players &&
                          room.players.length &&
                          room.players.length === 4
                        }
                        onClick={(e) => this.joinGame(e, room.rid)}
                      >
                        Join
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

const Home = withFirebase(HomeBase);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(HomePage);
