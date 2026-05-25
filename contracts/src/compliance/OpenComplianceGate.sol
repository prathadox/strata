// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IComplianceGate} from "../interfaces/IComplianceGate.sol";

/// @dev v1 permissionless gate. Phase 2 replaces it with ComplianceRegistry via vault.setComplianceGate.
contract OpenComplianceGate is IComplianceGate {
    function isAllowed(address, uint8) external pure returns (bool) {
        return true;
    }
}
