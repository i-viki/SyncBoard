import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip,
    Avatar,
    Tooltip,
    IconButton,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

function TextEditor({
    theme,
    wordCount,
    letterCount,
    handleSelectAll,
    handleCopyAll,
    handlePasteClipboard,
    isLocked,
    setLockOpen,
    lineCount,
    lineNumbersRef,
    textInputFieldRef,
    handleValueChange,
    handlePaste,
    isLockDisabled,
    isBoardInteractionDisabled,
}) {
    const [openToast, setOpenToast] = React.useState(false);
    console.log("lock status in text panel:", isBoardInteractionDisabled);
    const { code } = useParams();
    const handleDownload = () => {
        if (!textInputFieldRef.current) return;

        const text = textInputFieldRef.current.value.trim();
        if (!text) return;
        const lettersOnly = text.replace(/\s+/g, "");
        if (lettersOnly.length <= 1) return;
        const fileName = `syncboard_${code || "board"}`;
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName + ".txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setOpenToast(true);
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenToast(false);
    };
    const handleClearAll = () => {
        if (!textInputFieldRef.current) return;
        textInputFieldRef.current.value = "";
        handleValueChange({ target: { value: "" } });
    };
    return (
        <Paper
            elevation={3}
            sx={{
                flex: { xs: "50vh", md: 7 },
                width: { xs: "100%", md: "auto" },
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

                <Stack direction="row" spacing={1} alignItems="center">
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
                                >
                                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                        {wordCount}
                                    </Typography>
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

                    <Tooltip title="Select all">
                        <IconButton size="small" onClick={handleSelectAll}>
                            <SelectAllIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Copy all">
                        <IconButton size="small" onClick={handleCopyAll}>
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Paste from clipboard">
                        <IconButton disabled={isBoardInteractionDisabled} size="small" onClick={handlePasteClipboard}>
                            <ContentPasteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    {/* <Tooltip title="Clear all text">
                        <IconButton
                            size="small"
                            onClick={handleClearAll}
                            disabled={isBoardInteractionDisabled}
                        >
                            <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                    </Tooltip> */}
                    {letterCount > 1 && (
                        <Tooltip title="Download text">
                            <IconButton size="small" onClick={handleDownload}>
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

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

                <textarea
                    disabled={isBoardInteractionDisabled}
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
            <Snackbar
                open={openToast}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseToast} severity="success" sx={{ width: "100%" }}>
                    Text content downloaded successfully!
                </Alert>
            </Snackbar>
        </Paper>
    );
}

export default TextEditor;