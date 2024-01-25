import customFetchBase from "./customFetchBase";
import { setFilterTags, setTagOptions } from "../features/threadSlice";
import { createApi } from "@reduxjs/toolkit/query/react";

export const tagApi = createApi({
    reducerPath: "tagApi",
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        getTags: builder.query<string[], void>({
            query() {
                return {
                    url: "tags",
                };
            },
            transformResponse: (results: { data: string[] }) => results.data,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setTagOptions(data));
                    dispatch(setFilterTags(data));
                } catch (error) {
                    console.error(error);
                }
            },
        }),
    }),
});

export const { useGetTagsQuery } = tagApi;
