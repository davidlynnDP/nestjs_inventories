
interface Company {

    companyName: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    www: string;
}


export const companiesInformation: Company[] = [
    {
        companyName: "Samsung Electronics Colombia",
        email: "contacto@samsung.com.co",
        password: "samsung123",
        phoneNumber: "5874678",
        address: "Carrera 10 # 12-34, Bogotá, D.C.",
        www: "www.samsung.com.co"
    },
    {
        companyName: "Whirlpool Colombia",
        email: "contacto@whirlpool.com.co",
        password: "whirlpool123",
        phoneNumber: "3105556677",
        address: "Calle 20 # 30-45, Medellín, Antioquia",
        www: "www.whirlpool.com.co"
    },
    {
        companyName: "LG Electronics Colombia",
        email: "contacto@lg.com.co",
        password: "lg123",
        phoneNumber: "3116667788",
        address: "Avenida 30 # 40-55, Cali, Valle del Cauca",
        www: "www.lg.com.co"
    },
    {
        companyName: "Apple Colombia",
        email: "contacto@apple.com.co",
        password: "apple123",
        phoneNumber: "3127778899",
        address: "Carrera 40 # 50-65, Barranquilla, Atlántico",
        www: "www.apple.com.co"
    },
    {
        companyName: "Microsoft Colombia",
        email: "contacto@microsoft.com.co",
        password: "microsoft123",
        phoneNumber: "3138889900",
        address: "Calle 60 # 70-85, Cartagena, Bolívar",
        www: "www.microsoft.com.co"
    }
]