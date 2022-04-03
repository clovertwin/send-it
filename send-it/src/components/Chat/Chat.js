import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import io from "socket.io-client";

import "./Chat.css";

import TextContainer from "../TextContainer/TextContainer";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

const ENDPOINT = "https://send-it-chat.herokuapp.com/";

let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlName = searchParams.get("name");
    const urlRoom = searchParams.get("room");
    socket = io(ENDPOINT);
    setName(urlName);
    setRoom(urlRoom);
    socket.emit("join", { name: urlName, room: urlRoom }, () => {});
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [searchParams]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
