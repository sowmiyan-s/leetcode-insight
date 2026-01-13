import { motion } from 'framer-motion';
import { Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  username: string;
  overallScore: number;
}

export const ShareButtons = ({ username, overallScore }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('u', username);
    return url.toString();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `🎯 Just analyzed my LeetCode profile!\n\n` +
      `Overall Score: ${overallScore}/100\n\n` +
      `Check your profile: ${getShareUrl()}\n\n` +
      `#LeetCode #Coding #Programming`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(getShareUrl());
    const title = encodeURIComponent(`My LeetCode Profile Analysis - Score: ${overallScore}/100`);
    const summary = encodeURIComponent(
      `I analyzed my LeetCode profile and scored ${overallScore}/100! ` +
      `Check out this awesome LeetCode Profile Analyzer tool.`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-center gap-3"
    >
      <Button
        onClick={handleCopyLink}
        variant="outline"
        size="lg"
        className="gap-2"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-emerald-400" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="w-5 h-5" />
            Copy Link
          </>
        )}
      </Button>
      
      <Button
        onClick={handleShareTwitter}
        variant="outline"
        size="lg"
        className="gap-2 hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2]"
      >
        <Twitter className="w-5 h-5" />
        <span className="hidden sm:inline">Share on X</span>
      </Button>
      
      <Button
        onClick={handleShareLinkedIn}
        variant="outline"
        size="lg"
        className="gap-2 hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/50 hover:text-[#0A66C2]"
      >
        <Linkedin className="w-5 h-5" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
    </motion.div>
  );
};
