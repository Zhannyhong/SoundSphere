import customFetchBase from "./customFetchBase";
import { GenericResponseType, ThreadType } from "../../types/types";
import { ThreadInput } from "../../pages/CreateThread";
import { setThreads } from "../features/threadSlice";
import { createApi } from "@reduxjs/toolkit/query/react";

export const threadApi = createApi({
    reducerPath: "threadApi",
    baseQuery: customFetchBase,
    tagTypes: ["Threads"],
    endpoints: (builder) => ({
        createThread: builder.mutation<GenericResponseType, ThreadInput>({
            query(post) {
                return {
                    url: "/threads",
                    method: "POST",
                    credentials: "include",
                    body: post,
                };
            },
            invalidatesTags: [{ type: "Threads", id: "LIST" }],
        }),
        editThread: builder.mutation<GenericResponseType, { id: string; post: ThreadInput }>({
            query({ id, post }) {
                return {
                    url: `/threads/${id}`,
                    method: "PATCH",
                    credentials: "include",
                    body: post,
                };
            },
            invalidatesTags: (result, error, { id }) =>
                result
                    ? [
                          { type: "Threads", id },
                          { type: "Threads", id: "LIST" },
                      ]
                    : [{ type: "Threads", id: "LIST" }],
        }),
        getThread: builder.query<ThreadType, string>({
            query(id) {
                return {
                    url: `/threads/${id}`,
                    credentials: "include",
                };
            },
            providesTags: (result, error, id) => [{ type: "Threads", id }],
            transformResponse: (results: { data: ThreadType }) => results.data,
        }),
        getThreads: builder.query<ThreadType[], void>({
            query() {
                return {
                    url: `/threads`,
                    credentials: "include",
                };
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ ID }) => ({
                              type: "Threads" as const,
                              id: ID.toString(),
                          })),
                          { type: "Threads", id: "LIST" },
                      ]
                    : [{ type: "Threads", id: "LIST" }],
            transformResponse: (results: { data: ThreadType[] }) => results.data,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setThreads(data));
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        deleteThread: builder.mutation<GenericResponseType, string>({
            query(id) {
                return {
                    url: `/threads/${id}`,
                    method: "Delete",
                    credentials: "include",
                };
            },
            invalidatesTags: [{ type: "Threads", id: "LIST" }],
        }),
    }),
});

export const {
    useCreateThreadMutation,
    useDeleteThreadMutation,
    useEditThreadMutation,
    useGetThreadQuery,
    useGetThreadsQuery,
} = threadApi;
