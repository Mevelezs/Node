import { Exclude, Expose } from 'class-transformer';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderItem, (items) => items.order)
  items: OrderItem[];

  @Expose()
  get products() {
    // esto es un getter
    if (this.items) {
      return this.items
        .filter((item) => !!item) // item difernte de null & unefine
        .map((item) => ({
          ...item.products,
          quantity: item.quantity,
          itemId: item.id,
        }));
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.items) {
      return this.items
        .filter((item) => !!item)
        .reduce((total, item) => {
          const totalItem = item.quantity * item.products.price;
          return total + totalItem;
        }, 0);
    }
    return 0;
  }
}
