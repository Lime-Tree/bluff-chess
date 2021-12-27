import React, { useState, useEffect } from "react";

const Lobby = ({ socket }) => {
  const [roomNumber, setRoomNumber] = useState(0);

  useEffect(() => {
    socket.on("getRoomNumber", (roomNumber) => {
      setRoomNumber(roomNumber);
    });
  }, []);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const roomInput = ({ target }) => {
    setRoomNumber(target.value);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    socket.emit("joinRoom", roomNumber);
  };

  return (
    <div>
      <button onClick={createRoom}>Create Room</button>
      <form onSubmit={joinRoom}>
        <label>
          Room Number:
          <input type="text" value={roomNumber} onChange={roomInput} />
        </label>
        <input type="submit" value="Join" />
      </form>
    </div>
  );
};
export default Lobby;
