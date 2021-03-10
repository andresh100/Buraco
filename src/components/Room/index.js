import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";

import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

import Game from "../Game";

class RoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingUsers: true,
      loadingRooms: true,
      users: [],
      rooms: [],
    };
  }

  static defaultProps = {
    match: "",
  };

  render() {
    const {} = this.state;

    return (
      <div class="container">
        <AuthUserContext.Consumer>
          {(authUser) => <Room authUser={authUser} match={this.props.match} />}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class RoomBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingRoom: true,
      room: {},
    };
  }

  componentDidMount() {
    this.handle = window.addEventListener("beforeunload", (e) => {
      const { room } = this.state;
      const { authUser } = this.props;

      if (room !== {} && room.onlineUsers !== []) {
        let newRoom = { ...room };
        let array = [...newRoom.onlineUsers];
        let index = array.indexOf(authUser.uid);
        if (index !== -1) {
          array.splice(index, 1);
          newRoom.onlineUsers = array;
          this.props.firebase.room(this.props.match.params.id).set(
            {
              ...newRoom,
            },
            { merge: true }
          );
        }
      }
    });

    this.unsubscribeRoom = this.props.firebase
      .room(this.props.match.params.id)
      .onSnapshot((snapshot) => {
        let room = {};
        room = { ...snapshot.data(), rid: snapshot.id };
        this.setState({
          room,
        });
      });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.room !== this.state.room) {
      this.addToRoom();
    }
  }

  componentWillUnmount() {
    this.unsubscribeRoom();
    const { room } = this.state;
    const { authUser } = this.props;

    if (room !== {} && room.onlineUsers !== []) {
      let newRoom = { ...room };
      let array = [...newRoom.onlineUsers];
      let index = array.indexOf(authUser.uid);
      if (index !== -1) {
        array.splice(index, 1);
        newRoom.onlineUsers = array;
        this.props.firebase.room(this.props.match.params.id).set(
          {
            ...newRoom,
          },
          { merge: true }
        );
      }
    }
    this.handle && this.handle();
  }

  addToRoom() {
    const { room } = this.state;
    const { authUser } = this.props;
    if (
      room !== {} &&
      room.onlineUsers !== [] &&
      !room.onlineUsers.includes(authUser.uid)
    ) {
      let newRoom = { ...room };
      newRoom.onlineUsers.push(authUser.uid);
      this.props.firebase
        .room(this.props.match.params.id)
        .set(
          {
            ...newRoom,
          },
          { merge: true }
        )
        .then(() => {
          this.setState({
            room,
            loadingRoom: false,
          });
        });
    } else {
      this.setState({
        error: true,
        loadingRoom: false,
      });
    }
  }

  render() {
    const { room, loadingRoom } = this.state;

    return (
      <div>
        {loadingRoom ? (
          <div className="loader-wrapper is-active">
            <div className="loader is-loading"></div>
          </div>
        ) : (
          <>
            ROOM NAME: {room.name}
            <Game />
          </>
        )}
      </div>
    );
  }
}

const Room = withFirebase(RoomBase);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(RoomPage);
