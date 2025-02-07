import React, { useRef } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Box,
    Button
} from "@mui/material";

const LoginDialog = ({ open, handleClose }) => {
    // Refs for email and password inputs
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleAdminLogin = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        if (email === "thepack@gmail.com" && password === "packk") {
            document.cookie = `logedIn=true; path=/; max-age=${60 * 60 * 24 * 365 * 10}; Secure; SameSite=None`;
            document.cookie = `adminLogin=true; path=/; max-age=${60 * 60 * 24 * 365 * 10}; Secure; SameSite=None`;
            document.cookie = `queueCount=0;path=/;max-age=${60 * 60 * 24 * 365 * 10}; secure; SameSite=None`;
            handleClose();
        } else {
            alert("Invalid email or password");
        }
    };

    const memberLogin = () => {
        document.cookie = `logedIn=true; path=/; max-age=${60 * 60 * 24 * 365 * 10}; Secure; SameSite=None`;
        document.cookie = `adminLogin=false; path=/; max-age=${60 * 60 * 24 * 365 * 10}; Secure; SameSite=None`;
        handleClose();
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Email"
                    type="email"
                    fullWidth
                    id="email"
                    inputRef={emailRef} // Use ref for email
                />
                <TextField
                    margin="dense"
                    label="Password"
                    type="password"
                    fullWidth
                    id="password"
                    inputRef={passwordRef} // Use ref for password
                />

                <Button onClick={handleAdminLogin} color="primary">
                    Login
                </Button>
            </DialogContent>
            <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
                <Button variant="contained" color="success" onClick={memberLogin}>
                    Sign in as Member
                </Button>
            </Box>
        </Dialog>
    );
};

export default LoginDialog;
