import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const createThreadCard: React.FC = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Discuss anything music-related!</Typography>
                <Typography variant="body2" mt={2}>
                    Share your favourite song recommendations, a recent concert experience, or a new album release!
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    component={Link}
                    to="/thread/create"
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                >
                    Create thread
                </Button>
            </CardActions>
        </Card>
    );
};

export default createThreadCard;
