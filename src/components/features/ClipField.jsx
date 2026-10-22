/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  listenToRoom,
  updateRoom,
  updateRoomText,
} from "../../services/firebaseService";
import { uploadToCloudinary } from "../../services/cloudinaryService";
import { userIdentifier } from "../../utils/userIdentifier";
import { sanitizeString, sanitizeFileName } from "../../utils/sanitize";
import { ensureAnonymousAuth } from "../../services/authService";
import TextEditor from "./TextEditor";
import FilePanel from "./FilePanel";
import { useTheme, Box, Button, Typography } from "@mui/material";
import { toast } from "sonner";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { clickLogging } from "../../services/analyticsService";

const USER_UUID = userIdentifier();

function ClipField() {
  const { code } = useParams();
  const theme = useTheme();

  /* ================= STATE ================= */

  const [firebaseData, setFirebaseData] = useState({});
  const [textValue, setTextValue] = useState("");
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);

  const [lockOpen, setLockOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [isLockDisabled, setIsLockDisabled] = useState(null);

  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);

  const textInputFieldRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const fileContainerRef = useRef(null);
  const timeoutRef = useRef(null);

  // Board interaction disabled logic
  const isBoardInteractionDisabled =
    !!isLockDisabled === null
      ? true   // while loading, disable everything
      : isLockDisabled === false && isLocked;
  // Calculate words & letters
  const calculateMetrics = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const letters = text.replace(/\s/g, "").length;
    setWordCount(words);
    setLetterCount(letters);
  };

  // Update line count
  const updateLineNumbers = (text) => {
    const lines = text.split("\n").length;
    setLineCount(lines);
  };

  /* ================= TEXT SAVE ================= */

  // Save text to Firebase
  const updateValueInDatabase = (value) => {
    if (firebaseData.passwordHash && isLocked) {
      toast.error("Board is locked");
      return;
    }
    updateRoomText(code, value);
  };

  // Handle typing
  const handleValueChange = useCallback((value) => {
    setTextValue(value);
    calculateMetrics(value);
    updateLineNumbers(value);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateValueInDatabase(value);
    }, 400);
  }, [firebaseData, isLocked, code]);

  /* ================= EDITOR ACTIONS ================= */

  // Select all text
  const handleSelectAll = useCallback(() => {
    const textarea = textInputFieldRef.current;
    if (!textarea) return;
    textarea.focus();
    textarea.select();
    toast.info("All text selected", { duration: 2500 });
    clickLogging("All Text selected: " + code);
  }, [code]);

  // Copy all text
  const handleCopyAll = useCallback(async () => {
    const text = textValue || "";
    await navigator.clipboard.writeText(text);
    toast.info("Text copied to clipboard", { duration: 2500 });
    clickLogging("Text copied to clipboard: " + code);
  }, [textValue, code]);

  // Paste clipboard text
  const handlePasteClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const newValue = textValue + text;

      setTextValue(newValue);
      updateValueInDatabase(newValue);
      updateLineNumbers(newValue);

      toast.success("Text pasted from clipboard", { duration: 2500 });
      clickLogging("Text pasted from clipboard: " + code);
    } catch {
      console.log("Clipboard permission denied");
    }
  }, [textValue, code, firebaseData, isLocked]);

  /* ================= PIN HASH ================= */

  // Hash PIN with SHA-256 (salted with room code to prevent rainbow table attacks)
  async function hashPin(pin, salt = code) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${salt}:${pin}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // Legacy fallback for boards created before salting
  async function legacyHashPin(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  /* ================= FIREBASE LISTENER ================= */

  // Listen to room changes — wait for auth first so DB rules don't reject the read
  useEffect(() => {
    let unsubscribe = null;
    let cancelled = false;

    ensureAnonymousAuth()
      .then(() => {
        if (cancelled) return;
        unsubscribe = listenToRoom(code, (data) => {
          if (!data) return;

          // Check for expiration
          if (data.expirationTime && Date.now() > data.expirationTime) {
            updateRoom(code, {
              text: "",
              images: [],
              expirationTime: null,
              passwordHash: null,
              lastUpdated: new Date().toISOString(),
            });
            toast.error("Board session expired and has been cleared");
            return;
          }

          const text = data?.text ?? "";

          if (
            textInputFieldRef.current &&
            textInputFieldRef.current.value !== text
          ) {
            textInputFieldRef.current.value = text;
          }

          if (textValue !== text) {
            setTextValue(text);
          }

          calculateMetrics(text);
          updateLineNumbers(text);

          setFirebaseData(data);
          setIsLocked(!!data?.passwordHash);
          setIsLockDisabled(!!data?.isLockDisabled);

          if (data?.images?.length) {
            const active = data.images.filter((img) => !img.deleted);
            setImages(active);
          }
        });
      })
      .catch(() => {
        // Auth failed — listener won't start, but the app still renders
      });

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [code]);


  /* ================= FILE HANDLING ================= */

  // Handle file selection
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const fileHandler = async (file) => {
    try {
      if (isLocked) {
        toast.error("Board is locked");
        return;
      }

      if (loader) {
        toast.info("Upload in progress...");
        return;
      }

      if (!file) {
        toast.error("No file selected");
        return;
      }

      if (images.length >= 5) {
        toast.error("Maximum 5 files allowed per board.");
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error("File must be less than 10MB");
        return;
      }

      setLoader(true);
      const isImage = file.type.startsWith("image/");

      // Only read as data URL for image preview; non-images don't need it
      let previewSrc = null;
      if (isImage) {
        previewSrc = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      setImages([{ src: previewSrc, name: file.name, type: file.type, isImage }]);

      // Upload the raw File object (not base64)
      const res = await uploadToCloudinary(file);

      const now = new Date().toISOString();

      const updatedImages = [
        ...(firebaseData.images || []),
        {
          name: sanitizeString(file.name),
          src: res.url,
          bytes: res.bytes || 0,
          format: res.format || file.name.split(".").pop() || "",
          resourceType: res.resourceType || "raw",
          fileType: file.type || "",
          downloads: 0,
          deleted: false,
          user: USER_UUID,
          lastUpdated: now,
        },
      ];

      await updateRoom(code, {
        ...firebaseData,
        text: textInputFieldRef.current?.value || "",
        images: updatedImages,
        users: firebaseData?.users?.length
          ? firebaseData.users
          : [USER_UUID],
        lastUpdated: now,
      });

    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed. Please try again.");
      setImages([]);
    } finally {
      setLoader(false);

      if (uploadBtnRef.current) {
        uploadBtnRef.current.value = "";
      }
    }
  };

  // Delete file
  const handleDeleteFile = useCallback((src) => {
    const updated = firebaseData.images.map((img) =>
      img.src === src ? { ...img, deleted: true } : img
    );

    // Update Firebase and let the listener handle the UI update naturally
    updateRoom(code, { ...firebaseData, images: updated });
  }, [firebaseData, code]);

  // Download file
  const handleDownloadFile = useCallback(async (src, name) => {
    if (!src) return;

    const sanitizedName = sanitizeFileName(name);
    console.log("Starting download for:", sanitizedName, "from URL:", src);
    toast.info(`Preparing ${name}...`);

    try {
      console.log("Attempting Blob fetch...");
      // Explicitly omit credentials to avoid triggering Cloudinary security filters
      const response = await fetch(src, {
        mode: "cors",
        credentials: "omit"
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = sanitizedName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Blob download failed, falling back to direct link:", error);
      // Fallback to direct link if fetch fails (e.g. CORS)
      const link = document.createElement("a");
      link.href = src;
      link.download = sanitizedName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, []);



  /* ================= SCROLL SYNC ================= */

  useEffect(() => {
    const textarea = textInputFieldRef.current;
    const lineBox = lineNumbersRef.current;

    if (!textarea || !lineBox) return;

    const syncScroll = () => {
      lineBox.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener("scroll", syncScroll);
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, [textInputFieldRef.current, lineNumbersRef.current]);

  /* ================= DRAG DROP ================= */

  useEffect(() => {
    const container = fileContainerRef.current;
    if (!container) return;

    const handleDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => fileHandler(file));
    };

    const preventDefault = (e) => e.preventDefault();

    container.addEventListener("dragover", preventDefault);
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("dragover", preventDefault);
      container.removeEventListener("drop", handleDrop);
    };
  }, [fileContainerRef.current]);

  /* ================= RENDER ================= */

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          height: { xs: "86vh", md: "86vh" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <TextEditor
          theme={theme}
          value={textValue}
          onValueChange={handleValueChange}
          wordCount={wordCount}
          letterCount={letterCount}
          handleSelectAll={handleSelectAll}
          handleCopyAll={handleCopyAll}
          handlePasteClipboard={handlePasteClipboard}
          isLocked={isLocked}
          setLockOpen={setLockOpen}
          lineCount={lineCount}
          lineNumbersRef={lineNumbersRef}
          textInputFieldRef={textInputFieldRef}
          handleValueChange={handleValueChange}
          isLockDisabled={isLockDisabled}
          isBoardInteractionDisabled={isBoardInteractionDisabled}
        />

        <FilePanel
          theme={theme}
          files={images}
          loader={loader}
          uploadBtnRef={uploadBtnRef}
          fileContainerRef={fileContainerRef}
          fileHandler={fileHandler}
          handleDownloadFile={handleDownloadFile}
          handleDeleteFile={handleDeleteFile}
          isLockDisabled={isLockDisabled}
          isBoardInteractionDisabled={isBoardInteractionDisabled}
        />
      </Box>

      {/* Lock Dialog */}
      <Dialog
        open={lockOpen}
        onClose={() => setLockOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              backgroundColor: theme.palette.mode === "dark" ? "#141414" : "#ffffff",
              border: `1px solid ${theme.palette.mode === "dark" ? "#262626" : "#e4e4e7"}`,
              p: 1.5,
              boxShadow: theme.palette.mode === "dark"
                ? "0 20px 60px rgba(0, 0, 0, 0.6)"
                : "0 20px 60px rgba(0, 0, 0, 0.12)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            letterSpacing: "-0.4px",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#090909",
          }}
        >
          {isLocked ? "Unlock Board" : "Secure Board with PIN"}
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              fontSize: "13px",
              color: theme.palette.mode === "dark" ? "#999999" : "#71717a",
              mb: 2,
            }}
          >
            {isLocked
              ? "Enter your 6-digit PIN to re-enable editing and sharing."
              : "Set a 6-digit SHA-256 PIN to restrict write access to this workspace."}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            placeholder="••••••"
            slotProps={{
              htmlInput: {
                maxLength: 6,
                style: {
                  textAlign: "center",
                  letterSpacing: "6px",
                  fontSize: "20px",
                  fontFamily: "var(--font-mono)",
                },
              },
            }}
            value={pinInput}
            onChange={(e) =>
              setPinInput(e.target.value.replace(/\D/g, ""))
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.mode === "dark" ? "#1c1c1c" : "#f4f4f5",
                borderRadius: "10px",
              },
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setLockOpen(false)}
            sx={{
              borderRadius: "100px",
              borderColor: theme.palette.mode === "dark" ? "#262626" : "#e4e4e7",
              color: theme.palette.mode === "dark" ? "#999999" : "#71717a",
              "&:hover": {
                borderColor: theme.palette.mode === "dark" ? "#383838" : "#a1a1aa",
                color: theme.palette.mode === "dark" ? "#ffffff" : "#090909",
                backgroundColor: theme.palette.mode === "dark" ? "#1c1c1c" : "#f4f4f5",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={pinInput.length !== 6}
            onClick={async () => {
              const hashed = await hashPin(pinInput);

              if (!isLocked) {
                await updateRoom(code, {
                  ...firebaseData,
                  passwordHash: hashed,
                  isLockDisabled: false,
                });

                setIsLocked(true);
                setIsLockDisabled(false);
                toast.success("Board locked");
              } else {
                const isMatch = firebaseData.passwordHash === hashed || firebaseData.passwordHash === await legacyHashPin(pinInput);
                if (isMatch) {
                  await updateRoom(code, {
                    ...firebaseData,
                    passwordHash: null,
                    isLockDisabled: true,
                  });

                  setIsLocked(false);
                  setIsLockDisabled(true);
                  toast.success("Board lock disabled");
                } else {
                  toast.error("Incorrect PIN");
                  return;
                }
              }

              setPinInput("");
              setLockOpen(false);
            }}
            sx={{
              borderRadius: "100px",
              px: 3,
              fontWeight: 600,
              backgroundColor: theme.palette.mode === "dark" ? "#ffffff" : "#090909",
              color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "#ececec" : "#222222",
              },
            }}
          >
            {isLocked ? "Unlock" : "Lock Board"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClipField;