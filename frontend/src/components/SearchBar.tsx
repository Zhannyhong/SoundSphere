import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearchTerm } from "../redux/features/threadSlice";
import React from "react";
import { IconButton, InputBase, Paper, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar: React.FC = () => {
    const searchTerm = useAppSelector((state) => state.threadState.searchTerm);
    const dispatch = useAppDispatch();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(event.target.value));
    };

    return (
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", minWidth: "60%" }}>
            <SearchIcon sx={{ p: "10px" }} aria-label="search" />
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search Threads"
                inputProps={{ "aria-label": "search threads" }}
                value={searchTerm}
                onChange={handleSearch}
            />
            {searchTerm.length >= 1 && (
                <Tooltip title="Clear search">
                    <IconButton type="button" sx={{ p: "10px" }} aria-label="clear">
                        <ClearIcon
                            onClick={() => {
                                dispatch(setSearchTerm(""));
                            }}
                        />
                    </IconButton>
                </Tooltip>
            )}
        </Paper>
    );
};

export default SearchBar;
