"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  Star, 
  Verified, 
  Brain, 
  Database,
  DollarSign,
  Users 
} from 'lucide-react';

interface Dataset {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  size: string;
  downloads: number;
  rating: number;
  provider: string;
  isVerified: boolean;
  tags: string[];
  lastUpdated: string;
  aiModelCompatibility: string[];
}

interface DatasetCardProps {
  dataset: Dataset;
  onViewDetails?: (dataset: Dataset) => void;
  onPurchase?: (dataset: Dataset) => void;
  className?: string;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ 
  dataset, 
  onViewDetails, 
  onPurchase, 
  className 
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'computer vision':
        return <Eye className="h-4 w-4" />;
      case 'nlp':
      case 'natural language processing':
        return <Brain className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'computer vision':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'nlp':
      case 'natural language processing':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'audio':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'multimodal':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'time series':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className={`vf-card hover:shadow-lg transition-all duration-300 cursor-pointer ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={`${getCategoryColor(dataset.category)} border-0`}>
              {getCategoryIcon(dataset.category)}
              <span className="ml-1">{dataset.category}</span>
            </Badge>
            {dataset.isVerified && (
              <Badge variant="outline" className="border-green-500 text-green-700">
                <Verified className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{dataset.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {dataset.title}
        </CardTitle>
        
        <CardDescription className="line-clamp-2">
          {dataset.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dataset Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-lg">{dataset.size}</div>
            <div className="text-muted-foreground">Size</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg flex items-center justify-center gap-1">
              <Download className="h-4 w-4" />
              {dataset.downloads}
            </div>
            <div className="text-muted-foreground">Downloads</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-lg flex items-center justify-center gap-1">
              <DollarSign className="h-4 w-4" />
              {dataset.price}
            </div>
            <div className="text-muted-foreground">{dataset.currency}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {dataset.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {dataset.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{dataset.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Provider Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>by {dataset.provider}</span>
          </div>
          <span>Updated {dataset.lastUpdated}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(dataset)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button 
            size="sm" 
            className="flex-1 vf-button-primary"
            onClick={() => onPurchase?.(dataset)}
          >
            <Download className="h-4 w-4 mr-1" />
            Purchase
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard; 