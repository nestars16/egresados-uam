import { Outlet , useNavigate} from "react-router-dom"
import { AdminSidebar } from "@/components/custom/admin/AdminSidebar"
import { jwtDecode } from "jwt-decode"


type JwtRolePayload = {
  roles : string[]
}

export function AdminDashboard(){
  const userJwt = sessionStorage.getItem("jwt");
  const navigate = useNavigate();

  if(!userJwt) {
    navigate("/")
  } else {
    const decodedJwt = jwtDecode(userJwt) as JwtRolePayload;
    
    if(decodedJwt.roles.some((role) => role !== "ROLE_ADMIN")) {
      navigate("/")
    }
  }

  return(
      <div className="flex h-full w-full">
        <section>
          <AdminSidebar/>
        </section>
        <section className='w-full h-full'>
          <Outlet/> 
        </section>
      </div>
  )
}
