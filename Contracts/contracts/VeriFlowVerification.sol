// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {UsingTellor} from "usingtellor/contracts/UsingTellor.sol";

/**
 * @title VeriFlowVerification
 * @dev AI model verification system using Tellor oracles
 * @notice Verifies AI training sessions and model performance metrics
 */
contract VeriFlowVerification is Ownable, ReentrancyGuard, UsingTellor {
    /// @notice Minimum stake required for submitting training proofs
    uint256 public constant TRAINING_STAKE = 100 * 10**18; // 100 USDFC
    
    /// @notice Time window for oracle responses (15 minutes)
    uint256 public constant ORACLE_TIMEOUT = 15 minutes;
    
    /// @notice Minimum confidence threshold for verification (80%)
    uint256 public constant MIN_CONFIDENCE = 8000; // 80.00%
    
    /// @notice Dispute period for challenges (24 hours)
    uint256 public constant DISPUTE_PERIOD = 24 hours;

    /// @notice USDFC token for payments and stakes
    IERC20 public immutable usdfc;

    /// @notice Current training session ID counter
    uint256 public currentTrainingId;

    /// @notice Enumeration for verification status
    enum VerificationStatus {
        PENDING,
        VERIFIED,
        FAILED,
        DISPUTED,
        CANCELLED
    }

    /// @notice Enumeration for AI model types
    enum ModelType {
        CLASSIFICATION,
        REGRESSION,
        NLP,
        COMPUTER_VISION,
        REINFORCEMENT_LEARNING,
        GENERATIVE,
        MULTIMODAL
    }

    /// @notice Structure for performance metrics
    struct PerformanceMetrics {
        uint256 accuracy;      // Accuracy percentage (0-10000)
        uint256 precision;     // Precision percentage (0-10000)
        uint256 recall;        // Recall percentage (0-10000)
        uint256 f1Score;       // F1 score percentage (0-10000)
        uint256 confidence;    // Confidence level (0-10000)
        string customMetrics;  // JSON string for additional metrics
    }

    /// @notice Structure for training session
    struct TrainingSession {
        uint256 id;
        address trainer;
        uint256 datasetId;
        string modelHash;      // IPFS hash of trained model
        string datasetHash;    // IPFS hash of training dataset
        ModelType modelType;
        PerformanceMetrics metrics;
        VerificationStatus status;
        uint256 stakeAmount;
        uint256 submissionTime;
        uint256 verificationTime;
        bytes32 tellorQueryId;
        bool hasReward;
    }

    /// @notice Structure for verification challenge
    struct Challenge {
        uint256 trainingId;
        address challenger;
        string reason;
        uint256 challengeTime;
        bool isResolved;
        bool isValid;
    }

    /// @notice Mapping of training ID to training session
    mapping(uint256 => TrainingSession) public trainingSessions;
    
    /// @notice Mapping of trainer to their training session IDs
    mapping(address => uint256[]) public trainerSessions;
    
    /// @notice Mapping of dataset to training sessions using it
    mapping(uint256 => uint256[]) public datasetTrainingSessions;
    
    /// @notice Mapping of challenge ID to challenge details
    mapping(uint256 => Challenge) public challenges;
    
    /// @notice Current challenge ID counter
    uint256 public currentChallengeId;

    /// @notice Mapping for custom Tellor query types
    mapping(string => bool) public supportedQueryTypes;

    /// @notice Events
    event TrainingSubmitted(
        uint256 indexed trainingId,
        address indexed trainer,
        uint256 indexed datasetId,
        string modelHash
    );

    event VerificationCompleted(
        uint256 indexed trainingId,
        VerificationStatus status,
        PerformanceMetrics metrics
    );

    event ChallengeSubmitted(
        uint256 indexed challengeId,
        uint256 indexed trainingId,
        address indexed challenger
    );

    event ChallengeResolved(
        uint256 indexed challengeId,
        bool isValid,
        address resolver
    );

    event TellorQuerySubmitted(
        uint256 indexed trainingId,
        bytes32 queryId,
        string queryType
    );

    /// @notice Modifiers
    modifier validTraining(uint256 trainingId) {
        require(trainingId > 0 && trainingId <= currentTrainingId, "Invalid training ID");
        _;
    }

    modifier onlyTrainer(uint256 trainingId) {
        require(trainingSessions[trainingId].trainer == msg.sender, "Not the trainer");
        _;
    }

    /**
     * @dev Constructor
     * @param _tellor Tellor oracle contract address
     * @param _usdfc USDFC token contract address
     */
    constructor(
        address payable _tellor,
        address _usdfc
    ) UsingTellor(_tellor) Ownable(msg.sender) {
        require(_usdfc != address(0), "Invalid USDFC address");
        usdfc = IERC20(_usdfc);
        
        // Initialize supported query types
        supportedQueryTypes["AIModelPerformance"] = true;
        supportedQueryTypes["DatasetQuality"] = true;
        supportedQueryTypes["TrainingVerification"] = true;
        supportedQueryTypes["ModelBenchmark"] = true;
    }

    /**
     * @notice Submit AI training session for verification
     * @param datasetId Dataset used for training
     * @param modelHash IPFS hash of the trained model
     * @param datasetHash IPFS hash of the dataset
     * @param modelType Type of AI model
     * @param metrics Self-reported performance metrics
     */
    function submitTraining(
        uint256 datasetId,
        string memory modelHash,
        string memory datasetHash,
        ModelType modelType,
        PerformanceMetrics memory metrics
    ) external nonReentrant {
        require(bytes(modelHash).length > 0, "Model hash required");
        require(bytes(datasetHash).length > 0, "Dataset hash required");
        require(metrics.confidence <= 10000, "Invalid confidence level");

        // Transfer stake
        require(
            usdfc.transferFrom(msg.sender, address(this), TRAINING_STAKE),
            "Stake transfer failed"
        );

        currentTrainingId++;
        uint256 trainingId = currentTrainingId;

        trainingSessions[trainingId] = TrainingSession({
            id: trainingId,
            trainer: msg.sender,
            datasetId: datasetId,
            modelHash: modelHash,
            datasetHash: datasetHash,
            modelType: modelType,
            metrics: metrics,
            status: VerificationStatus.PENDING,
            stakeAmount: TRAINING_STAKE,
            submissionTime: block.timestamp,
            verificationTime: 0,
            tellorQueryId: bytes32(0),
            hasReward: false
        });

        trainerSessions[msg.sender].push(trainingId);
        datasetTrainingSessions[datasetId].push(trainingId);

        emit TrainingSubmitted(trainingId, msg.sender, datasetId, modelHash);

        // Automatically request oracle verification
        _requestOracleVerification(trainingId);
    }

    /**
     * @notice Request Tellor oracle verification for training session
     * @param trainingId Training session ID
     */
    function _requestOracleVerification(uint256 trainingId) internal {
        TrainingSession storage session = trainingSessions[trainingId];
        
        // Create Tellor query for AI model performance verification
        bytes memory queryData = abi.encode(
            "AIModelPerformance",
            abi.encode(
                session.modelHash,
                session.datasetHash,
                uint256(session.modelType),
                session.metrics.accuracy,
                session.metrics.precision,
                session.metrics.recall,
                session.metrics.f1Score
            )
        );
        
        bytes32 queryId = keccak256(queryData);
        session.tellorQueryId = queryId;

        emit TellorQuerySubmitted(trainingId, queryId, "AIModelPerformance");
    }

    /**
     * @notice Get verification result from Tellor oracle
     * @param trainingId Training session ID
     */
    function getVerificationResult(uint256 trainingId) 
        external 
        validTraining(trainingId) 
    {
        TrainingSession storage session = trainingSessions[trainingId];
        require(session.status == VerificationStatus.PENDING, "Not pending verification");
        require(session.tellorQueryId != bytes32(0), "No oracle query submitted");

        // Get data from Tellor oracle
        (bytes memory value, uint256 timestamp) = _getDataBefore(
            session.tellorQueryId,
            block.timestamp - ORACLE_TIMEOUT
        );

        require(timestamp > 0, "No oracle data available");
        require(block.timestamp - timestamp <= ORACLE_TIMEOUT, "Oracle data too old");

        // Decode oracle response
        (
            bool isValid,
            uint256 verifiedAccuracy,
            uint256 verifiedPrecision,
            uint256 verifiedRecall,
            uint256 verifiedF1,
            uint256 confidenceLevel
        ) = abi.decode(value, (bool, uint256, uint256, uint256, uint256, uint256));

        // Update session with verified metrics
        session.metrics.accuracy = verifiedAccuracy;
        session.metrics.precision = verifiedPrecision;
        session.metrics.recall = verifiedRecall;
        session.metrics.f1Score = verifiedF1;
        session.metrics.confidence = confidenceLevel;
        session.verificationTime = block.timestamp;

        // Determine verification status
        if (isValid && confidenceLevel >= MIN_CONFIDENCE) {
            session.status = VerificationStatus.VERIFIED;
            
            // Return stake plus reward
            uint256 rewardAmount = session.stakeAmount + (session.stakeAmount * 20 / 100); // 20% reward
            session.hasReward = true;
            
            require(
                usdfc.transfer(session.trainer, rewardAmount),
                "Reward transfer failed"
            );
        } else {
            session.status = VerificationStatus.FAILED;
            // Stake is forfeited
        }

        emit VerificationCompleted(trainingId, session.status, session.metrics);
    }

    /**
     * @notice Submit a challenge to a verified training session
     * @param trainingId Training session to challenge
     * @param reason Reason for the challenge
     */
    function submitChallenge(
        uint256 trainingId,
        string memory reason
    ) external validTraining(trainingId) {
        TrainingSession storage session = trainingSessions[trainingId];
        require(session.status == VerificationStatus.VERIFIED, "Only verified sessions can be challenged");
        require(
            block.timestamp <= session.verificationTime + DISPUTE_PERIOD,
            "Challenge period expired"
        );
        require(bytes(reason).length > 0, "Reason required");

        // Require challenger stake (same as training stake)
        require(
            usdfc.transferFrom(msg.sender, address(this), TRAINING_STAKE),
            "Challenge stake transfer failed"
        );

        currentChallengeId++;
        challenges[currentChallengeId] = Challenge({
            trainingId: trainingId,
            challenger: msg.sender,
            reason: reason,
            challengeTime: block.timestamp,
            isResolved: false,
            isValid: false
        });

        session.status = VerificationStatus.DISPUTED;

        emit ChallengeSubmitted(currentChallengeId, trainingId, msg.sender);
    }

    /**
     * @notice Resolve a challenge (admin function)
     * @param challengeId Challenge ID to resolve
     * @param isValid Whether the challenge is valid
     */
    function resolveChallenge(
        uint256 challengeId,
        bool isValid
    ) external onlyOwner {
        Challenge storage challenge = challenges[challengeId];
        require(!challenge.isResolved, "Challenge already resolved");
        
        TrainingSession storage session = trainingSessions[challenge.trainingId];
        
        challenge.isResolved = true;
        challenge.isValid = isValid;

        if (isValid) {
            // Challenge is valid - mark training as failed
            session.status = VerificationStatus.FAILED;
            
            // Return challenger's stake and give them the training stake
            uint256 totalReward = TRAINING_STAKE * 2;
            require(
                usdfc.transfer(challenge.challenger, totalReward),
                "Challenge reward transfer failed"
            );
        } else {
            // Challenge is invalid - restore verified status
            session.status = VerificationStatus.VERIFIED;
            
            // Return training stake to original trainer
            require(
                usdfc.transfer(session.trainer, TRAINING_STAKE),
                "Trainer stake return failed"
            );
        }

        emit ChallengeResolved(challengeId, isValid, msg.sender);
    }

    /**
     * @notice Get training session details
     * @param trainingId Training session ID
     * @return Training session details
     */
    function getTrainingSession(uint256 trainingId) 
        external 
        view 
        validTraining(trainingId)
        returns (TrainingSession memory) 
    {
        return trainingSessions[trainingId];
    }

    /**
     * @notice Get training sessions by trainer
     * @param trainer Trainer address
     * @return Array of training session IDs
     */
    function getTrainerSessions(address trainer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return trainerSessions[trainer];
    }

    /**
     * @notice Get training sessions using a dataset
     * @param datasetId Dataset ID
     * @return Array of training session IDs
     */
    function getDatasetTrainingSessions(uint256 datasetId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return datasetTrainingSessions[datasetId];
    }

    /**
     * @notice Get verified training sessions for a dataset
     * @param datasetId Dataset ID
     * @return Array of verified training session IDs
     */
    function getVerifiedTrainingSessions(uint256 datasetId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        uint256[] memory allSessions = datasetTrainingSessions[datasetId];
        uint256[] memory verifiedSessions = new uint256[](allSessions.length);
        uint256 count = 0;

        for (uint256 i = 0; i < allSessions.length; i++) {
            if (trainingSessions[allSessions[i]].status == VerificationStatus.VERIFIED) {
                verifiedSessions[count] = allSessions[i];
                count++;
            }
        }

        // Resize array to actual count
        assembly {
            mstore(verifiedSessions, count)
        }

        return verifiedSessions;
    }

    /**
     * @notice Calculate average performance metrics for a dataset
     * @param datasetId Dataset ID
     * @return avgAccuracy Average accuracy
     * @return avgPrecision Average precision
     * @return avgRecall Average recall
     * @return avgF1Score Average F1 score
     * @return sessionCount Number of verified sessions
     */
    function getDatasetPerformanceStats(uint256 datasetId) 
        external 
        view 
        returns (
            uint256 avgAccuracy,
            uint256 avgPrecision,
            uint256 avgRecall,
            uint256 avgF1Score,
            uint256 sessionCount
        ) 
    {
        uint256[] memory sessions = datasetTrainingSessions[datasetId];
        uint256 totalAccuracy = 0;
        uint256 totalPrecision = 0;
        uint256 totalRecall = 0;
        uint256 totalF1 = 0;
        uint256 verifiedCount = 0;

        for (uint256 i = 0; i < sessions.length; i++) {
            TrainingSession storage session = trainingSessions[sessions[i]];
            if (session.status == VerificationStatus.VERIFIED) {
                totalAccuracy += session.metrics.accuracy;
                totalPrecision += session.metrics.precision;
                totalRecall += session.metrics.recall;
                totalF1 += session.metrics.f1Score;
                verifiedCount++;
            }
        }

        if (verifiedCount > 0) {
            avgAccuracy = totalAccuracy / verifiedCount;
            avgPrecision = totalPrecision / verifiedCount;
            avgRecall = totalRecall / verifiedCount;
            avgF1Score = totalF1 / verifiedCount;
        }

        sessionCount = verifiedCount;
    }

    /**
     * @notice Add supported Tellor query type (admin function)
     * @param queryType Query type to add
     */
    function addSupportedQueryType(string memory queryType) external onlyOwner {
        supportedQueryTypes[queryType] = true;
    }

    /**
     * @notice Emergency withdrawal of stuck funds (admin function)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(usdfc.transfer(owner(), amount), "Withdrawal failed");
    }
} 