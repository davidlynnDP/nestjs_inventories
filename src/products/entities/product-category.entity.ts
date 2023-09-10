import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './product.entity';


@Entity({ name: 'product_categories' }) 
export class ProductCategories {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    category: string;

    @OneToMany(
        () => Product,
        (product) => product.category,
        /* options? - bardHelp */
    )
    products?: Product[];

}