"use client"
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    posts: [],
    loading: false,
    error: null,
};

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        fetchPostsStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess(state, action) {
            state.loading = false;
            state.posts = action.payload;
        },
        fetchPostsFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } = blogSlice.actions;
export const selectPosts = (state) => state.blog.posts;
export const selectLoading = (state) => state.blog.loading;
export const selectError = (state) => state.blog.error;

export default blogSlice.reducer;

export const fetchPosts = () => async (dispatch) => {
    dispatch(fetchPostsStart());
    try {
        const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + "/blogs");
        const data = response.data.blogs;
        dispatch(fetchPostsSuccess(data));
    } catch (error) {
        dispatch(fetchPostsFailure(error.toString()));
    }
};