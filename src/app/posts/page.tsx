"use client"
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "@/lib/postsSlice";
import { useEffect } from "react";
import SinglePost from "../_Components/singlepost/page";
import { Grid } from "@mui/material";
import PendingIcon from '@mui/icons-material/Pending';
import ResponsiveAppBar from "../_Components/navbar/page";

export default function Posts() {
  const dispatch = useDispatch<typeof getPosts>();
  const { allPosts, isLoading, isError } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  return (
    <>
            <ResponsiveAppBar></ResponsiveAppBar>

      {isLoading ? (
        <PendingIcon sx={{ width:200,height:200, textAlign:"center", color: "blue" }} />
      ) : (
        <Grid container spacing={4}>
          {allPosts?.map((post) => (
            <Grid item xs={6} md={3} key={post.id}>
              <SinglePost postdetails={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}