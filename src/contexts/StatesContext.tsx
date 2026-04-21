import { getRequest, postRequest, BASE_URL } from "@/utils/fetch-function";
import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

import { v4 as uuidv4 } from "uuid";

type Nullable<T> = T | null;

type NetworkState = {
  network: string;
  networkPassphrase: string;
};

type StatesContextType = {
  BASE_URL: string;
  accessToken: Nullable<string>;
  setAccessToken: Dispatch<SetStateAction<Nullable<string>>>;
  formatDate: (dateString: string) => string;
  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  updateData: string;
  setUpdateData: Dispatch<SetStateAction<string>>;
  refresh: string;
  setRefresh: Dispatch<SetStateAction<string>>;
  postRequest: typeof postRequest;
  getRequest: typeof getRequest;
  userKey: string;
  setUserKey: Dispatch<SetStateAction<string>>;
  triggerUpdate: () => void;
  expiryDate: string;
  setExpiryDate: Dispatch<SetStateAction<string>>;
  formatDateTime: (dateTimeString: string) => string;
  capitalize: (str: string) => string;
  formatUtcToLocalTime: (utcString: string) => string;
  isEnabled: boolean;
  setIsEnabled: Dispatch<SetStateAction<boolean>>;
  downloadPayments: () => void;
  maskKey: (
    key: string,
    start?: number,
    end?: number,
    maskLength?: number | null
  ) => string;
  walletKitIsOpen: boolean;
  setWalletKitIsOpen: Dispatch<SetStateAction<boolean>>;
  network: NetworkState | null;
  setNetwork: Dispatch<SetStateAction<NetworkState | null>>;
  connecting: boolean;
  setConnecting: Dispatch<SetStateAction<boolean>>;
  loadedContractId: string;
  setLoadedContractId: Dispatch<SetStateAction<string>>;
  contractOperations: any;
  setContractOperations: Dispatch<SetStateAction<any>>;
  contractAddr: string;
  setContractAddr: Dispatch<SetStateAction<string>>;
  assetOperation: string;
  setAssetOperation: Dispatch<SetStateAction<string>>;
  walletApp: string;
  setWalletApp: Dispatch<SetStateAction<string>>;
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  BASE_FEE: string;
  showOutputModal: boolean;
  setShowOutputModal: Dispatch<SetStateAction<boolean>>;
  outputs: any;
  setOutputs: Dispatch<SetStateAction<any>>;
};

type Props = {
  children: ReactNode;
};

const StatesContext = createContext<StatesContextType | undefined>(undefined);

export function StatesProvider({ children }: Props) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<string>("");
  const [refresh, setRefresh] = useState<string>("");

  const [userKey, setUserKey] = useState<string>("");

  const [expiryDate, setExpiryDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const [walletKitIsOpen, setWalletKitIsOpen] = useState<boolean>(false);

  const [network, setNetwork] = useState<NetworkState | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  const [loadedContractId, setLoadedContractId] = useState<string>("");
  const [contractOperations, setContractOperations] = useState<any>(null);
  const [contractAddr, setContractAddr] = useState<string>("");

  const [assetOperation, setAssetOperation] = useState<string>("trustline");
  const [walletApp, setWalletApp] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<string>("interact");

  const [outputs, setOutputs] = useState<any>(null);
  const [showOutputModal, setShowOutputModal] = useState<boolean>(false);

  const BASE_FEE = "1000000";

  const triggerUpdate = () => {
    setUpdateData(uuidv4());
  };

  const capitalize = (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    return `${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function formatUtcToLocalTime(utcString: string): string {
    const date = new Date(utcString);
    if (Number.isNaN(date.getTime())) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");

    const month = date.toLocaleString("en-US", { month: "short" });

    return `${hours}:${mins}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
  }

  function formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    if (Number.isNaN(date.getTime())) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${mins}, ${date.getDate()} ${date.toLocaleString(
      "default",
      {
        month: "long",
      }
    )}, ${date.getFullYear()}`;
  }

  function maskKey(
    key: string,
    start = 10,
    end = 10,
    maskLength: number | null = null
  ): string {
    if (!key) return "";

    if (key.length <= start + end) return key;

    const prefix = key.slice(0, start);
    const suffix = key.slice(-end);

    let hidden = key.length - start - end;
    if (maskLength !== null) hidden = Math.max(0, maskLength);

    return `${prefix}${"*".repeat(hidden)}${suffix}`;
  }

  const downloadPayments = () => {
    // intentionally minimal (no payments state in this version)
    console.warn("No payments data available");
  };

  return (
    <StatesContext.Provider
      value={{
        BASE_URL,
        accessToken,
        setAccessToken,
        formatDate,
        isFetching,
        setIsFetching,
        updateData,
        setUpdateData,
        refresh,
        setRefresh,
        postRequest,
        getRequest,
        userKey,
        setUserKey,
        triggerUpdate,
        expiryDate,
        setExpiryDate,
        formatDateTime,
        capitalize,
        formatUtcToLocalTime,
        isEnabled,
        setIsEnabled,
        downloadPayments,
        maskKey,
        walletKitIsOpen,
        setWalletKitIsOpen,
        network,
        setNetwork,
        connecting,
        setConnecting,
        loadedContractId,
        setLoadedContractId,
        contractOperations,
        setContractOperations,
        contractAddr,
        setContractAddr,
        assetOperation,
        setAssetOperation,
        walletApp,
        setWalletApp,
        selectedTab,
        setSelectedTab,
        BASE_FEE,
        showOutputModal,
        setShowOutputModal,
        outputs,
        setOutputs,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
}

export function useStates(): StatesContextType {
  const context = useContext(StatesContext);

  if (!context) {
    throw new Error("useStates must be used within StatesProvider");
  }

  return context;
}
