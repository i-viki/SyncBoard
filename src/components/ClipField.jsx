/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, update, onValue } from "firebase/database";
import { userIdentifier } from "../scripts/userIdentifier";
import { sanitizeString } from "../scripts/sanitizeString";
import { TailSpin } from "react-loader-spinner";
import {
  useTheme,
  Box,
  Paper,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { Toaster, toast } from "sonner";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { clickLogging } from "../scripts/analyticsLogging";

const USER_UUID = userIdentifier();

function ClipField() {
  const [lockOpen, setLockOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const theme = useTheme();
  const { code } = useParams();
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const textInputFieldRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const uploadBtnRef = useRef(null);
  const fileContainerRef = useRef(null);
  const timeoutRef = useRef(null);

  const roomRef = ref(appDatabase, `rooms/${code}`);

  const [firebaseData, setFirebaseData] = useState({});
  const [images, setImages] = useState([]);
  const [loader, setLoader] = useState(false);


  /* ================= METRICS ================= */

  const calculateMetrics = (text) => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const letters = text.replace(/\s/g, "").length;

    setWordCount(words);
    setLetterCount(letters);
  };
  /* ================= EDITOR ACTIONS ================= */

  const getWordCount = () => {
    const text = textInputFieldRef.current?.value || "";
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const handleSelectAll = () => {
    const textarea = textInputFieldRef.current;
    textarea.focus();
    textarea.select();
    toast.info("All text selected", { duration: 2500 });
    clickLogging("All Text selected: " + code);
  };

  const handleCopyAll = async () => {
    const text = textInputFieldRef.current?.value || "";
    await navigator.clipboard.writeText(text);
    toast.info("Text copied to clipboard", { duration: 2500 });
    clickLogging("Text copied to clipboard: " + code);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const textarea = textInputFieldRef.current;
      const newValue = textarea.value + text;
      textarea.value = newValue;
      updateValueInDatabase(newValue);
      updateLineNumbers(newValue);
      toast.success("Text pasted from clipboard", { duration: 2500 });
      clickLogging("Text pasted from clipboard: " + code);
    } catch (err) {
      console.log("Clipboard permission denied");
    }

  };



  /* ================= TEXT SAVE ================= */

  const updateValueInDatabase = (value) => {
    if (firebaseData.passwordHash && isLocked) {
      toast.error("Board is locked");
      return;
    }

    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");

    update(roomRef, {
      text: value,
      images: firebaseData.images || [],
      users: firebaseData?.users?.length
        ? firebaseData.users
        : [USER_UUID],
      lastUpdated: now,
      passwordHash: firebaseData.passwordHash || null,
    });
  };

  const handleValueChange = () => {
    const value = textInputFieldRef.current.value;
    calculateMetrics(value); // add this
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      updateValueInDatabase(value);
    }, 500);

    updateLineNumbers(value);
  };
  async function hashPin(pin) {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }
  /* ================= LINE NUMBERS ================= */

  const updateLineNumbers = (text) => {
    const lines = text.split("\n").length;
    setLineCount(lines);
  };

  /* ================= FIREBASE LISTENER ================= */

  useEffect(() => {
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const text = data?.text ?? "";

      if (textInputFieldRef.current) {
        textInputFieldRef.current.value = text;
        updateLineNumbers(text);
      }

      calculateMetrics(text);

      setFirebaseData(data);
      setIsLocked(!!data?.passwordHash);
      if (data?.images?.length) {
        const active = data.images.filter((img) => !img.deleted);
        setImages(active.length ? [active[active.length - 1]] : []);
      }
    });

    return () => unsubscribe();
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const imageExists = (name, src) =>
    images.find((img) => img.name === name && img.src === src);

  const uploadImageOnCloudinary = async (src, name) => {
    const payload = new FormData();
    payload.append("file", src);
    payload.append(
      "upload_preset",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_UPLOAD_PRESET_NAME
    );
    payload.append(
      "cloud_name",
      import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME
    );

    fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: payload }
    )
      .then((res) => res.json())
      .then((res) => {
        const now = new Date().toISOString();

        const data = {
          text: textInputFieldRef.current.value,
          images: [
            ...(firebaseData.images || []),
            {
              name: sanitizeString(name),
              src: res.url,
              bytes: res.bytes,
              downloads: 0,
              deleted: false,
              user: USER_UUID,
              lastUpdated: now,
            },
          ],
          users: firebaseData?.users?.length
            ? firebaseData.users
            : [USER_UUID],
          lastUpdated: now,
        };

        update(roomRef, data);
        setLoader(false);
      })
      .catch(() => {
        setImages([]);
        setLoader(false);
      });
  };

const fileHandler = (file) => {
  if (firebaseData.passwordHash && isLocked) {
    toast.error("Board is locked");
    return;
  }

  if (loader) {
    toast.info("Upload in progress...");
    return;
  }

  if (images.length === 1) {
    toast.error("Only one image can be uploaded at a time");
    return;
  }

  if (!file || !file.type.startsWith("image")) {
    toast.error("Invalid file type");
    return;
  }

  setLoader(true);

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    const src = reader.result;

    if (!imageExists(file.name, src)) {
      setImages([{ src, name: file.name }]);
      uploadImageOnCloudinary(src, file.name);
    }

    // Reset input so same file can be selected again
    if (uploadBtnRef.current) {
      uploadBtnRef.current.value = "";
    }
  };
};

  /* ================= PASTE IMAGE ================= */

  const handlePaste = (event) => {
    const items = event.clipboardData.items;

    for (let item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        fileHandler(file);
      }
    }
  };
  useEffect(() => {
    const textarea = textInputFieldRef.current;
    const lineBox = lineNumbersRef.current;

    const syncScroll = () => {
      lineBox.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener("scroll", syncScroll);

    return () => {
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, []);
  /* ================= DRAG DROP ================= */
  useEffect(() => {
    const textarea = textInputFieldRef.current;
    const lineBox = lineNumbersRef.current;

    const syncScroll = () => {
      lineBox.scrollTop = textarea.scrollTop;
    };

    textarea.addEventListener("scroll", syncScroll);

    return () => {
      textarea.removeEventListener("scroll", syncScroll);
    };
  }, []);
  useEffect(() => {
    const container = fileContainerRef.current;

    const handleDrop = (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      Array.from(files).forEach((file) => fileHandler(file));
    };

    container.addEventListener("dragover", (e) =>
      e.preventDefault()
    );
    container.addEventListener("drop", handleDrop);

    return () => {
      container.removeEventListener("drop", handleDrop);
    };
  }, []);

  /* ================= DELETE ================= */

  const handleDeleteImage = (src) => {
    const updated = firebaseData.images.map((img) =>
      img.src === src ? { ...img, deleted: true } : img
    );

    update(roomRef, { ...firebaseData, images: updated });
    setImages([]);
  };

  /* ================= DOWNLOAD ================= */

  const handleDownloadImage = (src, name) => {
    const encodedName = sanitizeString(name);
    if (src.includes("/upload/")) {
      const parts = src.split("/upload/");
      const downloadUrl = `${parts[0]}/upload/fl_attachment:${encodedName}/${parts[1]}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.click();
      return;
    }
    if (src.startsWith("data:image/")) {
      const link = document.createElement("a");
      link.href = src;
      link.download = encodedName;
      link.click();
    }
  };

  /* ================= RENDER ================= */

  return (
    <Box sx={{ px: 2, py: 3 }}>

      <Box sx={{ display: "flex", gap: 2, height: "86vh" }}>

        {/* ================= TEXT EDITOR (70%) ================= */}
        <Paper
          elevation={3}
          sx={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: theme.palette.background.paper,
          }}
        >

          {/* Topbar */}
          <Box
            sx={{
              px: 2,
              py: 1.2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.action.hover,
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              Text Editor
            </Typography>

            {/* RIGHT SIDE ACTIONS */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Metrics Chip */}
              <Chip
                avatar={
                  <Tooltip title="Number of words">
                    <Avatar
                      sx={{
                        bgcolor: "primary.secondary",
                        color: "inherit",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    ><Typography
                      variant="caption"
                      sx={{ opacity: 0.7 }}
                    >
                        {wordCount} </Typography>
                    </Avatar>
                  </Tooltip>
                }
                label={`${letterCount} chars`}
                variant="outlined"
                sx={{
                  height: 30,
                  fontWeight: 200,
                  borderRadius: 999,
                }}
              />

              {/* Select All */}
              <Tooltip title="Select all">
                <IconButton size="small" onClick={handleSelectAll}>
                  <SelectAllIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Copy */}
              <Tooltip title="Copy all">
                <IconButton size="small" onClick={handleCopyAll}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Paste */}
              <Tooltip title="Paste from clipboard">
                <IconButton size="small" onClick={handlePasteClipboard}>
                  <ContentPasteIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={isLocked ? "Unlock board" : "Lock board"}>
                <IconButton size="small" onClick={() => setLockOpen(true)}>
                  {isLocked ? (
                    <LockIcon color="error" fontSize="small" />
                  ) : (
                    <LockOpenIcon color="primary" fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Editor Body */}
          <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>

            {/* Line Numbers */}
            <Box
              ref={lineNumbersRef}
              sx={{
                width: 48,
                px: 1,
                py: 1.5,
                textAlign: "right",
                borderRight: (theme) =>
                  `1px solid ${theme.palette.divider}`,
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                backgroundColor: theme.palette.action.hover,
                color: theme.palette.text.disabled,
                overflow: "hidden",
                userSelect: "none",
              }}
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </Box>

            {/* Textarea */}
            <textarea
              ref={textInputFieldRef}
              onChange={handleValueChange}
              onPaste={handlePaste}
              spellCheck="false"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                padding: "14px 16px",
                fontFamily: "'Fira Code', monospace",
                fontSize: 14,
                lineHeight: 1.6,
                backgroundColor: "transparent",
                color: "inherit",
                overflow: "auto",
              }}
            />
          </Box>
        </Paper>

        {/* ================= IMAGE SECTION (30%) ================= */}
        <Paper
          elevation={0}
          sx={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            p: 2,
            backgroundColor: theme.palette.background.paper,
            border: (theme) =>
              `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" mb={2}>
            Image Upload
          </Typography>

          <Box
            ref={fileContainerRef}
            onClick={() => uploadBtnRef.current.click()}
            sx={{
              flex: 1,
              border: "2px dashed",
              borderColor: "rgba(255,255,255,0.15)",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "0.25s",
              borderColor: theme.palette.divider,
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            {/* Hidden Input */}
            <input
              type="file"
              hidden
              ref={uploadBtnRef}
              accept="image/*"
              onChange={(e) =>
                fileHandler(e.target.files[0])
              }
            />

            {/* Empty State */}
            {images.length === 0 && (
              <>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Select, paste or drop image here.
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ mt: 1, opacity: 0.5 }}
                >
                  Max 5MB • One file only
                </Typography>
              </>
            )}

            {/* Image Preview */}
            {images.length === 1 && (
              <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                  }}
                >
                  <img
                    src={images[0].src}
                    alt={images[0].name}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      transition: "0.3s ease",
                      filter: loader ? "blur(6px)" : "none",
                      opacity: loader ? 0.7 : 1,
                    }}
                  />

                  {/* Loading Overlay */}
                  {loader && (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backdropFilter: "brightness(0.8)",
                      }}
                    >
                      <TailSpin
                        height="60"
                        width="60"
                        color="#42a5f5"
                        ariaLabel="uploading"
                      />
                    </Box>
                  )}
                </Box>

                {/* Action Buttons */}
                {!loader && (
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadImage(images[0].src, images[0].name);
                      }}
                    >
                      Download
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(images[0].src);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}
          </Box>

          {/* INFO SECTION */}
          <Typography
            variant="caption"
            sx={{ mt: 2, opacity: 0.6 }}
          >
            Note: Only one image can be shared at a time.
            Delete the current image before uploading a new one.
          </Typography>
        </Paper>

      </Box>
      <Dialog open={lockOpen} onClose={() => setLockOpen(false)}>
        <DialogTitle>
          {isLocked ? "Unlock Board" : "Secure This Board"}
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Enter 6-digit PIN"
            inputProps={{ maxLength: 6 }}
            value={pinInput}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPinInput(value);
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setLockOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={pinInput.length !== 6}
            onClick={async () => {
              const hashed = await hashPin(pinInput);

              if (!isLocked) {
                // Lock board
                await update(roomRef, {
                  ...firebaseData,
                  passwordHash: hashed,
                });
                setIsLocked(true);
                toast.success("Board locked");
              } else {
                // Unlock attempt
                if (firebaseData.passwordHash === hashed) {
                  setIsLocked(false);
                  toast.success("Board unlocked");
                } else {
                  toast.error("Incorrect PIN");
                  return;
                }
              }

              setPinInput("");
              setLockOpen(false);
            }}
          >
            {isLocked ? "Unlock" : "Lock"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ClipField;