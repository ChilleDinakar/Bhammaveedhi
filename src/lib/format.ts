/**
 * Bhaama Veedhi — shared helpers
 */

/** Format a number (paise-free rupees) as Indian currency: ₹12,499 */
export function formatINR(amount: number): string {
  return "₹" + new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}

/** WhatsApp phone number (international format, no +) */
export const WHATSAPP_NUMBER = "917337231094";

export const BRAND = {
  name: "Bhaama Veedhi",
  subtitle: "STYLED FOR EVERY BHAAMA",
  tagline: "Everyday Elegance, Made for You.",
  quote: "A little love, a little sparkle & a whole lot of pretty ✨🤍",
  email: "bhaamaveedhi@gmail.com",
  phone: "+91 7337231094",
  whatsapp: "917337231094",
  instagram: "https://www.instagram.com/bhaama_veedhi?igsh=bXY3czU2MzQxaWx2",
  instagramHandle: "@bhaama_veedhi",
};

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export type DeliveryAddress = {
  fullName: string;
  phone: string;
  altPhone?: string;
  pincode: string;
  houseDetails: string; // Flat, House no., Building / Apartment name
  streetArea: string; // Street, Sector, Area, Colony
  landmark?: string; // Landmark for delivery boy
  city: string; // Town / City / District
  state: string; // State
  addressType: "Home" | "Work";
};

/** Build the WhatsApp checkout URL with structured items, pricing, and complete delivery address */
export function buildWhatsAppCheckoutUrl(
  items: {
    title: string;
    quantity: number;
    price: number;
  }[],
  total: number,
  address?: DeliveryAddress
): string {
  const lines = items
    .map(
      (it, i) =>
        `${i + 1}. *${it.title}* × ${it.quantity} — ${formatINR(it.price)}`
    )
    .join("\n");

  const shippingText =
    total >= 499 ? "FREE (Orders above ₹499)" : "₹60 (Standard Shipping)";
  const finalTotal = total >= 499 ? total : total + 60;

  let addressBlock = "";
  if (address) {
    const altPhoneStr = address.altPhone ? ` (Alt: +91 ${address.altPhone})` : "";
    const landmarkStr = address.landmark
      ? `\n📍 *Landmark:* ${address.landmark}`
      : "";

    addressBlock = `
━━━━━━━━━━━━━━━━━━━━━━
📍 *DELIVERY ADDRESS:*
👤 *Recipient:* ${address.fullName}
📞 *Mobile:* +91 ${address.phone}${altPhoneStr}
🏠 *Address:* ${address.houseDetails}, ${address.streetArea}${landmarkStr}
🏙️ *City:* ${address.city}
🗺️ *State & Pincode:* ${address.state} — ${address.pincode}
🏷️ *Address Type:* ${address.addressType}`;
  }

  const message = `✨ *NEW ORDER — BHAAMA VEEDHI* ✨
━━━━━━━━━━━━━━━━━━━━━━
🛍️ *ITEMS IN CART:*
${lines}

💰 *Subtotal:* ${formatINR(total)}
🚚 *Shipping:* ${shippingText}
✨ *Total Amount:* ${formatINR(finalTotal)}
${addressBlock}
━━━━━━━━━━━━━━━━━━━━━━
Please confirm my order and share payment details (UPI / Bank Transfer). Thank you! ♡`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
