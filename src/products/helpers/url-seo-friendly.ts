


export const SEOFriendlyURL = ( url: string ): string => {
    
    // Elimina los espacios en blanco
    url = url.replaceAll(" ", "-");
  
    // Elimina los caracteres especiales
    url = url.replaceAll(/[^a-zA-Z0-9-]+/g, "");
  
    // Pasa la URL a minúsculas
    url = url.toLowerCase();
  
    // Elimina los guiones medios
    url = url.replaceAll("--", "-");
  
    // Elimina los guiones bajos
    url = url.replaceAll("_", "-");
  
    // Elimina los acentos
    url = url.replaceAll(/á|é|í|ó|ú/g, "a-e-i-o-u");
  
    // Elimina los símbolos
    url = url.replaceAll(/[,.;!?¿¡]/g, "");
  
    return url;
  }