import { useGetTagsQuery } from "../redux/apis/tagApi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setFilterTags } from "../redux/features/threadSlice";
import React, { useEffect } from "react";
import { TextField, Autocomplete, Typography, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { toast } from "react-toastify";

const FilterTags: React.FC = () => {
    const { isLoading, isError, error } = useGetTagsQuery();
    const dispatch = useAppDispatch();
    const tagOptions = useAppSelector((state) => state.threadState.tagOptions);
    const filterTags = useAppSelector((state) => state.threadState.filterTags);

    useEffect(() => {
        if (isError) {
            console.log(error);
            toast.error((error as any).data.data);
        }
    }, [isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Autocomplete
            multiple
            size="small"
            id="Filter by tags"
            options={tagOptions}
            value={filterTags}
            disableCloseOnSelect
            onChange={(event, value) => dispatch(setFilterTags(value))}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Add Filter"
                    label={
                        <Stack direction="row" alignItems="center" gap={1}>
                            <FilterListIcon />
                            <Typography>Tags</Typography>
                        </Stack>
                    }
                />
            )}
        />
    );
};

export default FilterTags;
