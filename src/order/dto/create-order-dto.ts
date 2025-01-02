export class CreateOrderDTO {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
