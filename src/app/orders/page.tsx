"use client";

import { useState } from "react";
import MainLayout from "@/components/mainlayout/MainLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Order, OrderItem } from "@/types/orders";
import { Pencil } from "lucide-react";

// Mock data
const mockOrders: Order[] = [
  {
    orderId: "ORD-001",
    showId: "AWS23",
    occurrenceId: "AWS23-LV",
    subTotal: 15000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 1500,
    orderType: "New",
    customerPO: "PO-12345",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-001",
    orderDate: "2024-03-20",
    boothInfo: "Booth #A12",
    billingAddress: "123 Main St, New York, NY 10001",
    total: 16500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Booth Package A",
        itemDescription: "Standard 10x10 Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 3000,
        newPrice: 3000,
        discount: 0,
        extendedPrice: 3000,
        userItemDescription: "Standard booth with basic setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-20",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-001",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "LED Screen",
        itemDescription: "55-inch LED Display",
        quantity: 2,
        cancellationFee: 500,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 2000,
        newPrice: 2000,
        discount: 0,
        extendedPrice: 4000,
        userItemDescription: "High-resolution display for presentations",
        dff: "N/A",
        orderReceivedDate: "2024-03-20",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-002",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Furniture Package",
        itemDescription: "Basic Booth Furniture Set",
        quantity: 1,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Includes table, chairs, and storage",
        dff: "N/A",
        orderReceivedDate: "2024-03-20",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-003",
        industryInformation: "Technology",
      },
    ],
  },
  {
    orderId: "ORD-002",
    showId: "MSFT24",
    occurrenceId: "BUILD24-SEA",
    subTotal: 25000,
    salesChannel: "Partner",
    terms: "Net 45",
    tax: 2500,
    orderType: "New",
    customerPO: "PO-23456",
    cancelCharge: 0,
    source: "Email",
    project: "P2024-002",
    orderDate: "2024-03-21",
    boothInfo: "Booth #B15",
    billingAddress: "456 Tech Ave, Seattle, WA 98101",
    total: 27500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Premium Booth Package",
        itemDescription: "20x20 Premium Booth",
        quantity: 1,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 12000,
        newPrice: 12000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Premium booth with custom branding",
        dff: "N/A",
        orderReceivedDate: "2024-03-21",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-004",
        industryInformation: "Software",
      },
      {
        serialNo: 2,
        orderedItem: "AV Package",
        itemDescription: "Complete Audio-Visual Setup",
        quantity: 1,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Includes sound system and projectors",
        dff: "N/A",
        orderReceivedDate: "2024-03-21",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-005",
        industryInformation: "Software",
      },
      {
        serialNo: 3,
        orderedItem: "Networking Equipment",
        itemDescription: "High-Speed Network Setup",
        quantity: 1,
        cancellationFee: 300,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 5000,
        userItemDescription: "Enterprise-grade networking equipment",
        dff: "N/A",
        orderReceivedDate: "2024-03-21",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-006",
        industryInformation: "Software",
      },
    ],
  },
  {
    orderId: "ORD-003",
    showId: "GGL24",
    occurrenceId: "IO24-SF",
    subTotal: 18000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 1800,
    orderType: "New",
    customerPO: "PO-34567",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-003",
    orderDate: "2024-03-22",
    boothInfo: "Booth #C08",
    billingAddress: "789 Innovation Way, San Francisco, CA 94105",
    total: 19800,
    items: [
      {
        serialNo: 1,
        orderedItem: "Standard Booth Package",
        itemDescription: "10x10 Standard Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 5000,
        userItemDescription: "Standard booth setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-22",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-007",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "Display Monitors",
        itemDescription: "32-inch 4K Monitors",
        quantity: 3,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 1000,
        newPrice: 1000,
        discount: 0,
        extendedPrice: 3000,
        userItemDescription: "High-resolution monitors for demos",
        dff: "N/A",
        orderReceivedDate: "2024-03-22",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-008",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Demo Stations",
        itemDescription: "Interactive Demo Stations",
        quantity: 2,
        cancellationFee: 400,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 10000,
        userItemDescription: "Interactive demo stations with touch screens",
        dff: "N/A",
        orderReceivedDate: "2024-03-22",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-009",
        industryInformation: "Technology",
      },
    ],
  },
  {
    orderId: "ORD-004",
    showId: "WWDC24",
    occurrenceId: "WWDC24-CUP",
    subTotal: 30000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 3000,
    orderType: "New",
    customerPO: "PO-45678",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-004",
    orderDate: "2024-03-23",
    boothInfo: "Booth #D20",
    billingAddress: "101 Apple Park Way, Cupertino, CA 95014",
    total: 33000,
    items: [
      {
        serialNo: 1,
        orderedItem: "Deluxe Booth Package",
        itemDescription: "30x30 Deluxe Booth",
        quantity: 1,
        cancellationFee: 1500,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 15000,
        newPrice: 15000,
        discount: 0,
        extendedPrice: 15000,
        userItemDescription: "Deluxe booth with premium features",
        dff: "N/A",
        orderReceivedDate: "2024-03-23",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-010",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "Meeting Room Setup",
        itemDescription: "Private Meeting Room",
        quantity: 1,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Private meeting room with AV",
        dff: "N/A",
        orderReceivedDate: "2024-03-23",
        status: "Confirmed",
        itemType: "Room",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-011",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Lounge Area",
        itemDescription: "VIP Lounge Setup",
        quantity: 1,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 7000,
        newPrice: 7000,
        discount: 0,
        extendedPrice: 7000,
        userItemDescription: "VIP lounge with premium furniture",
        dff: "N/A",
        orderReceivedDate: "2024-03-23",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-012",
        industryInformation: "Technology",
      },
    ],
  },
  {
    orderId: "ORD-005",
    showId: "CES24",
    occurrenceId: "CES24-LV",
    subTotal: 22000,
    salesChannel: "Partner",
    terms: "Net 45",
    tax: 2200,
    orderType: "New",
    customerPO: "PO-56789",
    cancelCharge: 0,
    source: "Email",
    project: "P2024-005",
    orderDate: "2024-03-24",
    boothInfo: "Booth #E25",
    billingAddress: "321 Tech Blvd, Las Vegas, NV 89109",
    total: 24200,
    items: [
      {
        serialNo: 1,
        orderedItem: "Standard Booth Package",
        itemDescription: "10x10 Standard Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 5000,
        userItemDescription: "Standard booth setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-24",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-013",
        industryInformation: "Consumer Electronics",
      },
      {
        serialNo: 2,
        orderedItem: "Product Display Cases",
        itemDescription: "Glass Display Cases",
        quantity: 4,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 2000,
        newPrice: 2000,
        discount: 0,
        extendedPrice: 8000,
        userItemDescription: "Premium glass display cases",
        dff: "N/A",
        orderReceivedDate: "2024-03-24",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-014",
        industryInformation: "Consumer Electronics",
      },
      {
        serialNo: 3,
        orderedItem: "Lighting Package",
        itemDescription: "Professional Lighting Setup",
        quantity: 1,
        cancellationFee: 300,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 9000,
        newPrice: 9000,
        discount: 0,
        extendedPrice: 9000,
        userItemDescription: "Professional lighting for product display",
        dff: "N/A",
        orderReceivedDate: "2024-03-24",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-015",
        industryInformation: "Consumer Electronics",
      },
    ],
  },
  {
    orderId: "ORD-006",
    showId: "AWS23",
    occurrenceId: "AWS23-LV",
    subTotal: 35000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 3500,
    orderType: "New",
    customerPO: "PO-67890",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-006",
    orderDate: "2024-03-25",
    boothInfo: "Booth #F30",
    billingAddress: "555 Cloud Ave, Las Vegas, NV 89109",
    total: 38500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Premium Booth Package",
        itemDescription: "20x20 Premium Booth",
        quantity: 1,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 12000,
        newPrice: 12000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Premium booth with custom branding",
        dff: "N/A",
        orderReceivedDate: "2024-03-25",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-016",
        industryInformation: "Cloud Computing",
      },
      {
        serialNo: 2,
        orderedItem: "Server Rack",
        itemDescription: "Enterprise Server Rack",
        quantity: 2,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 16000,
        userItemDescription: "Enterprise-grade server racks",
        dff: "N/A",
        orderReceivedDate: "2024-03-25",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-017",
        industryInformation: "Cloud Computing",
      },
      {
        serialNo: 3,
        orderedItem: "Network Infrastructure",
        itemDescription: "Complete Network Setup",
        quantity: 1,
        cancellationFee: 600,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 7000,
        newPrice: 7000,
        discount: 0,
        extendedPrice: 7000,
        userItemDescription: "Complete network infrastructure setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-25",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-018",
        industryInformation: "Cloud Computing",
      },
    ],
  },
  {
    orderId: "ORD-007",
    showId: "MSFT24",
    occurrenceId: "BUILD24-SEA",
    subTotal: 28000,
    salesChannel: "Partner",
    terms: "Net 45",
    tax: 2800,
    orderType: "New",
    customerPO: "PO-78901",
    cancelCharge: 0,
    source: "Email",
    project: "P2024-007",
    orderDate: "2024-03-26",
    boothInfo: "Booth #G35",
    billingAddress: "777 Dev Street, Seattle, WA 98101",
    total: 30800,
    items: [
      {
        serialNo: 1,
        orderedItem: "Standard Booth Package",
        itemDescription: "10x10 Standard Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 5000,
        userItemDescription: "Standard booth setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-26",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-019",
        industryInformation: "Software Development",
      },
      {
        serialNo: 2,
        orderedItem: "Developer Workstations",
        itemDescription: "High-Performance Workstations",
        quantity: 4,
        cancellationFee: 300,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 3000,
        newPrice: 3000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Developer workstations with dual monitors",
        dff: "N/A",
        orderReceivedDate: "2024-03-26",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-020",
        industryInformation: "Software Development",
      },
      {
        serialNo: 3,
        orderedItem: "Demo Area Setup",
        itemDescription: "Interactive Demo Area",
        quantity: 1,
        cancellationFee: 500,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 11000,
        newPrice: 11000,
        discount: 0,
        extendedPrice: 11000,
        userItemDescription: "Interactive demo area with touch screens",
        dff: "N/A",
        orderReceivedDate: "2024-03-26",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-021",
        industryInformation: "Software Development",
      },
    ],
  },
  {
    orderId: "ORD-008",
    showId: "GGL24",
    occurrenceId: "IO24-SF",
    subTotal: 42000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 4200,
    orderType: "New",
    customerPO: "PO-89012",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-008",
    orderDate: "2024-03-27",
    boothInfo: "Booth #H40",
    billingAddress: "888 Innovation Drive, San Francisco, CA 94105",
    total: 46200,
    items: [
      {
        serialNo: 1,
        orderedItem: "Deluxe Booth Package",
        itemDescription: "30x30 Deluxe Booth",
        quantity: 1,
        cancellationFee: 1500,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 15000,
        newPrice: 15000,
        discount: 0,
        extendedPrice: 15000,
        userItemDescription: "Deluxe booth with premium features",
        dff: "N/A",
        orderReceivedDate: "2024-03-27",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-022",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "Meeting Rooms",
        itemDescription: "Private Meeting Rooms",
        quantity: 2,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 8000,
        newPrice: 8000,
        discount: 0,
        extendedPrice: 16000,
        userItemDescription: "Private meeting rooms with AV",
        dff: "N/A",
        orderReceivedDate: "2024-03-27",
        status: "Confirmed",
        itemType: "Room",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-023",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Lounge Area",
        itemDescription: "VIP Lounge Setup",
        quantity: 1,
        cancellationFee: 800,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 11000,
        newPrice: 11000,
        discount: 0,
        extendedPrice: 11000,
        userItemDescription: "VIP lounge with premium furniture",
        dff: "N/A",
        orderReceivedDate: "2024-03-27",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Deluxe",
        documentNumber: "DOC-024",
        industryInformation: "Technology",
      },
    ],
  },
  {
    orderId: "ORD-009",
    showId: "WWDC24",
    occurrenceId: "WWDC24-CUP",
    subTotal: 19000,
    salesChannel: "Direct",
    terms: "Net 30",
    tax: 1900,
    orderType: "New",
    customerPO: "PO-90123",
    cancelCharge: 0,
    source: "Web",
    project: "P2024-009",
    orderDate: "2024-03-28",
    boothInfo: "Booth #I45",
    billingAddress: "999 Apple Way, Cupertino, CA 95014",
    total: 20900,
    items: [
      {
        serialNo: 1,
        orderedItem: "Standard Booth Package",
        itemDescription: "10x10 Standard Booth",
        quantity: 1,
        cancellationFee: 0,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 5000,
        newPrice: 5000,
        discount: 0,
        extendedPrice: 5000,
        userItemDescription: "Standard booth setup",
        dff: "N/A",
        orderReceivedDate: "2024-03-28",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-025",
        industryInformation: "Technology",
      },
      {
        serialNo: 2,
        orderedItem: "Display Monitors",
        itemDescription: "27-inch 4K Monitors",
        quantity: 4,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 800,
        newPrice: 800,
        discount: 0,
        extendedPrice: 3200,
        userItemDescription: "High-resolution monitors for demos",
        dff: "N/A",
        orderReceivedDate: "2024-03-28",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-026",
        industryInformation: "Technology",
      },
      {
        serialNo: 3,
        orderedItem: "Demo Stations",
        itemDescription: "Interactive Demo Stations",
        quantity: 3,
        cancellationFee: 400,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 4000,
        newPrice: 4000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Interactive demo stations with touch screens",
        dff: "N/A",
        orderReceivedDate: "2024-03-28",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Standard",
        documentNumber: "DOC-027",
        industryInformation: "Technology",
      },
    ],
  },
  {
    orderId: "ORD-010",
    showId: "CES24",
    occurrenceId: "CES24-LV",
    subTotal: 45000,
    salesChannel: "Partner",
    terms: "Net 45",
    tax: 4500,
    orderType: "New",
    customerPO: "PO-01234",
    cancelCharge: 0,
    source: "Email",
    project: "P2024-010",
    orderDate: "2024-03-29",
    boothInfo: "Booth #J50",
    billingAddress: "111 Tech Lane, Las Vegas, NV 89109",
    total: 49500,
    items: [
      {
        serialNo: 1,
        orderedItem: "Premium Booth Package",
        itemDescription: "20x20 Premium Booth",
        quantity: 1,
        cancellationFee: 1000,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 12000,
        newPrice: 12000,
        discount: 0,
        extendedPrice: 12000,
        userItemDescription: "Premium booth with custom branding",
        dff: "N/A",
        orderReceivedDate: "2024-03-29",
        status: "Confirmed",
        itemType: "Booth",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-028",
        industryInformation: "Consumer Electronics",
      },
      {
        serialNo: 2,
        orderedItem: "Product Display Cases",
        itemDescription: "Premium Display Cases",
        quantity: 6,
        cancellationFee: 200,
        quantityCancelled: 0,
        uom: "EA",
        kitPrice: 2500,
        newPrice: 2500,
        discount: 0,
        extendedPrice: 15000,
        userItemDescription: "Premium display cases with lighting",
        dff: "N/A",
        orderReceivedDate: "2024-03-29",
        status: "Confirmed",
        itemType: "Furniture",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-029",
        industryInformation: "Consumer Electronics",
      },
      {
        serialNo: 3,
        orderedItem: "Lighting Package",
        itemDescription: "Professional Lighting Setup",
        quantity: 1,
        cancellationFee: 300,
        quantityCancelled: 0,
        uom: "SET",
        kitPrice: 18000,
        newPrice: 18000,
        discount: 0,
        extendedPrice: 18000,
        userItemDescription: "Professional lighting for product display",
        dff: "N/A",
        orderReceivedDate: "2024-03-29",
        status: "Confirmed",
        itemType: "Equipment",
        ato: false,
        lineType: "Premium",
        documentNumber: "DOC-030",
        industryInformation: "Consumer Electronics",
      },
    ],
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [editedItem, setEditedItem] = useState<OrderItem | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    // If search query is empty, show all orders
    if (!searchQuery) return true;

    // Convert search query to lowercase for case-insensitive search
    const query = searchQuery.toLowerCase();

    // Check if the search query matches any ID
    return (
      order.orderId.toLowerCase().includes(query) ||
      order.showId.toLowerCase().includes(query) ||
      order.occurrenceId.toLowerCase().includes(query) ||
      order.items.some((item) => 
        item.documentNumber.toLowerCase().includes(query)
      )
    );
  });

  const handleOrderEdit = () => {
    if (selectedOrder) {
      setEditedOrder({ ...selectedOrder });
      setIsEditingOrder(true);
    }
  };

  const handleItemEdit = (item: OrderItem) => {
    setEditedItem({ ...item });
    setIsEditingItem(true);
  };

  const handleOrderSave = () => {
    if (editedOrder) {
      // In a real app, you would update the backend here
      const updatedOrders = mockOrders.map(order => 
        order.orderId === editedOrder.orderId ? editedOrder : order
      );
      setSelectedOrder(editedOrder);
      setIsEditingOrder(false);
    }
  };

  const handleItemSave = () => {
    if (editedItem && selectedOrder) {
      // In a real app, you would update the backend here
      const updatedItems = selectedOrder.items.map(item =>
        item.serialNo === editedItem.serialNo ? editedItem : item
      );
      const updatedOrder = {
        ...selectedOrder,
        items: updatedItems
      };
      setSelectedOrder(updatedOrder);
      setIsEditingItem(false);
    }
  };

  return (
    <MainLayout breadcrumbs={[{ label: "Orders" }]}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Orders</CardTitle>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by ID (Order, Show, Occurrence, Document)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button>New Order</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Show ID</TableHead>
                    <TableHead>Customer PO</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow
                      key={order.orderId}
                      className={cn(
                        "cursor-pointer hover:bg-gray-50",
                        selectedOrder?.orderId === order.orderId && "bg-blue-50"
                      )}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.showId}</TableCell>
                      <TableCell>{order.customerPO}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>${order.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">{order.orderType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            handleOrderEdit();
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order Details</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleOrderEdit}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Box 1: Order Information */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Order ID</Label>
                      <Input value={selectedOrder.orderId} readOnly />
                    </div>
                    <div>
                      <Label>Show ID</Label>
                      <Input value={selectedOrder.showId} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label>Occurrence ID</Label>
                    <Input value={selectedOrder.occurrenceId} readOnly />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Sub Total</Label>
                      <Input value={`$${selectedOrder.subTotal}`} readOnly />
                    </div>
                    <div>
                      <Label>Tax</Label>
                      <Input value={`$${selectedOrder.tax}`} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label>Total</Label>
                    <Input value={`$${selectedOrder.total}`} readOnly />
                  </div>
                  <div>
                    <Label>Billing Address</Label>
                    <Input value={selectedOrder.billingAddress} readOnly />
                  </div>
                </div>

                {/* Box 2: Order Items List */}
                <div className="space-y-2">
                  <Label>Order Items</Label>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.serialNo}
                        className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.orderedItem}</p>
                            <p className="text-sm text-gray-500">{item.itemDescription}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{item.status}</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleItemEdit(item);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>${item.extendedPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Order Edit Modal */}
      <Modal
        isOpen={isEditingOrder}
        onClose={() => setIsEditingOrder(false)}
        title="Edit Order"
      >
        {editedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Order ID</Label>
                <Input value={editedOrder.orderId} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Show ID</Label>
                <Input value={editedOrder.showId} onChange={(e) => setEditedOrder({ ...editedOrder, showId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Occurrence ID</Label>
                <Input value={editedOrder.occurrenceId} onChange={(e) => setEditedOrder({ ...editedOrder, occurrenceId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sales Channel</Label>
                <Input value={editedOrder.salesChannel} onChange={(e) => setEditedOrder({ ...editedOrder, salesChannel: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Terms</Label>
                <Input value={editedOrder.terms} onChange={(e) => setEditedOrder({ ...editedOrder, terms: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Type</Label>
                <Input value={editedOrder.orderType} onChange={(e) => setEditedOrder({ ...editedOrder, orderType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer PO</Label>
                <Input value={editedOrder.customerPO} onChange={(e) => setEditedOrder({ ...editedOrder, customerPO: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cancel Charge</Label>
                <Input type="number" value={editedOrder.cancelCharge} onChange={(e) => setEditedOrder({ ...editedOrder, cancelCharge: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Input value={editedOrder.source} onChange={(e) => setEditedOrder({ ...editedOrder, source: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Input value={editedOrder.project} onChange={(e) => setEditedOrder({ ...editedOrder, project: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Date</Label>
                <Input type="date" value={editedOrder.orderDate} onChange={(e) => setEditedOrder({ ...editedOrder, orderDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Booth Info</Label>
                <Input value={editedOrder.boothInfo} onChange={(e) => setEditedOrder({ ...editedOrder, boothInfo: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Billing Address</Label>
                <Input value={editedOrder.billingAddress} onChange={(e) => setEditedOrder({ ...editedOrder, billingAddress: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Sub Total</Label>
                <Input type="number" value={editedOrder.subTotal} onChange={(e) => setEditedOrder({ ...editedOrder, subTotal: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Tax</Label>
                <Input type="number" value={editedOrder.tax} onChange={(e) => setEditedOrder({ ...editedOrder, tax: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input type="number" value={editedOrder.total} onChange={(e) => setEditedOrder({ ...editedOrder, total: Number(e.target.value) })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditingOrder(false)}>Cancel</Button>
              <Button onClick={handleOrderSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Item Edit Modal */}
      <Modal
        isOpen={isEditingItem}
        onClose={() => setIsEditingItem(false)}
        title="Edit Order Item"
      >
        {editedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Serial No</Label>
                <Input value={editedItem.serialNo} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Ordered Item</Label>
                <Input value={editedItem.orderedItem} onChange={(e) => setEditedItem({ ...editedItem, orderedItem: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Item Description</Label>
                <Input value={editedItem.itemDescription} onChange={(e) => setEditedItem({ ...editedItem, itemDescription: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" value={editedItem.quantity} onChange={(e) => setEditedItem({ ...editedItem, quantity: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity Cancelled</Label>
                <Input type="number" value={editedItem.quantityCancelled} onChange={(e) => setEditedItem({ ...editedItem, quantityCancelled: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>UOM</Label>
                <Input value={editedItem.uom} onChange={(e) => setEditedItem({ ...editedItem, uom: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Kit Price</Label>
                <Input type="number" value={editedItem.kitPrice} onChange={(e) => setEditedItem({ ...editedItem, kitPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>New Price</Label>
                <Input type="number" value={editedItem.newPrice} onChange={(e) => setEditedItem({ ...editedItem, newPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Discount</Label>
                <Input type="number" value={editedItem.discount} onChange={(e) => setEditedItem({ ...editedItem, discount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Extended Price</Label>
                <Input type="number" value={editedItem.extendedPrice} onChange={(e) => setEditedItem({ ...editedItem, extendedPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Cancellation Fee</Label>
                <Input type="number" value={editedItem.cancellationFee} onChange={(e) => setEditedItem({ ...editedItem, cancellationFee: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>User Item Description</Label>
                <Input value={editedItem.userItemDescription} onChange={(e) => setEditedItem({ ...editedItem, userItemDescription: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>DFF</Label>
                <Input value={editedItem.dff} onChange={(e) => setEditedItem({ ...editedItem, dff: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Order Received Date</Label>
                <Input type="date" value={editedItem.orderReceivedDate} onChange={(e) => setEditedItem({ ...editedItem, orderReceivedDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input value={editedItem.status} onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Item Type</Label>
                <Input value={editedItem.itemType} onChange={(e) => setEditedItem({ ...editedItem, itemType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ATO</Label>
                <Checkbox checked={editedItem.ato} onCheckedChange={(checked) => setEditedItem({ ...editedItem, ato: checked as boolean })} />
              </div>
              <div className="space-y-2">
                <Label>Line Type</Label>
                <Input value={editedItem.lineType} onChange={(e) => setEditedItem({ ...editedItem, lineType: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Document Number</Label>
                <Input value={editedItem.documentNumber} onChange={(e) => setEditedItem({ ...editedItem, documentNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Industry Information</Label>
                <Input value={editedItem.industryInformation} onChange={(e) => setEditedItem({ ...editedItem, industryInformation: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditingItem(false)}>Cancel</Button>
              <Button onClick={handleItemSave}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Item Details Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Item Details"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Serial No</Label>
                <p>{selectedItem.serialNo}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">UOM</Label>
                <p>{selectedItem.uom}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Quantity</Label>
                <p>{selectedItem.quantity}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Quantity Cancelled</Label>
                <p>{selectedItem.quantityCancelled}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Item Type</Label>
                <p>{selectedItem.itemType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">ATO</Label>
                <Checkbox checked={selectedItem.ato} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Kit Price</Label>
                <p>${selectedItem.kitPrice}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">New Price</Label>
                <p>${selectedItem.newPrice}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Discount</Label>
                <p>${selectedItem.discount}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Extended Price</Label>
                <p>${selectedItem.extendedPrice}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Cancellation Fee</Label>
                <p>${selectedItem.cancellationFee}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-500">User Description</Label>
              <p className="text-sm">{selectedItem.userItemDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">DFF</Label>
                <p>{selectedItem.dff}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Order Received Date</Label>
                <p>{selectedItem.orderReceivedDate}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Line Type</Label>
                <p>{selectedItem.lineType}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Document Number</Label>
                <p>{selectedItem.documentNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Industry Information</Label>
              <p>{selectedItem.industryInformation}</p>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
} 