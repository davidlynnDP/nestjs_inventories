

interface Supplier {

    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    www: string;
}

export const supplierInformation: Supplier[] = [
    {
        fullName: "Juan Pérez",
        email: "juan.perez@example.com",
        phoneNumber: "310 555 6677",
        address: "Carrera 10 # 12-34, Bogotá, D.C.",
        www: "www.example.com/juan-perez"
      },
      {
        fullName: "Sofía Rodríguez",
        email: "sofia.rodriguez@example.com",
        phoneNumber: "320 444 5566",
        address: "Calle 20 # 30-45, Medellín, Antioquia",
        www: "www.example.com/sofia-rodriguez"
      },
      {
        fullName: "Carlos Gómez",
        email: "carlos.gomez@example.com",
        phoneNumber: "311 666 7788",
        address: "Avenida 30 # 40-55, Cali, Valle del Cauca",
        www: "www.example.com/carlos-gomez"
      },
      {
        fullName: "María Hernández",
        email: "maria.hernandez@example.com",
        phoneNumber: "312 777 8899",
        address: "Carrera 40 # 50-65, Barranquilla, Atlántico",
        www: "www.example.com/maria-hernandez"
      },
      {
        fullName: "Pedro López",
        email: "pedro.lopez@example.com",
        phoneNumber: "313 888 9900",
        address: "Calle 60 # 70-85, Cartagena, Bolívar",
        www: "www.example.com/pedro-lopez"
      }
]
