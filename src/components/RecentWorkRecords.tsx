
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { WorkRecord } from '@/types/work-record';
import { Clock, DollarSign, User, Calendar, Filter, BarChart3, TableIcon } from 'lucide-react';

interface RecentWorkRecordsProps {
  records: WorkRecord[];
}

const RecentWorkRecords: React.FC<RecentWorkRecordsProps> = ({ records }) => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [filterBy, setFilterBy] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter records based on selected filter
  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    
    switch (filterBy) {
      case 'today':
        return recordDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return recordDate >= weekAgo;
      case 'month':
        return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const totalHours = filteredRecords.reduce((sum, record) => sum + record.hours_spent, 0);
  const totalEarnings = filteredRecords.reduce((sum, record) => sum + record.total_remuneration, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Catatan Pekerjaan Terbaru
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {filteredRecords.length} records • {totalHours.toFixed(1)} jam total • 
              Rp {totalEarnings.toLocaleString('id-ID')} total earning
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('chart')}
                className="rounded-l-none"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'table' ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pegawai</TableHead>
                  <TableHead>Tugas</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Jam</TableHead>
                  <TableHead className="text-right">Remunerasi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{record.employee_name}</div>
                          {record.contributing_employees && record.contributing_employees.length > 0 && (
                            <div className="text-xs text-gray-500">
                              +{record.contributing_employees.length} kolaborator
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate" title={record.task_description}>
                          {record.task_description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(record.date).toLocaleDateString('id-ID')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-purple-700 border-purple-200">
                        {record.hours_spent}h
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium text-green-700">
                          Rp {record.total_remuneration.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Selesai
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart view - simplified bar chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecords.slice(0, 12).map((record) => (
                <Card key={record.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">{record.employee_name}</h4>
                    <Badge variant="outline">{record.hours_spent}h</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 truncate">{record.task_description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString('id-ID')}</span>
                    <span className="text-sm font-medium text-green-600">
                      Rp {(record.total_remuneration / 1000).toFixed(0)}k
                    </span>
                  </div>
                  {/* Simple progress bar representing hours */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((record.hours_spent / 12) * 100, 100)}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-gray-500">Tidak ada catatan pekerjaan untuk filter yang dipilih</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentWorkRecords;
