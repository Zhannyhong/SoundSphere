import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSortOrder } from "../redux/features/threadSlice";
import * as React from "react";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

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
            label={
                <Stack direction="row" alignItems="center" gap={1}>
                    <SortIcon />
                    <Typography>Sort By</Typography>
                </Stack>
            }
            value={sortOrder}
            onChange={handleSort}
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
