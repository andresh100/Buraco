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
    };
  }

  render() {
    const { users, rooms, loadingRooms, loadingUsers } = this.state;

    return <div>GAME</div>;
  }
}

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition))(GamePage);
