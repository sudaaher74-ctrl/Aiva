"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function AiFloatingButton() {
  const pathname = usePathname();

  // Don't show on AI Chat page itself
  if (pathname === '/ai-chat') return null;

  return (
    <Link href="/chatbot">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#c5a059] to-[#d4b982] text-zinc-950 font-bold text-sm shadow-xl shadow-[#c5a059]/25 cursor-pointer hover:shadow-[#c5a059]/40 transition-shadow"
      >
        <Sparkles className="h-5 w-5" />
        <span className="hidden sm:inline">Ask AI</span>
      </motion.div>
    </Link>
  );
}
