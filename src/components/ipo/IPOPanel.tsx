'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';

interface IPO {
  id: string;
  companyName: string;
  symbol: string;
  issueType: 'fresh' | 'offer-for-sale';
  priceBand: {
    min: number;
    max: number;
  };
  lotSize: number;
  minInvestment: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  status: 'upcoming' | 'open' | 'closed' | 'listed';
  subscription: {
    retail: number;
    qib: number;
    hni: number;
    total: number;
  };
  gmp: number; // Grey Market Premium
  description: string;
  sector: string;
  rating: string;
}

export default function IPOPanel() {
  const [selectedIPO, setSelectedIPO] = useState<string | null>(null);

  // Mock IPO data
  const ipos: IPO[] = [
    {
      id: '1',
      companyName: 'TechStart Solutions Ltd.',
      symbol: 'TECHSTART',
      issueType: 'fresh',
      priceBand: { min: 215, max: 225 },
      lotSize: 65,
      minInvestment: 14625,
      openDate: '2024-01-18',
      closeDate: '2024-01-22',
      listingDate: '2024-01-30',
      status: 'open',
      subscription: {
        retail: 2.5,
        qib: 8.2,
        hni: 15.3,
        total: 8.7
      },
      gmp: 45,
      description: 'Leading SaaS company providing cloud-based solutions for enterprises',
      sector: 'Technology',
      rating: '4/5'
    },
    {
      id: '2',
      companyName: 'Green Energy Ventures',
      symbol: 'GREENEV',
      issueType: 'fresh',
      priceBand: { min: 180, max: 190 },
      lotSize: 80,
      minInvestment: 15200,
      openDate: '2024-01-25',
      closeDate: '2024-01-29',
      listingDate: '2024-02-06',
      status: 'upcoming',
      subscription: {
        retail: 0,
        qib: 0,
        hni: 0,
        total: 0
      },
      gmp: 25,
      description: 'Renewable energy company focused on solar and wind power projects',
      sector: 'Energy',
      rating: '3/5'
    },
    {
      id: '3',
      companyName: 'HealthPlus Pharma',
      symbol: 'HEALTHPLUS',
      issueType: 'offer-for-sale',
      priceBand: { min: 320, max: 335 },
      lotSize: 45,
      minInvestment: 15075,
      openDate: '2024-01-10',
      closeDate: '2024-01-14',
      listingDate: '2024-01-22',
      status: 'listed',
      subscription: {
        retail: 12.5,
        qib: 25.8,
        hni: 35.2,
        total: 24.5
      },
      gmp: 120,
      description: 'Pharmaceutical company specializing in generic and specialty drugs',
      sector: 'Healthcare',
      rating: '5/5'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'closed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'listed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4" />;
      case 'listed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateSubscriptionProgress = (subscription: number) => {
    return Math.min((subscription / 10) * 100, 100); // Assuming 10x is full subscription
  };

  const openIPOs = ipos.filter(ipo => ipo.status === 'open');
  const upcomingIPOs = ipos.filter(ipo => ipo.status === 'upcoming');
  const listedIPOs = ipos.filter(ipo => ipo.status === 'listed');

  return (
    <div className="space-y-6">
      <Tabs defaultValue="open" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="open">Open IPOs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="listed">Listed</TabsTrigger>
          <TabsTrigger value="calendar">IPO Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4">
          {openIPOs.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Open IPOs</h3>
                  <p className="text-muted-foreground">
                    Check back soon for new IPO opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            openIPOs.map((ipo) => (
              <Card key={ipo.id} className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{ipo.companyName}</span>
                        <Badge variant="outline">{ipo.symbol}</Badge>
                      </CardTitle>
                      <CardDescription>{ipo.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(ipo.status)}>
                        {getStatusIcon(ipo.status)}
                        <span className="ml-1">{ipo.status.toUpperCase()}</span>
                      </Badge>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        {ipo.rating}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price Band</p>
                      <p className="font-semibold">
                        {formatCurrency(ipo.priceBand.min)} - {formatCurrency(ipo.priceBand.max)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lot Size</p>
                      <p className="font-semibold">{ipo.lotSize} shares</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Min Investment</p>
                      <p className="font-semibold">{formatCurrency(ipo.minInvestment)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">GMP</p>
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(ipo.gmp)} ({((ipo.gmp / ipo.priceBand.max) * 100).toFixed(1)}%)
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Open Date</p>
                      <p className="font-medium">{formatDate(ipo.openDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Close Date</p>
                      <p className="font-medium">{formatDate(ipo.closeDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Listing Date</p>
                      <p className="font-medium">{formatDate(ipo.listingDate)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Subscription</span>
                      <span className="text-sm font-semibold">{ipo.subscription.total.toFixed(1)}x</span>
                    </div>
                    <Progress value={calculateSubscriptionProgress(ipo.subscription.total)} className="h-2" />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Retail:</span>
                        <span>{ipo.subscription.retail.toFixed(1)}x</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">QIB:</span>
                        <span>{ipo.subscription.qib.toFixed(1)}x</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">HNI:</span>
                        <span>{ipo.subscription.hni.toFixed(1)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingIPOs.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Upcoming IPOs</h3>
                  <p className="text-muted-foreground">
                    Check back soon for upcoming IPO opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            upcomingIPOs.map((ipo) => (
              <Card key={ipo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{ipo.companyName}</span>
                        <Badge variant="outline">{ipo.symbol}</Badge>
                      </CardTitle>
                      <CardDescription>{ipo.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(ipo.status)}>
                      {getStatusIcon(ipo.status)}
                      <span className="ml-1">{ipo.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Price Band</p>
                      <p className="font-semibold">
                        {formatCurrency(ipo.priceBand.min)} - {formatCurrency(ipo.priceBand.max)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Lot Size</p>
                      <p className="font-semibold">{ipo.lotSize} shares</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Date</p>
                      <p className="font-medium">{formatDate(ipo.openDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Close Date</p>
                      <p className="font-medium">{formatDate(ipo.closeDate)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline">Set Reminder</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="listed" className="space-y-4">
          {listedIPOs.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Recent Listings</h3>
                  <p className="text-muted-foreground">
                    Recently listed IPOs will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            listedIPOs.map((ipo) => (
              <Card key={ipo.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{ipo.companyName}</span>
                        <Badge variant="outline">{ipo.symbol}</Badge>
                      </CardTitle>
                      <CardDescription>{ipo.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(ipo.status)}>
                      {getStatusIcon(ipo.status)}
                      <span className="ml-1">{ipo.status.toUpperCase()}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Issue Price</p>
                      <p className="font-semibold">{formatCurrency(ipo.priceBand.max)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Listing Price</p>
                      <p className="font-semibold text-green-600">
                        {formatCurrency(ipo.priceBand.max + ipo.gmp)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Listing Gains</p>
                      <p className="font-semibold text-green-600">
                        +{formatCurrency(ipo.gmp)} ({((ipo.gmp / ipo.priceBand.max) * 100).toFixed(1)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subscription</p>
                      <p className="font-semibold">{ipo.subscription.total.toFixed(1)}x</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline">Track Performance</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>IPO Calendar 2024</CardTitle>
              <CardDescription>
                Complete schedule of upcoming and recent IPOs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  IPO dates are subject to change based on market conditions and regulatory approvals.
                </AlertDescription>
              </Alert>
              <div className="mt-6 space-y-4">
                {ipos.map((ipo) => (
                  <div key={ipo.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{ipo.companyName}</h4>
                        <p className="text-sm text-muted-foreground">{ipo.symbol} • {ipo.sector}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatDate(ipo.openDate)}</p>
                      <Badge className={getStatusColor(ipo.status)} variant="outline">
                        {ipo.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}