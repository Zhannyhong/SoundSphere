import { CommentInput, commentSchema } from "./NewComment";
import { useEditCommentMutation, useGetCommentQuery } from "../../redux/apis/commentApi";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

type Props = {
    commentID: number;
    openEditCommentModal: boolean;
    setOpenEditCommentModal: (openEditCommentModal: boolean) => void;
};

const EditComment: React.FC<Props> = ({ commentID, openEditCommentModal, setOpenEditCommentModal }) => {
    const comment = useGetCommentQuery(commentID.toString()).data;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CommentInput>({
        resolver: zodResolver(commentSchema),
        defaultValues: { body: comment?.body },
    });
    const [editComment, { isLoading, isError, error, isSuccess }] = useEditCommentMutation();

    useEffect(() => {
        reset({ body: comment?.body });
    }, [comment]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully edited comment");
            setOpenEditCommentModal(false);
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    const submitForm: SubmitHandler<CommentInput> = (data) => {
        editComment({ id: commentID.toString(), post: data });
    };

    return (
        <Dialog open={openEditCommentModal} onClose={() => setOpenEditCommentModal(false)} fullWidth>
            <form onSubmit={handleSubmit(submitForm)}>
                <DialogTitle>Edit Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        multiline
                        rows={5}
                        id="body"
                        label="Comment"
                        type="text"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        {...register("body")}
                        error={!!errors.body}
                        helperText={errors.body?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => setOpenEditCommentModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" type="submit">
                        Save changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditComment;
