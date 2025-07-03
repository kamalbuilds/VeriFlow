import { useState } from "react";
import DatasetCard from "@/components/DatasetCard";
import { useAccount } from "wagmi";
import useVeriFlow from "@/hooks/useVeriFlow";

export default function Store() {
  const { isConnected } = useAccount();
  const { datasetCount } = useVeriFlow();

  // Mock data for datasets - in production this would come from the blockchain
  const datasets = [
    {
      id: 1,
      title: "Large-Scale Image Classification Dataset",
      description: "A comprehensive dataset with 10M+ labeled images across 1000 categories.",
      category: "Computer Vision",
      price: 25,
      currency: "USDFC",
      size: "2.5TB",
      downloads: 1247,
      rating: 4.8,
      provider: "AI Research Labs",
      isVerified: true,
      tags: ["classification", "images", "large-scale"],
      lastUpdated: "2 days ago",
      aiModelCompatibility: ["CNN", "ResNet", "EfficientNet"]
    },
    {
      id: 2,
      title: "Financial News Sentiment Analysis Corpus",
      description: "Curated financial news articles with sentiment labels.",
      category: "NLP",
      price: 15,
      currency: "USDFC",
      size: "1.2GB",
      downloads: 834,
      rating: 4.6,
      provider: "FinData Corp",
      isVerified: true,
      tags: ["sentiment", "financial", "news"],
      lastUpdated: "1 week ago",
      aiModelCompatibility: ["BERT", "GPT", "RoBERTa"]
    }
  ];

  const handleViewDetails = (dataset) => {
    console.log("View details for dataset:", dataset.id);
    // TODO: Open dataset details modal
  };

  const handlePurchase = (dataset) => {
    console.log("Purchase dataset:", dataset.id);
    // TODO: Implement purchase functionality
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">AI Dataset Store</h2>
          <p className="text-gray-600">Browse and purchase verified AI training datasets</p>
        </div>
        <div className="text-sm text-gray-500">
          {datasetCount || datasets.length} datasets available
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasets.map((dataset) => (
          <DatasetCard
            key={dataset.id}
            dataset={dataset}
            onViewDetails={handleViewDetails}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {datasets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <p className="text-lg mb-2">No datasets available</p>
            <p className="text-sm">Check back later for new AI training datasets</p>
          </div>
        </div>
      )}
    </div>
  );
}
