import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from '@techverse/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const ActivityLogs: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['activity-logs'],
    queryFn: async () => {
      const res = await axios.get('/api/activity-logs', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8 dark:text-white">Loading Activity Logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Activity Logs</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsData?.map((log: any) => (
                <TableRow key={log._id}>
                  <TableCell className="text-sm whitespace-nowrap text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold dark:text-white">{log.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-500 uppercase">{log.user?.role || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.action.includes('DELETE') ? 'error' : log.action.includes('UPDATE') ? 'warning' : 'success'}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium dark:text-white">{log.resource}</TableCell>
                  <TableCell className="text-sm text-gray-500">{log.ipAddress || 'Unknown'}</TableCell>
                </TableRow>
              ))}
              {logsData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">No activity recorded yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
