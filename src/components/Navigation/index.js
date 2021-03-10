import React, { Component } from "react";
import { Link } from "react-router-dom";

import { AuthUserContext } from "../Session";
import SignOutButton from "../SignOut";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.burgerClicked = this.burgerClicked.bind(this);

    this.state = { openBurger: false };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  burgerClicked() {
    this.setState({
      openBurger: !this.state.openBurger,
    });
  }

  render() {
    const { users, loading, openBurger } = this.state;
    return (
      <AuthUserContext.Consumer>
        {(authUser) =>
          authUser ? (
            <NavigationAuth
              authUser={authUser}
              openBurger={openBurger}
              burgerClicked={this.burgerClicked}
            />
          ) : (
            <NavigationNonAuth
              openBurger={openBurger}
              burgerClicked={this.burgerClicked}
            />
          )
        }
      </AuthUserContext.Consumer>
    );
  }
}

const NavigationAuth = ({ authUser, openBurger, burgerClicked }) => (
  <nav
    className="navbar is-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="navbar-brand">
      <Link className="navbar-item" to={ROUTES.HOME}>
        BURACO
      </Link>

      <a
        role="button"
        className="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        onClick={() => burgerClicked()}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      className={!openBurger ? "navbar-menu" : "navbar-menu is-active"}
    >
      {/* <div className="navbar-start">
        <a className="navbar-item">Home</a>

        <a className="navbar-item">Documentation</a>

        
      </div> */}

      <div className="navbar-end">
        {/* <div className="navbar-item">
          <div className="buttons">
            <a className="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a className="button is-light">Log in</a>
          </div>
        </div> */}
        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link">{authUser.username}</a>

          <div className="navbar-dropdown is-right">
            {/* <Link className="navbar-item" to={ROUTES.HOME}>
              Home
            </Link> */}
            <Link className="navbar-item" to={ROUTES.ACCOUNT}>
              Account
            </Link>
            {!!authUser.roles[ROLES.ADMIN] && (
              <Link className="navbar-item" to={ROUTES.ADMIN}>
                Admin
              </Link>
            )}
            <hr className="navbar-divider" />
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// const NavigationAuth = ({ authUser }) => (
//   <ul>
//     {console.log(authUser)}
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.HOME}>Home</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//     </li>
//     {!!authUser.roles[ROLES.ADMIN] && (
//       <li>
//         <Link to={ROUTES.ADMIN}>Admin</Link>
//       </li>
//     )}
//     <li>
//       <SignOutButton />
//     </li>
//   </ul>
// );

const NavigationNonAuth = ({ openBurger, burgerClicked }) => (
  <nav
    className="navbar is-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="navbar-brand">
      <Link className="navbar-item" to={ROUTES.LANDING}>
        BURACO
      </Link>

      <a
        role="button"
        className="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        onClick={() => burgerClicked()}
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div
      id="navbarBasicExample"
      className={!openBurger ? "navbar-menu" : "navbar-menu is-active"}
    >
      {/* <div className="navbar-start">
        <a className="navbar-item">Home</a>

        <a className="navbar-item">Documentation</a>

        
      </div> */}

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <Link className="button is-primary" to={ROUTES.SIGN_UP}>
              SING UP
            </Link>
            <Link className="button is-light" to={ROUTES.SIGN_IN}>
              SING IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//     </li>
//   </ul>
// );

export default Navigation;
