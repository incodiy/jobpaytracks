
import { Button } from "@/components/ui/button";
import { Table, Grid, ChevronDown, ChevronUp } from "lucide-react";

interface ViewToggleProps {
  view: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
  showForm: boolean;
  onToggleForm: () => void;
  formTitle: string;
}

const ViewToggle = ({ view, onViewChange, showForm, onToggleForm, formTitle }: ViewToggleProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Tampilan:</span>
        <div className="flex border rounded-lg">
          <Button
            variant={view === 'card' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('card')}
            className="rounded-r-none border-r-0"
          >
            <Grid className="h-4 w-4 mr-2" />
            Card
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('table')}
            className="rounded-l-none"
          >
            <Table className="h-4 w-4 mr-2" />
            Tabel
          </Button>
        </div>
      </div>
      
      <Button
        variant="outline"
        onClick={onToggleForm}
        className="flex items-center space-x-2"
      >
        {showForm ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <span>{showForm ? `Sembunyikan ${formTitle}` : `Tampilkan ${formTitle}`}</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
