import { useState, useEffect } from "react";

import styles from "./pricing.module.scss";

import CloseIcon from "../icons/close.svg";
import {
  Input,
  List,
  DangerousListItem,
  ListItem,
  Modal,
  PasswordInput,
} from "./ui-lib";

import { IconButton } from "./button";
import { useAuthStore, useAccessStore, useWebsiteConfigStore } from "../store";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast } from "./ui-lib";
import { useRouter } from "next/navigation";
import { isInWechat } from "../utils/wechat";
import { isMobile } from "../utils";

export interface Package {
  id: number;
  state: number;
  calcType: string;
  calcTypeId: number;
  drawCount: number;
  chatCount: number;
  advancedChatCount: number;
  tokens: number;
  price: string;
  title: string;
  subTitle: string;
  uuid: string;
  top: number;
  days: string;
}
interface PackageResponse {
  code: number;
  message?: string;
  data: Package[];
}

export function GoToPayModel(props: {
  title: string;
  wechatCodeUrl: string;
  onClose: () => void;
}) {
  return (
    <div className="modal-mask">
      <Modal title={props.title} onClose={() => props.onClose()} actions={[]}>
        <div>
          <div style={{ textAlign: "center" }}>
            订单已创建，请点击以下按钮前往付款（微信支付）
          </div>
          <div style={{ textAlign: "center" }}>
            <a
              href="javascript:void(0)"
              style={{
                background: "#00C250",
                fontSize: "12px",
                color: "#FFFFFF",
                lineHeight: "32px",
                fontWeight: 500,
                display: "inline-block",
                borderRadius: "4px",
                width: "160px",
                marginTop: "20px",
                textDecoration: "none",
              }}
              target="_blank"
              onClick={() => window.open(props.wechatCodeUrl, "_blank")}
            >
              点此付款
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function Pricing() {
  const router = useRouter();
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const { pricingPageTitle, pricingPageSubTitle } = useWebsiteConfigStore();

  const [packages, setPackages] = useState([] as Package[]);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setTokenValid] = useState("unknown");
  useEffect(() => {
    setLoading(true);
    const url = "/package/onSales";
    const BASE_URL = process.env.BASE_URL;
    const mode = process.env.BUILD_MODE;
    let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;
    fetch(requestUrl, {
      method: "get",
      headers: {
        Authorization: "Bearer " + authStore.token,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const packagesResp = res as unknown as PackageResponse;
        if (Math.floor(packagesResp.code / 100) === 100) {
          setTokenValid("invalid");
        } else {
          setTokenValid("valid");
        }
        if (!packagesResp.data) {
          setPackages([]);
          return;
        }
        setPackages(
          packagesResp.data.map((pkg) => {
            pkg = { ...pkg };
            if (pkg.title && !pkg.title.includes("<")) {
              pkg.title = `<div style="font-size: 20px;">${pkg.title}</div>`;
            }
            if (!pkg.subTitle) {
              const prefix = {
                1: "总额",
                2: "每天",
                3: "每小时",
                4: "每3小时",
              }[pkg.calcTypeId];
              pkg.subTitle =
                `<ul style="margin-top: 5px;padding-inline-start: 10px;">` +
                (pkg.tokens
                  ? `<li>${prefix} <span style="font-size: 18px;">${
                      pkg.tokens === -1 ? "无限" : pkg.tokens
                    }</span> tokens</li>`
                  : "") +
                (pkg.chatCount
                  ? `<li>${prefix} <span style="font-size: 18px;">${
                      pkg.chatCount === -1 ? "无限" : pkg.chatCount
                    }</span> 次基础聊天（GPT3.5）</li>`
                  : "") +
                (pkg.advancedChatCount
                  ? `<li>${prefix} <span style="font-size: 18px;">${
                      pkg.advancedChatCount === -1
                        ? "无限"
                        : pkg.advancedChatCount
                    }</span> 次高级聊天（GPT4）</li>`
                  : "") +
                (pkg.drawCount
                  ? `<li>${prefix} <span style="font-size: 18px;">${
                      pkg.drawCount === -1 ? "无限" : pkg.drawCount
                    }</span> 次AI绘画</li>`
                  : "") +
                `<li>有效期： <span style="font-size: 18px;">${pkg.days}</span> 天</li>` +
                `</ul>`;
            }
            return pkg;
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [authStore.token]);

  const [goToPayModelShow, setGoToPayModelShow] = useState(false);
  const [wechatCodeUrl, setWechatCodeUrl] = useState("");
  function handleClickBuy(pkg: Package) {
    console.log("buy pkg", pkg);
    setLoading(true);
    const inWechat = isInWechat();
    const inMobile = isMobile();
    const url = "/order";
    const BASE_URL = process.env.BASE_URL;
    const mode = process.env.BUILD_MODE;
    let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;
    fetch(requestUrl, {
      method: "post",
      headers: {
        Authorization: "Bearer " + authStore.token,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        packageUuid: pkg.uuid,
        count: 1,
        inWechat,
        inMobile,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("resp.data", res.data);
        const order = res.data;
        if (res.code !== 0) {
          if (res.code === 11303) {
            showToast(Locale.PricingPage.TOO_FREQUENCILY);
          } else {
            const message = Locale.PricingPage.BuyFailedCause + res.message;
            showToast(message);
          }
          return;
        }

        if (order.state === 5) {
          // console.log(log.message?.url)
          // window.open(log.message?.url, "_blank");
          console.log("router.push", order.payUrl);
          if (order.payChannel === "xunhu") {
            router.push(order.payUrl);
          } else {
            // lantu
            if (inWechat || inMobile) {
              if (inWechat) {
                // showToast('window.open navigate to ' + order.payUrl)
                // window.open(order.payUrl, "_blank")
                // setGoToPayModelShow(true);
                // setWechatCodeUrl(order.payUrl)
                router.push(order.payUrl);
              } else {
                router.push(order.payUrl);
              }
            } else {
              navigate(Path.Pay + "?uuid=" + order.uuid);
            }
          }
          //
        } else {
          const logs = JSON.parse(order.logs);
          // console.log('order.logs', logs)
          const log = logs[0];
          const message =
            Locale.PricingPage.BuyFailedCause +
            (log.message?.message || log.message);
          console.error(message);
          showToast(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    // showToast(Locale.PricingPage.ConsultAdministrator);
  }

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {pricingPageTitle || "购买套餐"}
          </div>
          <div className="window-header-sub-title">
            {pricingPageSubTitle || "畅享与AI聊天的乐趣"}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.PricingPage.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["pricing"]}>
        {loading ? (
          <div style={{ height: "100px", textAlign: "center" }}>
            {Locale.PricingPage.Loading}
          </div>
        ) : (
          <></>
        )}
        {!loading && isTokenValid === "invalid" && (
          <div style={{ height: "100px", textAlign: "center" }}>
            <a
              href="javascript:void(0)"
              onClick={() => {
                navigate(Path.Login);
              }}
            >
              {Locale.PricingPage.PleaseLogin}
            </a>
          </div>
        )}
        {!loading &&
        !(isTokenValid === "invalid") &&
        (!packages || packages.length === 0) ? (
          <div style={{ height: "100px", textAlign: "center" }}>
            {Locale.PricingPage.NoPackage}
          </div>
        ) : (
          <></>
        )}
        {packages.map((item) => {
          return (
            <List key={item.uuid}>
              <DangerousListItem title={item.title} subTitle={item.subTitle}>
                <div style={{ minWidth: "100px" }}>
                  <div
                    style={{
                      margin: "10px",
                      fontSize: "24px",
                      textAlign: "center",
                    }}
                  >
                    ￥{item.price}
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <IconButton
                      text={Locale.PricingPage.Actions.Buy}
                      type="primary"
                      block={true}
                      disabled={loading}
                      onClick={() => {
                        handleClickBuy(item);
                      }}
                    />
                  </div>
                </div>
              </DangerousListItem>
            </List>
          );
        })}

        <List>
          <ListItem>
            <IconButton
              text={Locale.PricingPage.Actions.Order}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Order);
              }}
            />
          </ListItem>
          <ListItem>
            <IconButton
              text={Locale.PricingPage.Actions.RedeemCode}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.RedeemCode);
              }}
            />
          </ListItem>
        </List>
      </div>

      {goToPayModelShow && (
        <GoToPayModel
          title={"前往支付"}
          wechatCodeUrl={wechatCodeUrl}
          onClose={() => setGoToPayModelShow(false)}
        />
      )}
    </ErrorBoundary>
  );
}
