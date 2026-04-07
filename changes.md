# FridgePolice Prototype

## Overview
FridgePolice is a roommate food tracking app that manages shared food items and prevents conflicts.

## Scenario 1: Double Allocation
Handled by validating available quantity during approval.
Only one request can be approved if limited food is left.

## Scenario 2: Unused Approved Food
Implemented an expire feature that returns unused portions back to inventory.

## Scenario 3: Duplicate Items
Each item has a unique ID, allowing identical names to be tracked separately.

## Scenario 4: Inventory Mismatch
Users can manually correct food quantity, resetting inconsistent data.

## Engineering Decisions
- Used React state (no database)
- Focused on correctness over UI
- Kept logic simple and testable