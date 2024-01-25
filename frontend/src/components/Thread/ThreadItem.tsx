import TagList from "../TagList";
import { ThreadType } from "../../types/types";
import React from "react";
import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import moment from "moment";
import ForumIcon from "@mui/icons-material/Forum";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";

type Props = {
    thread: ThreadType;
};

const ThreadItem: React.FC<Props> = ({ thread }) => {
    return (
        <Card variant="outlined">
            <CardActionArea component={Link} to={`/thread/${thread.ID}`}>
                <CardContent>
                    <Grid container>
                        <Grid container item xs={1} alignItems="center" justifyContent="space-evenly">
                            <Stack direction="row" alignItems="center" gap={0}>
                                <Typography>{thread.votes.length}</Typography>
                                <KeyboardArrowUpIcon />
                            </Stack>
                        </Grid>
                        <Grid container item xs>
                            <Grid
                                container
                                item
                                xs={12}
                                spacing={3}
                                justifyContent="space-between"
                                alignItems="baseline"
                            >
                                <Grid item xs>
                                    <Typography
                                        variant="h6"
                                        gutterBottom
                                        sx={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitLineClamp: "2",
                                            WebkitBoxOrient: "vertical",
                                        }}
                                    >
                                        {thread.title}
                                    </Typography>
                                </Grid>
                                <Grid item xs="auto">
                                    <Typography>{moment(thread.CreatedAt).fromNow()}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container item>
                                <Typography
                                    variant="body1"
                                    gutterBottom
                                    sx={{
                                        whiteSpace: "pre-line",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: "5",
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {thread.body}
                                </Typography>
                                <Grid container item xs={12} sx={{ mt: 2 }}>
                                    <TagList tags={thread.tags.map((tag) => tag.name)} />
                                    <Stack direction="row" alignItems="center" gap={0.5} sx={{ ml: "auto" }}>
                                        <ForumIcon />
                                        <Typography>{thread.comments.length}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default ThreadItem;
