import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CheckoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}
export class CreateCheckoutCommand {
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      image_url: string;
      product_id: number;
    };
  }[];
}

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: CheckoutStatus = CheckoutStatus.PENDING;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'],
    eager: true, // eager loading vs lazy loading (carregamento n + 1) - https://typeorm.io/#/eager-and-lazy-relations
  })
  items: CheckoutItem[];

  static create(input: CreateCheckoutCommand) {
    const checkout = new Checkout();
    checkout.items = input.items.map((item) => {
      const checkoutItem = new CheckoutItem();
      checkoutItem.quantity = item.quantity;
      checkoutItem.price = item.price;

      const checkoutProduct = new CheckoutProduct();
      checkoutProduct.name = item.product.name;
      checkoutProduct.description = item.product.description;
      checkoutProduct.image_url = item.product.image_url;
      checkoutProduct.product_id = item.product.product_id;

      checkoutItem.product = checkoutProduct;
      return checkoutItem;
    });

    checkout.total = input.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    return checkout;
  }

  pay() {
    if (this.status === CheckoutStatus.PAID)
      throw new Error('Checkout already paid');
    if (this.status === CheckoutStatus.FAILED)
      throw new Error('Checkout failed');
    this.status = CheckoutStatus.PAID;
  }

  fail() {
    if (this.status === CheckoutStatus.FAILED)
      throw new Error('Checkout failed');
    if (this.status === CheckoutStatus.PAID)
      throw new Error('Checkout already paid');
    this.status = CheckoutStatus.FAILED;
  }
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column()
  product_id: number;
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Checkout)
  checkout: Checkout;

  @ManyToOne(() => CheckoutProduct, {
    cascade: ['insert'],
    eager: true,
  })
  product: CheckoutProduct;
}
