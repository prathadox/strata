// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {TrancheController} from "./TrancheController.sol";
import {IComplianceGate} from "./interfaces/IComplianceGate.sol";

contract TrancheVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;

    error NotCompliant();

    TrancheController public immutable controller;
    TrancheController.Tranche public immutable tranche;
    IComplianceGate public complianceGate;

    event ComplianceGateUpdated(address gate);

    constructor(
        IERC20Metadata asset_,
        TrancheController controller_,
        IComplianceGate gate_,
        TrancheController.Tranche tranche_,
        address owner_,
        string memory name_,
        string memory symbol_
    ) ERC4626(asset_) ERC20(name_, symbol_) Ownable(owner_) {
        controller = controller_;
        tranche = tranche_;
        complianceGate = gate_;
    }

    function setComplianceGate(IComplianceGate gate_) external onlyOwner {
        complianceGate = gate_;
        emit ComplianceGateUpdated(address(gate_));
    }

    /// @dev NAV is bookkept by the Controller (not raw balance), so totalAssets only moves on harvest.
    function totalAssets() public view override returns (uint256) {
        return controller.trancheNAVView(tranche);
    }

    /// @dev small virtual-shares offset; the bookkept-NAV design already blocks donation inflation.
    function _decimalsOffset() internal pure override returns (uint8) {
        return 3;
    }

    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        if (!complianceGate.isAllowed(receiver, uint8(tranche))) revert NotCompliant();
        return super.deposit(assets, receiver);
    }

    function mint(uint256 shares, address receiver) public override returns (uint256) {
        if (!complianceGate.isAllowed(receiver, uint8(tranche))) revert NotCompliant();
        return super.mint(shares, receiver);
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        IERC20(asset()).safeTransferFrom(caller, address(controller), assets);
        controller.notifyDeposit(tranche, assets);
        _mint(receiver, shares);
        emit Deposit(caller, receiver, assets, shares);
    }

    function _withdraw(address caller, address receiver, address owner_, uint256 assets, uint256 shares)
        internal override
    {
        if (caller != owner_) _spendAllowance(owner_, caller, shares);
        _burn(owner_, shares);
        controller.notifyWithdraw(tranche, assets, receiver);
        emit Withdraw(caller, receiver, owner_, assets, shares);
    }
}
