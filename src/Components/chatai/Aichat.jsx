import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, IconButton, Paper, Avatar, Stack } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../api/axiosInstance"

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newChat = [...chat, { sender: "user", text: message }];
    setChat(newChat);
    setMessage("");

    try {
      const res = await axios.post("/auth/chat/", { message });
      setChat([...newChat, { sender: "ai", text: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChat([...newChat, { sender: "ai", text: "لا يمكنك استعمال هذه الخاصية يجب دفع الاشتراك" }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, height: "500px", display: "flex", flexDirection: "column" }}>
      {/* Chat Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 1, px: 1 }}>
        {chat.map((c, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1}
            justifyContent={c.sender === "ai" ? "flex-start" : "flex-end"}
            sx={{ mb: 1 }}
          >
            {c.sender === "ai" && <Avatar sx={{ width: 30, height: 30 }}>AI</Avatar>}
            <Box
              sx={{
                maxWidth: "70%",
                bgcolor: c.sender === "ai" ? "#f1f1f1" : "#1976d2",
                color: c.sender === "ai" ? "black" : "white",
                px: 2,
                py: 1,
                borderRadius: 2,
                wordBreak: "break-word",
              }}
            >
              <Typography variant="body2">{c.text}</Typography>
            </Box>
            {c.sender === "user" && <Avatar sx={{ width: 30, height: 30 }}>U</Avatar>}
          </Stack>
        ))}
        <div ref={chatEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ display: "flex", mt: 1 }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
        />
        <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
