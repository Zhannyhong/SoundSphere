import customFetchBase from "./customFetchBase";
import { threadApi } from "./threadApi";
import { CommentType, GenericResponseType } from "../../types/types";
import { CommentInput } from "../../components/Comment/NewComment";
import { createApi } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
    reducerPath: "commentApi",
    baseQuery: customFetchBase,
    tagTypes: ["Comments"],
    endpoints: (builder) => ({
        createComment: builder.mutation<GenericResponseType, { id: string; post: CommentInput }>({
            query({ id, post }) {
                return {
                    url: `/threads/${id}/comments`,
                    method: "POST",
                    credentials: "include",
                    body: post,
                };
            },
            invalidatesTags: [{ type: "Comments", id: "LIST" }],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(threadApi.util.invalidateTags(["Threads"]));
            },
        }),
        editComment: builder.mutation<GenericResponseType, { id: string; post: CommentInput }>({
            query({ id, post }) {
                return {
                    url: `/comments/${id}`,
                    method: "PATCH",
                    credentials: "include",
                    body: post,
                };
            },
            invalidatesTags: (result, error, { id }) =>
                result
                    ? [
                          { type: "Comments", id },
                          { type: "Comments", id: "LIST" },
                      ]
                    : [{ type: "Comments", id: "LIST" }],
        }),
        getComment: builder.query<CommentType, string>({
            query(id) {
                return {
                    url: `/comments/${id}`,
                    credentials: "include",
                };
            },
            providesTags: (result, error, id) => [{ type: "Comments", id }],
            transformResponse: (results: { data: CommentType }) => results.data,
        }),
        getThreadComments: builder.query<CommentType[], string>({
            query(id) {
                return {
                    url: `/threads/${id}/comments`,
                    credentials: "include",
                };
            },
            providesTags: () => [{ type: "Comments", id: "LIST" }],
            transformResponse: (results: { data: CommentType[] }) => results.data,
        }),
        deleteComment: builder.mutation<GenericResponseType, string>({
            query(id) {
                return {
                    url: `/comments/${id}`,
                    method: "Delete",
                    credentials: "include",
                };
            },
            invalidatesTags: [{ type: "Comments", id: "LIST" }],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled;
                dispatch(threadApi.util.invalidateTags(["Threads"]));
            },
        }),
    }),
});

export const {
    useCreateCommentMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetThreadCommentsQuery,
    useGetCommentQuery,
} = commentApi;
