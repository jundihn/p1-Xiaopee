function format_currency(value) {
  return value.toLocaleString("id-ID", { style: "currency", currency:"IDR"});
}

module.exports = {format_currency}