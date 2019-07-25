import React from 'react';

import withSession from '../Session/withSession';

import { MessageCreate, Messages } from '../Message';

const Landing = ({ session }) => (
  <div>
    <h2>Landing Page</h2>
  </div>
);

export default withSession(Landing);
