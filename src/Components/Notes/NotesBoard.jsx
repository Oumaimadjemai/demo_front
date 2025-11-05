import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  DialogActions,
  DialogContent,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { useState, useEffect } from "react";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import axios from "../../api/axiosInstance";

export default function NotesBoard() {
  const [notes, setNotes] = useState([]);
  const [openAddNoteDialog, setOpenAddNoteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null); // pour edit
  const [noteToDelete, setNoteToDelete] = useState(null); // pour confirmation

  // Fetch notes from DRF
  const fetchNotes = async () => {
    const res = await axios.get("note/notes/");
    setNotes(res.data.results);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note to DRF
  const handleAddNote = async (note) => {
    await axios.post("note/notes/", {
      title: note.title,
      subject: note.subject,
      color: note.color,
    });
    fetchNotes();
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setNoteToDelete(id);
    setOpenConfirmDialog(true);
  };

  // Delete note from DRF
  const handleDeleteNote = async () => {
    if (noteToDelete) {
      await axios.delete(`note/notes/${noteToDelete}/`);
      setNoteToDelete(null);
      setOpenConfirmDialog(false);
      fetchNotes();
    }
  };

  // Open edit dialog
  const handleEditNote = (index) => {
    const note = notes[index];
    setSelectedNote(note);
    setOpenEditDialog(true);
  };

  // Save edited note
  const handleSaveEdit = async (note) => {
    await axios.put(`note/notes/${selectedNote.id}/`, {
      title: note.title,
      subject: note.subject,
      color: note.color,
    });
    setSelectedNote(null);
    setOpenEditDialog(false);
    fetchNotes();
  };

  return (
    <>
      {/* Add button */}
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        sx={{ width: "150px", height: "50px" }}
        onClick={() => setOpenAddNoteDialog(true)}
      >
        إضافة ملاحظة
      </Button>

      {/* Notes list */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 6, mt: 4 }}
        justifyContent="space-between"
      >
        <NoteList
          notes={notes}
          onDelete={(index) => confirmDelete(notes[index].id)}
          onEdit={handleEditNote}
        />
      </Stack>

      {/* Dialog: Add Note */}
      <Dialog
        open={openAddNoteDialog}
        onClose={() => setOpenAddNoteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddNoteDialog(false)}
              sx={{ color: (theme) => theme.palette.error.main }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" color="primary">
              إضافة ملاحظة
            </Typography>
          </Box>
        </DialogTitle>

        <NoteForm
          setOpenAddNoteDialog={setOpenAddNoteDialog}
          onAddNote={handleAddNote}
        />
      </Dialog>

      {/* Dialog: Edit Note */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          تعديل الملاحظة
        </DialogTitle>

        {selectedNote && (
          <NoteForm
            setOpenAddNoteDialog={setOpenEditDialog}
            onAddNote={handleSaveEdit}
            initialData={selectedNote} // on ajoute ce prop pour pré-remplir
          />
        )}
      </Dialog>

      {/* Dialog: Confirm Delete */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>تأكيد الحذف</DialogTitle>
        <DialogContent>
          هل أنت متأكد أنك تريد حذف هذه الملاحظة ؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>إلغاء</Button>
          <Button onClick={handleDeleteNote} color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
