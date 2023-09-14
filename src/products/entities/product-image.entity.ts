import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from './';


@Entity({ name: 'product_images' }) 
export class ProductImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
        /* options? - bardHelp */
    )
    product?: Product 
}