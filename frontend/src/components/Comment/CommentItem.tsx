import EditComment from "./EditComment";
import { CommentType } from "../../types/types";
import { useDeleteCommentMutation } from "../../redux/apis/commentApi";
import { useAppSelector } from "../../redux/store";
import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

type Props = {
    comment: CommentType;
    commentID: number;
};

const CommentItem: React.FC<Props> = ({ comment, commentID }) => {
    const userID = useAppSelector((state) => state.authState.userID);
    const [openEditCommentModal, setOpenEditCommentModal] = useState<boolean>(false);

    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState<boolean>(false);
    const [deleteComment, { isLoading, isError, error, isSuccess }] = useDeleteCommentMutation();
    const onDeleteThreadHandler = () => {
        deleteComment(commentID.toString());
        setOpenDeleteConfirmationModal(false);
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully deleted comment");
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    return (
        <Box>
            <Stack direction="row" alignItems="center" mb={2}>
                <Stack>
                    <Typography variant="body1" fontWeight="bold">
                        {comment.user.username}
                    </Typography>
                    <Typography variant="caption">{moment(comment.CreatedAt).fromNow()}</Typography>
                </Stack>
                {userID === comment.user.ID && (
                    <Stack direction="row" sx={{ ml: "auto" }}>
                        <Tooltip title="Edit comment">
                            <IconButton
                                onClick={() => setOpenEditCommentModal(true)}
                                sx={{ "& :hover": { color: "blue" } }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <EditComment
                            commentID={commentID}
                            openEditCommentModal={openEditCommentModal}
                            setOpenEditCommentModal={setOpenEditCommentModal}
                        />
                        <Tooltip title="Delete comment">
                            <IconButton
                                onClick={() => setOpenDeleteConfirmationModal(true)}
                                sx={{ "& :hover": { color: "red" } }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Dialog open={openDeleteConfirmationModal}>
                            <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
                            <DialogActions>
                                <Button variant="text" onClick={() => setOpenDeleteConfirmationModal(false)}>
                                    Cancel
                                </Button>
                                <Button color="error" variant="contained" onClick={() => onDeleteThreadHandler()}>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                )}
            </Stack>
            <Typography variant="body2" mt={2} sx={{ whiteSpace: "pre-line" }}>
                {comment.body}
            </Typography>
        </Box>
    );
};

export default CommentItem;
