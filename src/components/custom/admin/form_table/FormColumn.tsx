import { ColumnDef } from "@tanstack/react-table";
import { Checkbox} from '@/components/ui/checkbox'
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom";

export type Form = {
  id: string,
  name : string,
  numberOfAnswers: Number,
  published : boolean,
}

export type RawForm = {
  id : string,
  name: string,
  answersCollectedFrom: string[],
  published : boolean
}

export const columns : ColumnDef<Form>[] = [
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
    accessorKey : "name",
    header : "Label"
  },
  {
    accessorKey : "numberOfAnswers",
    header : ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Number of Answers
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    }
  },
  {
    accessorKey : "published",
    header : "Published",
  }, 
 {
    id: "actions",
    enableHiding: false,
    cell: ({row}) => {
      const form = row.original
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
              <Link to={`${form.id}`}>
                Go to Detail
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
