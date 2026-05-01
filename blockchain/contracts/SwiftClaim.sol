// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SwiftClaim {
    address public owner;

    mapping(address => bool) public isAdmin;

    struct PolicyTemplate {
        uint256 id;
        string policyType;
        uint256 premium;
        uint256 coverageAmount;
        uint256 expiryDuration;
        string description;
        bool isActive;
    }

    struct UserPolicy {
        uint256 id;
        uint256 templateId;
        address policyholder;
        uint256 startTime;
        uint256 expiryTime;
        bool isActive;
    }

    enum ClaimStatus { PendingVerification, Verified, Rejected, PayoutPending, Paid }

    struct Claim {
        uint256 id;
        uint256 userPolicyId;
        address claimant;
        string claimType;
        uint256 incidentDate;
        string description;
        string metadataURI;
        ClaimStatus status;
        uint256 timestamp;
    }

    uint256 public policyTemplateCount;
    uint256 public userPolicyCount;
    uint256 public claimCount;
    uint256 public totalPayouts;

    mapping(uint256 => PolicyTemplate) public policyTemplates;
    mapping(uint256 => UserPolicy) public userPolicies;
    mapping(address => uint256[]) public userPoliciesByAddress;
    mapping(uint256 => Claim) public claims;

    // Fraud detection simple counter
    mapping(address => uint256) public lastClaimTime;
    uint256 public constant CLAIM_COOLDOWN = 1 days;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event PolicyTemplateAdded(uint256 indexed templateId, string policyType, uint256 premium, uint256 coverageAmount);
    event PolicyPurchased(uint256 indexed userPolicyId, uint256 indexed templateId, address indexed policyholder);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed userPolicyId, address indexed claimant);
    event ClaimStatusChanged(uint256 indexed claimId, ClaimStatus status);
    event ClaimPaid(uint256 indexed claimId, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender] || msg.sender == owner, "Only admin can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
        isAdmin[msg.sender] = true;
    }

    // --- Admin Functions ---

    function setAdmin(address _admin, bool _status) external onlyOwner {
        isAdmin[_admin] = _status;
        if (_status) {
            emit AdminAdded(_admin);
        } else {
            emit AdminRemoved(_admin);
        }
    }

    function addPolicyTemplate(
        string memory _policyType,
        uint256 _premium,
        uint256 _coverageAmount,
        uint256 _expiryDuration,
        string memory _description
    ) external onlyAdmin {
        policyTemplateCount++;
        policyTemplates[policyTemplateCount] = PolicyTemplate({
            id: policyTemplateCount,
            policyType: _policyType,
            premium: _premium,
            coverageAmount: _coverageAmount,
            expiryDuration: _expiryDuration,
            description: _description,
            isActive: true
        });
        emit PolicyTemplateAdded(policyTemplateCount, _policyType, _premium, _coverageAmount);
    }

    function updatePolicyTemplate(
        uint256 _templateId,
        uint256 _premium,
        uint256 _coverageAmount,
        uint256 _expiryDuration,
        string memory _description,
        bool _isActive
    ) external onlyAdmin {
        require(_templateId > 0 && _templateId <= policyTemplateCount, "Invalid template ID");
        PolicyTemplate storage template = policyTemplates[_templateId];
        template.premium = _premium;
        template.coverageAmount = _coverageAmount;
        template.expiryDuration = _expiryDuration;
        template.description = _description;
        template.isActive = _isActive;
    }

    // --- User Functions ---

    function buyPolicy(uint256 _templateId) external payable {
        require(_templateId > 0 && _templateId <= policyTemplateCount, "Invalid template ID");
        PolicyTemplate memory template = policyTemplates[_templateId];
        require(template.isActive, "Policy template is not active");
        require(msg.value == template.premium, "Incorrect premium amount sent");

        userPolicyCount++;
        userPolicies[userPolicyCount] = UserPolicy({
            id: userPolicyCount,
            templateId: _templateId,
            policyholder: msg.sender,
            startTime: block.timestamp,
            expiryTime: block.timestamp + template.expiryDuration,
            isActive: true
        });

        userPoliciesByAddress[msg.sender].push(userPolicyCount);
        emit PolicyPurchased(userPolicyCount, _templateId, msg.sender);
    }

    function getUserPolicies(address _user) external view returns (uint256[] memory) {
        return userPoliciesByAddress[_user];
    }

    function submitClaim(
        uint256 _userPolicyId,
        string memory _claimType,
        uint256 _incidentDate,
        string memory _description,
        string memory _metadataURI
    ) external {
        require(_userPolicyId > 0 && _userPolicyId <= userPolicyCount, "Invalid user policy ID");
        UserPolicy storage policy = userPolicies[_userPolicyId];
        require(policy.policyholder == msg.sender, "Not the policyholder");
        require(policy.isActive, "Policy is not active");
        require(block.timestamp <= policy.expiryTime, "Policy expired");
        require(block.timestamp > lastClaimTime[msg.sender] + CLAIM_COOLDOWN, "Claim cooldown active: Possible fraud");

        lastClaimTime[msg.sender] = block.timestamp;
        
        claimCount++;
        claims[claimCount] = Claim({
            id: claimCount,
            userPolicyId: _userPolicyId,
            claimant: msg.sender,
            claimType: _claimType,
            incidentDate: _incidentDate,
            description: _description,
            metadataURI: _metadataURI,
            status: ClaimStatus.PendingVerification,
            timestamp: block.timestamp
        });

        emit ClaimSubmitted(claimCount, _userPolicyId, msg.sender);
    }

    // --- Claim Management (Admin) ---

    function verifyClaim(uint256 _claimId) external onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.PendingVerification, "Claim not pending verification");
        claim.status = ClaimStatus.Verified;
        emit ClaimStatusChanged(_claimId, ClaimStatus.Verified);
    }

    function approvePayout(uint256 _claimId) external onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.Verified, "Claim must be verified first");
        claim.status = ClaimStatus.PayoutPending;
        emit ClaimStatusChanged(_claimId, ClaimStatus.PayoutPending);
    }

    function rejectClaim(uint256 _claimId) external onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.PendingVerification || claim.status == ClaimStatus.Verified, "Cannot reject");
        claim.status = ClaimStatus.Rejected;
        emit ClaimStatusChanged(_claimId, ClaimStatus.Rejected);
    }

    function releasePayout(uint256 _claimId) external onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(claim.status == ClaimStatus.PayoutPending, "Payout not pending");
        
        UserPolicy storage policy = userPolicies[claim.userPolicyId];
        PolicyTemplate memory template = policyTemplates[policy.templateId];
        
        require(address(this).balance >= template.coverageAmount, "Insufficient contract balance");

        claim.status = ClaimStatus.Paid;
        policy.isActive = false; // Policy consumed after full payout
        totalPayouts += template.coverageAmount;

        (bool success, ) = claim.claimant.call{value: template.coverageAmount}("");
        require(success, "Transfer failed");

        emit ClaimStatusChanged(_claimId, ClaimStatus.Paid);
        emit ClaimPaid(_claimId, template.coverageAmount);
    }

    // Admin can fund the contract to cover payouts
    receive() external payable {}
}
