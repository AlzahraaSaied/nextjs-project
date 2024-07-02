import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

let headers = {
  token: localStorage.getItem("userToken"),
};
export let getPosts = createAsyncThunk("postsSlice/getPosts", async () => {
  let response = await fetch(
    `https://linked-posts.routemisr.com/posts?limit=50`,
    {
      method: "GET",
      headers: headers,
    }
  );

  let data = await response.json();
  return data.posts;
});
export let addPost = createAsyncThunk(
  "postsSlice/addPost",
  async (FormData) => {
    let response = await fetch(`https://linked-posts.routemisr.com/posts`, {
      body: FormData,
      method: "POST",
      headers: headers,
    });

    let data = await response.json();
    return data.posts;
  }
);
export const updatePost = createAsyncThunk(
  "postsSlice/updatePost",
  async ({ id, formData }) => {
    const response = await fetch(
      `https://linked-posts.routemisr.com/posts/${id}`,
      {
        method: "PUT",
        headers: headers,
        body: formData,
      }
    );

    const data = await response.json();
    return data;
  }
);

export const deletePost = createAsyncThunk(
  'postsSlice/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://linked-posts.routemisr.com/posts/${id}`, {
        method: 'DELETE',
        headers: headers, // Ensure headers are defined and correct
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      return id; // Return the ID of the deleted post upon success
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const addComment = createAsyncThunk(
  "postsSlice/addComment",
  async (raw) => {
    const response = await fetch(
      "https://linked-posts.routemisr.com/comments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(raw),
      }
    );

    const data = await response.json();
    return data;
  }
);
export const updateComment = createAsyncThunk(
  "postsSlice/updateComment",
  async ({ id, raw }) => {
    const response = await fetch(
      `https://linked-posts.routemisr.com/comments/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(raw),
      }
    );

    const data = await response.json();
    return data;
  }
);

export const deleteComment = createAsyncThunk(
  "postsSlice/deleteComment",
  async (id) => {
    await fetch(`https://linked-posts.routemisr.com/comments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return id;
  }
);
let initialState = {
  allPosts: [],
  userPosts: [],
  isLoading: false,
  isError: null,
};
let postsSlice = createSlice({
  name: "postsSlice",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.allPosts = action.payload; // Assuming action.payload is already an array of posts
      state.isLoading = false;
      state.isError = null;
    });
    builder.addCase(getPosts.pending, (state, action) => {
      state.isLoading = true;
      state.isError = null;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });
    builder.addCase(addPost.fulfilled, (state, action) => {
      console.log("Added");
    });

    builder.addCase(updatePost.fulfilled, (state, action) => {
      console.log("Updated Post");
      // Update state as per your requirement after a successful update
    });

    builder.addCase(deletePost.fulfilled, (state, action) => {
      // Remove the deleted post from state
      state.posts = state.posts.filter(post => post.id !== action.payload);
    });
    // Handle other action types if necessary
  
    builder.addCase(addComment.fulfilled, (state, action) => {
      console.log("AddedComment");
    });
    builder.addCase(updateComment.fulfilled, (state, action) => {
      console.log("UpdatedComment");
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      console.log("DeletedComment");
    });
  },
  reducers: {},
});

export let postsReducer = postsSlice.reducer;
