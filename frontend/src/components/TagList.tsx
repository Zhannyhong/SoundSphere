import React from "react";
import { Chip, Stack } from "@mui/material";

type Props = {
    tags: string[];
};

const TagList: React.FC<Props> = ({ tags }) => {
    return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {tags.map((tag) => {
                return <Chip label={tag} size="small" key={tag} color="primary"></Chip>;
            })}
        </Stack>
    );
};

export default TagList;
