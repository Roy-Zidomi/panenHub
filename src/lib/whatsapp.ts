export const createWhatsappLink = (order: any) => {
  const itemsText = order.items
    .map((i: any) => `${i.name} x${i.qty}`)
    .join("\n");

  const message = `\nNew Order\n\nName: ${order.name}\nPhone: ${order.phone}\nAddress: ${order.address}\n\nItems:\n${itemsText}\n\nTotal: Rp${order.total}\n`;

  // User-provided target number: 088262668629 -> international format: 6288262668629
  const adminNumber = "6288262668629";

  return `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
};
