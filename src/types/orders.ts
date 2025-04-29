export interface OrderItem {
  serialNo: number;
  orderedItem: string;
  itemDescription: string;
  quantity: number;
  cancellationFee: number;
  quantityCancelled: number;
  uom: string;
  kitPrice: number;
  newPrice: number;
  discount: number;
  extendedPrice: number;
  userItemDescription: string;
  dff: string;
  orderReceivedDate: string;
  status: string;
  itemType: string;
  ato: boolean;
  lineType: string;
  documentNumber: string;
  industryInformation: string;
  isNew?: boolean;
}

export interface Order {
  orderId: string;
  showId: string;
  occurrenceId: string;
  subTotal: number;
  salesChannel: string;
  terms: string;
  tax: number;
  orderType: string;
  customerPO: string;
  cancelCharge: number;
  source: string;
  project: string;
  orderDate: string;
  boothInfo: string;
  billingAddress: string;
  total: number;
  items: OrderItem[];
} 