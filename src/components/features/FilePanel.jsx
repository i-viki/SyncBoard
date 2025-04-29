import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    Chip,
    IconButton,
} from "@mui/material";
import { TailSpin } from "react-loader-spinner";
import {
    FileUp,
    FileText,
    FileImage,
    FileVideo,
    FileAudio,
    File,
    Trash2,
    Download,
} from "lucide-react";

const getFileIcon = (fileType) => {
    if (!fileType) return File;
    if (fileType.startsWith("image/")) return FileImage;
    if (fileType.startsWith("video/")) return FileVideo;
    if (fileType.startsWith("audio/")) return FileAudio;
    if (fileType.startsWith("text/") || fileType.includes("pdf") || fileType.includes("document"))
        return FileText;
    return File;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageFile = (file) => {
    if (file.isImage) return true;
    if (file.fileType && file.fileType.startsWith("image/")) return true;
    const ext = file.name?.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(ext);
};

function FileItem({ file, theme, loader, handleDownloadFile, handleDeleteFile, isBoardInteractionDisabled }) {
    const isImage = isImageFile(file);
    const FileIcon = getFileIcon(file.type || file.fileType);

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.action.hover,
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1.5,
                transition: "0.2s",
                "&:hover": {
                    borderColor: theme.palette.primary.main,
                }
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                }}
            >
                {isImage && file.src ? (
                    <img
                        src={file.src}
                        alt={file.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <FileIcon size={24} color={theme.palette.primary.main} />
                )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 600 }}
                >
                    {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatFileSize(file.bytes)}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
                <IconButton
                    size="small"
                    onClick={() => handleDownloadFile(file.src, file.name)}
                    sx={{ color: "primary.main" }}
                >
                    <Download size={18} />
                </IconButton>
                <IconButton
                    size="small"
                    color="error"
                    disabled={isBoardInteractionDisabled}
                    onClick={() => handleDeleteFile(file.src)}
                >
                    <Trash2 size={18} />
                </IconButton>
            </Stack>
        </Box>
    );
}

function FilePanel({
    theme,
    files,
    loader,
    uploadBtnRef,
    fileContainerRef,
    fileHandler,
    handleDownloadFile,
    handleDeleteFile,
    isBoardInteractionDisabled,
}) {
    return (
        <Paper
            elevation={3}
            sx={{
                flex: { xs: "50vh", md: 3 },
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                p: 2,
                backgroundColor: theme.palette.background.paper,
                overflow: "hidden"
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                    Board Files
                </Typography>
                <Chip
                    label={`${files.length}/5`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: 11 }}
                />
            </Box>

            {/* Drop Zone */}
            <Box
                ref={fileContainerRef}
                onClick={() => !isBoardInteractionDisabled && uploadBtnRef.current.click()}
                sx={{
                    border: "2px dashed",
                    borderColor: theme.palette.divider,
                    borderRadius: 2,
                    p: 2,
                    textAlign: "center",
                    cursor: isBoardInteractionDisabled ? "default" : "pointer",
                    backgroundColor: theme.palette.action.hover,
                    transition: "0.2s",
                    opacity: isBoardInteractionDisabled ? 0.6 : 1,
                    "&:hover": {
                        borderColor: isBoardInteractionDisabled ? theme.palette.divider : theme.palette.primary.main,
                        backgroundColor: isBoardInteractionDisabled ? theme.palette.action.hover : "rgba(0,0,0,0.02)",
                    },
                    mb: 3
                }}
            >
                <input
                    type="file"
                    hidden
                    ref={uploadBtnRef}
                    onChange={(e) => fileHandler(e.target.files[0])}
                    disabled={isBoardInteractionDisabled}
                />

                {loader ? (
                    <Box sx={{ py: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <TailSpin height="30" width="30" color={theme.palette.primary.main} />
                        <Typography variant="caption">Uploading...</Typography>
                    </Box>
                ) : (
                    <>
                        <FileUp size={24} style={{ opacity: 0.6, marginBottom: 4 }} />
                        <Typography variant="caption" display="block">
                            Drop files here or click to upload
                        </Typography>
                    </>
                )}
            </Box>

            {/* File List */}
            <Box sx={{ flex: 1, overflowY: "auto", pr: 0.5 }}>
                {files.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center", opacity: 0.4 }}>
                        <Typography variant="body2">No files shared yet</Typography>
                    </Box>
                ) : (
                    files.map((file, index) => (
                        <FileItem
                            key={index}
                            file={file}
                            theme={theme}
                            handleDownloadFile={handleDownloadFile}
                            handleDeleteFile={handleDeleteFile}
                            isBoardInteractionDisabled={isBoardInteractionDisabled}
                        />
                    ))
                )}
            </Box>

            <Typography variant="caption" sx={{ mt: 2, opacity: 0.5, fontSize: 10 }}>
                Files up to 10MB are instantly synced with all active board members.
            </Typography>
        </Paper>
    );
}

export default React.memo(FilePanel);
