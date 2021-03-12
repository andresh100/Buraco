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
      belongsToRoom: false,
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
    const { authUser } = this.props;
    this.handle = window.addEventListener("beforeunload", (e) => {
      if (
        this.props.match.params.id !== "" &&
        this.props.match.params.id !== undefined
      ) {
        this.props.firebase
          .spliceArray(
            `rooms/${this.props.match.params.id}`,
            "onlineUsers",
            authUser.uid
          )
          .catch(() => {
            console.log("Something went Wrong");
          });
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
      this.loadRoom();
    }
  }

  componentWillUnmount() {
    this.unsubscribeRoom();
    const { authUser } = this.props;

    if (
      this.props.match.params.id !== "" &&
      this.props.match.params.id !== undefined
    ) {
      this.props.firebase
        .spliceArray(
          `rooms/${this.props.match.params.id}`,
          "onlineUsers",
          authUser.uid
        )
        .catch(() => {
          console.log("Something went Wrong");
        });
    }
    this.handle && this.handle();
  }

  addToRoom() {
    const { room, belongsToRoom } = this.state;
    const { authUser } = this.props;
    if (
      room !== {} &&
      room.onlineUsers !== [] &&
      !room.onlineUsers.includes(authUser.uid)
    ) {
      this.props.firebase
        .appendArray(
          `rooms/${this.props.match.params.id}`,
          "onlineUsers",
          authUser.uid
        )
        .then(() => {
          this.setState({
            room,
            loadingRoom: false,
          });
        })
        .catch(() => {
          console.log("Something went Wrong");
        });
    } else {
      this.setState({
        error: true,
        loadingRoom: false,
      });
    }
  }

  loadRoom() {
    const { room } = this.state;
    const { authUser } = this.props;

    if (room.players.includes(authUser.uid)) {
      this.setState({
        belongsToRoom: true,
      });
      this.addToRoom();
    } else {
      this.setState({
        belongsToRoom: false,
        loadingRoom: false,
      });
    }
  }

  render() {
    const { room, loadingRoom, belongsToRoom } = this.state;

    return (
      <div>
        {loadingRoom ? (
          <div className="loader-wrapper is-active">
            <div className="loader is-loading"></div>
          </div>
        ) : (
          <>
            {belongsToRoom ? (
              <>
                ROOM NAME: {room.name}
                <Game />
              </>
            ) : (
              <> You are not a member of this Room</>
            )}
          </>
        )}
      </div>
    );
  }
}

const Room = withFirebase(RoomBase);

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(RoomPage);
