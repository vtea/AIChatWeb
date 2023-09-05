import { SubmitKey } from "../store/config";
import { LocaleType } from "./index";

const en: LocaleType = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized:
      "Unauthorized access, please enter access code in settings page.",
    Login: "You are already logged in, please click the Retry button below.",
  },
  Auth: {
    Title: "Need Access Code",
    Tips: "Please enter access code below",
    Input: "access code",
    Confirm: "Confirm",
    Later: "Later",
  },
  Sidebar: {
    Title: "Notice",
    Close: "Close",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages`,
    Actions: {
      ChatList: "Go To Chat List",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Pin: "Pin",
      PinToastContent: "Pinned 2 messages to contextual prompts",
      PinToastAction: "View",
      Delete: "Delete",
      Edit: "Edit",
    },
    Commands: {
      new: "Start a new chat",
      newm: "Start a new chat with mask",
      next: "Next Chat",
      prev: "Previous Chat",
      clear: "Clear Context",
      del: "Delete Chat",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "To Latest",
      Theme: {
        auto: "Auto",
        light: "Light Theme",
        dark: "Dark Theme",
      },
      Prompt: "Prompts",
      Masks: "Masks",
      Clear: "Clear Context",
      Settings: "Settings",
      Internet: "Access Internet",
    },
    TooFrequently: "You're sending too fast. Please try again later.",
    Rename: "Rename Chat",
    Typing: "Typing…",
    SensitiveWordsTip: (question: string) =>
      `您的提问中包含敏感词：${question}`,
    BalanceNotEnough: "您的额度不足，请联系管理员",
    Input: (submitKey: string, action: string, append?: boolean) => {
      var inputHints = `${submitKey} to ${action}`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return (
        inputHints + (append ? ", / to search prompts, : to use commands" : "")
      );
    },
    Send: "Send",
    Draw: "Draw",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
  },
  Midjourney: {
    SelectImgMax: (max: number) => `Select up to ${max} images`,
    InputDisabled: "Input is disabled in this mode",
    HasImgTip:
      "Tip: In the mask mode, only the first image will be used. In the blend mode, the five selected images will be used in order (click the image to remove it)",
    ModeImagineUseImg: "Mask Mode",
    ModeBlend: "Blend Mode",
    ModeDescribe: "Describe Mode",
    NeedInputUseImgPrompt:
      'You need to enter content to use the image in the mask mode, please enter the content starting with "/mj"',
    BlendMinImg: (min: number, max: number) =>
      `At least ${min} images are required in the mixed image mode, and up to ${max} images are required`,
    TaskErrUnknownType: "Task submission failed: unknown task type",
    TaskErrNotSupportType: (type: string) =>
      `Task submission failed: unsupported task type -> ${type}`,
    StatusCode: (code: number) => `Status code: ${code}`,
    TaskSubmitErr: (err: string) => `Task submission failed: ${err}`,
    RespBody: (body: string) => `Response body: ${body}`,
    None: "None",
    UnknownError: "Unknown error",
    UnknownReason: "Unknown reason",
    TaskPrefix: (prompt: string, taskId: string) =>
      `**Prompt:** ${prompt}\n**Task ID:** ${taskId}\n`,
    PleaseWait: "Please wait a moment",
    TaskSubmitOk: "Task submitted successfully",
    TaskStatusFetchFail: "Failed to get task status",
    TaskStatus: "Task status",
    TaskRemoteSubmit: "Task has been submitted to Midjourney server",
    TaskProgressTip: (progress: number | undefined) =>
      `Task is running${progress ? `, current progress: ${progress}%` : ""}`,
    TaskNotStart: "Task has not started",
    Url: "URL",
    SettingProxyCoverTip:
      "The MidjourneyProxy address defined here will override the MIDJOURNEY_PROXY_URL in the environment variables",
    ImageAgent: "Image Agent",
    ImageAgentOpenTip:
      "After turning it on, the returned Midjourney image will be proxied by this program itself, so this program needs to be in a network environment that can access cdn.discordapp.com to be effective",
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in mask or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
    NoNotice: "No announcements",
  },
  LoginPage: {
    Title: "Sign in",
    SubTitle: "Log in to communicate",
    Username: {
      Title: "Username or Email",
      SubTitle: "",
      Placeholder: "Please enter your username or email address",
    },
    Password: {
      Title: "Password",
      SubTitle: "",
      Placeholder: "Please enter your password",
    },
    Actions: {
      Close: "Close",
      Login: "Login",
      Logout: "Logout",
    },
    Toast: {
      Success: "Login Success",
      Logining: "Signing in……",
      EmptyUserName: "Username or email address cannot be empty",
      EmptyPassword: "Password cannot be null！",
    },
    GoToRegister: "Go to Register",
    ForgetPassword: "Forgot / Reset Password",
  },
  RegisterPage: {
    Title: "Register",
    SubTitle: "",
    Name: {
      Title: "Name",
      SubTitle: "",
      Placeholder: "",
    },
    Email: {
      Title: "Email",
      SubTitle: "",
      Placeholder: "",
    },
    EmailCode: {
      Title: "Code",
      SubTitle: "EmailCode",
      Placeholder: "",
    },
    Phone: {
      Title: "Mobile number",
      SubTitle: "Phone number",
      Placeholder: "",
    },
    PhoneCode: {
      Title: "PhoneCode",
      SubTitle: "",
      Placeholder: "SMS Code",
    },
    Username: {
      Title: "Username",
      SubTitle: "",
      Placeholder: "",
    },
    Password: {
      Title: "Password",
      SubTitle: "",
      Placeholder: "",
    },
    ConfirmedPassword: {
      Title: "ConfirmedPassword",
      SubTitle: "",
      Placeholder: "",
    },
    Actions: {
      Close: "Close",
    },
    Toast: {
      Success: "Registration successful, jumping now……",
      Registering: "Registering……",
      Failed: "Registration Failure！",
      FailedWithReason: "Registration failed! Reason：",
      PasswordNotTheSame: "Inconsistent passwords entered twice！",
      PasswordEmpty: "Password cannot be null！",
      SendEmailCode: "Send CAPTCHA",
      EmailCodeSending: "Verification Code Sending",
      EmailCodeSent: "Verification code sent",
      EmailIsEmpty: "Please enter your e-mail address",
      EmailCodeSentFrequently: "Sent too often, please try again later",
      EmailFormatError: "Incorrect e-mail format",
      EmailCodeEmpty: "Please enter your email verification code",
      EmailExistsError: "This email address is registered",
      SendPhoneCode: "Send SMS code",
      PhoneCodeSending: "Verification Code Sending",
      PhoneCodeSent: "Verification code sent",
      PhoneIsEmpty: "Please enter your phone number",
      PhoneCodeSentFrequently: "Sent too often, please try again later",
      PhoneFormatError: "Incorrect cell phone number format",
      PhoneCodeEmpty: "Please enter the SMS code",
      PhoneExistsError: "This phone number is registered",
    },
    GoToLogin: "Go to Login",
    Captcha: "",
    CaptchaTitle: "Click to Refresh Captcha",
    CaptchaIsEmpty: "Please enter the graphic code",
    CaptchaLengthError: "Incorrect length of graphic captcha",
    CaptchaInput: {
      Title: "CAPTCHA",
      SubTitle: "",
      Placeholder: "Please enter the verification code in the picture",
    },
  },
  ForgetPasswordPage: {
    Title: "Reset Password",
    SubTitle: "",
    Toast: {
      PasswordResetting: "Reset Password in",
      PasswordResetFailed: "Reset password failed！",
      PasswordResetSuccess: "Reset successful. Jumping now.……",
      PasswordResetFailedWithReason: "Reset failed! Reason：",
    },
    Actions: {
      Close: "Close",
    },
  },
  Profile: {
    Title: "User Center",
    SubTitle: "User Center",
    Username: "Username",
    Email: "Email",
    Phone: "Phone",
    InviteCode: {
      Title: "InviteCode",
      TitleRequired: "",
      Placeholder: "Placeholder",
    },
    Tokens: {
      Title: "tokens",
      SubTitle: "tokens Count",
    },
    ChatCount: {
      Title: "Chat Count",
      SubTitle: "",
    },
    AdvanceChatCount: {
      Title: "Advance Chat Count",
      SubTitle: "",
    },
    DrawCount: {
      Title: "DrawCount",
      SubTitle: "DrawCount",
    },
    Actions: {
      Close: "Close",
      Pricing: "Pricing",
      Order: "Order",
      GoToBalanceList: "More",
      ConsultAdministrator: "Consult Administrator",
      All: "所有套餐",
      CreateInviteCode: "Create Invite Code",
      Copy: "Copy Url",
      Redeem: "Redeem",
    },
    BalanceItem: {
      Title: "Package Type",
      SubTitle: "",
      CalcTypes: {
        Total: "Total",
        Daily: "Daily",
        Hourly: "Hourly",
        ThreeHourly: "Every 3 hours",
      },
    },
    ExpireList: {
      Title: "Expiry date",
      SubTitle: "",
    },
  },
  RedeemCodePage: {
    Title: "RedeemCode",
    RedeemCodeInput: {
      Title: "RedeemCode",
      Placeholder: "Placeholder",
    },
    Actions: {
      Close: "Close",
      Redeem: "Redeem",
    },
  },
  PricingPage: {
    Title: "Pricing",
    SubTitle: "",
    Actions: {
      Close: "Close",
      Buy: " Buy ",
      Order: "Order",
      RedeemCode: "RedeemCode",
    },
    NoPackage: "NO Package",
    Loading: "Loading……",
    PleaseLogin: "Please Login",
    ConsultAdministrator: "Contact Administrator",
    BuyFailedCause: "Buy Failed Cause：",
    TOO_FREQUENCILY: "TOO FREQUENCILY",
    CREATE_ORDER_FAILED: "CREATE ORDER FAILED",
  },
  PayPage: {
    PaidSuccess: "Paid Success",
    Actions: {
      Close: "Close",
    },
  },
  BalancePage: {
    Title: "Purchased Package",
    NoBalance: "No Balance",
    Loading: "Loading……",
    Actions: {
      Close: "Close",
      Pricing: "Pricing",
      Order: "Order",
      Profile: "User Center",
      Refresh: "Refresh",
      Refreshing: "Refreshing……",
      RedeemCode: "RedeemCode",
    },
  },
  OrderPage: {
    Title: "Order Center",
    NoOrder: "No Order",
    Loading: "Loadin……",
    StateError: "StateError！",
    CancelFailedForStateError: "Cancel Failed For State Error",
    CancelSuccess: "Cancel Success",
    CancelFailure: "Cancel Failure",
    TryAgainLaster: "Try Again Laster",
    PleaseWaitForDataSync:
      "Data may be delayed, please check the order status after 10 minutes of successful payment, please do not repeat payment",
    Actions: {
      Pay: "Pay",
      Cancel: "Cancel",
      Pricing: "Pricing",
      Profile: "User Center",
      Copy: "Copy",
      Refresh: "Refresh",
      Refreshing: "Refreshing……",
    },
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    Danger: {
      Reset: {
        Title: "Reset All Settings",
        SubTitle: "Reset all setting items to default",
        Action: "Reset",
        Confirm: "Confirm to reset all settings to default?",
      },
      Clear: {
        Title: "Clear All Data",
        SubTitle: "Clear all messages and settings",
        Action: "Clear",
        Confirm: "Confirm to clear all messages and settings?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },

    InputTemplate: {
      Title: "Input Template",
      SubTitle: "Newest message will be filled to this template",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    Mask: {
      Title: "Mask Splash Screen",
      SubTitle: "Show a mask splash screen before starting new chat",
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },
    Token: {
      Title: "API Key",
      SubTitle: "Use your key to ignore access code limit",
      Placeholder: "OpenAI API Key",
    },
    Usage: {
      Title: "Account Balance",
      SubTitle(used: any, total: any) {
        return `Used this month $${used}, subscription $${total}`;
      },
      IsChecking: "Checking...",
      Check: "Check",
      NoAccess: "Enter API Key to check balance",
    },
    AccessCode: {
      Title: "Access Code",
      SubTitle: "Access control enabled",
      Placeholder: "Need Access Code",
    },
    Endpoint: {
      Title: "Endpoint",
      SubTitle: "Custom endpoint must start with http(s)://",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
    FrequencyPenalty: {
      Title: "Frequency Penalty",
      SubTitle:
        "A larger value decreasing the likelihood to repeat the same line",
    },
    Version: {
      Title: "Ver",
      SubTitle: "",
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Contextual and Memory Prompts",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },
  Plugin: {
    Name: "Plugin",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Just Start",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  Exporter: {
    Model: "Model",
    Messages: "Messages",
    Topic: "Topic",
    Time: "Time",
  },
};

export default en;
