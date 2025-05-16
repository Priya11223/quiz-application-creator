"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Save, ArrowLeft } from "lucide-react"
import { QuestionForm } from "../../components/question-form"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Question } from "@/types/question"

// Function to create an empty question template
const createEmptyQuestion = (id: string): Question => ({
  id,
  text: "",
  category: "General",
  options: [
    { id: "o1", text: "", isCorrect: false },
    { id: "o2", text: "", isCorrect: false },
    { id: "o3", text: "", isCorrect: false },
    { id: "o4", text: "", isCorrect: false },
  ],
})

// Sample questions for initial state
const sampleQuestions: Question[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    category: "Geography",
    options: [
      { id: "o1", text: "Paris", isCorrect: true },
      { id: "o2", text: "London", isCorrect: false },
      { id: "o3", text: "Berlin", isCorrect: false },
      { id: "o4", text: "Madrid", isCorrect: false },
    ],
  },
  {
    id: "q2",
    text: "Which planet is known as the Red Planet?",
    category: "Science",
    options: [
      { id: "o1", text: "Venus", isCorrect: false },
      { id: "o2", text: "Mars", isCorrect: true },
      { id: "o3", text: "Jupiter", isCorrect: false },
      { id: "o4", text: "Saturn", isCorrect: false },
    ],
  },
  {
    id: "q3",
    text: "Who painted the Mona Lisa?",
    category: "Art",
    options: [
      { id: "o1", text: "Vincent van Gogh", isCorrect: false },
      { id: "o2", text: "Pablo Picasso", isCorrect: false },
      { id: "o3", text: "Leonardo da Vinci", isCorrect: true },
      { id: "o4", text: "Michelangelo", isCorrect: false },
    ],
  },
]

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions)
  const [filter, setFilter] = useState("All")

  // Initialize new question state
  const [newQuestion, setNewQuestion] = useState<Question>(() => createEmptyQuestion(`q${questions.length + 1}`))

  // Load questions from localStorage on component mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedQuestions = localStorage.getItem("questions")
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions))
        }
      }
    } catch (error) {
      console.error("Failed to load questions from localStorage:", error)
      // Fallback to sample questions if there's an error
      setQuestions(sampleQuestions)
    }
  }, [])

  // Save questions to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && questions.length > 0) {
        localStorage.setItem("questions", JSON.stringify(questions))
      }
    } catch (error) {
      console.error("Failed to save questions to localStorage:", error)
    }
  }, [questions])

  // Reset the form with a new empty question
  const resetForm = useCallback(() => {
    setNewQuestion(createEmptyQuestion(`q${questions.length + 1}`))
  }, [questions.length])

  const addQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast({
        title: "Missing question text",
        description: "Please provide text for your question.",
        variant: "destructive",
      })
      return
    }

    if (!newQuestion.options.some((o) => o.isCorrect)) {
      toast({
        title: "Missing correct answer",
        description: "Please mark at least one option as correct.",
        variant: "destructive",
      })
      return
    }

    if (newQuestion.options.some((o) => !o.text.trim())) {
      toast({
        title: "Incomplete options",
        description: "Please fill in all option texts.",
        variant: "destructive",
      })
      return
    }

    // Add the new question to the questions array
    setQuestions((prev) => [...prev, newQuestion])

    // Reset the form
    resetForm()

    toast({
      title: "Question added",
      description: "Your question has been added to the question bank.",
    })
  }

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))

    toast({
      title: "Question deleted",
      description: "The question has been removed from the question bank.",
    })
  }

  const updateNewQuestion = (question: Question) => {
    setNewQuestion(question)
  }

  const filteredQuestions = filter === "All" ? questions : questions.filter((q) => q.category === filter)

  // Derive categories from questions
  const categories = ["All", ...Array.from(new Set(questions.map((q) => q.category)))]

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground mt-1">Manage your quiz questions</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Question</CardTitle>
          <CardDescription>Create a new question for your question bank</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Enter your question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newQuestion.category}
                onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <QuestionForm question={newQuestion} onChange={updateNewQuestion} />

            <Button onClick={addQuestion} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Add Question to Bank
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Existing Questions</h2>
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-category">Filter by:</Label>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No questions found in this category.</div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                  <CardDescription>Category: {question.category}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteQuestion(question.id)}>
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div key={option.id} className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                          option.isCorrect ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={option.isCorrect ? "font-medium" : ""}>{option.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
