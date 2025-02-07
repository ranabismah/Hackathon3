const order = {
  name: "order",
  title: "Orders",
  type: "document",
  fields: [
    {
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "customerAddress",
      title: "Customer Address",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "customerPhone",
      title: "Customer Phone",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "productId", title: "Product ID", type: "string" },
            { name: "title", title: "Product Title", type: "string" },
            { name: "price", title: "Price", type: "number" },
            { name: "quantity", title: "Quantity", type: "number" },
          ],
        },
      ],
    },
    {
      name: "paymentMethod",
      title: "Payment Method",
      type: "string",
      options: { list: ["Cash on Delivery"] },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "status",
      title: "Order Status",
      type: "string",
      options: { list: ["Pending", "Shipped", "Delivered"] },
      initialValue: "Pending",
      validation: (Rule: any) => Rule.required(),
    },
  ],
};

export default order;

