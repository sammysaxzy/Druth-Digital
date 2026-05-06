export const residentialPlans = [
  {
    name: "Bronze Home",
    monthly: 21150,
    installation: 35000,
    speed: " Up To 20 Mbps",
    devices: "5+ devices",
    data: "Unlimited"
  },
  {
    name: "Silver Home",
    monthly: 26350,
    installation: 35000,
    speed: "Up To 25 Mbps",
    devices: "7+ devices",
    data: "Unlimited"
  },
  {
    name: "Gold Home",
    monthly: 42150,
    installation: 35000,
    speed: "Up To 40 Mbps",
    devices: "12+ devices",
    data: "Unlimited"
  },
  {
    name: "Platinum Home",
    monthly: 53300,
    installation: 35000,
    speed: "Up To 80 Mbps",
    devices: "15+ devices",
    data: "Unlimited"
  }
];

export const smePlans = [
  {
    name: "SME Silver",
    monthly: 45500,
    installation: 120000,
    speed: "Up To 20 Mbps",
    devices: "5+ devices",
    data: "Unlimited"
  },
  {
    name: "SME Topaz",
    monthly: 82500,
    installation: 120000,
    speed: "Up To 40 Mbps",
    devices: "7+ devices",
    data: "Unlimited"
  },
  {
    name: "SME Plus",
    monthly: 122500,
    installation: 120000,
    speed: "Up To 60 Mbps",
    devices: "12+ devices",
    data: "Unlimited"
  },
  {
    name: "SME Diamond",
    monthly: 155075,
    installation: 120000,
    speed: "Up To 75 Mbps",
    devices: "15+ devices",
    data: "Unlimited"
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

