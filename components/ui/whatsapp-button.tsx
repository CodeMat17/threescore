"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hello! I'm interested in your services.",
}: WhatsAppButtonProps) {
  const handleClick = () => {
    // Remove all non-numeric characters and the + sign for WhatsApp URL
    const formattedPhone = phoneNumber.replace(/\D/g, "");

    // Try multiple approaches
    const approaches = [
      // Approach 1: Simple encoded message
      `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`,
      // Approach 2: API format
      `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`,
      // Approach 3: Manual encoding
      `https://wa.me/${formattedPhone}?text=${message.replace(/ /g, "%20").replace(/\?/g, "%3F")}`,
      // Approach 4: Just the phone number (fallback)
      `https://wa.me/${formattedPhone}`,
    ];

    console.log("Trying WhatsApp approaches:");
    approaches.forEach((url, index) => {
      console.log(`Approach ${index + 1}:`, url);
    });

    // Try the first approach
    const whatsappUrl = approaches[0];
    console.log("Using:", whatsappUrl);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 active:scale-95 md:bottom-8 md:right-8'
      aria-label='Chat with us on WhatsApp'
      title='Chat with us on WhatsApp'>
      <MessageCircle className='h-6 w-6 text-white' />
    </button>
  );
}
