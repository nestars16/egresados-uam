import { redirect, Params, useLoaderData } from "react-router-dom";
import { RawEgresado } from "./admin/egresado_table/EgresadoColumn";
import { API_URL } from "@/globals";
import { SingleNotFound } from "./SingleNotFound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import "@uploadcare/react-uploader/core.css";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

export async function loader({ params }: { params: Params<"id"> }) {
  const userJwt = sessionStorage.getItem("jwt");

  if (!userJwt) {
    return redirect("/");
  }

  try {
    const response = await fetch(`${API_URL}/egresado/${params.id}`, {
      headers: {
        Authorization: `Bearer ${userJwt}`,
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
    return redirect("/");
  }
}

type LabeledInputProps = {
  label: string;
  disabled: boolean | null;
  value: string;
  name: string;
  type: string;
  placeholder: string;
};

function LabeledInput({
  label,
  disabled,
  value,
  name,
  type,
  placeholder,
}: LabeledInputProps) {
  return (
    <div className="grid w-9/12 max-w-sm items-center gap-1.5">
      <Label htmlFor={name} className="ml-1">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        disabled={disabled ? disabled : false}
        value={value}
      />
    </div>
  );
}

type DisabledDatePickerProps = {
  date: Date;
  id: string;
  label: string;
};

function DisabledDatePicker({ date, id, label }: DisabledDatePickerProps) {
  return (
    <>
      <Label htmlFor={id} className="m-1 block">
        {label}
      </Label>
      <Button
        id={id}
        name={id}
        variant={"outline"}
        disabled
        className={cn(
          "w-9/12 justify-start text-left font-normal",
          !date && "text-muted-foreground",
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>
    </>
  );
}

export function EgresadoSingleView() {
  const egresado = useLoaderData() as RawEgresado;
  const { toast } = useToast();

  const [egresadoState, setEgresadoState] = useState<RawEgresado>(egresado);
  const [jobStartDate, setJobStartDate] = useState<Date>();
  const [jobEndDate, setJobEndDate] = useState<Date>();
  const [file, setFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fileList = event.target.files;
    setFile(fileList ? fileList.item(0) : null);
  };

  const handleFileUpload = async () => {
    setIsUploadingFile(true);
    const jwt = sessionStorage.getItem("jwt");

    if (file === null) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "File cannot be null",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const formData = new FormData();
    formData.set("resume", file);

    try {
      const response = await fetch(
        `${API_URL}/egresado/${egresadoState.id}/resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body: formData,
        },
      );

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
          description: "Managed to upload CV",
        });

        setEgresadoState({
          ...egresadoState,
          resumeLink: responseJson.data,
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
      setIsUploadingFile(false);
    }
  };

  const birthDate = new Date(egresadoState.fechaNacimiento);
  const graduationDate = new Date(egresadoState.fechaGraduacion);

  if (!egresadoState) {
    return (
      <SingleNotFound
        objectType="Egresado"
        redirectTo="/"
        message="Go back to log-in"
      />
    );
  }

  return (
    <Card className="rounded-none h-full">
      <CardHeader>
        <CardTitle>{egresadoState.nombreCompleto}</CardTitle>
        <CardDescription>CIF - {egresadoState.cif}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row justify-start items-start">
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `1fr 1.5fr` }}
        >
          <section id="input-fields" className="flex flex-col gap-2">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-6">
              Personal Information
            </h3>
            <DisabledDatePicker
              date={birthDate}
              id="birth-date"
              label="Birth Date"
            />
            <DisabledDatePicker
              date={graduationDate}
              label="Graduation Date"
              id="gradudation-date"
            />
            <LabeledInput
              label="Email"
              disabled={true}
              value={egresadoState.logInEmail}
              name="logInEmail"
              type="email"
              placeholder="Email"
            />
            <div className="m-0.5" />
            {egresadoState.contactosTelefonicos.map((number, index) => (
              <LabeledInput
                label={`Phone #${index + 1}`}
                value={number}
                disabled={true}
                name={`number-${index}`}
                placeholder="Phone"
                type="tel"
                key={`number-${index}`}
              />
            ))}
            {egresado.resumeLink === "" ? (
              <div className="flex flex-row gap-1  justify-start items-end">
                <div>
                  <Label htmlFor="cv" className="ml-1">
                    CV
                  </Label>
                  <Input
                    id="cv"
                    type="file"
                    className="ml-1 w-9/12 dark:text-white"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <Button
                    disabled={isUploadingFile}
                    type="submit"
                    onClick={handleFileUpload}
                  >
                    {isUploadingFile && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isUploadingFile ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <a download href={egresado.resumeLink}>
                    Download resume
                  </a>
                </Button>
              </>
            )}
          </section>
          <section id="job-history" className="flex flex-col gap-4">
            <div className="mb-6">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Work History
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter a job you've had in the past
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !jobStartDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {jobStartDate ? (
                      format(jobStartDate, "PPP")
                    ) : (
                      <span>Start Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={jobStartDate}
                    onSelect={setJobStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !jobEndDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {jobEndDate ? (
                      format(jobEndDate, "PPP")
                    ) : (
                      <span>End Date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={jobEndDate}
                    onSelect={setJobEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input className="w-5/12" placeholder="Job title" type="text" />
              <Button> Add </Button>
            </div>
            <Separator className="my-4" />
            <div>
              {egresadoState.trabajos.map((job, index) => (
                <div
                  className="flex flex-row gap-4"
                  key={`oldJobContainer-${index}`}
                >
                  <div>
                    <DisabledDatePicker
                      date={new Date(job.fechaInicio)}
                      label="Start Date"
                      id={`oldJob-${index}`}
                    />
                  </div>
                  <div>
                    <DisabledDatePicker
                      date={new Date(job.fechaTerminacion || new Date())}
                      label="End Date"
                      id={`oldJob-${index}`}
                    />
                  </div>
                  <LabeledInput
                    disabled={true}
                    name={`oldJob-${index}`}
                    label="Job Title"
                    value={job.posicionActual}
                    type="text"
                    placeholder="Job Title"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
}