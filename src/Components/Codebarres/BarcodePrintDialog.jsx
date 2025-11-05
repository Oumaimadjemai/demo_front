
// import { useEffect, useState } from "react";
// import { Dialog, Box, Typography, Button } from "@mui/material";
// import JsBarcode from "jsbarcode";
// import axios from "../../api/axiosInstance";

// export default function BarcodePrintDialog({
//   selectedProduit,
//   onClose,
//   onPrinted,
// }) {
//   const [svgMarkup, setSvgMarkup] = useState("");

//   // Generate SVG barcode whenever product changes
//   useEffect(() => {
//     if (selectedProduit) {
//       const svg = document.createElement("svg");

//       JsBarcode(svg, selectedProduit.codebarre, {
//         format: "EAN13",
//         width: 1,
//         height: 20,
//         displayValue: true,
//         fontSize: 13,
//         margin: 9, // add margin
//       });

//       // Create final SVG markup with store + product name
//       const finalMarkup = `
//   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="110">
//     <!-- Texte centré -->
//     <text x="80%" y="10" font-size="14" text-anchor="middle" font-family="Arial">Dar Lokman</text>
//     <text x="80%" y="24" font-size="12" text-anchor="middle" font-family="Arial">${selectedProduit.nom}</text>

//     <!-- Code-barres avec moins d'espace -->
//     <g transform="translate(90,26)">
//       ${svg.outerHTML}
//     </g>
//   </svg>
// `;


//       setSvgMarkup(finalMarkup);
//     }
//   }, [selectedProduit]);

//   const handleSendToBackend = async () => {
//     if (!svgMarkup) return;
//     try {
//       await axios.post("/prod/print-barcode-server/", {
//         code: selectedProduit.codebarre,
//         product: selectedProduit.nom,
//         store: "Dar Lokman",
//         svg: svgMarkup,
//       });
//       if (onPrinted) onPrinted(selectedProduit.codebarre);
//       onClose(); // close dialog after send
//     } catch (err) {
//       console.error("Erreur envoi serveur:", err);
//       alert("Erreur lors de l'envoi au serveur.");
//     }
//   };

//   if (!selectedProduit) return null;
//   const handleWebPrint = () => {
//   const iframe = document.createElement("iframe");
//   iframe.style.position = "fixed";
//   iframe.style.right = "0";
//   iframe.style.bottom = "0";
//   iframe.style.width = "0";
//   iframe.style.height = "0";
//   iframe.style.border = "0";
//   document.body.appendChild(iframe);

//   iframe.contentDocument.write(`
//     <html>
//       <head><title>Print</title></head>
//       <body>${svgMarkup}</body>
//     </html>
//   `);

//   iframe.contentDocument.close();
//   iframe.contentWindow.focus();
//   iframe.contentWindow.print();

//   // Remove iframe after printing
//   setTimeout(() => document.body.removeChild(iframe), 1000);
// };


//   return (
//     <Dialog open={!!selectedProduit} onClose={onClose}>
//       <Box sx={{ p: 1, width: "200px", textAlign: "center" }}>
       
//         <Box
//           sx={{ display: "flex", justifyContent: "center", mt: 1 }}
//           dangerouslySetInnerHTML={{ __html: svgMarkup }}
//         />

//         <Button
//           variant="contained"
//           // onClick={handleSendToBackend}
//           onClick={handleWebPrint}
//           fullWidth
//           sx={{ mt: 2 }}
//         >
//           Imprimer
//         </Button>
//       </Box>
//     </Dialog>
//   );
// }
// import { useEffect, useState } from "react";
// import { Dialog, Box, Button } from "@mui/material";
// import JsBarcode from "jsbarcode";

// export default function BarcodePrintDialog({ selectedProduit, onClose, onPrinted }) {
//   const [svgMarkup, setSvgMarkup] = useState("");

//   useEffect(() => {
//     if (selectedProduit) {
//       const svg = document.createElement("svg");

//       JsBarcode(svg, selectedProduit.codebarre, {
//         format: "EAN13",
//         width: 1,       // thicker bars for better scanning, increase if needed
//         height: 30,     // taller bars for better visibility
//         displayValue: true,
//         fontSize: 14,
//         margin: 5,
//       });

//       // Create SVG wrapper with centered text and barcode, styled as a column flexbox
//       const finalMarkup = `
//         <svg xmlns="http://www.w3.org/2000/svg" style="width: 58mm; height: auto; font-family: Arial, sans-serif; display: block; margin: auto;">
//           <text x="50%" y="20" font-size="14" text-anchor="middle" fill="black">Dar Lokman</text>
//           <text x="50%" y="40" font-size="12" text-anchor="middle" fill="black">${selectedProduit.nom}</text>
//           <g transform="translate(50,50)">
//             ${svg.outerHTML}
//           </g>
//         </svg>
//       `;

//       setSvgMarkup(finalMarkup);
//     }
//   }, [selectedProduit]);

//   const handleWebPrint = () => {
//     const iframe = document.createElement("iframe");
//     iframe.style.position = "fixed";
//     iframe.style.right = "0";
//     iframe.style.bottom = "0";
//     iframe.style.width = "0";
//     iframe.style.height = "0";
//     iframe.style.border = "0";
//     document.body.appendChild(iframe);

//     const printContent = `
//       <html>
//         <head>
//           <title>Print</title>
//           <style>
//             @media print {
//               @page {
//                 size: 58mm auto;
//                 margin: 0;
//               }
//               body {
//                 margin: 0;
//                 padding: 0;
//                 display: flex;
//                 justify-content: center;
//                 align-items: center;
//               }
//               svg {
//                 width: 58mm;
//                 height: auto;
//                 display: block;
//                 margin: 0 auto;
//               }
//             }
//             body {
//               margin: 0;
//               padding: 0;
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               height: 100vh;
//             }
//             svg {
//               width: 58mm;
//               height: auto;
//               display: block;
//               margin: 0 auto;
//             }
//           </style>
//         </head>
//         <body>${svgMarkup}</body>
//       </html>
//     `;

//     iframe.contentDocument.write(printContent);
//     iframe.contentDocument.close();
//     iframe.contentWindow.focus();
//     iframe.contentWindow.print();

//     setTimeout(() => document.body.removeChild(iframe), 1000);
//   };

//   if (!selectedProduit) return null;

//   return (
//     <Dialog open={!!selectedProduit} onClose={onClose}>
//       <Box
//         sx={{
//           p: 1,
//           width: "220px",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//         }}
//       >
//         <Box
//           sx={{ mt: 1, width: "100%" }}
//           dangerouslySetInnerHTML={{ __html: svgMarkup }}
//         />
//         <Button variant="contained" onClick={handleWebPrint} fullWidth>
//           Imprimer
//         </Button>
//       </Box>
//     </Dialog>
//   );
// }


// import { useEffect, useState } from "react";
// import { Dialog, Box, Button } from "@mui/material";
// import JsBarcode from "jsbarcode";

// export default function BarcodePrintDialog({ selectedProduit, onClose }) {
//   const [svgMarkup, setSvgMarkup] = useState("");

//   useEffect(() => {
//     if (selectedProduit) {
//       const svg = document.createElement("svg");

//      JsBarcode(svg, selectedProduit.codebarre, {
//   format: "EAN13",
//   width: 1,         // thinner bars → smaller footprint
//   height: 30,       // shorter bars
//   displayValue: true,
//   fontSize: 9,      // smaller font
//   margin: 0,
// });


//       const finalMarkup = `
//         <div style="width: 58mm; font-family: Arial, sans-serif;">
//           <div style="text-align:center; font-weight:bold; font-size:12px;">Dar Lokman</div>
//           <div style="text-align:center; font-size:10px;">${selectedProduit.nom}</div>
//           <div style="text-align:center; margin-top:2mm;">${svg.outerHTML}</div>
//         </div>
//       `;
//       setSvgMarkup(finalMarkup);
//     }
//   }, [selectedProduit]);

//   const handleWebPrint = () => {
//     const iframe = document.createElement("iframe");
//     iframe.style.position = "fixed";
//     iframe.style.right = "0";
//     iframe.style.bottom = "0";
//     iframe.style.width = "0";
//     iframe.style.height = "0";
//     iframe.style.border = "0";
//     document.body.appendChild(iframe);

//     const printContent = `
//       <html>
//         <head>
//           <style>
//             @page {
//               size: 58mm auto;
//               margin: 0;
//             }
//             body {
//               margin: 0;
//               padding: 0;
//               display: flex;
//               justify-content: center;
//             }
//           </style>
//         </head>
//         <body>${svgMarkup}</body>
//       </html>
//     `;

//     iframe.contentDocument.write(printContent);
//     iframe.contentDocument.close();
//     iframe.contentWindow.focus();
//     iframe.contentWindow.print();

//     setTimeout(() => document.body.removeChild(iframe), 1000);
//   };

//   if (!selectedProduit) return null;

//   return (
//     <Dialog open={!!selectedProduit} onClose={onClose}>
//       <Box sx={{ p: 2, width: 230 }}>
//         <Box dangerouslySetInnerHTML={{ __html: svgMarkup }} sx={{ mb: 2 }} />
//         <Button variant="contained" fullWidth onClick={handleWebPrint}>
//           Imprimer
//         </Button>
//       </Box>
//     </Dialog>
//   );
// }


import { useEffect, useState } from "react";
import { Dialog, Box, Button, Stack } from "@mui/material";
import JsBarcode from "jsbarcode";
import axios from "../../api/axiosInstance"

export default function BarcodePrintDialog({ selectedProduit, onClose, refreshProduits }) {
  const [svgMarkup, setSvgMarkup] = useState("");

  useEffect(() => {
    if (selectedProduit) {
      const svg = document.createElement("svg");
      const code = selectedProduit.codebarre?.toString() || "0000000000000";

      JsBarcode(svg, code, {
        format: "EAN13",
        lineColor: "#000",
        width: 2,
        height: 60,
        displayValue: false, // Masquer le code sous le code-barres
        margin: 0,
      });

      const finalMarkup = `
        <div style="width: 56mm; font-family: Arial, sans-serif; text-align:center;">
          <div style="font-weight:bold; font-size:14px;">Dar Lokman</div>
          <div style="font-size:12px; margin-bottom:2mm;">${selectedProduit.nom}</div>
          <div style="text-align:center;">${svg.outerHTML}</div>
          <div style="font-size:14px; letter-spacing:2px; margin-top:2mm;">${code}</div>
        </div>
      `;
      setSvgMarkup(finalMarkup);
    }
  }, [selectedProduit]);

  // ✅ Impression sur ticket
  const handleWebPrint = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const printContent = `
      <html>
        <head>
          <style>
            @page {
              size: 58mm auto;
              margin: 2mm;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
            }
          </style>
        </head>
        <body>${svgMarkup}</body>
      </html>
    `;

    iframe.contentDocument.write(printContent);
    iframe.contentDocument.close();
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 300);
  };

  // ✅ Suppression du code-barre
  const handleDeleteBarcode = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const produit = selectedProduit;

      // Supprimer le code-barre sélectionné
      const updatedCodes =
        (produit.codes_barres || []).filter(
          (cb) => cb !== produit.codebarre
        ) || [];

      // Mettre à jour la quantité
      const updatedQuantite = Math.max(0, (produit.quantite || 0) - 1);

      // PATCH vers backend
      await axios.patch(
        `/prod/produits/${produit.id}/`,
        {
          codes_barres: updatedCodes,
          quantite: updatedQuantite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔁 Actualiser la liste dans le tableau
      if (refreshProduits) await refreshProduits();

      // Fermer le dialogue
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression du code-barre :", error);
      alert("Une erreur est survenue lors de la suppression du code-barre.");
    }
  };

  if (!selectedProduit) return null;

  return (
    <Dialog open={!!selectedProduit} onClose={onClose}>
      <Box sx={{ p: 2, width: 230 }}>
        <Box dangerouslySetInnerHTML={{ __html: svgMarkup }} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={1}>
          <Button variant="contained" fullWidth onClick={handleWebPrint}>
            Imprimer
          </Button>
          <Button
            variant="contained"
            fullWidth
            color="error"
            onClick={handleDeleteBarcode}
          >
            Supprimer
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}

