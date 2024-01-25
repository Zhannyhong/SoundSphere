import { useCreateCommentMutation } from "../../redux/apis/commentApi";
import { Button, TextField, Box } from "@mui/material";
import React, { useEffect } from "react";
import { object, string, TypeOf } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const commentSchema = object({
    body: string().min(1, "Comment is required").max(1000, "Comment cannot exceed 1000 characters"),
});

export type CommentInput = TypeOf<typeof commentSchema>;

const NewComment: React.FC = () => {
    const { threadID } = useParams<{ threadID: string }>();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });
    const [createComment, { isLoading, isError, error, isSuccess }] = useCreateCommentMutation();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully posted comment");
            navigate(`/thread/${threadID}`);
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    useEffect(() => {
        if (isSubmitting) {
            reset();
        }
    }, [isSubmitting]);

    const navigate = useNavigate();
    const submitForm: SubmitHandler<CommentInput> = (data) => {
        createComment({ id: threadID as string, post: data });
    };

    return (
        <Box sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitForm)}>
                <TextField
                    multiline
                    rows={4}
                    id="body"
                    label="New Comment"
                    type="text"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    {...register("body")}
                    error={!!errors.body}
                    helperText={errors.body?.message}
                    InputProps={{
                        endAdornment: (
                            <Button variant="contained" type="submit">
                                Post Comment
                            </Button>
                        ),
                    }}
                />
            </form>
        </Box>
    );
};

export default NewComment;
