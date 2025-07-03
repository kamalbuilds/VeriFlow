"use client";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import AIMarketplace from "@/components/AIMarketplace";

export default function Home() {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const router = useRouter();

  // Show AI marketplace for connected users
  if (isConnected) {
    return <AIMarketplace />;
  }

  // Show VeriFlow landing page for non-connected users
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Verifiable</span>
                  <span className="block text-indigo-600 xl:inline"> AI Data</span>
                  <span className="block xl:inline"> Marketplace</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  VeriFlow is the first marketplace for verifiable AI training data on Filecoin. 
                  Buy and sell AI datasets with cryptographic proofs, automated verification, 
                  and USDFC stablecoin payments powered by F3 fast finality.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={openConnectModal}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
                    >
                      Connect Wallet & Start Trading
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => window.open("https://docs.veriflow.ai", "_blank")}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">🤖</div>
              <div className="text-2xl font-bold">AI + Blockchain</div>
              <div className="text-lg">Verifiable Data Marketplace</div>
              <div className="text-sm mt-2 opacity-80">Powered by Filecoin & USDFC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionary AI Data Economy
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Built for the $9 trillion AI market with cutting-edge blockchain technology
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  🔬
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verifiable Training</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Cryptographic proofs ensure AI models actually used your data for training.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  💰
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">USDFC Payments</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Stable cryptocurrency payments powered by Filecoin's new stablecoin.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  ⚡
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">F3 Fast Finality</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  450x faster transaction confirmation for real-time marketplace operations.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  🛡️
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Data Provenance</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Immutable chain of custody from data source to model training.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  📊
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Quality Scoring</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Multi-dimensional quality metrics powered by Tellor oracles.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  🌐
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Decentralized Storage</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Your data is stored securely on IPFS and Filecoin network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to revolutionize AI training?</span>
            <span className="block">Start with VeriFlow today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join the first verifiable AI data marketplace and earn from your high-quality datasets.
          </p>
          <button
            onClick={openConnectModal}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}
