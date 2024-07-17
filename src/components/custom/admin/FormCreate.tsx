import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ToastAction } from "@/components/ui/toast";

import { Checkbox } from "@/components/ui/checkbox";

import { X, Loader2 } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/globals";
import { useToast } from "@/components/ui/use-toast";

type QuestionDTO = {
  question: string;
  type: string;
  possibleAnswers: string[] | null;
};

type FormDTO = {
  name: string;
  description: string;
  questions: QuestionDTO[];
  published: boolean;
  answersCollectedFrom: [];
};

export function FormCreate() {
  const [form, setForm] = useState<FormDTO>({
    name: "",
    description: "",
    questions: [
      {
        question: "",
        type: "TEXT",
        possibleAnswers: null,
      },
    ],
    published: false,
    answersCollectedFrom: [],
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { toast } = useToast();

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: event.target.value });
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, description: event.target.value });
  };

  const handleQuestionTextChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newQuestions = form.questions.map((question, qIndex) => {
        if (qIndex === index) {
          return { ...question, question: event.target.value };
        }
        return question;
      });
      setForm({ ...form, questions: newQuestions });
    };

  const handleQuestionTypeChange = (index: number) => (value: string) => {
    const newQuestions = form.questions.map((question, qIndex) => {
      if (qIndex === index) {
        return {
          ...question,
          type: value,
          possibleAnswers: value === "MULTIPLE_CHOICE" ? [""] : null,
        };
      }
      return question;
    });
    setForm({ ...form, questions: newQuestions });
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    const newQuestions = form.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        const newPossibleAnswers = question.possibleAnswers?.map(
          (option, oIndex) => {
            if (oIndex === optionIndex) {
              return value;
            }
            return option;
          },
        );
        return { ...question, possibleAnswers: newPossibleAnswers };
      }
      return question;
    }) as QuestionDTO[];

    setForm({ ...form, questions: newQuestions });
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = form.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        const newPossibleAnswers = question.possibleAnswers?.filter(
          (_, oIndex) => oIndex !== optionIndex,
        );
        return { ...question, possibleAnswers: newPossibleAnswers };
      }
      return question;
    }) as QuestionDTO[];

    setForm({ ...form, questions: newQuestions });
  };

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = form.questions.map((question, qIndex) => {
      if (qIndex === questionIndex && question.possibleAnswers) {
        return {
          ...question,
          possibleAnswers: [...question.possibleAnswers, ""],
        };
      }
      return question;
    }) as QuestionDTO[];
    setForm({ ...form, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion: QuestionDTO = {
      question: "",
      type: "TEXT",
      possibleAnswers: null,
    };
    setForm({ ...form, questions: [...form.questions, newQuestion] });
  };

  const handleChangePublished = () => {
    setForm({ ...form, published: !form.published });
  };

  const handleFormSave = async (e: FormEvent) => {
    e.preventDefault();

    const adminJwt = sessionStorage.getItem("jwt");

    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/form/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminJwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const responseJson = await response.json();

      if (responseJson.status === "error") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: responseJson.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } else if (responseJson.status === "success") {
        toast({
          title: "Action Successful",
          description: "Managed to save form",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Card className="w-full h-full rounded-none">
        <form id="form-creation-form" onSubmit={handleFormSave}>
          <CardHeader>
            <CardTitle>
              <Input
                placeholder="Form Title"
                className="placeholder:text-5xl text-5xl h-20 w-full"
                value={form.name}
                onChange={handleTitleChange}
                required
              />
            </CardTitle>
            <Textarea
              placeholder="Form Description"
              className="w-full"
              value={form.description}
              onChange={handleDescriptionChange}
            />
            <div className="text-sm text-muted-foreground mt-16 flex flex-row">
              <fieldset className="flex items-center space-x-2 m-2">
                <Checkbox
                  id="terms"
                  checked={form.published}
                  onCheckedChange={handleChangePublished}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Publish on Save?
                </label>
              </fieldset>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {form.questions.map((question, questionIndex) => (
                <AccordionItem
                  key={`form-question-${questionIndex}`}
                  value={`form-question-${questionIndex}`}
                >
                  <AccordionTrigger className="w-full">
                    <Input
                      placeholder={`Question #${questionIndex + 1}`}
                      value={question.question}
                      onChange={handleQuestionTextChange(questionIndex)}
                      className="w-11/12"
                      required
                    />
                  </AccordionTrigger>
                  <AccordionContent className="ml-2">
                    <Label className="ml-1">Question Type</Label>
                    <div className="h-2" />
                    <Select
                      onValueChange={handleQuestionTypeChange(questionIndex)}
                      defaultValue={question.type}
                      required
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="MULTIPLE_CHOICE">
                          Multiple Choice
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="h-4" />
                    {question.type === "MULTIPLE_CHOICE" && (
                      <div className="flex flex-col gap-2 mt-2">
                        <Label className="ml-1">Possible Choices</Label>
                        <div className="flex flex-col gap-2 mt-2">
                          {question.possibleAnswers?.map((option, index) => (
                            <div
                              key={`question-possible-answer-${index}`}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(
                                    questionIndex,
                                    index,
                                    e.target.value,
                                  )
                                }
                                placeholder={`Choice ${index + 1}`}
                                className="w-[200px]"
                                required
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  handleRemoveOption(questionIndex, index);
                                }}
                                type="button"
                              >
                                {index !== 0 && <X />}
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleAddOption(questionIndex);
                          }}
                          className="mt-4"
                          type="button"
                        >
                          Add Choice
                        </Button>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-row gap-2">
            <Button onClick={handleAddQuestion} type="button">
              Add
            </Button>
            <Button disabled={isSaving} type="submit">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Form"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
