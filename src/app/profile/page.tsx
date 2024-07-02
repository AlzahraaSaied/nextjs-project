"use client"
import { Grid } from "@mui/material";
import AddPost from "../_Components/addpost/page";

export default function Profile(){

    return(<>

    <Grid container >
        <Grid item xs={4}></Grid>
        <Grid item xs={8}>
        <AddPost/>
        </Grid>
    </Grid>

    </>)
}