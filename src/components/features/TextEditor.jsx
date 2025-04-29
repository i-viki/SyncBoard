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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DownloadIcon from "@mui/icons-material/Download";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useParams } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { toast } from "sonner";

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

const LANGUAGES = [
    { label: "Auto-Detect", value: "auto" },
    { label: "Plain Text", value: "plain" },
    { label: "JavaScript", value: "javascript" },
    { label: "JSON", value: "json" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
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
    const [detectedLanguage, setDetectedLanguage] = useState("plain");
    const { code } = useParams();
    const preRef = useRef(null);

    // Internal state for immediate UI feedback (Debounced Firebase sync)
    const [localValue, setLocalValue] = useState(value);
    const debounceTimer = useRef(null);

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

    // Precise Auto-detection logic using a scoring system
    useEffect(() => {
        if (language !== "auto") return;

        const detect = (text) => {
            if (!text.trim()) return "plain";
            
            const scores = {
                javascript: 0,
                python: 0,
                java: 0,
                html: 0,
                css: 0,
                json: 0,
                markdown: 0
            };

            // JavaScript patterns
            if (/\b(const|let|var|function|export|import|return|await|async)\b/.test(text)) scores.javascript += 2;
            if (/\b(console\.log|window|document|React|useEffect|useState)\b/.test(text)) scores.javascript += 3;
            if (/\s=>\s/.test(text)) scores.javascript += 2;
            if (/[;{}]/.test(text)) scores.javascript += 1;

            // Python patterns
            if (/\b(def|elif|from|import|print|while|if __name__)\b/.test(text)) scores.python += 2;
            if (/:$/m.test(text)) scores.python += 2;
            if (/\b(pip install|f"|f')/.test(text)) scores.python += 3;
            // Java patterns
            if (/\b(public|private|protected|static|void|class|interface|extends|implements|throws|new)\b/.test(text)) scores.java += 1;
            if (/\b(System\.out\.print|String\[\] args|@Override|@Nullable|@NonNull)\b/.test(text)) scores.java += 5;
            if (/\b(public class|public static void main)\b/.test(text)) scores.java += 10;
            if (/[;{}]/.test(text)) scores.java += 1;            
            
            // Python patterns
            if (/\b(def|elif|from|import|print|while|if __name__|yield|lambda|pass|with)\b/.test(text)) scores.python += 3;
            if (/:$/m.test(text)) scores.python += 2;
            if (/\b(pip install|f"|f')/.test(text)) scores.python += 4;
            
            // Only give "no-braces" points if there's already some Python evidence
            if (!/[;{}]/.test(text) && scores.python > 0) scores.python += 1; 

            // HTML patterns
            if (/<(!DOCTYPE|html|head|body|div|span|p|a|script|link|style)\b/i.test(text)) scores.html += 6;
            if (/<\/?[a-z][^>]*>/i.test(text)) scores.html += 3;
            if (/&[a-z]+;/i.test(text)) scores.html += 1;

            // CSS patterns
            if (/\b(margin|padding|color|background|display|flex|position|border|font-family)\b\s*:/.test(text)) scores.css += 5;
            if (/@(media|keyframes|import|font-face)\b/.test(text)) scores.css += 5;
            if (/[{}]/.test(text) && !scores.javascript && !scores.java && !scores.html) scores.css += 2;

            // JSON patterns
            if (/^\s*[\{\[]/.test(text) && /[\}\]]\s*$/.test(text)) scores.json += 6;
            if (/"[a-zA-Z0-9_]+"\s*:\s*/.test(text)) scores.json += 5;

            // Markdown patterns
            if (/^(#|##|###|####|#####|######)\s/.test(text)) scores.markdown += 5;
            if (/\[.*\]\(.*\)/.test(text)) scores.markdown += 5;
            if (/^(\*|-|\d\.)\s/.test(text)) scores.markdown += 2;

            // Find max score
            let maxScore = 0;
            let bestLang = "plain";

            for (const [lang, score] of Object.entries(scores)) {
                if (score > maxScore) {
                    maxScore = score;
                    bestLang = lang;
                }
            }

            // Confidence threshold: If no language got a decent score, it's plain text
            if (maxScore < 3) return "plain";

            return bestLang;
        };

        setDetectedLanguage(detect(localValue));
    }, [localValue, language]);

    const activeLanguage = language === "auto" ? detectedLanguage : language;

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
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.action.hover,
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2" fontWeight={600}>
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
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
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
                            overflow: "auto",
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