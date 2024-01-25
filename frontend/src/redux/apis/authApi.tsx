import customFetchBase from "./customFetchBase";
import { AuthResponseType } from "../../types/types";
import { LoginInput } from "../../components/Login";
import { SignupInput } from "../../components/Signup";
import { setAuth } from "../features/authSlice";
import { createApi } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: customFetchBase,
    endpoints: (builder) => ({
        signupUser: builder.mutation<AuthResponseType, SignupInput>({
            query(data) {
                return {
                    url: "users/signup",
                    method: "POST",
                    body: data,
                };
            },
            transformResponse: (result: { data: AuthResponseType }) => result.data,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAuth(data));
                } catch (error) {
                    console.error(error);
                }
            },
        }),
        loginUser: builder.mutation<AuthResponseType, LoginInput>({
            query(data) {
                return {
                    url: "users/login",
                    method: "POST",
                    body: data,
                    credentials: "include",
                };
            },
            transformResponse: (result: { data: AuthResponseType }) => result.data,
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAuth(data));
                } catch (error) {
                    console.error(error);
                }
            },
        }),
    }),
});

export const { useLoginUserMutation, useSignupUserMutation } = authApi;
