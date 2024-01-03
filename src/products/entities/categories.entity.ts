import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;

  @ManyToMany(() => Products, (product) => product.category)
  @JoinTable({
    name: 'categories_products',
    joinColumn: {
      name: 'category_id',
    },
    inverseJoinColumn: {
      name: 'product_id',
    },
  })
  product: Products[];
}
