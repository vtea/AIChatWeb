import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export interface AiPlugin {
  id: number;
  uuid: string;
  name: string;
  logo?: string;
  alone: boolean;
  builtin: boolean;
  state: number;
}

export type ModelContentType = "Text" | "Image";
export interface SimpleModel {
  name: string;
  contentType: ModelContentType;
}

export interface WebsiteConfigStore {
  title: string;
  mainTitle: string;
  subTitle: string;
  icp: string;
  loginPageSubTitle: string;
  registerPageSubTitle: string;
  pricingPageTitle: string;
  pricingPageSubTitle: string;
  payPageTitle: string;
  payPageSubTitle: string;
  chatPageSubTitle: string;
  sensitiveWordsTip: string;
  balanceNotEnough: string;
  registerTypes: string[];
  registerForInviteCodeOnly: boolean;
  redeemCodePageTitle: string;
  redeemCodePageSubTitle: string;
  redeemCodePageBanner: string;
  redeemCodePageTop: string;
  redeemCodePageIndex: string;
  redeemCodePageBottom: string;
  hideGithubIcon: boolean;
  botHello: string;
  hideChatLogWhenNotLogin: boolean;
  logoUrl?: string;
  availableModels: SimpleModel[];
  defaultSystemTemplate?: string;
  plugins?: AiPlugin[];
  fetchWebsiteConfig: () => Promise<any>;
}

export interface WebsiteConfig {
  title: string;
  mainTitle: string;
  subTitle: string;
  icp: string;
  loginPageSubTitle: string;
  registerPageSubTitle: string;
  registerTypes: string[];
  registerForInviteCodeOnly: boolean;
  redeemCodePageTitle: string;
  redeemCodePageSubTitle: string;
  redeemCodePageBanner: string;
  redeemCodePageTop: string;
  redeemCodePageIndex: string;
  redeemCodePageBottom: string;
  pricingPageTitle: string;
  pricingPageSubTitle: string;
  payPageTitle: string;
  payPageSubTitle: string;
  chatPageSubTitle: string;
  sensitiveWordsTip: string;
  balanceNotEnough: string;
  hideGithubIcon: boolean;
  botHello: string;
  hideChatLogWhenNotLogin: boolean;
  logoUuid?: string;
  defaultSystemTemplate: string;
  availableModels: SimpleModel[];
  plugins?: AiPlugin[];
}
export interface WebsiteConfigData {
  websiteContent: WebsiteConfig;
}

import { Response } from "../api/common";
export type WebsiteConfigResponse = Response<WebsiteConfigData>;

export const useWebsiteConfigStore = create<WebsiteConfigStore>()(
  persist(
    (set, get) => ({
      title: "",
      mainTitle: "",
      subTitle: "",
      icp: "",
      loginPageSubTitle: "",
      registerPageSubTitle: "",
      registerTypes: [] as string[],
      registerForInviteCodeOnly: false as boolean,
      pricingPageTitle: "",
      pricingPageSubTitle: "",
      payPageTitle: "",
      payPageSubTitle: "",
      chatPageSubTitle: "",
      sensitiveWordsTip: "",
      balanceNotEnough: "",
      hideGithubIcon: false as boolean,
      botHello: "",
      hideChatLogWhenNotLogin: false as boolean,
      logoUrl: "",
      availableModels: [] as SimpleModel[],
      redeemCodePageTitle: "",
      redeemCodePageSubTitle: "",
      redeemCodePageBanner: "",
      redeemCodePageTop: "",
      redeemCodePageIndex: "",
      redeemCodePageBottom: "",
      defaultSystemTemplate: "",
      plugins: [] as AiPlugin[],

      async fetchWebsiteConfig() {
        const url = "/globalConfig/website";
        const BASE_URL = process.env.BASE_URL;
        const mode = process.env.BUILD_MODE;
        console.log("mode", mode);
        let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;
        return fetch(requestUrl, {
          method: "get",
        })
          .then((res) => res.json())
          .then((res: WebsiteConfigResponse) => {
            console.log("[GlobalConfig] got website config from server", res);
            const website = res.data.websiteContent;
            // console.log('store: website.logoUuid', website.logoUuid)
            const getBaseUrl = () => {
              const BASE_URL = process?.env?.BASE_URL;
              const mode = process?.env?.BUILD_MODE;
              return mode === "export" ? BASE_URL || "" : "";
            };

            set(() => ({
              title: website.title,
              mainTitle: website.mainTitle,
              subTitle: website.subTitle,
              icp: website.icp || "",
              loginPageSubTitle: website.loginPageSubTitle,
              registerPageSubTitle: website.registerPageSubTitle,
              registerTypes:
                website.registerTypes && website.registerTypes.length
                  ? website.registerTypes
                  : (["OnlyUsername"] as string[]),
              registerForInviteCodeOnly: website.registerForInviteCodeOnly,
              pricingPageTitle: website.pricingPageTitle,
              pricingPageSubTitle: website.pricingPageSubTitle,
              payPageTitle: website.payPageTitle,
              payPageSubTitle: website.payPageSubTitle,
              chatPageSubTitle: website.chatPageSubTitle,
              sensitiveWordsTip: website.sensitiveWordsTip,
              balanceNotEnough: website.balanceNotEnough,
              hideGithubIcon: website.hideGithubIcon,
              botHello: website.botHello,
              hideChatLogWhenNotLogin: website.hideChatLogWhenNotLogin,
              redeemCodePageTitle: website.redeemCodePageTitle || "",
              redeemCodePageSubTitle: website.redeemCodePageSubTitle || "",
              redeemCodePageBanner: website.redeemCodePageBanner || "",
              redeemCodePageTop: website.redeemCodePageTop || "",
              redeemCodePageIndex: website.redeemCodePageIndex || "",
              redeemCodePageBottom: website.redeemCodePageBottom || "",
              logoUrl:
                website.logoUuid !== undefined &&
                website.logoUuid !== null &&
                website.logoUuid !== ""
                  ? getBaseUrl() + "/api/file/" + website.logoUuid
                  : "",
              availableModels: website.availableModels,
              defaultSystemTemplate: website.defaultSystemTemplate,
              plugins: website.plugins,
            }));
            return res;
          })
          .catch((e) => {
            console.error(
              "[GlobalConfig] failed to fetch website config in store/website.ts",
              e,
            );
          })
          .finally(() => {
            // fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.WebsiteConfig,
      version: 1,
    },
  ),
);
