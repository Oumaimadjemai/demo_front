import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// export default function NoteList({ notes, onDelete, onEdit }) {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexWrap: "wrap",
//         gap: 2,
//         mt: 4,
//         justifyContent: "center",
//       }}
//     >
//       {notes.map((note, index) => (
//         <Card key={index} sx={{ backgroundColor: note.color, width: 200 }}>
//           <CardContent>
//             <Typography variant="h6">{note.title}</Typography>
//             <Typography variant="body2">{note.subject}</Typography>

//             <Stack direction="row" justifyContent="flex-end" spacing={1}>
//               {note.date && (
//                 <Typography variant="caption" color="text.secondary">
//                   {note.date}
//                 </Typography>
//               )}
//               <IconButton onClick={() => onEdit(index)} size="small">
//                 <EditIcon fontSize="small" sx={{ color: "primary.main" }} />
//               </IconButton>
//               <IconButton
//                 onClick={() => onDelete(index)}
//                 size="small"
//                 color="error"
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </Stack>
//           </CardContent>
//         </Card>
//       ))}
//     </Box>
//   );
// }
export default function NoteList({ notes, onDelete, onEdit }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mt: 4,
        justifyContent: "center",
      }}
    >
      {notes.map((note, index) => (
        <Card key={note.id} sx={{ backgroundColor: note.color, width: 200 }}>
          <CardContent>
            <Typography variant="h6">{note.title}</Typography>
            <Typography variant="body2">{note.subject}</Typography>

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              {note.date && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(note.date).toLocaleString("fr-FR")}
                </Typography>
              )}
              <IconButton onClick={() => onEdit(index)} size="small">
                <EditIcon fontSize="small" sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton
                onClick={() => onDelete(index)}
                size="small"
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
