import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Brands } from './brands.entity';
import { Category } from './categories.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'varchar' })
  image: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }) // el tipo organiza la hora segun la zona y el default es para no tener que pasarlo
  updateAt: Date;

  @ManyToOne(() => Brands, (brand) => brand.product)
  @JoinColumn({ name: 'brand_id' })
  brand: Brands;

  @ManyToMany(() => Category, (category) => category.product)
  category: Category[];
}
