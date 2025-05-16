"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Database } from "lucide-react"
import { CreateQuizDialog } from "../components/create-quiz-dialog"
import type { Quiz } from "@/types/quiz"

// Sample quizzes for initial state
const sampleQuizzes: Quiz[] = [
{
      id: "1",
      title: "General Knowledge",
      description: "10 questions about various topics",
      createdAt: "May 10, 2025",
      questions: [],
    },
    {
      id: "2",
      title: "Science Quiz",
      description: "8 questions about physics and chemistry",
      createdAt: "May 12, 2025",
      questions: [],
    },
    {
      id: "3",
      title: "History Trivia",
      description: "12 questions about world history",
      createdAt: "May 14, 2025",
      questions: [],
    },
]

export default function Home() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(sampleQuizzes)

  // Load quizzes from localStorage on component mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedQuizzes = localStorage.getItem("quizzes")
        if (storedQuizzes) {
          setQuizzes(JSON.parse(storedQuizzes))
        }
      }
    } catch (error) {
      console.error("Failed to load quizzes from localStorage:", error)
      // Fallback to sample quizzes if there's an error
      setQuizzes(sampleQuizzes)
    }
  }, [])

  return (
    <div className="container mx-auto py-10 bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quiz Creator</h1>
          <p className="text-muted-foreground mt-1">Create and manage your quizzes</p>
        </div>
        <div className="flex gap-3">
          <Link href="/questions">
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Manage Questions
            </Button>
          </Link>
          <CreateQuizDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Created on {quiz.createdAt}</p>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                <Button size="sm">View</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
