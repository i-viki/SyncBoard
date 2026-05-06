import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip,
    Avatar,
    Tooltip,
    IconButton,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import {
    ContentCopy as ContentCopyIcon,
    SelectAll as SelectAllIcon,
    ContentPaste as ContentPasteIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Download as DownloadIcon,
    AutoAwesome as AutoAwesomeIcon,
    ClearAll as ClearAllIcon,
} from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { toast } from "sonner";
import { useLanguageDetection } from "../../hooks/useLanguageDetection";

import Prism from "prismjs";
import "../../prism.css";

// Import some languages
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-json";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-go";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-yaml";

const LANGUAGES = [
    { label: "Auto-Detect", value: "auto" },
    { label: "Plain Text", value: "plain" },
    { label: "JavaScript", value: "javascript" },
    { label: "JSON", value: "json" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp" },
    { label: "Go", value: "go" },
    { label: "PHP", value: "php" },
    { label: "SQL", value: "sql" },
    { label: "Ruby", value: "ruby" },
    { label: "YAML", value: "yaml" },
    { label: "Markdown", value: "markdown" },
];

function TextEditor({
    theme,
    value,
    onValueChange,
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
    isBoardInteractionDisabled,
}) {
    const [openToast, setOpenToast] = useState(false);
    const [language, setLanguage] = useState("auto");
    const { code } = useParams();
    const preRef = useRef(null);

    // Internal state for immediate UI feedback (Debounced Firebase sync)
    const [localValue, setLocalValue] = useState(value);
    const debounceTimer = useRef(null);
    const detectedLanguage = useLanguageDetection(localValue, language);

    const activeLanguage = language === "auto" ? detectedLanguage : language;

    // Sync local value with incoming remote changes
    useEffect(() => {
        if (value !== localValue) {
            setLocalValue(value);
        }
    }, [value]);

    const handleTextChange = (newVal) => {
        // Update UI immediately
        setLocalValue(newVal);

        // Debounce the Firebase write to save database load
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // If the user clears EVERYTHING, we want it to reflect quickly
        const delay = newVal === "" ? 200 : 500;

        debounceTimer.current = setTimeout(() => {
            onValueChange(newVal);
            debounceTimer.current = null;
        }, delay);
    };

    const handleDownload = () => {
        if (!localValue.trim()) return;
        const fileName = `syncboard_${code || "board"}`;
        const blob = new Blob([localValue], { type: "text/plain" });
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

    const handleClearAll = () => {
        if (isBoardInteractionDisabled) return;
        handleTextChange("");
        toast.success("Board cleared");
    };

    const handleCloseToast = (event, reason) => {
        if (reason === "clickaway") return;
        setOpenToast(false);
    };

    const highlight = (code) => {
        if (activeLanguage === "plain") return code;
        try {
            return Prism.highlight(
                code,
                Prism.languages[activeLanguage] || Prism.languages.javascript,
                activeLanguage
            );
        } catch (e) {
            return code;
        }
    };

    const syncScroll = (e) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.target.scrollTop;
            preRef.current.scrollLeft = e.target.scrollLeft;
        }
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = e.target.scrollTop;
        }
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
                    py: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.action.hover,
                }}
            >
                <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ alignItems: "center" }}>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            fontSize: { xs: 9, sm: 12 },
                            opacity: 0.8
                        }}
                    >
                        Editor
                    </Typography>

                    <FormControl size="small" variant="standard">
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            sx={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "primary.main",
                                "&:before, &:after": { border: "none !important" }
                            }}
                        >
                            {LANGUAGES.map((lang) => (
                                <MenuItem key={lang.value} value={lang.value} sx={{ fontSize: 13 }}>
                                    {lang.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {language === "auto" && (
                        <Chip
                            icon={<AutoAwesomeIcon style={{ fontSize: 14 }} />}
                            label={activeLanguage.toUpperCase()}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: 10, opacity: 0.8 }}
                        />
                    )}
                </Stack>

                <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} sx={{ alignItems: "center" }}>
                    <Chip
                        avatar={
                            <Tooltip title="Number of words">
                                <Avatar
                                    sx={{
                                        bgcolor: "action.hover",
                                        color: "text.secondary",
                                        fontWeight: 700,
                                        fontSize: 12,
                                        border: (theme) => `1px solid ${theme.palette.divider}`,
                                    }}
                                >
                                    {wordCount}
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

                    {letterCount > 1 && (
                        <Tooltip title="Download text">
                            <IconButton size="small" onClick={handleDownload}>
                                <DownloadIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Clear Board">
                        <IconButton
                            disabled={isBoardInteractionDisabled}
                            size="small"
                            onClick={handleClearAll}
                        >
                            <ClearAllIcon fontSize="small" />
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
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    overflow: "hidden",
                    backgroundColor: theme.palette.mode === "dark"
                        ? "rgba(0,0,0,0.12)"
                        : "rgba(0,0,0,0.02)"
                }}
            >
                <Box
                    ref={lineNumbersRef}
                    sx={{
                        width: 48,
                        px: 1,
                        py: "14px",
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

                <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                    {/* The Background Highlight Layer */}
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        style={{
                            margin: 0,
                            padding: "14px 16px",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            fontFamily: "'Fira Code', monospace",
                            fontSize: 14,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            pointerEvents: "none",
                            boxSizing: "border-box",
                            color: theme.palette.text.primary,
                        }}
                        dangerouslySetInnerHTML={{ __html: highlight(localValue) + "\n" }}
                    />

                    {/* The Real Editable Textarea */}
                    <textarea
                        ref={textInputFieldRef}
                        value={localValue}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onScroll={syncScroll}
                        disabled={isBoardInteractionDisabled}
                        spellCheck="false"
                        style={{
                            display: "block",
                            margin: 0,
                            padding: "14px 16px",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            border: "none",
                            outline: "none",
                            resize: "none",
                            fontFamily: "'Fira Code', monospace",
                            fontSize: 14,
                            lineHeight: 1.6,
                            backgroundColor: "transparent",
                            color: "transparent", // Hide the text, but keep the caret
                            caretColor: theme.palette.text.primary,
                            overflowY: "scroll",
                            overflowX: "hidden",
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(155, 155, 155, 0.5) transparent",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            boxSizing: "border-box",
                            zIndex: 1,
                        }}
                    />
                </Box>
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

export default React.memo(TextEditor);