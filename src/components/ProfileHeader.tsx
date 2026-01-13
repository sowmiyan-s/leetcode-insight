import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  username: string;
  avatar: string;
  realName?: string;
  location?: string;
  aboutMe?: string;
  totalSolved: number;
}

export const ProfileHeader = ({ username, avatar, realName, location, aboutMe, totalSolved }: ProfileHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
            <img
              src={avatar}
              alt={username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${username}`;
              }}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-background">
            <span className="text-xs font-bold text-white">LC</span>
          </div>
        </motion.div>

        {/* Total Solved Highlight (New) */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex flex-col items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/20 absolute right-8 top-1/2 -translate-y-1/2"
        >
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Total Solved</span>
          <span className="text-4xl font-black text-foreground">{totalSolved}</span>
        </motion.div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold mb-1"
          >
            {realName || username}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-primary font-mono text-lg mb-2"
          >
            @{username}
          </motion.p>

          {location && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-sm mb-3"
            >
              📍 {location}
            </motion.p>
          )}

          {aboutMe && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-muted-foreground text-sm max-w-xl line-clamp-2"
            >
              {aboutMe}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4"
          >
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a
                href={`https://leetcode.com/u/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                View on LeetCode
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
