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
    monthly: 51400,
    installation: 120000,
    speed: "Up to 45Mbps",
    devices: "17+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Plus",
    monthly: 93100,
    installation: 120000,
    speed: "Up to 60Mbps",
    devices: "20+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Topaz",
    monthly: 138300,
    installation: 120000,
    speed: "Up to 75Mbps",
    devices: "25+ devices",
    data: "Unlimited Data"
  },
  {
    name: "SME Diamond",
    monthly: 175000,
    installation: 120000,
    speed: "Up to 100Mbps",
    devices: "30+ devices",
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
