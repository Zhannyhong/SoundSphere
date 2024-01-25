import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSortOrder } from "../redux/features/threadSlice";
import * as React from "react";
import { MenuItem, TextField } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import InputAdornment from "@mui/material/InputAdornment";

const SortBy: React.FC = () => {
    const sortOptions = ["Most Recent", "Least Recent", "Most Popular", "Least Popular"];
    const sortOrder = useAppSelector((state) => state.threadState.sortOrder);
    const dispatch = useAppDispatch();

    const handleSort = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSortOrder(event.target.value));
    };

    return (
        <TextField
            id="Sort By"
            select
            label="Sort By"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SortIcon />
                    </InputAdornment>
                ),
            }}
            value={sortOrder}
            onChange={handleSort}
            sx={{ width: 200 }}
        >
            {sortOptions.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SortBy;
