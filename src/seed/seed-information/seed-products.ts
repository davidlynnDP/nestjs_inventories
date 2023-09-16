

interface Product {

    title: string;
    description: string;
    unitPrice: number;
    currentStock: number;
    minimumStock: number;

    category: string;
}


export const productInformation: Product[] = [
    {
        title: "Televisor Samsung 440ZH",
        description: "Televisor LED de 44 pulgadas con resolución Full HD.",
        unitPrice: 500000,
        currentStock: 10,
        minimumStock: 5,
        category: "electronics"
    },
    {
        title: "Nevera Whirlpool 350L",
        description: "Nevera de 350 litros con congelador inferior.",
        unitPrice: 200000,
        currentStock: 5,
        minimumStock: 3,
        category: "electronics"
    },
    {
        title: "Lavadora Samsung 16KG",
        description: "Lavadora de 16 kilos con carga frontal.",
        unitPrice: 150000,
        currentStock: 10,
        minimumStock: 5,
        category: "electronics"
    },
    {
        title: "Celular iPhone 13 Pro",
        description: "Celular de gama alta con triple cámara.",
        unitPrice: 4000000,
        currentStock: 2,
        minimumStock: 1,
        category: "technology"
    },
    {
        title: "Computador portátil Dell XPS 13",
        description: "Computador portátil ultrabook con pantalla táctil.",
        unitPrice: 3000000,
        currentStock: 5,
        minimumStock: 3,
        category: "technology"
    },
    {
        title: "Cocina de inducción Whirlpool 60 cm",
        description: "Cocina de inducción con 4 zonas de cocción y función de boost.",
        unitPrice: 2500000,
        currentStock: 10,
        minimumStock: 5,
        category: "electronics"
    },
    {
        title: "Lavadora-secadora Samsung 22 kg",
        description: "Lavadora-secadora de 22 kilos con carga frontal.",
        unitPrice: 2000000,
        currentStock: 10,
        minimumStock: 5,
        category: "electronics"
    },
    {
        title: "Computador portátil Apple MacBook Pro M2",
        description: "Computador portátil ultrabook con procesador Apple M2.",
        unitPrice: 5000000,
        currentStock: 5,
        minimumStock: 3,
        category: "technology"
    },
    {
        title: "Tablet Samsung Galaxy Tab S8 Ultra",
        description: "Tablet de 14,6 pulgadas con pantalla AMOLED y procesador Snapdragon 8 Gen 1.",
        unitPrice: 3500000,
        currentStock: 10,
        minimumStock: 5,
        category: "technology"
    },
    {
        title: "Celular Samsung Galaxy S23 Ultra",
        description: "Celular de gama alta con pantalla AMOLED de 6,8 pulgadas y cámara triple.",
        unitPrice: 4500000,
        currentStock: 2,
        minimumStock: 1,
        category: "technology"
    }
]