import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState("0");
  const [roomNotExist, setRoomNotExist] = useState("");
  const [roomList, setRoomList] = useState("None");

  useEffect(() => {
    socket.on("createdRoom", (newRoomList) => {
      setRoomList(newRoomList.join(", "));
    });
    // TODO: how to make url function of room number?
    socket.on("roomJoined", (roomNumber) => {
      navigate("./lobby");
    });
    socket.on("roomNotExist", () => {
      setRoomNotExist("Room does not exist.");
    });
  }, []);

  const createRoom = () => {
    socket.emit("createRoom");
  };

  const roomInput = ({ target }) => {
    setRoomNumber(target.value);
    console.log("roomNumber=" + roomNumber);
  };

  const joinRoom = (event) => {
    event.preventDefault();
    socket.emit("joinRoom", roomNumber);
  };

  return (
    // <div>
    //   <h1>Bluff Chess</h1>
    //   <p>Existing Rooms: {roomList}</p>
    //   <button onClick={createRoom}>Create Room</button>
    //   <form onSubmit={joinRoom}>
    //     <label>
    //       Room Number:
    //       <input type="text" value={roomNumber} onChange={roomInput} />
    //     </label>
    //     <input type="submit" value="Join" />
    //   </form>
    //   {roomNotExist}
    // </div>
    <div>
      <Typography variant="h1">Bluff Chess</Typography>

      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item sx={{ p: 1 }}>
          <Button onClick={createRoom} variant="contained">
            Create Room
          </Button>
        </Grid>

        <Grid item sx={{ p: 1 }}>
          <form onSubmit={joinRoom}>
            <TextField
              value={roomNumber}
              onChange={roomInput}
              id="room-number-basic"
              label="Room Number:"
              variant="outlined"
              error={roomNotExist !== ""}
              helperText={roomNotExist}
            />
            <Button type="submit" value="Join" variant="contained">
              Join Room
            </Button>
          </form>
        </Grid>
      </Grid>

      <Typography variant="p">Existing Rooms: {roomList}</Typography>
    </div>
  );
};
export default Home;
