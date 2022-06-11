import React, { useState, useEffect } from 'react';
import socket from '../../services/socket';

const GooglePhotos = () => {
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    socket.on('googlePhotos', (data: string) => {
      setPhoto(data);
    });
  }, []);

  return (
    <div>
      {photo ? (
        <img src={photo} alt="google" width="300" height="300"></img>
      ) : (
        <img src="./png/paige.png" alt="paige" width="250" height="250"></img>
      )}
    </div>
  );
};
export default GooglePhotos;
