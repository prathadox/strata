// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IComplianceGate {
    /// @param tranche 0=Senior, 1=Mezzanine, 2=Junior
    function isAllowed(address user, uint8 tranche) external view returns (bool);
}
