import ThreadList from "../components/Thread/ThreadList";
import SearchBar from "../components/SearchBar";
import SortBy from "../components/SortBy";
import CreateThread from "../components/CreateThreadCard";
import FilterTags from "../components/FilterTags";
import React from "react";
import { Container, Stack, Grid } from "@mui/material";

const Home: React.FC = () => {
    return (
        <>
            <Container sx={{ py: 8 }}>
                <Grid container spacing={5}>
                    <Grid item xs={3}>
                        <Stack spacing={5}>
                            <CreateThread />
                            <FilterTags />
                        </Stack>
                    </Grid>
                    <Grid item xs>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                            <SortBy />
                            <SearchBar />
                        </Stack>
                        <ThreadList />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Home;
