import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

export type Egresado = {
  id : string,
  fullName : string,
  email : string,
  graduationDate : string,
  phoneNumber : string,
  currentOccupation : string,
  aprobado : boolean,
}

type Job = {
  posicionActual: string,
  fechaInicio : string,
  fechaTerminacion : string | null
}

export type RawEgresado = {
  id : string,
  nombreCompleto : string,
  logInEmail : string,
  fechaGraduacion : string,
  fechaNacimiento : string,
  contactosTelefonicos : string[],
  correos : string[],
  aprobado : boolean,
  cif : string,
  cargoActual : Job,
  trabajos : Job[],
  resumeLink : string,
}

export const columns : ColumnDef<Egresado>[] = [
  {
      id: "select",
      accessorKey : "select",
      header: ({ table } : any) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell : ({ row } : any) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    },

  {
    accessorKey : "fullName",
    header : "Full Name",
  },
  {
    accessorKey : "email",
    header : "Email",
  },
  {
    accessorKey : "graduationDate",
    header : "Graduated on",
  },
  {
    accessorKey: "phoneNumber",
    header : "Phone",
  },
  {
    accessorKey : "currentOccupation",
    header : "Occupation",
  }, 
  {
    accessorKey : "aprobado",
    header : "Aprobado",
    enableSorting : true
  }, 
 {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const egresado = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to={`${egresado.id}`}>
                Go to Profile 
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
