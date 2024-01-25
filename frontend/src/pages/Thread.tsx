import CommentList from "../components/Comment/CommentList";
import TagList from "../components/TagList";
import { ThreadType } from "../types/types";
import { useAppSelector } from "../redux/store";
import { useDeleteThreadMutation, useGetThreadQuery } from "../redux/apis/threadApi";
import NewComment from "../components/Comment/NewComment";
import Vote from "../components/Vote";
import {
    Container,
    Button,
    Typography,
    Divider,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import React, { useEffect, useState } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import moment from "moment/moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Thread: React.FC = () => {
    const username = useAppSelector((state) => state.authState.username);

    const { threadID } = useParams<{ threadID: string }>();
    const thread = useGetThreadQuery(threadID as string).data as ThreadType;

    const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState<boolean>(false);

    const [deleteThread, { isLoading, isError, error, isSuccess }] = useDeleteThreadMutation();
    const onDeleteThreadHandler = () => {
        deleteThread(threadID as string);
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            toast.success("Successfully deleted thread");
            navigate("/");
        }
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    if (!thread) {
        return <div>Loading...</div>;
    }
    return (
        <Container sx={{ py: 8 }}>
            <Paper sx={{ bgcolor: "white", px: 8, py: 5 }}>
                <Stack direction="row" alignItems="center" mb={2}>
                    <Button
                        component={Link}
                        to="/"
                        startIcon={<ArrowBackIcon />}
                        color="inherit"
                        variant="text"
                        sx={{ textTransform: "none", p: 0 }}
                    >
                        Back to all threads
                    </Button>
                    <Stack direction="row" sx={{ ml: "auto" }}>
                        {username === thread.user.username && (
                            <>
                                <Tooltip title="Edit thread">
                                    <Link to={`/thread/${thread.ID}/edit`}>
                                        <IconButton sx={{ "& :hover": { color: "blue" } }}>
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                </Tooltip>
                                <Tooltip title="Delete thread">
                                    <IconButton
                                        onClick={() => setOpenDeleteConfirmationModal(true)}
                                        sx={{ "& :hover": { color: "red" } }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        <Dialog open={openDeleteConfirmationModal}>
                            <DialogTitle>Are you sure you want to delete this thread?</DialogTitle>
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
                </Stack>
                <TagList tags={thread.tags.map((tag) => tag.name)} />
                <Typography variant="h6" mt={1}>
                    {thread.title}
                </Typography>
                <Typography variant="body1" my={2} sx={{ whiteSpace: "pre-line" }}>
                    {thread.body}
                </Typography>
                <List dense>
                    <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary={thread.user.username} />
                    </ListItem>
                    <ListItem disableGutters disablePadding>
                        <ListItemIcon>
                            <EditCalendarIcon />
                        </ListItemIcon>
                        <ListItemText primary={moment(thread.CreatedAt).fromNow()} />
                    </ListItem>
                </List>
                <Stack direction="row" my={2} spacing={1}>
                    <Vote threadID={threadID as string} />
                    <Button variant="outlined" startIcon={<ForumIcon />}>
                        {thread.comments.length}
                    </Button>
                </Stack>
                {username ? (
                    <NewComment />
                ) : (
                    <>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Please authenticate to upvote or comment
                        </Alert>
                    </>
                )}
                <Divider />
                <Typography variant="body2" my={2}>
                    Comments:
                </Typography>
                <CommentList threadID={thread.ID} />
            </Paper>
        </Container>
    );
};

export default Thread;
