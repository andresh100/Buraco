import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";
import Game from "../Game";

class RoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingRoom: true,
      room: {},
    };
  }

  static defaultProps = {
    match: "",
  };

  componentDidMount() {
    this.unsubscribeRoom = this.props.firebase
      .room(this.props.match.params.id)
      .onSnapshot((snapshot) => {
        let room = {};
        room = { ...snapshot.data(), rid: snapshot.id };
        this.setState({
          room,
          loadingRoom: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribeRoom();
  }

  render() {
    const { room, loadingRoom } = this.state;

    return (
      <div class="container">
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

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(RoomPage);
