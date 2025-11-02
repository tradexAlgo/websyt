'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calendar,
  Star,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

interface MutualFund {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  nav: number;
  navChange: number;
  navChangePercent: number;
  returns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
    sinceInception: number;
  };
  risk: 'low' | 'moderate' | 'high';
  rating: number;
  minInvestment: number;
  expenseRatio: number;
  fundSize: number;
  inceptionDate: string;
  fundManager: string;
  description: string;
  topHoldings: Array<{
    name: string;
    percentage: number;
  }>;
}

export default function MutualFundsPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('returns');

  // Mock mutual fund data
  const mutualFunds: MutualFund[] = [
    {
      id: '1',
      name: 'Tech Growth Fund',
      category: 'Equity',
      subCategory: 'Large Cap',
      nav: 125.45,
      navChange: 2.15,
      navChangePercent: 1.74,
      returns: {
        oneYear: 18.5,
        threeYear: 22.3,
        fiveYear: 19.8,
        sinceInception: 16.2
      },
      risk: 'high',
      rating: 4,
      minInvestment: 500,
      expenseRatio: 1.2,
      fundSize: 2500000000,
      inceptionDate: '2018-03-15',
      fundManager: 'Sarah Johnson',
      description: 'Invests in high-growth technology companies with strong fundamentals',
      topHoldings: [
        { name: 'Apple Inc.', percentage: 8.5 },
        { name: 'Microsoft Corp.', percentage: 7.2 },
        { name: 'Alphabet Inc.', percentage: 6.8 },
        { name: 'Amazon.com Inc.', percentage: 5.9 },
        { name: 'Tesla Inc.', percentage: 4.3 }
      ]
    },
    {
      id: '2',
      name: 'Balanced Advantage Fund',
      category: 'Hybrid',
      subCategory: 'Aggressive Hybrid',
      nav: 89.32,
      navChange: 0.85,
      navChangePercent: 0.96,
      returns: {
        oneYear: 12.3,
        threeYear: 14.5,
        fiveYear: 13.2,
        sinceInception: 11.8
      },
      risk: 'moderate',
      rating: 5,
      minInvestment: 1000,
      expenseRatio: 0.8,
      fundSize: 1800000000,
      inceptionDate: '2016-08-20',
      fundManager: 'Michael Chen',
      description: 'Dynamic allocation between equity and debt based on market conditions',
      topHoldings: [
        { name: 'HDFC Bank Ltd.', percentage: 6.2 },
        { name: 'Reliance Industries Ltd.', percentage: 5.8 },
        { name: 'TCS Ltd.', percentage: 5.1 },
        { name: 'Government Securities', percentage: 12.5 },
        { name: 'Corporate Bonds', percentage: 8.3 }
      ]
    },
    {
      id: '3',
      name: 'Conservative Debt Fund',
      category: 'Debt',
      subCategory: 'Corporate Bond',
      nav: 1024.68,
      navChange: 0.15,
      navChangePercent: 0.01,
      returns: {
        oneYear: 7.2,
        threeYear: 7.8,
        fiveYear: 7.5,
        sinceInception: 7.3
      },
      risk: 'low',
      rating: 3,
      minInvestment: 1000,
      expenseRatio: 0.5,
      fundSize: 3200000000,
      inceptionDate: '2015-01-10',
      fundManager: 'Priya Patel',
      description: 'Invests in high-quality corporate bonds and government securities',
      topHoldings: [
        { name: 'Government Securities', percentage: 35.2 },
        { name: 'AAA Corporate Bonds', percentage: 28.5 },
        { name: 'AA Corporate Bonds', percentage: 18.3 },
        { name: 'Bank Deposits', percentage: 10.5 },
        { name: 'Money Market Instruments', percentage: 7.5 }
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Hybrid', label: 'Hybrid' },
    { value: 'Debt', label: 'Debt' },
    { value: 'ELSS', label: 'ELSS' },
  ];

  const riskLevels = [
    { value: 'all', label: 'All Risk Levels' },
    { value: 'low', label: 'Low Risk' },
    { value: 'moderate', label: 'Moderate Risk' },
    { value: 'high', label: 'High Risk' },
  ];

  const sortOptions = [
    { value: 'returns', label: '1Y Returns' },
    { value: 'rating', label: 'Rating' },
    { value: 'nav', label: 'NAV' },
    { value: 'fundSize', label: 'Fund Size' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(2)}`;
  };

  const formatFundSize = (size: number) => {
    if (size >= 1000000000) {
      return `₹${(size / 1000000000).toFixed(1)}K Cr`;
    } else if (size >= 10000000) {
      return `₹${(size / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(size / 100000).toFixed(1)}L`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredFunds = mutualFunds.filter(fund => {
    const matchesSearch = fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         fund.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || fund.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || fund.risk === selectedRisk;
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const sortedFunds = [...filteredFunds].sort((a, b) => {
    switch (sortBy) {
      case 'returns':
        return b.returns.oneYear - a.returns.oneYear;
      case 'rating':
        return b.rating - a.rating;
      case 'nav':
        return b.nav - a.nav;
      case 'fundSize':
        return b.fundSize - a.fundSize;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="explore" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="explore">Explore Funds</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Explore Mutual Funds</CardTitle>
              <CardDescription>
                Find the best mutual funds for your investment goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search mutual funds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map(risk => (
                      <SelectItem key={risk.value} value={risk.value}>
                        {risk.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Mutual Funds List */}
          <div className="grid gap-4">
            {sortedFunds.map((fund) => (
              <Card key={fund.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{fund.name}</h3>
                        <div className="flex items-center">
                          {getRatingStars(fund.rating)}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{fund.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant="outline">{fund.category}</Badge>
                        <Badge variant="secondary">{fund.subCategory}</Badge>
                        <Badge className={getRiskColor(fund.risk)}>
                          {fund.risk.toUpperCase()} RISK
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">{formatCurrency(fund.nav)}</div>
                      <div className={`flex items-center text-sm ${
                        fund.navChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {fund.navChange >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {fund.navChange >= 0 ? '+' : ''}{fund.navChange.toFixed(2)} ({fund.navChangePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">1Y Return</p>
                      <p className="font-semibold text-green-600">+{fund.returns.oneYear}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">3Y Return</p>
                      <p className="font-semibold text-green-600">+{fund.returns.threeYear}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">5Y Return</p>
                      <p className="font-semibold text-green-600">+{fund.returns.fiveYear}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expense Ratio</p>
                      <p className="font-semibold">{fund.expenseRatio}%</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Top Holdings</span>
                      <span className="text-xs text-muted-foreground">Fund Manager: {fund.fundManager}</span>
                    </div>
                    <div className="space-y-2">
                      {fund.topHoldings.slice(0, 3).map((holding, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{holding.name}</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={holding.percentage} className="w-20 h-2" />
                            <span className="text-sm font-medium">{holding.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Min Investment: {formatCurrency(fund.minInvestment)}</span>
                      <span>Fund Size: {formatFundSize(fund.fundSize)}</span>
                      <span>Inception: {formatDate(fund.inceptionDate)}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button size="sm">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Invest
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compare Mutual Funds</CardTitle>
              <CardDescription>
                Compare performance, risk, and other metrics across multiple funds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select Funds to Compare</h3>
                <p className="text-muted-foreground mb-4">
                  Choose up to 4 mutual funds to compare their performance side by side
                </p>
                <Button>Select Funds</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SIP Calculator</CardTitle>
              <CardDescription>
                Calculate your investment returns with Systematic Investment Plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Monthly Investment</label>
                    <Input type="number" placeholder="5000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Investment Period (Years)</label>
                    <Input type="number" placeholder="10" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expected Return (%)</label>
                    <Input type="number" placeholder="12" />
                  </div>
                  <Button className="w-full">Calculate Returns</Button>
                </div>
                <div className="bg-muted rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Investment Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Investment:</span>
                      <span className="font-semibold">₹6,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wealth Gained:</span>
                      <span className="font-semibold text-green-600">₹11,61,695</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Maturity Value:</span>
                      <span className="text-primary">₹17,61,695</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Mutual Fund Portfolio</CardTitle>
              <CardDescription>
                Track and manage your mutual fund investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Investments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start investing in mutual funds to build your portfolio
                </p>
                <Button>Explore Funds</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}