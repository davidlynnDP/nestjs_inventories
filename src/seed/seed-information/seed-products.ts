

interface Product {

    title: string;
    code: string;
    description: string;
    unitPrice: number;
    currentStock: number;
    minimumStock: number;

    images?: string[];
    category?: string;
}


export const productInformation: Product[] = [
    {
        title: "Televisor Samsung 440ZH",
        code: "samsung-tv-440zh-30cm-x-25cm",
        description: "Televisor LED de 44 pulgadas con resolución Full HD.",
        unitPrice: 500000,
        currentStock: 10,
        minimumStock: 5,
        images: [],
        category: "electronics"
    },
    {
        title: "Nevera Whirlpool 350L",
        code: "whirlpool-refrigerador-350l",
        description: "Nevera de 350 litros con congelador inferior.",
        unitPrice: 200000,
        currentStock: 5,
        minimumStock: 3,
        images: [],
        category: "electronics"
    },
    {
        title: "Lavadora Samsung 16KG",
        code: "samsung-lavadora-16kg",
        description: "Lavadora de 16 kilos con carga frontal.",
        unitPrice: 150000,
        currentStock: 10,
        minimumStock: 5,
        images: [],
        category: "electronics"
    },
    {
        title: "Celular iPhone 13 Pro",
        code: "iphone-13-pro",
        description: "Celular de gama alta con triple cámara.",
        unitPrice: 4000000,
        currentStock: 2,
        minimumStock: 1,
        images: [],
        category: "technology"
    },
    {
        title: "Computador portátil Dell XPS 13",
        code: "dell-xps-13",
        description: "Computador portátil ultrabook con pantalla táctil.",
        unitPrice: 3000000,
        currentStock: 5,
        minimumStock: 3,
        images: [],
        category: "technology"
    },
    {
        title: "Cocina de inducción Whirlpool 60 cm",
        code: "whirlpool-cocina-inducción-60cm",
        description: "Cocina de inducción con 4 zonas de cocción y función de boost.",
        unitPrice: 2500000,
        currentStock: 10,
        minimumStock: 5,
        images: [],
        category: "electronics"
    },
    {
        title: "Lavadora-secadora Samsung 22 kg",
        code: "samsung-lavadora-secadora-22kg",
        description: "Lavadora-secadora de 22 kilos con carga frontal.",
        unitPrice: 2000000,
        currentStock: 10,
        minimumStock: 5,
        images: [],
        category: "electronics"
    },
    {
        title: "Computador portátil Apple MacBook Pro M2",
        code: "apple-macbook-pro-m2",
        description: "Computador portátil ultrabook con procesador Apple M2.",
        unitPrice: 5000000,
        currentStock: 5,
        minimumStock: 3,
        images: [],
        category: "technology"
    },
    {
        title: "Tablet Samsung Galaxy Tab S8 Ultra",
        code: "samsung-galaxy-tab-s8-ultra",
        description: "Tablet de 14,6 pulgadas con pantalla AMOLED y procesador Snapdragon 8 Gen 1.",
        unitPrice: 3500000,
        currentStock: 10,
        minimumStock: 5,
        images: [],
        category: "technology"
    },
    {
        title: "Celular Samsung Galaxy S23 Ultra",
        code: "samsung-galaxy-s23-ultra",
        description: "Celular de gama alta con pantalla AMOLED de 6,8 pulgadas y cámara triple.",
        unitPrice: 4500000,
        currentStock: 2,
        minimumStock: 1,
        images: [],
        category: "technology"
    }
]