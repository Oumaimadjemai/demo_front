import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Card,
  Container,
} from "@mui/material";
import { HexColorPicker } from "react-colorful";

export default function NoteForm({ onAddNote, setOpenAddNoteDialog, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [color, setColor] = useState(initialData?.color || "#f5f5f5");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubject(initialData.subject || "");
      setColor(initialData.color || "#f5f5f5");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (title.trim() === "" || subject.trim() === "") return;
    onAddNote({ title, subject, color });
    setTitle("");
    setSubject("");
    setColor("#f5f5f5");
    setShowColorPicker(false);
    setOpenAddNoteDialog(false);
  };

  const handleClick = () => {
    handleSubmit();
    setOpenAddNoteDialog(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ width: 400, mx: "auto", mt: 4, mb: 4, p: 2 }}>
        <Card sx={{ p: 2 }}>
          <TextField
            label="العنوان"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="الموضوع"
            multiline
            fullWidth
            minRows={3}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            {showColorPicker ? "إخفاء" : "اختر لون"}
          </Button>
          {showColorPicker && (
            <Box sx={{ mt: 2 }}>
              <HexColorPicker color={color} onChange={setColor} />
            </Box>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={handleClick}
            sx={{ mt: 3 }}
          >
            إضافة
          </Button>
        </Card>
      </Box>
    </Container>
  );
}
