import { WhatsAppIcon } from "@/components/ui/icons";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

/**
 * Floating WhatsApp CTA.
 *
 * Now a plain anchor rendered on the server rather than a client component
 * with an `onClick` + `window.open` (which broke middle-click, "open in new
 * tab", and shipped JS for what is fundamentally a link). WhatsApp's brand
 * green is intentionally literal — it is their colour, not ours, so it stays
 * outside the theme tokens and is defined once here.
 */
export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your services.",
}: WhatsAppButtonProps) {
  const digits = phoneNumber.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      aria-label='Chat with us on WhatsApp'
      className='fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] active:scale-95 md:bottom-8 md:right-8'>
      <WhatsAppIcon className='size-7 text-white' />
    </a>
  );
}
