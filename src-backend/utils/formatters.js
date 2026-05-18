function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return "Not specified";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long"
  }).format(new Date(value));
}

module.exports = {
  formatCurrency,
  formatDate
};
