export function formatFileSize(size) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const sizes = ["B", "KB", "MB", "GB"];
  return `${(size / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export const getFormattedDate = (givenDate) => {
  const date = new Date(givenDate);
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return formattedDate;
};

export const getTimeInDays = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  return days;
};

const consensuses = {
  fendermint: "0",
};
const supplySources = {
  native: "0",
  cusdt: "0x4a8c75f0318C1D9Aeff3e9345f4BAcC78D6D6779",
};

const permissionModes = {
  collateral: "0",
  federated: "1",
  static: "2",
};

export const getSubnetParams = (subnet) => {
  const {
    route,
    chainId,
    consensus,
    supplySource,
    permissionMode,
    minActivationCollateral,
    minValidators,
    bottomUpCheckPeriod,
    ipcGateway = "0x6d25fbFac9e6215E03C687E54F7c74f489949EaF",
    activeValidatorsLimit,
    majorityPercentage,
    powerScale,
    subnetID,
  } = subnet;
  return [
    minActivationCollateral.toString(),
    minValidators.toString(),
    bottomUpCheckPeriod.toString(),
    ipcGateway,
    activeValidatorsLimit.toString(),
    majorityPercentage.toString(),
    consensuses[consensus.toLowerCase()],
    powerScale.toString(),
    permissionModes[permissionMode.toLowerCase()],
    [
      supplySources[supplySource.toLowerCase()],
      "0x0000000000000000000000000000000000000000",
    ],
    [chainId, [route]],
  ];
};
export function getKeyByValue(object, value) {
  return Object.entries(object).find(([key, val]) => val === value)?.[0];
}

export async function waitForSeconds(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}
