// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {OpenComplianceGate} from "../src/compliance/OpenComplianceGate.sol";

contract OpenComplianceGateTest is Test {
    OpenComplianceGate gate;

    function setUp() public {
        gate = new OpenComplianceGate();
    }

    function test_allowsAnyUserAnyTranche() public view {
        assertTrue(gate.isAllowed(address(0x1234), 0));
        assertTrue(gate.isAllowed(address(0x1234), 1));
        assertTrue(gate.isAllowed(address(0x1234), 2));
        assertTrue(gate.isAllowed(address(0), 2));
    }
}
