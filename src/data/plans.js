export const residentialPlans = [
  {
    name: "Bronze",
    monthly: 21500,
    installation: 70000,
    promoInstallation: 40000,
    speed: "Up to 20Mbps",
    devices: "5+ devices",
    data: "Unlimited Data"
  },
  {
    name: "Silver",
    monthly: 26900,
    installation: 70000,
    promoInstallation: 40000,
    speed: "Up to 25Mbps",
    devices: "7+ devices",
    data: "Unlimited Data"
  },
  {
    name: "Gold",
    monthly: 32300,
    installation: 70000,
    promoInstallation: 40000,
    speed: "Up to 30Mbps",
    devices: "10+ devices",
    data: "Unlimited Data"
  },
  {
    name: "Platinum",
    monthly: 48400,
    installation: 70000,
    promoInstallation: 40000,
    speed: "Up to 40Mbps",
    devices: "15+ devices",
    data: "Unlimited Data"
  }
];

export const smePlans = [
  {
    name: "SME Silver",
    monthly: 45500,
    installation: 120000,
    speed: "Up to 20Mbps",
    devices: "5+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Plus",
    monthly: 82500,
    installation: 120000,
    speed: "Up to 40Mbps",
    devices: "7+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Topaz",
    monthly: 122500,
    installation: 120000,
    speed: "Up to 60Mbps",
    devices: "12+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Diamond",
    monthly: 155075,
    installation: 120000,
    speed: "Up to 75Mbps",
    devices: "15+ devices",
    data: "Unlimited Data"
  }
];

export const broadbandPlans = {
  residential: {
    label: "Residential",
    plans: residentialPlans
  },
  sme: {
    label: "SME",
    plans: smePlans
  }
};
