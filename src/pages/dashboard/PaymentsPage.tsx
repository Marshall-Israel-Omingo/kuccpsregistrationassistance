import { format } from 'date-fns';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { usePayments, PaymentStatus } from '@/hooks/usePayments';
import { cn } from '@/lib/utils';

const getStatusConfig = (status: PaymentStatus) => {
  switch (status) {
    case 'completed':
      return { color: 'bg-success/10 text-success', icon: CheckCircle, label: 'Completed' };
    case 'pending':
      return { color: 'bg-warning/10 text-warning', icon: Clock, label: 'Pending' };
    case 'processing':
      return { color: 'bg-secondary/10 text-secondary', icon: RefreshCw, label: 'Processing' };
    case 'failed':
      return { color: 'bg-destructive/10 text-destructive', icon: AlertCircle, label: 'Failed' };
    case 'refunded':
      return { color: 'bg-muted text-muted-foreground', icon: RefreshCw, label: 'Refunded' };
    default:
      return { color: 'bg-muted text-muted-foreground', icon: Clock, label: 'Unknown' };
  }
};

const PaymentsPage = () => {
  const { data: payments, isLoading } = usePayments();

  const totalPaid = payments
    ?.filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20 lg:pb-6">
        <h1 className="text-2xl font-bold text-foreground">Payments</h1>

        {/* Balance Card */}
        <Card className="gradient-coral text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Total Paid</p>
                <p className="text-3xl font-bold">KES {totalPaid.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-secondary" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments && payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(payment.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">Application Fee</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.payment_method?.toUpperCase() || 'M-Pesa'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          'font-semibold',
                          payment.status === 'completed' ? 'text-secondary' : 'text-foreground'
                        )}>
                          KES {Number(payment.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                            statusConfig.color
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.status === 'completed' && (
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payment history yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentsPage;
