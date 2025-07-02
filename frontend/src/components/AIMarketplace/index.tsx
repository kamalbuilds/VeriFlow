"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DatasetCard from '@/components/DatasetCard';
import useVeriFlow from '@/hooks/useVeriFlow';
import { useAccount } from 'wagmi';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Database, 
  Users, 
  Star,
  Upload,
  Wallet
} from 'lucide-react';

interface AIMarketplaceProps {
  className?: string;
}

// Mock data for demonstration - in production, this would come from the blockchain
const mockDatasets = [
  {
    id: 1,
    title: "Large-Scale Image Classification Dataset",
    description: "A comprehensive dataset with 10M+ labeled images across 1000 categories, perfect for computer vision model training.",
    category: "Computer Vision",
    price: 25,
    currency: "USDFC",
    size: "2.5TB",
    downloads: 1247,
    rating: 4.8,
    provider: "AI Research Labs",
    isVerified: true,
    tags: ["classification", "images", "large-scale", "pre-processed"],
    lastUpdated: "2 days ago",
    aiModelCompatibility: ["CNN", "ResNet", "EfficientNet"]
  },
  {
    id: 2,
    title: "Financial News Sentiment Analysis Corpus",
    description: "Curated financial news articles with sentiment labels, ideal for building NLP models for market analysis.",
    category: "NLP",
    price: 15,
    currency: "USDFC",
    size: "1.2GB",
    downloads: 834,
    rating: 4.6,
    provider: "FinData Corp",
    isVerified: true,
    tags: ["sentiment", "financial", "news", "annotated"],
    lastUpdated: "1 week ago",
    aiModelCompatibility: ["BERT", "GPT", "RoBERTa"]
  },
  {
    id: 3,
    title: "Multi-Language Speech Recognition Dataset",
    description: "High-quality audio recordings in 25 languages with transcriptions, perfect for speech-to-text models.",
    category: "Audio",
    price: 40,
    currency: "USDFC",
    size: "4.8TB",
    downloads: 567,
    rating: 4.9,
    provider: "Speech Tech Inc",
    isVerified: false,
    tags: ["speech", "multilingual", "transcription", "audio"],
    lastUpdated: "3 days ago",
    aiModelCompatibility: ["Wav2Vec", "Whisper", "DeepSpeech"]
  },
  {
    id: 4,
    title: "Time Series Weather Prediction Data",
    description: "Global weather data with 50+ meteorological features collected over 20 years for forecasting models.",
    category: "Time Series",
    price: 30,
    currency: "USDFC",
    size: "800MB",
    downloads: 1092,
    rating: 4.7,
    provider: "Weather Analytics",
    isVerified: true,
    tags: ["weather", "forecasting", "temporal", "meteorology"],
    lastUpdated: "5 days ago",
    aiModelCompatibility: ["LSTM", "Transformer", "Prophet"]
  }
];

const AIMarketplace: React.FC<AIMarketplaceProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [datasets, setDatasets] = useState(mockDatasets);
  const [filteredDatasets, setFilteredDatasets] = useState(mockDatasets);
  
  const { address, isConnected } = useAccount();
  const { datasetCount, minStakeAmount } = useVeriFlow();

  const categories = ["All", "Computer Vision", "NLP", "Audio", "Time Series", "Multimodal"];

  // Filter datasets based on search and category
  useEffect(() => {
    let filtered = datasets;
    
    if (searchQuery) {
      filtered = filtered.filter(dataset =>
        dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(dataset => dataset.category === selectedCategory);
    }
    
    setFilteredDatasets(filtered);
  }, [searchQuery, selectedCategory, datasets]);

  const handleViewDetails = (dataset: any) => {
    console.log("View details for dataset:", dataset.id);
    // TODO: Open dataset details modal
  };

  const handlePurchase = (dataset: any) => {
    console.log("Purchase dataset:", dataset.id);
    // TODO: Implement purchase functionality
  };

  const marketplaceStats = {
    totalDatasets: datasetCount || 42,
    totalProviders: 156,
    totalDownloads: 25847,
    avgRating: 4.7
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold vf-gradient-primary bg-clip-text text-transparent mb-2">
          AI Data Marketplace
        </h1>
        <p className="text-muted-foreground">
          Discover and purchase high-quality, verifiable AI training datasets on Filecoin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="vf-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.totalDatasets}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="vf-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Providers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.totalProviders}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="vf-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="vf-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceStats.avgRating}/5</div>
            <p className="text-xs text-muted-foreground">Based on 2,400+ reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="vf-card mb-8">
        <CardHeader>
          <CardTitle>Find AI Datasets</CardTitle>
          <CardDescription>
            Search through verified, high-quality training data for your AI models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search datasets by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "vf-button-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons for Connected Users */}
      {isConnected && (
        <Card className="vf-card mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your datasets and participate in the marketplace
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="vf-button-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
            <Button variant="outline">
              <Wallet className="h-4 w-4 mr-2" />
              Stake as Provider
            </Button>
            <Button variant="outline">
              My Datasets
            </Button>
            <Button variant="outline">
              Purchase History
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dataset Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filteredDatasets.length} Datasets Found
          </h2>
          <div className="text-sm text-muted-foreground">
            Showing results for "{searchQuery || selectedCategory}"
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDatasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              onViewDetails={handleViewDetails}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {filteredDatasets.length === 0 && (
          <Card className="vf-card text-center py-12">
            <CardContent>
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No datasets found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse different categories
              </p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIMarketplace; 