'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  FileText, 
  Search,
  Calendar,
  Eye,
  Download,
  Star,
  Clock
} from 'lucide-react';

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

interface MarketAnalysis {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  recommendation: 'buy' | 'sell' | 'hold';
  targetPrice: number;
  analyst: string;
  updatedAt: string;
}

export default function ResearchPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Mock data for research articles
  const researchArticles: ResearchItem[] = [
    {
      id: '1',
      title: 'Tech Stocks Rally: Q4 2024 Outlook',
      description: 'Comprehensive analysis of technology sector performance and projections for the upcoming quarter.',
      category: 'sector-analysis',
      author: 'Sarah Johnson',
      publishedAt: '2024-01-15',
      readTime: '8 min',
      tags: ['technology', 'Q4-2024', 'growth'],
      featured: true,
    },
    {
      id: '2',
      title: 'Federal Reserve Policy Impact on Markets',
      description: 'How recent Fed decisions are affecting equity markets and what to expect in the coming months.',
      category: 'macro',
      author: 'Michael Chen',
      publishedAt: '2024-01-14',
      readTime: '6 min',
      tags: ['federal-reserve', 'monetary-policy', 'markets'],
      featured: false,
    },
    {
      id: '3',
      title: 'Emerging Markets: Opportunities and Risks',
      description: 'Deep dive into emerging market dynamics and investment opportunities for 2024.',
      category: 'emerging-markets',
      author: 'Priya Patel',
      publishedAt: '2024-01-13',
      readTime: '10 min',
      tags: ['emerging-markets', 'risk', 'opportunity'],
      featured: true,
    },
    {
      id: '4',
      title: 'Cryptocurrency Market Analysis',
      description: 'Technical and fundamental analysis of major cryptocurrencies and blockchain projects.',
      category: 'crypto',
      author: 'Alex Thompson',
      publishedAt: '2024-01-12',
      readTime: '7 min',
      tags: ['crypto', 'blockchain', 'technical-analysis'],
      featured: false,
    },
  ];

  // Mock data for market analysis
  const marketAnalysis: MarketAnalysis[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      recommendation: 'buy',
      targetPrice: 195.00,
      analyst: 'Tech Research Team',
      updatedAt: '2024-01-15',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 142.56,
      change: -1.23,
      changePercent: -0.85,
      recommendation: 'hold',
      targetPrice: 155.00,
      analyst: 'Internet Sector Team',
      updatedAt: '2024-01-14',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 378.91,
      change: 3.45,
      changePercent: 0.92,
      recommendation: 'buy',
      targetPrice: 425.00,
      analyst: 'Cloud Computing Team',
      updatedAt: '2024-01-15',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sector-analysis', label: 'Sector Analysis' },
    { value: 'macro', label: 'Macro Economics' },
    { value: 'emerging-markets', label: 'Emerging Markets' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'technical', label: 'Technical Analysis' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'featured', label: 'Featured' },
  ];

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sell':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredArticles = researchArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      case 'popular':
        return 0; // Mock sorting - in real app would use view counts
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="research" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="research">Research Reports</TabsTrigger>
          <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          <TabsTrigger value="tools">Research Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Research Library</CardTitle>
              <CardDescription>
                Access in-depth research reports and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search research articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
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
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
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

          {/* Research Articles */}
          <div className="grid gap-4">
            {sortedArticles.map((article) => (
              <Card key={article.id} className={article.featured ? 'border-primary' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {article.featured && (
                          <Badge variant="default" className="bg-primary">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {categories.find(c => c.value === article.category)?.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-muted-foreground mb-4">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>By {article.author}</span>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Read
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Analysis & Recommendations</CardTitle>
              <CardDescription>
                Expert analysis and price targets for major stocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketAnalysis.map((stock) => (
                  <div key={stock.symbol} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{stock.symbol}</h4>
                        <p className="text-sm text-muted-foreground">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatCurrency(stock.price)}</div>
                        <div className={`flex items-center text-sm ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Recommendation</p>
                        <Badge className={getRecommendationColor(stock.recommendation)}>
                          {stock.recommendation.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target Price</p>
                        <p className="font-semibold">{formatCurrency(stock.targetPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Analyst</p>
                        <p className="text-sm">{stock.analyst}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground">
                        Updated: {formatDate(stock.updatedAt)}
                      </p>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Full Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Technical Analysis</span>
                </CardTitle>
                <CardDescription>
                  Advanced charting and technical indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Launch Charts</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Screener</span>
                </CardTitle>
                <CardDescription>
                  Filter stocks based on technical and fundamental criteria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Open Screener</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Market Heatmap</span>
                </CardTitle>
                <CardDescription>
                  Visual representation of market movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">View Heatmap</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}