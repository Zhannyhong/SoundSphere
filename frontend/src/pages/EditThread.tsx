import { ThreadInput, threadSchema } from "./CreateThread";
import { useAppSelector } from "../redux/store";
import { useEditThreadMutation, useGetThreadQuery } from "../redux/apis/threadApi";
import { Container, Button, Paper, TextField, Autocomplete } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditThread: React.FC = () => {
    const { threadID } = useParams<{ threadID: string }>();
    const thread = useGetThreadQuery(threadID as string).data;
    const tagOptions = useAppSelector((state) => state.threadState.tagOptions);
    const username = useAppSelector((state) => state.authState.username);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ThreadInput>({
        resolver: zodResolver(threadSchema),
        defaultValues: { tags: [], title: "", body: "" },
    });
    const [editThread, { isLoading, isError, error, isSuccess }] = useEditThreadMutation();

    useEffect(() => {
        if (thread) {
            reset({ tags: thread.tags.map((tag) => tag.name), title: thread.title, body: thread.body });
        }
    }, [thread]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully edited thread");
            navigate(`/thread/${threadID}`);
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.message);
        }
    }, [isLoading]);

    const navigate = useNavigate();
    const submitForm: SubmitHandler<ThreadInput> = (data) => {
        editThread({ id: threadID as string, post: data });
    };

    if (username !== thread?.user.username) {
        navigate(`/thread/${threadID}`);
    }

    return (
        <Container sx={{ py: { xs: 3, sm: 8 } }}>
            <Paper sx={{ bgcolor: "white", p: { xs: 4, sm: 7 } }}>
                <Button
                    component={Link}
                    to={`/thread/${threadID}`}
                    startIcon={<ArrowBackIcon />}
                    color="inherit"
                    variant="text"
                    sx={{ textTransform: "none", p: 0, mb: 4 }}
                >
                    Back to thread
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
                        InputLabelProps={{ shrink: true }}
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
                        InputLabelProps={{ shrink: true }}
                        {...register("body")}
                        error={!!errors.body}
                        helperText={errors.body?.message}
                    />
                    <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                        Edit Thread
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditThread;
