import ThreadItem from "./ThreadItem";
import { useGetThreadsQuery } from "../../redux/apis/threadApi";
import { useAppSelector } from "../../redux/store";
import { selectTransformedThreads } from "../../redux/features/threadSlice";
import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { toast } from "react-toastify";

const ThreadList: React.FC = () => {
    const { isLoading, isError, error } = useGetThreadsQuery();
    const threads = useAppSelector(selectTransformedThreads);

    useEffect(() => {
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return threads?.length === 0 ? (
        <div>No threads</div>
    ) : (
        <Stack spacing={2}>
            {threads?.map((thread) => (
                <ThreadItem thread={thread} key={thread.ID} />
            ))}
        </Stack>
    );
};

export default ThreadList;
