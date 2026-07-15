/**
 * Bhaama Veedhi — shared helpers
 */

/** Format a number (paise-free rupees) as Indian currency: Rs. 12,499 */
export function formatINR(amount: number): string {
  return "Rs. " + new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** WhatsApp phone number (international format, no +) */
export const WHATSAPP_NUMBER = "917337231094";

export const BRAND = {
  name: "Bhaama Veedhi",
  tagline: "Every woman deserves a little sparkle in her everyday story ✨",
  email: "bhaamaveedhi@gmail.com",
  phone: "+91 7337231094",
  whatsapp: "917337231094",
  instagram: "https://www.instagram.com/bhaama_veedhi?igsh=bXY3czU2MzQxaWx2",
};

/** Build the WhatsApp checkout URL with an order message */
export function buildWhatsAppCheckoutUrl(items: {
  title: string;
  quantity: number;
  price: number;
}[], total: number): string {
  const lines = items
    .map(
      (it, i) =>
        `${i + 1}. ${it.title} - Quantity: ${it.quantity} - Price: ${formatINR(
          it.price
        )}`
    )
    .join("\n");

  const message = `Hello Bhaama Veedhi! ✨ I would like to place an order for the following items:

${lines}

Total Amount: ${formatINR(total)}
Please let me know the payment and delivery details!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
