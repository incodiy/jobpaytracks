
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface LoadMoreCardsProps<T> {
  data: T[];
  renderCard: (item: T) => React.ReactNode;
  itemsPerLoad?: number;
  className?: string;
}

const LoadMoreCards = <T extends { id: string }>({
  data,
  renderCard,
  itemsPerLoad = 10,
  className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
}: LoadMoreCardsProps<T>) => {
  const [visibleItems, setVisibleItems] = useState(itemsPerLoad);

  const hasMore = visibleItems < data.length;
  const displayedData = data.slice(0, visibleItems);

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + itemsPerLoad, data.length));
  };

  return (
    <div className="space-y-6">
      <div className={className}>
        {displayedData.map(renderCard)}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={loadMore}
            className="px-6 py-2"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Muat Lebih Banyak ({data.length - visibleItems} tersisa)
          </Button>
        </div>
      )}

      {!hasMore && data.length > itemsPerLoad && (
        <div className="text-center text-sm text-gray-500">
          Menampilkan semua {data.length} item
        </div>
      )}
    </div>
  );
};

export default LoadMoreCards;
