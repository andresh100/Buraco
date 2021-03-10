import React, { Component } from "react";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../Firebase";
import { withAuthorization } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

class HomePage extends Component {
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

  render() {
    const { users, rooms, loadingRooms, loadingUsers } = this.state;

    return (
      <div class="container">
        {loadingRooms || loadingUsers ? (
          <div className="loader-wrapper is-active">
            <div className="loader is-loading"></div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>
                  <abbr title="Room Name">Room</abbr>
                </th>
                <th>
                  <abbr title="Number of players in this Room">#</abbr>
                </th>
                <th>
                  <abbr title="Join">Join</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr>
                  <td>{room.name}</td>
                  <td>{room.users.length}</td>
                  <td>
                    <Link
                      to={ROUTES.ROOM + "/" + room.rid}
                      className="button is-primary"
                    >
                      Join
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

const condition = (authUser) => !!authUser;

export default compose(withAuthorization(condition))(HomePage);
