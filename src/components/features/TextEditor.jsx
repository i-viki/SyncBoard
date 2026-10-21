import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Chip,
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

// Import languages
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
        setLocalValue(value);
    }, [value]);

    const handleTextChange = (newVal) => {
        setLocalValue(newVal);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

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

    const isDark = theme.palette.mode === "dark";

    return (
        <Paper
            elevation={0}
            sx={{
                flex: { xs: "50vh", md: 7 },
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px", // Framer rounded.xl
                overflow: "hidden",
                backgroundColor: isDark ? "#141414" : "#ffffff",
                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                boxShadow: isDark ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
        >
            {/* Topbar */}
            <Box
                sx={{
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                    backgroundColor: isDark ? "#141414" : "#fafafa",
                }}
            >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.8,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: "100px",
                            backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                            border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "11px",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: "#999999",
                            }}
                        >
                            Syntax
                        </Typography>

                        <FormControl size="small" variant="standard">
                            <Select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                disableUnderline
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: isDark ? "#ffffff" : "#090909",
                                    fontFamily: "var(--font-mono)",
                                    "& .MuiSelect-select": {
                                        py: 0.2,
                                        pr: 2,
                                    },
                                    "& svg": {
                                        color: "#999999",
                                    },
                                }}
                            >
                                {LANGUAGES.map((lang) => (
                                    <MenuItem
                                        key={lang.value}
                                        value={lang.value}
                                        sx={{
                                            fontSize: 13,
                                            fontFamily: "var(--font-mono)",
                                        }}
                                    >
                                        {lang.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {language === "auto" && (
                        <Chip
                            icon={<AutoAwesomeIcon sx={{ fontSize: "13px !important", color: "#0099ff !important" }} />}
                            label={activeLanguage.toUpperCase()}
                            size="small"
                            sx={{
                                height: 24,
                                fontSize: 10,
                                fontWeight: 700,
                                fontFamily: "var(--font-mono)",
                                letterSpacing: "0.5px",
                                backgroundColor: isDark ? "rgba(0, 153, 255, 0.1)" : "rgba(0, 153, 255, 0.08)",
                                color: "#0099ff",
                                border: "1px solid rgba(0, 153, 255, 0.25)",
                            }}
                        />
                    )}
                </Stack>

                {/* Counters and Controls */}
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: "100px",
                            backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                            border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                        }}
                    >
                        <Typography sx={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#ffffff", fontWeight: 600 }}>
                            {wordCount} <Box component="span" sx={{ color: "#999999", fontWeight: 400 }}>words</Box>
                        </Typography>
                        <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "#999999" }} />
                        <Typography sx={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#ffffff", fontWeight: 600 }}>
                            {letterCount} <Box component="span" sx={{ color: "#999999", fontWeight: 400 }}>chars</Box>
                        </Typography>
                    </Box>

                    {/* Circular Action Buttons (Framer button-icon-circular) */}
                    <Tooltip title="Select all text">
                        <IconButton
                            size="small"
                            onClick={handleSelectAll}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                color: "#999999",
                                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                                "&:hover": { color: "#ffffff", borderColor: "#3a3a3a", backgroundColor: isDark ? "#222222" : "#f4f4f5" },
                            }}
                        >
                            <SelectAllIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Copy all text">
                        <IconButton
                            size="small"
                            onClick={handleCopyAll}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                color: "#999999",
                                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                                "&:hover": { color: "#ffffff", borderColor: "#3a3a3a", backgroundColor: isDark ? "#222222" : "#f4f4f5" },
                            }}
                        >
                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Paste from clipboard">
                        <IconButton
                            disabled={isBoardInteractionDisabled}
                            size="small"
                            onClick={handlePasteClipboard}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                color: "#999999",
                                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                                "&:hover": { color: "#ffffff", borderColor: "#3a3a3a", backgroundColor: isDark ? "#222222" : "#f4f4f5" },
                            }}
                        >
                            <ContentPasteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    {letterCount > 1 && (
                        <Tooltip title="Download text as file">
                            <IconButton
                                size="small"
                                onClick={handleDownload}
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: "50%",
                                    color: "#999999",
                                    border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                    backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                                    "&:hover": { color: "#ffffff", borderColor: "#3a3a3a", backgroundColor: isDark ? "#222222" : "#f4f4f5" },
                                }}
                            >
                                <DownloadIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title="Clear Board">
                        <IconButton
                            disabled={isBoardInteractionDisabled}
                            size="small"
                            onClick={handleClearAll}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                color: "#999999",
                                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                                "&:hover": { color: "#ff5577", borderColor: "rgba(255, 85, 119, 0.4)", backgroundColor: "rgba(255, 85, 119, 0.08)" },
                            }}
                        >
                            <ClearAllIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={isLocked ? "Unlock board with PIN" : "Lock board with PIN"}>
                        <IconButton
                            size="small"
                            onClick={() => setLockOpen(true)}
                            sx={{
                                width: 34,
                                height: 34,
                                borderRadius: "50%",
                                color: isLocked ? "#ff5577" : "#0099ff",
                                border: `1px solid ${isLocked ? "rgba(255, 85, 119, 0.35)" : "rgba(0, 153, 255, 0.35)"}`,
                                backgroundColor: isLocked ? "rgba(255, 85, 119, 0.1)" : "rgba(0, 153, 255, 0.1)",
                                "&:hover": {
                                    backgroundColor: isLocked ? "rgba(255, 85, 119, 0.2)" : "rgba(0, 153, 255, 0.2)",
                                },
                            }}
                        >
                            {isLocked ? <LockIcon sx={{ fontSize: 16 }} /> : <LockOpenIcon sx={{ fontSize: 16 }} />}
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
                    backgroundColor: isDark ? "#090909" : "#fbfbfb", // Pure dark canvas ground
                }}
            >
                {/* Gutter with line numbers */}
                <Box
                    ref={lineNumbersRef}
                    sx={{
                        width: 50,
                        px: 1,
                        py: "16px",
                        textAlign: "right",
                        borderRight: `1px solid ${isDark ? "#1a1a1a" : "#e4e4e7"}`,
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        lineHeight: 1.6,
                        backgroundColor: isDark ? "#0f0f0f" : "#f4f4f5",
                        color: isDark ? "#444444" : "#a1a1aa",
                        overflow: "hidden",
                        userSelect: "none",
                    }}
                >
                    {Array.from({ length: lineCount }, (_, i) => (
                        <div key={i}>{i + 1}</div>
                    ))}
                </Box>

                <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
                    {/* Syntax Highlight Layer */}
                    <pre
                        ref={preRef}
                        aria-hidden="true"
                        style={{
                            margin: 0,
                            padding: "16px 18px",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            overflow: "hidden",
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            pointerEvents: "none",
                            boxSizing: "border-box",
                            color: isDark ? "#ffffff" : "#090909",
                        }}
                        dangerouslySetInnerHTML={{ __html: highlight(localValue) + "\n" }}
                    />

                    {/* Textarea Input Layer */}
                    <textarea
                        ref={textInputFieldRef}
                        value={localValue}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onScroll={syncScroll}
                        disabled={isBoardInteractionDisabled}
                        placeholder={isBoardInteractionDisabled ? "Board is locked with PIN" : "Start typing, paste text, or drag snippets here..."}
                        spellCheck="false"
                        style={{
                            display: "block",
                            margin: 0,
                            padding: "16px 18px",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            border: "none",
                            outline: "none",
                            resize: "none",
                            fontFamily: "var(--font-mono)",
                            fontSize: 14,
                            lineHeight: 1.6,
                            backgroundColor: "transparent",
                            color: "transparent",
                            caretColor: "#0099ff", // Framer accent blue caret
                            overflowY: "scroll",
                            overflowX: "hidden",
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgba(100, 100, 100, 0.4) transparent",
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
                <Alert
                    onClose={handleCloseToast}
                    severity="success"
                    sx={{
                        width: "100%",
                        backgroundColor: "#141414",
                        color: "#ffffff",
                        border: "1px solid #262626",
                        borderRadius: "100px",
                    }}
                >
                    Text content downloaded successfully!
                </Alert>
            </Snackbar>
        </Paper>
    );
}

export default React.memo(TextEditor);