const pricingPlans = {
  residential: [
    {
      name: "Bronze",
      speed: "Up to 20Mbps",
      data: "Unlimited Data",
      monthlySubscription: 21500,
      installationFee: 70000,
      promoInstallationFee: 40000,
      devices: "5+ devices"
    },
    {
      name: "Silver",
      speed: "Up to 25Mbps",
      data: "Unlimited Data",
      monthlySubscription: 26900,
      installationFee: 70000,
      promoInstallationFee: 40000,
      devices: "7+ devices"
    },
    {
      name: "Gold",
      speed: "Up to 30Mbps",
      data: "Unlimited Data",
      monthlySubscription: 32300,
      installationFee: 70000,
      promoInstallationFee: 40000,
      devices: "10+ devices"
    },
    {
      name: "Platinum",
      speed: "Up to 40Mbps",
      data: "Unlimited Data",
      monthlySubscription: 48400,
      installationFee: 70000,
      promoInstallationFee: 40000,
      devices: "15+ devices"
    }
  ],
  sme: [
    {
      name: "SME Silver",
      speed: "Up to 20Mbps",
      data: "Unlimited Data",
      monthlySubscription: 45500,
      installationFee: 120000,
      devices: "5+ devices"
    },
    {
      name: "SME Plus",
      speed: "Up to 40Mbps",
      data: "Unlimited Data",
      monthlySubscription: 82500,
      installationFee: 120000,
      devices: "7+ devices"
    },
    {
      name: "SME Topaz",
      speed: "Up to 60Mbps",
      data: "Unlimited Data",
      monthlySubscription: 122500,
      installationFee: 120000,
      devices: "12+ devices"
    },
    {
      name: "SME Diamond",
      speed: "Up to 75Mbps",
      data: "Unlimited Data",
      monthlySubscription: 155075,
      installationFee: 120000,
      devices: "15+ devices"
    }
  ]
};

module.exports = {
  pricingPlans
};
