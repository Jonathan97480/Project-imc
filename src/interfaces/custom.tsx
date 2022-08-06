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
    img: number
  }
  export interface WeekArray {
    week1: string[]
    week2: string[]
    week3: string[]
    week4: string[]
    week5: string[]
  }
}

export default custom
