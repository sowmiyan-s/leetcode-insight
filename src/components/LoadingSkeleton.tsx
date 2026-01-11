import { motion } from 'framer-motion';

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 py-8">
      {/* Profile Header Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl animate-shimmer" />
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="h-8 w-48 mx-auto md:mx-0 rounded animate-shimmer" />
            <div className="h-5 w-32 mx-auto md:mx-0 rounded animate-shimmer" />
            <div className="h-4 w-24 mx-auto md:mx-0 rounded animate-shimmer" />
          </div>
        </div>
      </motion.div>

      {/* Score Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full animate-shimmer" />
              <div className="space-y-2">
                <div className="h-5 w-24 rounded animate-shimmer" />
                <div className="h-4 w-32 rounded animate-shimmer" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 w-16 rounded animate-shimmer" />
                <div className="h-6 w-12 rounded animate-shimmer" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 h-80"
        >
          <div className="h-6 w-32 rounded animate-shimmer mb-4" />
          <div className="flex items-center justify-center h-56">
            <div className="w-48 h-48 rounded-full animate-shimmer" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 h-80"
        >
          <div className="h-6 w-40 rounded animate-shimmer mb-4" />
          <div className="space-y-4 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full animate-shimmer" />
                <div className="flex-1 h-4 rounded animate-shimmer" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
