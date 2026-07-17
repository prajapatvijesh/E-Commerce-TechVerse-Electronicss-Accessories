import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge } from '@techverse/ui';
import { Mail } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['newsletter'],
    queryFn: async () => {
      const res = await axios.get('/api/newsletter', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8 dark:text-white">Loading Subscribers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-white">Newsletter Subscribers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail size={20} />
            <span>Subscribers List ({subscribers?.length || 0})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Address</TableHead>
                <TableHead>Subscribed At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers?.map((sub: any) => (
                <TableRow key={sub._id}>
                  <TableCell className="font-medium dark:text-white">{sub.email}</TableCell>
                  <TableCell className="text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={sub.isActive ? 'success' : 'error'}>
                      {sub.isActive ? 'Active' : 'Unsubscribed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {subscribers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">No subscribers yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
