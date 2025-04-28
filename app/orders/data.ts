 const orders = [
  {
    orderId: "3478019",
    status: "Closed",
    customer: "3ARM",
    salesChannel: "EXHIBITOR",
    terms: "IMMED",
    orderType: "Freight Order",
    customerPo: "EDB8F-5D62B",
    source: "GES Experience",
    project: "071671301",
    booth: "S2885 - PROMAT_201704 - 3ARM",
    orderDate: "2017-02-20",
    subtotal: 209.43,
    tax: 0,
    cancelCharge: 0,
    total: 209.43,
    billToAddress1: "POLIND PLA DELS VIN",
    billToAddress2: "SANT JOAN DE VILATORRADA",

    lineItems: [
      {
        line: "1.1",
        orderedItem: "200400",
        itemDescription: "ESTIMATED MATERIAL HANDLING",
        qty: 1,
        cancellationFee: "",
        qtyCancelled: 0,
        uom: "EA",
        kitPrice: 0,
        newPrice: 837.72,
        discount: "",
        extendedPrice: 837.72,
        userItemDescription: "",
        dff: "||||||||No",
      },
      {
        line: "2.1",
        orderedItem: "200400",
        itemDescription: "ESTIMATED MATERIAL HANDLING",
        qty: 1,
        cancellationFee: "",
        qtyCancelled: 0,
        uom: "EA",
        kitPrice: -837.72,
        newPrice: -837.72,
        discount: "",
        extendedPrice: -837.72,
        userItemDescription: "",
        dff: "|No",
      },
      {
        line: "3.1",
        orderedItem: "200500",
        itemDescription: "EXHIBIT MATERIAL HANDLING",
        qty: 3,
        cancellationFee: "",
        qtyCancelled: 0,
        uom: "SSC",
        kitPrice: 69.81,
        newPrice: 69.81,
        discount: "",
        extendedPrice: 209.43,
        userItemDescription: "",
        dff: "||2.50",
      }
    ]
  }
  // Add more orders here
];


export default orders;