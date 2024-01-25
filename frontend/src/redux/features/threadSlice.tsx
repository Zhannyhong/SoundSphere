import { ThreadType } from "../../types/types";
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type threadStateType = {
    threads: ThreadType[];
    tagOptions: string[];
    filterTags: string[];
    sortOrder: string;
    searchTerm: string;
};

const initialState: threadStateType = {
    threads: [],
    tagOptions: [],
    filterTags: [],
    sortOrder: "Most Popular",
    searchTerm: "",
};

export const threadSlice = createSlice({
    initialState,
    name: "threadSlice",
    reducers: {
        setThreads: (state, action: PayloadAction<ThreadType[]>) => {
            state.threads = action.payload;
        },
        setTagOptions: (state, action: PayloadAction<string[]>) => {
            state.tagOptions = action.payload;
        },
        setFilterTags: (state, action: PayloadAction<string[]>) => {
            state.filterTags = action.payload;
        },
        setSortOrder: (state, action: PayloadAction<string>) => {
            state.sortOrder = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
});

export const selectTransformedThreads = createSelector(
    [
        (state: { threadState: { threads: ThreadType[] } }) => state.threadState.threads,
        (state: { threadState: { filterTags: string[] } }) => state.threadState.filterTags,
        (state: { threadState: { sortOrder: string } }) => state.threadState.sortOrder,
        (state: { threadState: { searchTerm: string } }) => state.threadState.searchTerm,
    ],
    (threads, filterTags, sortOrder, searchTerm) => {
        threads = filterThreads(threads, filterTags);
        threads = sortThreads(threads, sortOrder);
        threads = searchThreads(threads, searchTerm);
        return threads;
    },
);

const filterThreads = (threads: ThreadType[], filterTags: string[]) => {
    return threads.filter((thread) => {
        return filterTags.some((tag) => thread.tags.map((t) => t.name).includes(tag));
    });
};

const sortThreads = (threads: ThreadType[], sortOrder: string) => {
    switch (sortOrder) {
        case "Most Recent":
            return threads.slice().sort((a, b) => {
                return new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime();
            });
        case "Least Recent":
            return threads.slice().sort((a, b) => {
                return new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime();
            });
        case "Most Popular":
            return threads.sort((a, b) => {
                return b.votes.length - a.votes.length;
            });
        case "Least Popular":
            return threads.sort((a, b) => {
                return a.votes.length - b.votes.length;
            });
        default:
            return threads;
    }
};

const searchThreads = (threads: ThreadType[], searchTerm: string) => {
    if (searchTerm.length === 0) {
        return threads;
    }
    return threads.filter((thread) => {
        return (
            thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            thread.body.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
};

export default threadSlice.reducer;

export const { setThreads, setTagOptions, setFilterTags, setSortOrder, setSearchTerm } = threadSlice.actions;
