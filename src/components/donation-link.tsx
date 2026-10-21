import { Heart } from "lucide-react";
import { donationUrl } from "@/lib/funding";

export function DonationLink() {
  return (
    <a href={donationUrl} className="button-secondary">
      <Heart size={16} aria-hidden="true" />
      Donate via PayPal <span aria-hidden="true">↗</span>
    </a>
  );
}
