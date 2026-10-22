import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    IconButton,
    CircularProgress,
} from "@mui/material";
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

const getThumbnailSrc = (src) => {
    if (!src || !src.includes("cloudinary.com")) return src;
    return src.replace("/upload/", "/upload/c_thumb,w_96,h_96,q_auto,f_auto/");
};

function FileItem({ file, theme, handleDownloadFile, handleDeleteFile, isBoardInteractionDisabled }) {
    const isImage = isImageFile(file);
    const FileIcon = getFileIcon(file.type || file.fileType);
    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: "14px",
                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                backgroundColor: isDark ? "#1c1c1c" : "#ffffff",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 1.25,
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                    borderColor: isDark ? "#383838" : "#d4d4d8",
                    transform: "translateY(-1px)",
                },
            }}
        >
            <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: isDark ? "#141414" : "#f4f4f5",
                    border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                }}
            >
                {isImage && file.src ? (
                    <img
                        src={getThumbnailSrc(file.src)}
                        alt={file.name}
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <FileIcon size={20} color={isDark ? "#ffffff" : "#090909"} />
                )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    noWrap
                    sx={{
                        fontWeight: 600,
                        fontSize: "13px",
                        letterSpacing: "-0.13px",
                        color: isDark ? "#ffffff" : "#090909",
                    }}
                >
                    {file.name}
                </Typography>
                <Typography
                    variant="caption"
                    sx={{
                        color: "#999999",
                        fontSize: "11px",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {formatFileSize(file.bytes)}
                </Typography>
            </Box>

            <Stack direction="row" spacing={0.5}>
                <IconButton
                    size="small"
                    onClick={() => handleDownloadFile(file.src, file.name)}
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        color: "#999999",
                        "&:hover": { color: "#ffffff", backgroundColor: isDark ? "#262626" : "#f4f4f5" },
                    }}
                >
                    <Download size={16} />
                </IconButton>
                <IconButton
                    size="small"
                    disabled={isBoardInteractionDisabled}
                    onClick={() => handleDeleteFile(file.src)}
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        color: "#999999",
                        "&:hover": { color: "#ff5577", backgroundColor: "rgba(255, 85, 119, 0.1)" },
                    }}
                >
                    <Trash2 size={16} />
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
    const isDark = theme.palette.mode === "dark";

    return (
        <Paper
            elevation={0}
            sx={{
                flex: { xs: "50vh", md: 3 },
                width: { xs: "100%", md: "auto" },
                display: "flex",
                flexDirection: "column",
                borderRadius: "20px", // Framer rounded.xl
                p: 2.5,
                backgroundColor: isDark ? "#141414" : "#ffffff",
                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                boxShadow: isDark ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.05)",
                overflow: "hidden",
            }}
        >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography
                    sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        letterSpacing: "-0.14px",
                        color: isDark ? "#ffffff" : "#090909",
                    }}
                >
                    Shared Assets
                </Typography>
                <Box
                    sx={{
                        px: 1.25,
                        py: 0.25,
                        borderRadius: "100px",
                        backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                        border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#999999",
                    }}
                >
                    {files.length}/5
                </Box>
            </Box>

            {/* Drop Zone */}
            <Box
                ref={fileContainerRef}
                onClick={() => !isBoardInteractionDisabled && uploadBtnRef.current.click()}
                sx={{
                    border: `1.5px dashed ${isDark ? "#262626" : "#d4d4d8"}`,
                    borderRadius: "14px",
                    p: 2.5,
                    textAlign: "center",
                    cursor: isBoardInteractionDisabled ? "default" : "pointer",
                    backgroundColor: isDark ? "#090909" : "#fafafa",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: isBoardInteractionDisabled ? 0.6 : 1,
                    mb: 2.5,
                    "&:hover": {
                        borderColor: isBoardInteractionDisabled ? (isDark ? "#262626" : "#d4d4d8") : "#0099ff",
                        boxShadow: isBoardInteractionDisabled ? "none" : "0 0 16px rgba(0, 153, 255, 0.15)",
                    },
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
                    <Box sx={{ py: 1.5, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={28} sx={{ color: "#0099ff" }} />
                        <Typography variant="caption" sx={{ color: "#999999", fontWeight: 500 }}>
                            Syncing asset...
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <Box
                            sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                backgroundColor: isDark ? "#141414" : "#f4f4f5",
                                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1.25,
                            }}
                        >
                            <FileUp size={18} color="#0099ff" />
                        </Box>
                        <Typography
                            sx={{
                                fontSize: "12px",
                                fontWeight: 500,
                                color: isDark ? "#ffffff" : "#090909",
                                letterSpacing: "-0.12px",
                            }}
                        >
                            Drop file or browse
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: "#999999",
                                mt: 0.25,
                            }}
                        >
                            Up to 10MB per asset
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* File List / Empty State */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    pr: 0.5,
                }}
            >
                {files.length === 0 ? (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 3,
                            borderRadius: "14px",
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                            border: `1px dashed ${isDark ? "#1c1c1c" : "#e4e4e7"}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: "13px",
                                color: "#999999",
                                fontWeight: 500,
                                letterSpacing: "-0.13px",
                            }}
                        >
                            No assets uploaded yet
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: "#666666",
                                mt: 0.5,
                            }}
                        >
                            Images and documents sync instantly
                        </Typography>
                    </Box>
                ) : (
                    files.map((file, index) => (
                        <FileItem
                            key={file.src || file.name || index}
                            file={file}
                            theme={theme}
                            handleDownloadFile={handleDownloadFile}
                            handleDeleteFile={handleDeleteFile}
                            isBoardInteractionDisabled={isBoardInteractionDisabled}
                        />
                    ))
                )}
            </Box>

            <Typography
                sx={{
                    mt: 2,
                    fontSize: "11px",
                    color: "#666666",
                    textAlign: "center",
                    letterSpacing: "-0.11px",
                }}
            >
                End-to-end synchronized across devices
            </Typography>
        </Paper>
    );
}

export default React.memo(FilePanel);
