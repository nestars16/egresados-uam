import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { NotepadText, UserRound, Megaphone } from "lucide-react"
import { Link } from "react-router-dom"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function AdminSidebar() {
  return(
    <>
    <Command className="bg-card rounded-none h-full">
      <CommandList className="overflow-y-auto">
        <CommandGroup heading="Actions">
          <CommandItem>
          <UserRound className="mr-2"/>
            <Link to="/admin/dashboard/egresados">Egresado</Link>
          </CommandItem>
          <CommandItem>
            <NotepadText className="mr-2"/>
            <Link to="/admin/dashboard/forms">
              <ContextMenu>
                <ContextMenuTrigger>Forms</ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Link to="/">
                      Create
                    </Link>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </Link>
          </CommandItem>
          <CommandItem>
            <Megaphone className="mr-2" />
            <Link to="/admin/dashboard/advertisements">Advertisement</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
    </>
  )
}