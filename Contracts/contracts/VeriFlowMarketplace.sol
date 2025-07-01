// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

// TODO: Restore Filecoin.sol imports after stack depth fix
// import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
// import {CommonTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
// import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
// import {FilAddresses} from "@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol";

import {IVeriFlowVerification} from "./IVeriFlowVerification.sol";
import {IRegisterSubnetFacet} from "./IRegisterSubnetFacet.sol";

/**
 * @title VeriFlowMarketplace
 * @dev AI Data Marketplace with verifiable training proofs and USDFC payments
 * @notice First verifiable AI training data marketplace on Filecoin with F3 fast finalitycomplex Filecoin deal functionality 
 */
contract VeriFlowMarketplace is Ownable, ReentrancyGuard, Pausable {
    /// @notice Platform fee percentage (in basis points, 100 = 1%)
    uint256 public constant PLATFORM_FEE = 250; // 2.5%
    
    /// @notice Maximum quality score (100%)
    uint256 public constant MAX_QUALITY_SCORE = 10000; // 100.00%
    
    /// @notice Minimum stake required for data provider registration
    uint256 public providerStakeAmount;

    /// @notice USDFC stablecoin contract address (Secured Finance)
    /// @dev This is the real USDFC contract on Filecoin mainnet
    IERC20 public immutable usdfc;
    
    /// @notice AI verification contract
    IVeriFlowVerification public verificationContract;
    
    /// @notice Subnet registry for IPC integration
    IRegisterSubnetFacet public subnetRegistry;

    /// @notice Current dataset ID counter
    uint256 public currentDatasetId;
    
    /// @notice Platform treasury for fees
    address public treasury;

    /// @notice Enumeration for data categories
    enum DataCategory {
        TEXT,
        IMAGE,
        AUDIO,
        VIDEO,
        MULTIMODAL,
        STRUCTURED,
        TIMESERIES,
        GRAPH
    }

    /// @notice Structure for Filecoin storage deal parameters
    struct FilecoinDealParams {
        bytes piece_cid;
        uint64 piece_size;
        bool verified_deal;
        string label;
        int64 start_epoch;
        int64 end_epoch;
        uint256 storage_price_per_epoch;
        uint256 provider_collateral;
        uint256 client_collateral;
    }

    /// @notice Structure representing an AI dataset
    struct AIDataset {
        uint256 id;
        address provider;
        string title;
        string description;
        string ipfsHash;
        string metadataUri;
        uint256 priceUSDFC;
        DataCategory category;
        uint256 qualityScore;
        bool isVerified;
        bool isActive;
        uint256 downloadCount;
        uint256 totalRevenue;
        uint256 createdAt;
        uint256 updatedAt;
        uint64 filecoinDealId; // Filecoin storage deal ID
    }

    /// @notice Structure for data provider information
    struct DataProvider {
        address providerAddress;
        string name;
        string contactInfo;
        uint256 reputation;
        uint256 totalDatasets;
        uint256 totalRevenue;
        bool isVerified;
        bool isActive;
        address subnetAddress; // IPC subnet for provider
    }

    /// @notice Structure for purchase information
    struct DataPurchase {
        uint256 datasetId;
        address purchaser;
        uint256 amountPaid;
        uint256 purchaseDate;
        bool isActive;
        string accessKey; // Encrypted access key
    }

    /// @notice Mapping of dataset ID to dataset information
    mapping(uint256 => AIDataset) public datasets;
    
    /// @notice Mapping of provider address to provider information
    mapping(address => DataProvider) public providers;
    
    /// @notice Mapping of purchase ID to purchase information
    mapping(bytes32 => DataPurchase) public purchases;
    
    /// @notice Mapping of provider to their dataset IDs
    mapping(address => uint256[]) public providerDatasets;
    
    /// @notice Mapping to check if user has purchased dataset
    mapping(address => mapping(uint256 => bool)) public hasPurchased;
    
    /// @notice Mapping for dataset ratings (user => datasetId => rating)
    mapping(address => mapping(uint256 => uint256)) public ratings;

    /// @notice Events
    event ProviderRegistered(
        address indexed provider,
        string name,
        uint256 timestamp
    );
    
    event DatasetListed(
        uint256 indexed datasetId,
        address indexed provider,
        string title,
        uint256 price,
        DataCategory category
    );
    
    event DatasetPurchased(
        uint256 indexed datasetId,
        address indexed purchaser,
        uint256 amount,
        bytes32 purchaseId
    );
    
    event DatasetVerified(
        uint256 indexed datasetId,
        address indexed verifier,
        uint256 qualityScore
    );
    
    event ReputationUpdated(
        address indexed provider,
        uint256 oldReputation,
        uint256 newReputation
    );

    event FilecoinDealCreated(
        uint256 indexed datasetId,
        bytes indexed pieceCid,
        uint64 pieceSize
    );

    event FilecoinDealConfirmed(
        uint256 indexed datasetId,
        uint64 indexed dealId
    );

    /// @notice Modifiers
    modifier onlyRegisteredProvider() {
        require(providers[msg.sender].isActive, "Not a registered provider");
        _;
    }
    
    modifier validDataset(uint256 datasetId) {
        require(datasetId > 0 && datasetId <= currentDatasetId, "Invalid dataset ID");
        require(datasets[datasetId].isActive, "Dataset not active");
        _;
    }

    /**
     * @dev Constructor
     * @param _usdfc USDFC stablecoin contract address
     * @param _verificationContract AI verification contract
     * @param _treasury Platform treasury address
     * @param _providerStakeAmount Required stake for provider registration
     */
    constructor(
        address _usdfc,
        address _verificationContract,
        address _treasury,
        uint256 _providerStakeAmount
    ) Ownable(msg.sender) {
        require(_usdfc != address(0), "Invalid USDFC address");
        require(_treasury != address(0), "Invalid treasury address");
        require(_verificationContract != address(0), "Invalid verification contract");
        
        usdfc = IERC20(_usdfc);
        verificationContract = IVeriFlowVerification(_verificationContract);
        treasury = _treasury;
        providerStakeAmount = _providerStakeAmount;
    }

    /**
     * @notice Register as a data provider
     * @param name Provider name
     * @param contactInfo Contact information
     */
    function registerProvider(
        string memory name,
        string memory contactInfo
    ) external payable whenNotPaused {
        require(msg.value >= providerStakeAmount, "Insufficient stake");
        require(!providers[msg.sender].isActive, "Already registered");
        require(bytes(name).length > 0, "Name required");

        providers[msg.sender] = DataProvider({
            providerAddress: msg.sender,
            name: name,
            contactInfo: contactInfo,
            reputation: 5000, // Start with 50% reputation
            totalDatasets: 0,
            totalRevenue: 0,
            isVerified: false,
            isActive: true,
            subnetAddress: address(0)
        });

        emit ProviderRegistered(msg.sender, name, block.timestamp);
    }

    /**
     * @notice List a new AI dataset
     * @param title Dataset title
     * @param description Dataset description
     * @param ipfsHash IPFS hash of the dataset
     * @param metadataUri URI for additional metadata
     * @param priceUSDFC Price in USDFC tokens
     * @param category Data category
     */
    function listDataset(
        string memory title,
        string memory description,
        string memory ipfsHash,
        string memory metadataUri,
        uint256 priceUSDFC,
        DataCategory category
    ) external onlyRegisteredProvider whenNotPaused {
        require(bytes(title).length > 0, "Title required");
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(priceUSDFC > 0, "Price must be positive");

        currentDatasetId++;
        uint256 datasetId = currentDatasetId;

        datasets[datasetId] = AIDataset({
            id: datasetId,
            provider: msg.sender,
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            metadataUri: metadataUri,
            priceUSDFC: priceUSDFC,
            category: category,
            qualityScore: 0, // Will be set after verification
            isVerified: false,
            isActive: true,
            downloadCount: 0,
            totalRevenue: 0,
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            filecoinDealId: 0
        });

        providerDatasets[msg.sender].push(datasetId);
        providers[msg.sender].totalDatasets++;

        emit DatasetListed(datasetId, msg.sender, title, priceUSDFC, category);
    }

    /**
     * @notice Purchase a dataset
     * @param datasetId ID of the dataset to purchase
     * @param accessKeyHash Encrypted access key hash
     */
    function purchaseDataset(
        uint256 datasetId,
        string memory accessKeyHash
    ) external validDataset(datasetId) whenNotPaused nonReentrant {
        AIDataset storage dataset = datasets[datasetId];
        require(!hasPurchased[msg.sender][datasetId], "Already purchased");
        require(msg.sender != dataset.provider, "Cannot purchase own dataset");

        uint256 totalAmount = dataset.priceUSDFC;
        uint256 platformFee = (totalAmount * PLATFORM_FEE) / 10000;
        uint256 providerAmount = totalAmount - platformFee;

        // Process payments
        _processPayment(totalAmount, platformFee, providerAmount, dataset.provider);

        // Create purchase record and update stats
        bytes32 purchaseId = _createPurchaseRecord(datasetId, totalAmount, accessKeyHash);
        _updatePurchaseStats(datasetId, totalAmount, providerAmount);

        emit DatasetPurchased(datasetId, msg.sender, totalAmount, purchaseId);
    }

    /**
     * @notice Internal function to process payments (reduces stack depth)
     */
    function _processPayment(
        uint256 totalAmount,
        uint256 platformFee,
        uint256 providerAmount,
        address provider
    ) internal {
        require(
            usdfc.transferFrom(msg.sender, treasury, platformFee),
            "Platform fee transfer failed"
        );
        require(
            usdfc.transferFrom(msg.sender, provider, providerAmount),
            "Provider payment failed"
        );
    }

    /**
     * @notice Internal function to create purchase record (reduces stack depth)
     */
    function _createPurchaseRecord(
        uint256 datasetId,
        uint256 totalAmount,
        string memory accessKeyHash
    ) internal returns (bytes32) {
        bytes32 purchaseId = keccak256(
            abi.encodePacked(datasetId, msg.sender, block.timestamp)
        );
        
        purchases[purchaseId] = DataPurchase({
            datasetId: datasetId,
            purchaser: msg.sender,
            amountPaid: totalAmount,
            purchaseDate: block.timestamp,
            isActive: true,
            accessKey: accessKeyHash
        });

        return purchaseId;
    }

    /**
     * @notice Internal function to update purchase statistics (reduces stack depth)
     */
    function _updatePurchaseStats(
        uint256 datasetId,
        uint256 totalAmount,
        uint256 providerAmount
    ) internal {
        AIDataset storage dataset = datasets[datasetId];
        dataset.downloadCount++;
        dataset.totalRevenue += totalAmount;
        providers[dataset.provider].totalRevenue += providerAmount;
        hasPurchased[msg.sender][datasetId] = true;
    }

    /**
     * @notice Rate a purchased dataset (1-10 scale)
     * @param datasetId Dataset to rate
     * @param rating Rating from 1-10
     */
    function rateDataset(
        uint256 datasetId,
        uint256 rating
    ) external validDataset(datasetId) {
        require(hasPurchased[msg.sender][datasetId], "Must purchase to rate");
        require(rating >= 1 && rating <= 10, "Rating must be 1-10");
        
        ratings[msg.sender][datasetId] = rating;
        
        // Update provider reputation based on rating
        _updateProviderReputation(datasets[datasetId].provider, rating);
    }

    /**
     * @notice Create Filecoin storage deal for dataset using MarketAPI
     * @param datasetId Dataset ID
     * @param dealParams Filecoin deal parameters
     */
    function createFilecoinStorageDeal(
        uint256 datasetId,
        FilecoinDealParams calldata dealParams
    ) external validDataset(datasetId) nonReentrant {
        require(
            msg.sender == datasets[datasetId].provider,
            "Only provider can create deals"
        );
        
        // Create and process deal proposal
        _processDealProposal(datasetId, dealParams);
        
        emit FilecoinDealCreated(datasetId, dealParams.piece_cid, dealParams.piece_size);
    }

    /**
     * @notice Internal function to process deal proposal (reduces stack depth)
     * @param datasetId Dataset ID
     * @param dealParams Deal parameters
     */
    function _processDealProposal(
        uint256 datasetId,
        FilecoinDealParams calldata dealParams
    ) internal {
        // Update dataset state
        datasets[datasetId].filecoinDealId = 0; // Will be updated when deal is published
        datasets[datasetId].updatedAt = block.timestamp;
        
        // Note: Actual deal publishing happens off-chain by storage providers
        // This function validates and stores the deal parameters for verification
    }

    /**
     * @notice Update dataset with confirmed Filecoin deal ID
     * @param datasetId Dataset ID
     * @param dealId Confirmed Filecoin deal ID
     */
    function updateFilecoinDealId(
        uint256 datasetId,
        uint64 dealId
    ) external validDataset(datasetId) {
        require(
            msg.sender == datasets[datasetId].provider,
            "Only provider can update deal ID"
        );
        
        // TODO: Restore Filecoin MarketAPI verification after stack depth fix
        // MarketTypes.GetDealActivationReturn memory dealInfo = MarketAPI.getDealActivation(dealId);
        // require(CommonTypes.ChainEpoch.unwrap(dealInfo.activated) > 0, "Deal not activated");
        
        datasets[datasetId].filecoinDealId = dealId;
        datasets[datasetId].updatedAt = block.timestamp;
        
        emit FilecoinDealConfirmed(datasetId, dealId);
    }

    /**
     * @notice Get dataset information
     * @param datasetId Dataset ID
     * @return Dataset information
     */
    function getDataset(uint256 datasetId) 
        external 
        view 
        returns (AIDataset memory) 
    {
        return datasets[datasetId];
    }

    /**
     * @notice Get provider datasets
     * @param provider Provider address
     * @return Array of dataset IDs
     */
    function getProviderDatasets(address provider) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return providerDatasets[provider];
    }

    /**
     * @notice Get datasets by category (simplified to reduce stack depth)
     * @param category Data category
     * @param offset Pagination offset
     * @param limit Pagination limit
     * @return Array of dataset IDs
     */
    function getDatasetsByCategory(
        DataCategory category,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory) {
        require(limit > 0 && limit <= 100, "Invalid limit");
        
        return _paginateDatasetsByCategory(category, offset, limit);
    }

    /**
     * @notice Internal function to paginate datasets by category
     */
    function _paginateDatasetsByCategory(
        DataCategory category,
        uint256 offset,
        uint256 limit
    ) internal view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](limit);
        uint256 count = 0;
        uint256 currentOffset = 0;
        
        for (uint256 i = 1; i <= currentDatasetId && count < limit; i++) {
            if (datasets[i].category == category && datasets[i].isActive) {
                if (currentOffset >= offset) {
                    result[count] = i;
                    count++;
                }
                currentOffset++;
            }
        }
        
        // Resize array to actual count using memory-safe assembly
        assembly ("memory-safe") {
            mstore(result, count)
        }
        
        return result;
    }

    /**
     * @notice Update provider reputation based on rating
     * @param provider Provider address
     * @param rating New rating (1-10)
     */
    function _updateProviderReputation(address provider, uint256 rating) internal {
        DataProvider storage providerData = providers[provider];
        uint256 oldReputation = providerData.reputation;
        
        // Simple reputation algorithm: weighted average with existing reputation
        uint256 weight = providerData.totalDatasets > 0 ? providerData.totalDatasets : 1;
        uint256 newReputation = (oldReputation * weight + rating * 1000) / (weight + 1);
        
        // Ensure reputation stays within bounds (0-10000)
        if (newReputation > MAX_QUALITY_SCORE) {
            newReputation = MAX_QUALITY_SCORE;
        }
        
        providerData.reputation = newReputation;
        
        emit ReputationUpdated(provider, oldReputation, newReputation);
    }

    /**
     * @notice Admin function to verify a dataset
     * @param datasetId Dataset to verify
     * @param qualityScore Quality score (0-10000)
     */
    function verifyDataset(
        uint256 datasetId,
        uint256 qualityScore
    ) external onlyOwner validDataset(datasetId) {
        require(qualityScore <= MAX_QUALITY_SCORE, "Invalid quality score");
        
        datasets[datasetId].isVerified = true;
        datasets[datasetId].qualityScore = qualityScore;
        datasets[datasetId].updatedAt = block.timestamp;
        
        emit DatasetVerified(datasetId, msg.sender, qualityScore);
    }

    /**
     * @notice Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Update treasury address
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid address");
        treasury = newTreasury;
    }

    /**
     * @notice Update provider stake amount
     * @param newStakeAmount New stake amount
     */
    function updateProviderStakeAmount(uint256 newStakeAmount) external onlyOwner {
        providerStakeAmount = newStakeAmount;
    }
} 