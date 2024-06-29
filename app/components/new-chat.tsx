import { useEffect, useRef, useState } from "react";
import { Path, SlotID } from "../constant";
import { IconButton } from "./button";
import { EmojiAvatar } from "./emoji";
import styles from "./new-chat.module.scss";

import LeftIcon from "../icons/left.svg";
import LightningIcon from "../icons/lightning.svg";
import EyeIcon from "../icons/eye.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { RemoteMask, Mask, useMaskStore } from "../store/mask";
import Locale, { Lang } from "../locales";
import {
  ModelConfig,
  useAppConfig,
  useAuthStore,
  useChatStore,
  useWebsiteConfigStore,
} from "../store";
import { MaskAvatar } from "./mask";
import { useCommand } from "../command";
import { showConfirm } from "./ui-lib";
import { BUILTIN_MASK_STORE } from "../masks";

function getIntersectionArea(aRect: DOMRect, bRect: DOMRect) {
  const xmin = Math.max(aRect.x, bRect.x);
  const xmax = Math.min(aRect.x + aRect.width, bRect.x + bRect.width);
  const ymin = Math.max(aRect.y, bRect.y);
  const ymax = Math.min(aRect.y + aRect.height, bRect.y + bRect.height);
  const width = xmax - xmin;
  const height = ymax - ymin;
  const intersectionArea = width < 0 || height < 0 ? 0 : width * height;
  return intersectionArea;
}

function MaskItem(props: { mask: RemoteMask; onClick?: () => void }) {
  return (
    <div className={styles["mask"]} onClick={props.onClick}>
      <MaskAvatar mask={props.mask} />
      <div
        className={
          styles["mask-name"] +
          " one-line " +
          (props.mask.state === 0 ? styles["mask-gray"] : "")
        }
      >
        {props.mask.name}
      </div>
    </div>
  );
}

function useMaskGroup(masks: RemoteMask[] | Mask[]) {
  const [groups, setGroups] = useState<RemoteMask[][] | Mask[][]>([]);

  useEffect(() => {
    const computeGroup = () => {
      const appBody = document.getElementById(SlotID.AppBody);
      if (!appBody || masks.length === 0) return;

      const rect = appBody.getBoundingClientRect();
      const maxWidth = rect.width;
      const maxHeight = rect.height * 0.6;
      const maskItemWidth = 120;
      const maskItemHeight = 50;

      const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
      let maskIndex = 0;
      const nextMask = () => masks[maskIndex++ % masks.length];

      const rows = Math.ceil(maxHeight / maskItemHeight);
      const cols = Math.ceil(maxWidth / maskItemWidth);

      const newGroups = new Array(rows)
        .fill(0)
        .map((_, _i) =>
          new Array(cols)
            .fill(0)
            .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
        );
      setGroups(newGroups);
    };

    computeGroup();

    window.addEventListener("resize", computeGroup);
    return () => window.removeEventListener("resize", computeGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masks]);

  return groups;
}

function useMaskTypes(masks: RemoteMask[] | Mask[]) {
  const [maskTypes, setMaskTypes] = useState<string[]>([]);
  useEffect(() => {
    const newTypes = [] as string[];
    masks.forEach((mask) => {
      if (mask.type !== "") {
        if (mask.type && !newTypes.includes(mask.type)) {
          newTypes.push(mask.type);
        }
      }
    });
    newTypes.splice(0, 0, "全部");
    // newTypes.push('其他')
    console.log("newTypes", newTypes);
    setMaskTypes(newTypes);
  }, [masks]);
  return maskTypes;
}

export function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();
  const authStore = useAuthStore();
  const assistants = useWebsiteConfigStore().assistants;

  let [masks, setMasks] = useState<RemoteMask[] | Mask[]>([]);
  const maskTypes = useMaskTypes(masks);
  const [hotType, setHotType] = useState("全部");
  const [showMasks, setShowMasks] = useState<RemoteMask[] | Mask[]>([]);
  const groups = useMaskGroup(showMasks);
  useEffect(() => {
    maskStore.fetch(authStore.token).then((remoteMasks) => {
      if (remoteMasks.length === 0) {
        setMasks(maskStore.getAll());
      } else {
        setMasks(remoteMasks);
      }
    });
  }, [maskStore, authStore.token]);
  useEffect(() => {
    setShowMasks(
      masks.filter(
        (m) =>
          hotType === "全部" ||
          m.type === hotType ||
          (hotType === "其他" && (m.type === null || m.type === "")),
      ),
    );
  }, [hotType, masks]);

  const navigate = useNavigate();
  const config = useAppConfig();

  const maskRef = useRef<HTMLDivElement>(null);

  const { state } = useLocation();

  const [starting, setStarting] = useState(false);

  const startChat = (mask?: Mask | RemoteMask) => {
    setTimeout(async () => {
      setStarting(true);
      const result = await chatStore.newSession(
        authStore.token,
        () => {
          authStore.logout();
          navigate(Path.Login);
        },
        mask as Mask,
      );
      setStarting(false);
      if (result) {
        navigate(Path.Chat);
      }
    }, 10);
  };

  const startChatWithAssistant = (uuid: string) => {
    const assistant = assistants.find((a) => a.uuid === uuid);
    console.log("assistant", assistant);
    if (!assistant) {
      return;
    }
    setTimeout(async () => {
      setStarting(true);
      const result = await chatStore.newSession(
        authStore.token,
        () => {
          authStore.logout();
          navigate(Path.Login);
        },
        undefined,
        assistant,
      );
      setStarting(false);
      if (result) {
        navigate(Path.Chat);
      }
    }, 10);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(id) ?? BUILTIN_MASK_STORE.get(id);
        startChat(mask ?? undefined);
      } catch {
        console.error("[New Chat] failed to create chat from mask id=", id);
      }
    },
  });

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft =
        (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <div className={styles["new-chat"]}>
      <div className={styles["mask-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.NewChat.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
        {!state?.fromHome && (
          <IconButton
            text={Locale.NewChat.NotShow}
            onClick={async () => {
              if (await showConfirm(Locale.NewChat.ConfirmNoShow)) {
                startChat();
                config.update(
                  (config) => (config.dontShowMaskSplashScreen = true),
                );
              }
            }}
          ></IconButton>
        )}
      </div>
      <div className={styles["mask-cards"]}>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f606" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f916" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f479" size={24} />
        </div>
      </div>

      <div className={styles["title"]}>{Locale.NewChat.Title}</div>
      <div className={styles["sub-title"]}>{Locale.NewChat.SubTitle}</div>

      <div className={styles["actions"]}>
        <IconButton
          text={Locale.NewChat.More}
          onClick={() => navigate(Path.Masks)}
          icon={<EyeIcon />}
          disabled={starting}
          bordered
          shadow
        />

        <IconButton
          text={Locale.NewChat.Skip}
          onClick={() => startChat()}
          icon={<LightningIcon />}
          type="primary"
          disabled={starting}
          shadow
          className={styles["skip"]}
        />
      </div>

      {assistants && assistants.length > 0 && (
        <div className={styles["assistant-container"]} ref={maskRef}>
          <div className={styles["assistant-row"]}>
            <div className={styles["assistant-tip"]}>体验全新智能助手 →</div>
            {assistants
              .map((assistant) => {
                return {
                  id: assistant.uuid,
                  createdAt: 0,
                  avatar: "1f430",
                  name: assistant.name,
                  hideContext: true,
                  context: [],
                  modelConfig: {} as ModelConfig,
                  lang: "cn" as Lang,
                  builtin: true,
                } as Mask;
              })
              .map((assistant) => (
                <MaskItem
                  key={assistant.id}
                  mask={assistant}
                  onClick={() => startChatWithAssistant(assistant.id)}
                />
              ))}
          </div>
        </div>
      )}

      {maskTypes.length > 1 && (
        <div className={styles["mask-type-container"]}>
          <ul className={styles["mask-type-ul"]}>
            {maskTypes.map((mt) => {
              const active = hotType === mt;
              return (
                <li
                  key={mt}
                  className={
                    styles["mask-type-li"] +
                    " " +
                    styles["clickable"] +
                    " clickable " +
                    (active ? styles["active"] : "")
                  }
                  onClick={() => {
                    setHotType(mt);
                  }}
                >
                  {mt}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className={styles["masks"]} ref={maskRef}>
        {groups.map((masks, i) => (
          <div key={i} className={styles["mask-row"]}>
            {masks.map((mask, index) => (
              <MaskItem
                key={index}
                mask={mask}
                onClick={() => startChat(mask)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
