import { SignupInput } from "./Signup";
import { useLoginUserMutation } from "../redux/apis/authApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

type Props = {
    openLoginModal: boolean;
    setOpenLoginModal: (openLoginModal: boolean) => void;
};

const loginSchema = object({
    username: string().min(1, "Username is required").max(20, "Username must be less than 20 characters"),
    password: string().min(1, "Password is required").max(50, "Password must be less than 50 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const Login: React.FC<Props> = ({ openLoginModal, setOpenLoginModal }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupInput>({ resolver: zodResolver(loginSchema) });
    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully logged in");
            setOpenLoginModal(false);
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    const submitForm: SubmitHandler<LoginInput> = (data) => {
        loginUser(data);
    };

    return (
        <Dialog open={openLoginModal} onClose={() => setOpenLoginModal(false)} fullWidth>
            <form onSubmit={handleSubmit(submitForm)}>
                <DialogTitle>Welcome Back!</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="filled"
                        margin="normal"
                        {...register("username")}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />
                    <TextField
                        autoFocus
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="filled"
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenLoginModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Log In
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default Login;
