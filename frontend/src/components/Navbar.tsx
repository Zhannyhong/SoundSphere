import Login from "./Login";
import Signup from "./Signup";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { logout } from "../redux/features/authSlice";
import React, { useState } from "react";
import { AppBar, Button, Container, IconButton, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    const username = useAppSelector((state) => state.authState.username);
    const dispatch = useAppDispatch();

    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Successfully logged out");
    };

    return (
        <AppBar elevation={0} position="sticky" color="inherit">
            <Container>
                <Toolbar disableGutters>
                    <Typography
                        component={Link}
                        to="/"
                        variant="h6"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        SoundSphere
                    </Typography>
                    {username ? (
                        <Stack direction="row" spacing={0}>
                            <Button variant="text" sx={{ textTransform: "none", fontSize: 18 }}>
                                {username}
                            </Button>
                            <Tooltip title="Logout">
                                <IconButton aria-label="logout" onClick={() => handleLogout()}>
                                    <LogoutIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={2}>
                            <Button variant="text" onClick={() => setOpenLoginModal(true)}>
                                Log in
                            </Button>
                            <Login openLoginModal={openLoginModal} setOpenLoginModal={setOpenLoginModal} />
                            <Button variant="contained" onClick={() => setOpenSignupModal(true)}>
                                Sign up
                            </Button>
                            <Signup openSignupModal={openSignupModal} setOpenSignupModal={setOpenSignupModal} />
                        </Stack>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
