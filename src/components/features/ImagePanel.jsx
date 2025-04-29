import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import { TailSpin } from "react-loader-spinner";

function ImagePanel({
    theme,
    images,
    loader,
    uploadBtnRef,
    fileContainerRef,
    fileHandler,
    handleDownloadImage,
    handleDeleteImage,
    isLockDisabled,
    isBoardInteractionDisabled,
}) {
    console.log("lock status in image panel:", isBoardInteractionDisabled);


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
                Image Upload
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

                {images.length === 0 && (
                    <>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            Select, paste or drop image here.
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, opacity: 0.5 }}>
                            Max 5MB • One file only
                        </Typography>
                    </>
                )}

                {images.length === 1 && (
                    <Stack spacing={2} alignItems="center" sx={{ width: "50%" }}>
                        <Box sx={{ position: "relative", width: "100%" }}>
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

            <Typography variant="caption" sx={{ mt: 2, opacity: 0.6 }}>
                Note: Only one image can be shared at a time.
                Delete the current image before uploading a new one.
            </Typography>
        </Paper>
    );
}

export default ImagePanel;
