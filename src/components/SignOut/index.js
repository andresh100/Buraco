import React from 'react';
 
import { withFirebase } from '../Firebase';
 
const SignOutButton = ({ firebase }) => (
  <button type="button" className="button is-danger" onClick={firebase.doSignOut}>
    Sign Out
  </button>
);
 
export default withFirebase(SignOutButton);