import { API_URL } from "@/globals";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Params, redirect, useLoaderData } from "react-router-dom";
import { SingleNotFound } from "../SingleNotFound";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

type Question = {
  id: string;
  question: string;
  type: string;
  possibleAnswers: string[] | null;
  answers: string[];
};

export type Form = {
  id: string;
  name: string;
  description: string | null;
  questions: Question[];
  answersCollectedFrom: string[];
  published: boolean;
};

export async function loader({ params }: { params: Params<"id"> }) {
  const adminJwt = sessionStorage.getItem("jwt");

  if (!adminJwt) {
    return redirect("/");
  }

  try {
    const response = await fetch(`${API_URL}/form/${params.id}`, {
      headers: {
        Authorization: `Bearer ${adminJwt}`,
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    if (responseJson.status === "error") {
      sessionStorage.removeItem("jwt");
      return redirect("/");
    } else if (responseJson.status === "success") {
      return responseJson.data;
    }
  } catch (error) {
    console.error(error);
    return redirect("/admin/dashboard/forms");
  }

  return redirect("/");
}

export function FormSingleView() {
  const form = useLoaderData() as Form | null;

  if (!form) {
    return (
      <>
        <SingleNotFound
          objectType="Form"
          redirectTo="/admin/dashboard/forms"
          message="Go back to dashboard"
        />
      </>
    );
  }

  const downloadExcel = () => {
    const url = `${API_URL}/form/export/${form.id}`;

    const userJwt = sessionStorage.getItem("jwt");

    if (!userJwt) {
      return redirect("/");
    }

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userJwt}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Convert response to a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger a download
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `export-${form.name}.xlsx`; // Default filename
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Revoke the URL after the download is triggered
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((error) => {
        console.error("Error downloading the file:", error);
        alert("Failed to download file. Please try again.");
      });
  };

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="flex justify-between flex-row">
          <div>
            <CardTitle className="mb-3">{form.name}</CardTitle>
            <CardDescription>{form.description || ""}</CardDescription>
          </div>
          <Button variant="outline" onClick={downloadExcel}>
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {form.questions.map((question, index) => (
              <AccordionItem
                value={question.id}
                key={`${index}-${question.id}`}
              >
                <AccordionTrigger>{`Question #${index + 1} - ${question.question}`}</AccordionTrigger>
                <AccordionContent>
                  {question.answers.map((answer, index) => (
                    <Alert key={`${index}-${answer}`}>
                      <AlertTitle>{`Answer ${index + 1}`}</AlertTitle>
                      <AlertDescription>{answer}</AlertDescription>
                    </Alert>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}