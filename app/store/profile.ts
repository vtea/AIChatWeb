import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Balance, ProfileResponse } from "../api/users/[...path]/route";
import { StoreKey } from "../constant";
import { AuthStore, useAuthStore } from "./auth";

export interface ProfileStore {
  id: number;
  // tokens: number;
  // chatCount: number;
  // advanceChatCount: number;
  // drawCount: number;
  invitorId: number;
  balances: Balance[];

  fetchProfile: (token: string, authStore: AuthStore) => Promise<any>;
  createInviteCode: (authStore: AuthStore) => Promise<any>;
}

// let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      id: 0,
      // tokens: 0,
      // chatCount: 0,
      // advanceChatCount: 0,
      // drawCount: 0,
      invitorId: 0,
      balances: [],

      async fetchProfile(token: string, authStore: AuthStore) {
        const url = "/users/profile";
        const BASE_URL = process.env.BASE_URL;
        const mode = process.env.BUILD_MODE;
        let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;
        return fetch(requestUrl, {
          method: "get",
          headers: {
            Authorization: "Bearer " + token,
          },
          body: null,
        })
          .then((res) => res.json())
          .then((res: ProfileResponse) => {
            console.log("[Profile] got profile from server", res);
            const data = res.data;
            if (res.data) {
              set(() => ({
                id: data.id,
                tokens: data.tokens,
                chatCount: data.chatCount,
                advanceChatCount: data.advancedChatCount,
                drawCount: data.drawCount,
                balances: data.balances || [],
              }));
              authStore.updateInviteCode(data.inviteCode);
            } else {
              console.log("[Profile] set id = 0");
              set(() => ({
                id: 0,
                tokens: 0,
                chatCount: 0,
                advanceChatCount: 0,
                drawCount: 0,
                balances: [],
              }));
            }
            return res;
          })
          .catch(() => {
            console.error("[Profile] failed to fetch profile");
          })
          .finally(() => {
            // fetchState = 2;
          });
      },
      async createInviteCode(authStore: AuthStore) {
        // const authStore = useAuthStore()
        const url = "/users/inviteCode";
        const BASE_URL = process.env.BASE_URL;
        const mode = process.env.BUILD_MODE;
        let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;
        return fetch(requestUrl, {
          method: "post",
          headers: {
            Authorization: "Bearer " + authStore.token,
          },
          body: null,
        })
          .then((res) => res.json())
          .then((resp) => {
            if (resp.code === 0) {
              authStore.updateInviteCode(resp.data);
            }
            return resp;
          });
      },
    }),
    {
      name: StoreKey.Profile,
      version: 1,
    },
  ),
);
