import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, WifiOff, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onTryExample?: (username: string) => void;
}

export const ErrorState = ({ error, onRetry, onTryExample }: ErrorStateProps) => {
  const getErrorDetails = () => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('not found') || lowerError.includes('user')) {
      return {
        icon: <UserX className="w-16 h-16 text-amber-400" />,
        title: 'User Not Found',
        message: "We couldn't find this LeetCode profile. Double-check the username or try one of our examples below.",
        showExamples: true,
      };
    }
    
    if (lowerError.includes('network') || lowerError.includes('fetch') || lowerError.includes('failed')) {
      return {
        icon: <WifiOff className="w-16 h-16 text-red-400" />,
        title: 'Connection Error',
        message: "Couldn't connect to LeetCode. Please check your internet connection and try again.",
        showExamples: false,
      };
    }
    
    if (lowerError.includes('rate') || lowerError.includes('limit') || lowerError.includes('too many')) {
      return {
        icon: <Clock className="w-16 h-16 text-amber-400" />,
        title: 'Rate Limited',
        message: "Too many requests. Please wait a moment before trying again.",
        showExamples: false,
      };
    }
    
    return {
      icon: <AlertCircle className="w-16 h-16 text-red-400" />,
      title: 'Something Went Wrong',
      message: error || 'An unexpected error occurred. Please try again.',
      showExamples: true,
    };
  };

  const { icon, title, message, showExamples } = getErrorDetails();
  const exampleUsernames = ['neal_wu', 'tourist', 'jiangly'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 md:p-12 text-center max-w-lg mx-auto my-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="flex justify-center mb-6"
      >
        {icon}
      </motion.div>
      
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="gradient" className="gap-2 mb-6">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
      
      {showExamples && onTryExample && (
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">Try one of these profiles:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleUsernames.map((username) => (
              <Button
                key={username}
                variant="outline"
                size="sm"
                onClick={() => onTryExample(username)}
                className="font-mono"
              >
                {username}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
