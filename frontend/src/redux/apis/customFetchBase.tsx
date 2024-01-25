import { RootState } from "../store";
import { logout, setAuth } from "../features/authSlice";
import { AuthResponseType } from "../../types/types";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/`;

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).authState.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

const customFetchBase: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions,
) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock();
    let result = await baseQuery(args, api, extraOptions);
    if ((result.error?.data as any)?.data === "token has invalid claims: token is expired") {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();

            try {
                const refreshQuery = fetchBaseQuery({
                    baseUrl,
                    prepareHeaders: (headers, { getState }) => {
                        const token = (getState() as RootState).authState.refreshToken;
                        if (token) {
                            headers.set("Authorization", `Bearer ${token}`);
                        }

                        return headers;
                    },
                });

                const refreshResult = await refreshQuery(
                    { credentials: "include", url: "users/refresh" },
                    api,
                    extraOptions,
                );

                api.dispatch(setAuth((refreshResult.data as any).data as AuthResponseType));

                if (refreshResult.data) {
                    // Retry the initial query
                    result = await baseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(logout());
                    window.location.href = "/";
                }
            } finally {
                release();
            }
        } else {
            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export default customFetchBase;
