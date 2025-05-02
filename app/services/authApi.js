import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/user/getCategories`,
    }),
    getProfile: builder.query({
      query: () => `/user/getProfile`,
    }),
    getUsers: builder.query({
      query: () => `/user/getUsers`,
    }),
    getMyWribates: builder.query({
      query: () => `/user/myWribates`,
    }),
    getVotes: builder.query({
      query: (id) => `/user/getVotes/${id}`,
    }),

    getMyWribatesByCategory: builder.query({
      query: (category) => `/user/getWribateByCategory/${category}`,
    }),
    getMyWribateById: builder.query({
      query: (id) => `/user/getWribateById/${id}`,
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/user/login`,
        method: "POST",
        body: data,
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: `/user/sendOTP`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: `/user/vertfyOTP`,
        method: "POST",
        body: data,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: `/user/signUp`,
        method: "POST",
        body: data,
      }),
    }),
    uploadImage: builder.mutation({
      query: ({ type, data }) => ({
        url: `/user/uploadImage?image_type=${type}`,
        method: "POST",
        body: data,
        headers: {},
      }),
    }),
    createWribate: builder.mutation({
      query: (data) => ({
        url: `/user/createWribate`,
        method: "POST",
        body: data,
      }),
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `/user/createOrder`,
        method: "POST",
        body: data,
      }),
    }),
    // createBatchWribate: builder.mutation({
    //   query: (data) => ({
    //     url: `/user/createBatchWribate`,
    //     method: "POST",
    //     body: data,
    //     headers: {},
    //   }),
    // }),
    createBatchWribate: builder.mutation({
      query: (data) => {
        // Console log the data object here
        // console.log("Data being sent to createBatchWribate:", data);
        console.log("FormData entries:");
        for (const pair of data.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        return {
          url: `/user/createBatchWribate`,
          method: "POST",
          body: data,
          headers: {},
        };
      },
    }),
    addArgument: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/arguments/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    addComment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/comment/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    addVote: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/vote/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    updateFavoriteCategories: builder.mutation({
      query: (updatedCategories) => ({
        url: `/user/favouriteCategories`,
        method: "POST",
        body: updatedCategories,
      }),
    }),
    checkAvailableUserName: builder.mutation({
      query: (dataObject) => ({
        url: `/user/checkAvailableUserName`,
        method: "POST",
        body: dataObject,
      }),
    }),
    updateProfile: builder.mutation({
      query: ({ id, updatedProfile }) => ({
        url: `/user/updateProfile/${id}`,
        method: "PATCH",
        body: updatedProfile,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUpdateProfileMutation,
  useUpdateFavoriteCategoriesMutation,
  useCheckAvailableUserNameMutation,
  useGetCategoriesQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupMutation,
  useGetProfileQuery,
  useUploadImageMutation,
  useCreateWribateMutation,
  useGetMyWribatesQuery,
  useGetMyWribatesByCategoryQuery,
  useGetMyWribateByIdQuery,
  useAddArgumentMutation,
  useAddCommentMutation,
  useCreateBatchWribateMutation,
  useAddVoteMutation,
  useGetUsersQuery,
  useGetVotesQuery,
  useCreateOrderMutation,
} = authApi;
