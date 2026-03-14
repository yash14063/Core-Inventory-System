A modular Inventory Management System (IMS) that digitizes and streamlines all stock-related operations within a business.

The system replaces manual registers, Excel sheets, and fragmented tracking methods with a centralized, real-time, easy-to-use application for managing inventory, warehouses, and stock movements.

This project was developed as part of a hackathon project to demonstrate modern warehouse and inventory management practices.

Features
Authentication Module

Users can securely access the system using authentication.

Features:

User Registration

Login / Logout

OTP-based password reset

JWT authentication

Role-based access

User Roles:

Inventory Manager

Full permissions

Warehouse Staff

Limited operational permissions

After login, users are redirected to the Inventory Dashboard.

Dashboard Module

The dashboard provides a real-time overview of inventory operations.

Dashboard KPIs

Total Products in Stock

Low Stock Items

Out-of-Stock Items

Pending Receipts

Pending Deliveries

Scheduled Internal Transfers

Dashboard Visualizations

Inventory distribution by category

Inventory movement trends

Warehouse stock comparison

Dynamic Filters

Filter data by:

Document Type

Receipts

Deliveries

Internal Transfers

Adjustments

Status

Draft

Waiting

Ready

Done

Cancelled

Warehouse

Product Category

Product Management

Manage all products stored in warehouses.

Product Fields

Product Name

SKU / Product Code

Category

Unit of Measure

Initial Stock

Reorder Level

Warehouse Location

Capabilities

Create and update products

SKU search

Category filtering

Stock tracking per warehouse location

Low stock alerts

Warehouse Management

The system supports multiple warehouses and storage locations.

Warehouse Fields

Warehouse Name

Warehouse Code

Address

Location Structure

Each warehouse can contain locations such as:

Rack A

Rack B

Shelf 1

Shelf 2

Stock is tracked per location inside each warehouse.

Receipts (Incoming Goods)

Used when products arrive from suppliers.

Workflow

Create receipt

Add supplier

Add products and quantities

Validate receipt

After validation, stock increases automatically.

Example:

Receive 50 Steel Rods

Stock becomes:

Steel Rods → +50

Delivery Orders (Outgoing Goods)

Used when products are shipped to customers.

Workflow

Create delivery order

Select customer

Pick items

Pack items

Validate delivery

After validation, stock decreases automatically.

Example:

Deliver 10 Chairs

Stock becomes:

Chairs → -10

Internal Transfers

Move stock between warehouses or locations.

Examples:

Main Warehouse → Production Floor

Rack A → Rack B

Warehouse 1 → Warehouse 2

Total stock remains the same, but location changes.

All transfers are recorded in the system.

Stock Adjustments

Used to fix differences between:

System stock

Physical stock count

Steps

Select product

Select warehouse/location

Enter counted quantity

System updates stock automatically

Adjustment logged in ledger

Example:

System stock = 50

Physical count = 47

Adjustment:

Stock → -3

Move History / Stock Ledger

Every inventory movement is recorded in the Stock Ledger.

Ledger Tracks

Product

Quantity

Movement Type

Receipt

Delivery

Internal Transfer

Adjustment

Source Location

Destination Location

Timestamp

User performing action

This ensures full traceability of inventory movements.

Alerts

The system generates alerts for:

Low stock

Out-of-stock items

Pending deliveries

Pending receipts

Search & Filters

Smart filters allow quick access to data.

Search by:

SKU

Product category

Warehouse

Stock status

Application Navigation
Sidebar Menu

Dashboard

Products

Operations

Receipts

Delivery Orders

Internal Transfers

Inventory Adjustments

Move History

Warehouses

Settings

Profile Menu

My Profile

Logout

Database Design

The system uses normalized relational tables.

Main tables:

Users

Products

Categories

Warehouses

Locations

Stock

Receipts

Receipt Items

Delivery Orders

Delivery Items

Internal Transfers

Transfer Items

Stock Adjustments

Stock Ledger

Each table uses foreign key relationships for data integrity.

API Endpoints

REST APIs are used for backend communication.

Auth APIs

Register

Login

Reset password

OTP verification

Inventory APIs

Products

Warehouses

Receipts

Deliveries

Transfers

Adjustments

Stock Ledger

All APIs follow RESTful naming conventions.

Project Structure

Based on your current project:

inventory-management-system
│
├── src
│   ├── app
│   ├── styles
│   └── main.tsx
│
├── index.html
├── package.json
├── vite.config.ts
├── postcss.config.mjs
└── README.md
