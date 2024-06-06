import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useState , FormEvent} from "react"
import './Login.css'
import { API_URL } from "@/globals"
import { useNavigate } from "react-router-dom"

function BrandLoginCard() {
  return(
  <Card className="hidden lg:block lg:w-[486px] login-presentation-card">
  <CardHeader>
    <CardTitle className="text-white">Egresados UAM</CardTitle>
    <CardDescription className="text-gray-400">
      Dirección de Investigación y Extension Universitaria
    </CardDescription>
  </CardHeader>
  <CardContent>
  </CardContent>
  <CardFooter>
  </CardFooter>
</Card>
  )
}

export function Login() {

  const {toast} = useToast()
  const navigate = useNavigate();

  const [accessObj, setAccessObj] = useState({
    email : '',
    password: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;

    setAccessObj({
      ...accessObj,
      [name] : value
    })
  }

  const handleSubmit = async (e : FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    try {
      const authResponse = await fetch(`${API_URL}/admin/login`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json", 
        },
        body : JSON.stringify(accessObj)
      });

      const data = await authResponse.json();

      if(data.status === "error") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
        return;
      } else if (data.status === "success") {
        sessionStorage.setItem('jwt', data.data.token);
        toast({
          title: "Welcome back!",
          description: "Log in Succesful"
        })

        navigate("/admin/dashboard/egresados");
      }

    }catch(error: any) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
    }finally {

      setAccessObj({
        ...accessObj,
        password : ""
      })

      setIsSubmitting(false);
    }
  }

  const passwordRegex = '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$';

  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-uam">
    <section className="flex m-2">
      <BrandLoginCard/>
      <Card className="w-[350px] login-form-full-size">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Admin Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="login-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Username/Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email/username"
                  value={accessObj.email}
                  onChange={handleTextFieldChange}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={accessObj.password}
                  onChange={handleTextFieldChange} 
                  pattern={passwordRegex}
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button type="submit" form="login-form" disabled={isSubmitting}>
            {isSubmitting && <Loader2  className="mr-2 h-4 w-4 animate-spin"/>}
            {isSubmitting? "Submitting" : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </section>
    </section>
  )
}
