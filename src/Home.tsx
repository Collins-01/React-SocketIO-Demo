import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Home.css";
import Message from "./types/message_type";
// import Message from "./types/message_type";

const Home = () => {
  // *Variables
  const socket = io("http://localhost:5000");
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // *Methods
  const getAllMessages = () => {
    socket.emit("findAllMessaging", {}, (response: any) => {
      const list = response as Array<any>;
      console.log(`Message Length: ${list.length}`);
      list.map((item) => {
        console.log(`MESSAGE:: ${item.name}:: ${item.text}`);
      });
    });
  };
  const joinRoom = () => {
    socket.emit("join", { name: "Paulooo" }, (response: any) => {
      if (response.joined) {
        setJoined(response.joined);
        setName(response.name);
        console.log(`Join Room Response: ${response.joined}`);
      }
    });
  };
  const listenToMessages = () => {
    socket.on("message", (res: any) => {
      messages.push({ name: res.name, text: res.text });
      console.log(`Incoming Message: ${res.text}`);
    });
  };

  const sendMessage = () => {
    socket.emit("createMessaging", {
      text: `Hello! the time is ${Date.now().toLocaleString()}`,
      name: "Collins001",
    });
  };

  useEffect(() => {
    getAllMessages();
    listenToMessages();
  }, []);

  return (
    <div className="home">
      <h1>{name}</h1>
      {!joined && (
        <div className="home__joinContainer">
          <input placeholder="Name" />
          <button onClick={joinRoom}>Join</button>
        </div>
      )}
      {messages.map((msg) => (
        <h3>
          {msg.name} : {msg.text}
        </h3>
      ))}
      <div>
        <input placeholder="Send Message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Home;
