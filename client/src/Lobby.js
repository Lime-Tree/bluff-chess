import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Lobby = ({ socket }) => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("0");

  useEffect(() => {
    socket.on("roomJoined", () => {
      navigate("./board");
    });
  }, []);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const roomInput = ({ target }) => {
    setRoomNumber(target.value);
  };

  const joinRoom = (event) => {
    event.preventDefault();
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
