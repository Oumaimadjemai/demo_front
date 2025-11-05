import { useState } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "../../api/axiosInstance";
export default function ClientFiles({ files }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Sépare juste images et autres fichiers par extension (optionnel)
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const pdfExtensions = ["pdf"];

  const imageFiles =
    files?.filter((file) => {
      if (!file?.url) return false;
      const ext = file.url.split(".").pop()?.toLowerCase();
      return imageExtensions.includes(ext);
    }) || [];

  const otherFiles =
    files?.filter((file) => {
      if (!file?.url) return false;
      const ext = file.url.split(".").pop()?.toLowerCase();
      return !imageExtensions.includes(ext);
    }) || [];

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev === 0 ? imageFiles.length - 1 : prev - 1
      );
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((prev) =>
        prev === imageFiles.length - 1 ? 0 : prev + 1
      );
    }
  };
const handleDownload = async (file) => {
  const response = await axios.get(file.url, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name || "fichier";
  document.body.appendChild(link);
  link.click();
  link.remove();
};




  return (
    <div>
      {/* Liste des autres fichiers (PDF, Word, etc.) */}
      <div style={{ marginBottom: "20px" }}>
        <h3>ملفات أخرى</h3>
        {otherFiles.length > 0 ? (
          otherFiles.map((file, idx) => (
            <button
              key={file.id || idx}
              onClick={() => handleDownload(file)}
              style={{
                display: "block",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            >
              Télécharger {file.name || `Fichier ${idx + 1}`}
            </button>
          ))
        ) : (
          <p>لا توجد ملفات أخرى</p>
        )}
      </div>

      {/* Galerie d'images */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {imageFiles.length > 0 ? (
          imageFiles.map((file, idx) => (
            <img
              key={file.id || idx}
              src={file.url}
              alt={file.name || "Image"}
              width={100}
              style={{ cursor: "pointer", borderRadius: "8px" }}
              onClick={() => setSelectedIndex(idx)}
            />
          ))
        ) : (
          <p>لا توجد صور</p>
        )}
      </div>

      {/* Visionneuse plein écran */}
      <Dialog
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        maxWidth="lg"
      >
        <DialogContent
          sx={{
            position: "relative",
            p: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          <IconButton
            onClick={() => setSelectedIndex(null)}
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
          >
            <CloseIcon />
          </IconButton>

          {imageFiles.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          )}

          {selectedIndex !== null && imageFiles[selectedIndex] && (
            <img
              src={imageFiles[selectedIndex].url}
              alt={imageFiles[selectedIndex].name || "Image"}
              style={{
                width: "auto",
                maxWidth: "90%",
                maxHeight: "90vh",
                display: "block",
              }}
            />
          )}

          {imageFiles.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 10,
                color: "white",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
