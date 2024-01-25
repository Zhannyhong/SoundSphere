import customFetchBase from "./customFetchBase";
import { threadApi } from "./threadApi";
import { GenericResponseType, VoteType } from "../../types/types";
import { createApi } from "@reduxjs/toolkit/query/react";

export const voteApi = createApi({
    reducerPath: "voteApi",
    baseQuery: customFetchBase,
    tagTypes: ["Threads"],
    endpoints: (builder) => ({
        createVote: builder.mutation<GenericResponseType, string>({
            query(id) {
                return {
                    url: `threads/${id}/votes`,
                    method: "POST",
                    credentials: "include",
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(threadApi.util.invalidateTags(["Threads"]));
            },
        }),
        deleteVote: builder.mutation<GenericResponseType, string>({
            query(id) {
                return {
                    url: `threads/${id}/votes`,
                    method: "DELETE",
                    credentials: "include",
                };
            },
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(threadApi.util.invalidateTags(["Threads"]));
            },
        }),
        getVotes: builder.query<VoteType[], string>({
            query(id) {
                return {
                    url: `threads/${id}/votes`,
                    credentials: "include",
                };
            },
            transformResponse: (result: { data: VoteType[] }) => result.data,
        }),
    }),
});

export const { useCreateVoteMutation, useDeleteVoteMutation, useGetVotesQuery } = voteApi;
