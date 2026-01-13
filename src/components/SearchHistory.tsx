import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SearchHistoryItem } from '@/hooks/useSearchHistory';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelect: (username: string) => void;
  onRemove: (username: string) => void;
  onClear: () => void;
  isVisible: boolean;
}

export const SearchHistory = ({
  history,
  onSelect,
  onRemove,
  onClear,
  isVisible,
}: SearchHistoryProps) => {
  if (!isVisible || history.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute top-full left-0 right-0 mt-2 glass-card p-2 z-50 shadow-xl border border-border/50"
      >
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recent Searches
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
        </div>
        
        <div className="space-y-1">
          {history.map((item) => (
            <div
              key={item.username}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 cursor-pointer group transition-colors"
              onClick={() => onSelect(item.username)}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={item.avatar} alt={item.username} />
                <AvatarFallback className="text-xs bg-primary/20">
                  {item.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.username}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.lastSearched).toLocaleDateString()}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.username);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
