import CommentItem from "./CommentItem";
import { useGetThreadCommentsQuery } from "../../redux/apis/commentApi";
import React, { useEffect } from "react";
import { Divider, Stack } from "@mui/material";
import { toast } from "react-toastify";

type Props = {
    threadID: number;
};

const CommentList: React.FC<Props> = ({ threadID }) => {
    const {
        isLoading,
        isError,
        error,
        data: comments,
    } = useGetThreadCommentsQuery(threadID.toString(), { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return comments?.length === 0 ? (
        <div>No comments</div>
    ) : (
        <Stack spacing={3} divider={<Divider light />}>
            {comments?.map((comment) => (
                <CommentItem comment={comment} commentID={comment.ID} key={comment.ID} />
            ))}
        </Stack>
    );
};

export default CommentList;
