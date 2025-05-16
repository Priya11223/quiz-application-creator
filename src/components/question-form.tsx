"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/types/question"

interface QuestionFormProps {
  question: Question
  onChange: (question: Question) => void
}

export function QuestionForm({ question, onChange }: QuestionFormProps) {
  const [correctOption, setCorrectOption] = useState<string>(() => {
    const correct = question.options.find((o) => o.isCorrect)
    return correct ? correct.id : ""
  })

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...question,
      text: e.target.value,
    })
  }

  const handleOptionTextChange = (optionId: string, text: string) => {
    onChange({
      ...question,
      options: question.options.map((option) => (option.id === optionId ? { ...option, text } : option)),
    })
  }

  const handleCorrectOptionChange = (optionId: string) => {
    setCorrectOption(optionId)
    onChange({
      ...question,
      options: question.options.map((option) => ({
        ...option,
        isCorrect: option.id === optionId,
      })),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}`}>Question Text</Label>
        <Textarea
          id={`question-${question.id}`}
          value={question.text}
          onChange={handleQuestionTextChange}
          placeholder="Enter your question"
        />
      </div>

      <div className="space-y-2">
        <Label>Answer Options</Label>
        <RadioGroup value={correctOption} onValueChange={handleCorrectOptionChange}>
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <div className="flex-1 flex items-center">
                <Label htmlFor={option.id} className="mr-2 w-8">
                  {String.fromCharCode(65 + index)}:
                </Label>
                <Input
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1"
                />
              </div>
            </div>
          ))}
        </RadioGroup>
        <p className="text-sm text-muted-foreground mt-2">Select the radio button next to the correct answer</p>
      </div>
    </div>
  )
}
