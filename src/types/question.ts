export interface Option {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  text: string
  category: string
  options: Option[]
}
