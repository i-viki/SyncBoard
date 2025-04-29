import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    Chip,
} from "@mui/material";
import { TailSpin } from "react-loader-spinner";
import { FileUp, FileText, FileImage, FileVideo, FileAudio, File } from "lucide-react";

/**
 * Returns an appropriate icon component based on file MIME type
 */
const getFileIcon = (fileType) => {
    if (!fileType) return File;
    if (fileType.startsWith("image/")) return FileImage;
    if (fileType.startsWith("video/")) return FileVideo;
    if (fileType.startsWith("audio/")) return FileAudio;
    if (fileType.startsWith("text/") || fileType.includes("pdf") || fileType.includes("document"))
        return FileText;
    return File;
};

/**
 * Formats byte size into a human-readable string
 */
const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Checks whether a file is an image based on its type or name
 */
const isImageFile = (file) => {
    if (file.isImage) return true;
    if (file.fileType && file.fileType.startsWith("image/")) return true;
    const ext = file.name?.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext);
};

function FilePanel({
    theme,
    files,
    loader,
    uploadBtnRef,
    fileContainerRef,
    fileHandler,
    handleDownloadFile,
    handleDeleteFile,
    isLockDisabled,
    isBoardInteractionDisabled,
}) {
    const currentFile = files.length === 1 ? files[0] : null;
    const isImage = currentFile ? isImageFile(currentFile) : false;
    const FileIcon = currentFile ? getFileIcon(currentFile.type || currentFile.fileType) : FileUp;

    return (
        <Paper
            elevation={0}
            sx={{
                flex: { xs: "40vh", md: 3 },
                width: { xs: "100%", md: "auto" },
                mt: { xs: 2, md: 0 },
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
                File Upload
            </Typography>

            <Box
                ref={fileContainerRef}
                onClick={() => {
                    if (!isBoardInteractionDisabled) {
                        uploadBtnRef.current.click();
                    }
                }}
                sx={{

                    pointerEvents: isBoardInteractionDisabled ? "none" : "auto",
                    opacity: isBoardInteractionDisabled ? 0.6 : 1,



                    flex: 1,
                    border: "2px dashed",
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "0.25s",
                    overflow: "hidden",
                    "&:hover": {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                    },
                }}
            >
                <input
                    disabled={isBoardInteractionDisabled}
                    type="file"
                    hidden
                    ref={uploadBtnRef}
                    accept="*/*"
                    onChange={(e) => fileHandler(e.target.files[0])}
                />

                {files.length === 0 && (
                    <>
                        <FileUp
                            size={40}
                            strokeWidth={1.5}
                            style={{ opacity: 0.5, marginBottom: 8 }}
                        />
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Select, paste or drop any file here
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, opacity: 0.5 }}>
                            Max 10MB • One file at a time
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.4 }}>
                            Images, PDFs, documents, videos, and more
                        </Typography>
                    </>
                )}

                {currentFile && (
                    <Stack spacing={2} alignItems="center" sx={{ width: "100%", maxWidth: "280px" }}>
                        <Box sx={{ position: "relative", width: "100%" }}>
                            {isImage ? (
                                /* Image preview */
                                <img
                                    src={currentFile.src}
                                    alt={currentFile.name}
                                    style={{
                                        width: "100%",
                                        maxHeight: "220px",
                                        objectFit: "contain",
                                        borderRadius: 8,
                                        transition: "0.3s ease",
                                        filter: loader ? "blur(6px)" : "none",
                                        opacity: loader ? 0.7 : 1,
                                    }}
                                />
                            ) : (
                                /* Non-image file card */
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        p: 3,
                                        borderRadius: 2,
                                        backgroundColor: theme.palette.action.hover,
                                        transition: "0.3s ease",
                                        filter: loader ? "blur(6px)" : "none",
                                        opacity: loader ? 0.7 : 1,
                                    }}
                                >
                                    <FileIcon
                                        size={48}
                                        strokeWidth={1.5}
                                        color={theme.palette.primary.main}
                                    />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 1.5,
                                            fontWeight: 500,
                                            wordBreak: "break-word",
                                            textAlign: "center",
                                            maxWidth: "100%",
                                        }}
                                    >
                                        {currentFile.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        {currentFile.type && (
                                            <Chip
                                                label={currentFile.name?.split(".").pop()?.toUpperCase() || "FILE"}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: "0.7rem" }}
                                            />
                                        )}
                                        {currentFile.bytes && (
                                            <Chip
                                                label={formatFileSize(currentFile.bytes)}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: "0.7rem" }}
                                            />
                                        )}
                                    </Stack>
                                </Box>
                            )}

                            {loader && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        backdropFilter: "brightness(0.8)",
                                        borderRadius: 2,
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

                        {!loader && (
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadFile(currentFile.src, currentFile.name);
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
                                        handleDeleteFile(currentFile.src);
                                    }}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                )}
            </Box>

            <Typography variant="caption" sx={{ mt: 2, opacity: 0.6 }}>
                Note: Only one file can be shared at a time.
                Delete the current file before uploading a new one.
            </Typography>
        </Paper>
    );
}

export default FilePanel;
