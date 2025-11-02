'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { deposit, withdraw, getPaymentInfo } from '@/store/slices/stockDataSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CreditCard, 
  Banknote, 
  Smartphone,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export default function FundManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { balance, transactions, paymentMethods, loading, error } = useSelector((state: RootState) => state.stockData);
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [accountDetails, setAccountDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolder: '',
  });

  useEffect(() => {
    dispatch(getPaymentInfo({} as any));
  }, [dispatch]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return;
    }

    const result = await dispatch(deposit({
      amount: parseFloat(depositAmount),
      method: depositMethod,
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Deposit processed successfully!');
      setDepositAmount('');
      setDepositMethod('');
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      return;
    }

    const result = await dispatch(withdraw({
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      accountDetails,
    }));

    if (result.meta.requestStatus === 'fulfilled') {
      setSuccessMessage('Withdrawal processed successfully!');
      setWithdrawAmount('');
      setWithdrawMethod('');
      setShowWithdrawDialog(false);
      setAccountDetails({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountHolder: '',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Account Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-2">
            {formatCurrency(balance)}
          </div>
          <p className="text-sm text-muted-foreground">
            Available for trading and withdrawals
          </p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Fund Management Tabs */}
      <Tabs defaultValue="deposit" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit" className="flex items-center space-x-2">
            <ArrowDownCircle className="h-4 w-4" />
            <span>Deposit</span>
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="flex items-center space-x-2">
            <ArrowUpCircle className="h-4 w-4" />
            <span>Withdraw</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>
                Add funds to your trading account using various payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="10"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={depositMethod} onValueChange={setDepositMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit/Debit Card</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center space-x-2">
                        <Banknote className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>UPI</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full" 
                onClick={handleDeposit}
                disabled={!depositAmount || !depositMethod || loading}
              >
                {loading ? 'Processing...' : `Deposit ${depositAmount ? formatCurrency(parseFloat(depositAmount)) : ''}`}
              </Button>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Minimum deposit: $10</p>
                <p>• Processing time: Instant for cards, 1-2 business days for bank transfers</p>
                <p>• No deposit fees</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>
                Withdraw funds from your trading account to your bank account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="10"
                  max={balance}
                  step="0.01"
                />
                <p className="text-xs text-muted-foreground">
                  Available balance: {formatCurrency(balance)}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">
                      <div className="flex items-center space-x-2">
                        <Banknote className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={!withdrawAmount || !withdrawMethod || parseFloat(withdrawAmount) > balance}
                  >
                    Continue to Bank Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bank Account Details</DialogTitle>
                    <DialogDescription>
                      Enter your bank account details for withdrawal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input
                        id="bank-name"
                        placeholder="Enter bank name"
                        value={accountDetails.bankName}
                        onChange={(e) => setAccountDetails(prev => ({ ...prev, bankName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input
                        id="account-number"
                        placeholder="Enter account number"
                        value={accountDetails.accountNumber}
                        onChange={(e) => setAccountDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc-code">IFSC Code</Label>
                      <Input
                        id="ifsc-code"
                        placeholder="Enter IFSC code"
                        value={accountDetails.ifscCode}
                        onChange={(e) => setAccountDetails(prev => ({ ...prev, ifscCode: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-holder">Account Holder Name</Label>
                      <Input
                        id="account-holder"
                        placeholder="Enter account holder name"
                        value={accountDetails.accountHolder}
                        onChange={(e) => setAccountDetails(prev => ({ ...prev, accountHolder: e.target.value }))}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleWithdraw}
                      disabled={!accountDetails.bankName || !accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolder || loading}
                    >
                      {loading ? 'Processing...' : `Withdraw ${withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : ''}`}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Minimum withdrawal: $10</p>
                <p>• Processing time: 1-3 business days</p>
                <p>• Withdrawal fees may apply</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View your deposit and withdrawal history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p className="text-muted-foreground">
                Your transaction history will appear here once you make deposits or withdrawals.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={transaction.type === 'deposit' ? 'default' : 'secondary'}
                          className={transaction.type === 'deposit' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}
                        >
                          {transaction.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.method}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {getStatusIcon(transaction.status)}
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}