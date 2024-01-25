import { useAppSelector } from "../redux/store";
import { useCreateThreadMutation } from "../redux/apis/threadApi";
import { Container, Button, Paper, TextField, Autocomplete, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect } from "react";
import { object, string, TypeOf } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export const threadSchema = object({
    tags: string().array().nonempty("Tags are required"),
    title: string().min(1, "Title is required").max(300, "Title cannot exceed 300 characters"),
    body: string().max(5000, "Body cannot exceed 5000 characters"),
});

export type ThreadInput = TypeOf<typeof threadSchema>;

const CreateThread: React.FC = () => {
    const username = useAppSelector((state) => state.authState.username);
    const tagOptions = useAppSelector((state) => state.threadState.tagOptions);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ThreadInput>({ resolver: zodResolver(threadSchema) });
    const [createThread, { isLoading, isError, error, isSuccess }] = useCreateThreadMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully created thread");
            navigate("/");
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    const navigate = useNavigate();
    const submitForm: SubmitHandler<ThreadInput> = (data) => {
        createThread(data);
    };

    return (
        <Container sx={{ py: 8 }}>
            <Paper sx={{ bgcolor: "white", px: 8, py: 5 }}>
                <Button
                    component={Link}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    color="inherit"
                    variant="text"
                    sx={{ textTransform: "none", p: 0, mb: 4 }}
                >
                    Back to all threads
                </Button>
                <form onSubmit={handleSubmit(submitForm)}>
                    <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                            <Autocomplete
                                multiple
                                id="Thread tags"
                                options={tagOptions}
                                {...field}
                                disableCloseOnSelect
                                onChange={(_, data) => field.onChange(data)}
                                renderInput={(params) => (
                                    <TextField
                                        autoFocus
                                        {...params}
                                        variant="outlined"
                                        placeholder="Add tags"
                                        label="Tags"
                                        error={!!errors.tags}
                                        helperText={errors.tags?.message}
                                    />
                                )}
                            />
                        )}
                    />
                    <TextField
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        {...register("title")}
                        error={!!errors.title}
                        helperText={errors.title?.message}
                    />
                    <TextField
                        multiline
                        rows={10}
                        id="body"
                        label="Body"
                        type="text"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        {...register("body")}
                        error={!!errors.body}
                        helperText={errors.body?.message}
                    />
                    {username ? (
                        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                            Create Thread
                        </Button>
                    ) : (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            Please authenticate to create a thread
                        </Alert>
                    )}
                </form>
            </Paper>
        </Container>
    );
};

export default CreateThread;
