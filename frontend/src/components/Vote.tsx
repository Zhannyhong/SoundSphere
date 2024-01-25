import { useCreateVoteMutation, useDeleteVoteMutation, useGetVotesQuery } from "../redux/apis/voteApi";
import { useAppSelector } from "../redux/store";
import React, { useEffect } from "react";
import { Button } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { toast } from "react-toastify";

type Props = {
    threadID: string;
};

const Vote: React.FC<Props> = ({ threadID }) => {
    const { data: votes, refetch } = useGetVotesQuery(threadID);
    const userID = useAppSelector((state) => state.authState.userID);

    const [voted, setVoted] = React.useState<boolean>(false);
    const [
        createVote,
        { isLoading: isCreateLoading, isSuccess: isCreateSuccess, isError: isCreateError, error: createError },
    ] = useCreateVoteMutation();
    const [
        deleteVote,
        { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
    ] = useDeleteVoteMutation();

    useEffect(() => {
        if (votes) {
            setVoted(votes.some((vote) => vote.userID === userID));
        }
    }, [votes, userID]);

    useEffect(() => {
        if (isCreateSuccess) {
            toast.success("Successfully voted");
            setVoted(true);
            refetch();
        }
        if (isCreateError) {
            console.log(createError);
            toast.error((createError as any).data.data);
        }
    }, [isCreateLoading]);

    useEffect(() => {
        if (isDeleteSuccess) {
            toast.success("Successfully unvoted");
            setVoted(false);
            refetch();
        }
        if (isDeleteError) {
            console.log(deleteError);
            toast.error((deleteError as any).data.data);
        }
    }, [isDeleteLoading]);

    const handleCreateVote = () => {
        createVote(threadID);

        if (isCreateSuccess) {
            setVoted(true);
        }
    };

    const handleDeleteVote = () => {
        deleteVote(threadID);

        if (isDeleteSuccess) {
            setVoted(false);
        }
    };

    return (
        <Button
            variant="contained"
            startIcon={<KeyboardArrowUpIcon />}
            onClick={voted ? handleDeleteVote : handleCreateVote}
            color={voted ? "success" : "primary"}
            disabled={userID === 0}
        >
            {votes ? votes.length : 0}
        </Button>
    );
};

export default Vote;
