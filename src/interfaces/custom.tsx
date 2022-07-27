module custom {
  export interface Days {
    day: string
    month: string
    year: number
    newFinalDate: Date
  }
  export interface dataBaseImcTable {
    date: string
    poids: number
    imc: number
  }
}

export default custom
