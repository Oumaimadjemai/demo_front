import { useState } from "react";
import { Container, Typography } from "@mui/material";
import NoteForm from "../Notes/NoteForm";
import NoteList from "../Notes/NoteList";
export default function NoteCard() {
  const [notes, setNotes] = useState([]);

  const handleAddNote = (note) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };
  return (
    <>
    
      <Container>
        <Typography variant="h4" align="center" sx={{ mt: 4 }}>
          ملاحظاتي
        </Typography>
        <NoteForm onAddNote={handleAddNote} />
        <NoteList notes={notes} />
      </Container>
    </>
  );
}
