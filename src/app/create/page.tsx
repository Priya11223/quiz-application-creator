"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type { Question } from "@/types/question"
import type { Quiz } from "@/types/quiz"

export default function CreateQuizPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const title = searchParams.get("title") || "New Quiz"
  const numQuestions = Number.parseInt(searchParams.get("numQuestions") || "10")

  const [questions, setQuestions] = useState<Question[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  // Load questions and quizzes from localStorage on component mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedQuestions = localStorage.getItem("questions")
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions))
        }

        const storedQuizzes = localStorage.getItem("quizzes")
        if (storedQuizzes) {
          setQuizzes(JSON.parse(storedQuizzes))
        }
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error)
    }
  }, [])

  // Auto-select random questions based on the requested number
  useEffect(() => {
    if (questions.length > 0) {
      // Shuffle the questions array
      const shuffled = [...questions].sort(() => 0.5 - Math.random())
      // Take the first n questions
      const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length))
      setSelectedQuestions(selected.map((q) => q.id))
    }
  }, [questions, numQuestions])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedQuestions.length === 0) {
      toast({
        title: "No questions selected",
        description: "Please select at least one question for your quiz.",
        variant: "destructive",
      })
      return
    }

    // Create a new quiz with the selected questions
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title,
      description: `${selectedQuestions.length} questions`,
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      questions: selectedQuestions,
    }

    // Add the new quiz to the quizzes array
    const updatedQuizzes = [...quizzes, newQuiz]
    setQuizzes(updatedQuizzes)

    // Save to localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
      }
    } catch (error) {
      console.error("Failed to save quizzes to localStorage:", error)
    }

    toast({
      title: "Quiz created!",
      description: `Your quiz "${title}" has been created with ${selectedQuestions.length} questions.`,
    })

    router.push("/")
  }

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) => (prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Quiz: {title}</h1>
          <p className="text-muted-foreground mt-1">Select {numQuestions} questions for your quiz</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Available Questions</h2>
            <p className="text-sm text-muted-foreground">
              Selected: {selectedQuestions.length}/{numQuestions} questions
            </p>
          </div>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-muted-foreground mb-4">No questions available in the question bank.</p>
            <Link href="/questions">
              <Button>Add Questions</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card
                key={question.id}
                className={selectedQuestions.includes(question.id) ? "border-2 border-primary" : ""}
              >
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id={`select-${question.id}`}
                      checked={selectedQuestions.includes(question.id)}
                      onCheckedChange={() => toggleQuestion(question.id)}
                    />
                    <div>
                      <Label htmlFor={`select-${question.id}`} className="text-lg font-medium cursor-pointer">
                        {question.text}
                      </Label>
                      <CardDescription>Category: {question.category}</CardDescription>
                    </div>
                  </div>
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
      </form>
    </div>
  )
}
