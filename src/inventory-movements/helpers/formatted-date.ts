

export const formattedDate = (): string => {

    const date = new Date();

    const monthsOfTheYear = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];



    const weekday = date.toLocaleDateString("es-ES", {
      weekday: "long",
    });
  
    const dayOfTheMonth = date.getDate();
  
    const month = monthsOfTheYear[date.getMonth()]
  
    const year = date.getFullYear();

    return `${weekday}, ${dayOfTheMonth} de ${month} de ${year}`;
}