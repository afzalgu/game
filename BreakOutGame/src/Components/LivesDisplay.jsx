import React from 'react';

const LivesDisplay = ({ lives }) => (
  <div className="absolute top-5 right-5 text-xl font-bold">
    Lives: {lives}
  </div>
);

export default LivesDisplay;