import { Form, RawForm, columns} from "./FormColumn"
import { useEffect, useState } from 'react'
import React from "react"


import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  VisibilityState
} from "@tanstack/react-table"


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@radix-ui/react-toast"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

import { Tabs, TabsList, TabsTrigger , TabsContent} from "@/components/ui/tabs"
import { API_URL } from "@/globals"
import { redirect , useLoaderData, useNavigate } from "react-router-dom"

export async function loader() {
  const adminJwt = sessionStorage.getItem("jwt");
  let data : Form[] = []

  if (!adminJwt) {
    return redirect("/");
  }

  try {
    const response = await fetch(`${API_URL}/form/all`, {
        method : "GET",
        headers : {
          "Authorization" : `Bearer ${adminJwt}`
        },
    })

    const responseJson = await response.json();

    if(responseJson.status === "error") {
      sessionStorage.removeItem("jwt");
      return redirect("/")
    } else if (responseJson.status === "success") {
        const egresados = responseJson.data;

        data = egresados.map((e : RawForm) => {
          return {
            id:  e.id,
            name : e.name,
            numberOfAnswers: e.answersCollectedFrom.length,
            published: e.published
          }
        })

    }
  } catch(error) {
    console.error(error)
    return redirect("/")
  }

  return data;
}

export function FormListView() {
  const navigate = useNavigate();
  const adminJwt = sessionStorage.getItem("jwt");

  if(!adminJwt) {
    navigate("/")
  }

  const {toast} = useToast();
  const data = useLoaderData() as Form[];
  const [rowSelection, setRowSelection] = React.useState({})
  const [isPublishing, setIsPublishing] = useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [sorting, setSorting] = React.useState<SortingState>([])


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel : getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange : setColumnVisibility,
    onRowSelectionChange : setRowSelection,
    state : {
      columnFilters,
      columnVisibility,
      rowSelection,
      sorting
    }
  })

  const renderPublished = () => {
    const selectColumn = table.getColumn("select");
    selectColumn?.toggleVisibility(false);
    table.getColumn("published")?.setFilterValue(true);
  }

  const renderNotPublished =() => {
    const selectColumn = table.getColumn("select");
    selectColumn?.toggleVisibility(true);
    table.getColumn("published")?.setFilterValue(false);
  }

  const publishSelected = async () => {
    setIsPublishing(true)

    const ids = table.getFilteredSelectedRowModel().rows.map(
      (row) => {
        return row.original.id
      }
    );

    try {

      const response = await fetch(`${API_URL}/form/all/approve`, {
        method : "POST",
        headers : {
          "Authorization" : `Bearer ${adminJwt}`,
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(ids)
      });

      const responseJson = await response.json();

      if (responseJson.status === "error") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: responseJson.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      } else if (responseJson.status === "success") {
        toast({
          title: "Action Successful",
          description: "Managed to approve all",
          action : <ToastAction altText="Refresh to see changes"> 
            <Button
            onClick={() => {navigate(0)}}
            >
              <p className="leading-7 [&:not(:first-child)]:mt-6"> 
                Refresh to see changes
              </p>
            </Button>
          </ToastAction>
        })
      }
    }catch(error){
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
    }finally{
      setIsPublishing(false)
    }
  }


  useEffect(() => {
    const selectColumn = table.getColumn("select");
    selectColumn?.toggleVisibility(false);
    table.getColumn("published")?.toggleVisibility(false);
    table.getColumn("published")?.setFilterValue(true);

  }, [table])

  return (
    <>
      <Card className="rounded-none h-full">
        <CardHeader>
          <CardTitle className="ml-1">Forms</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full">
            <Tabs defaultValue="approved" className="w-[400px] pb-4">
              <TabsList>
                <TabsTrigger 
                  value="approved"
                  onClick={renderPublished}
                  onFocus={renderPublished}
                  >
                    Published
                  </TabsTrigger>
                <TabsTrigger 
                  value="not-approved"
                  onClick={renderNotPublished}
                  onFocus={renderNotPublished}
                  >
                    Not Published
                  </TabsTrigger>
              </TabsList>
              <TabsContent value="not-approved">
                <Button className="bg-green text-green-foreground hover:bg-green-active" variant="outline" disabled={isPublishing} onClick={publishSelected}>
                  {isPublishing && <Loader2  className="mr-2 h-4 w-4 animate-spin"/>}
                  {isPublishing? "Publishing" : "Publish All Selected"}
                </Button>
              </TabsContent>
            </Tabs>
            <div>
              <div className="flex items-center py-4">
                    <Input
                      placeholder="Filter names..."
                      value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                      onChange={(event) => {
                        table.getColumn("name")?.setFilterValue(event.target.value)
                      }
                      }
                      className="max-w-sm"
                    />
                  </div>
              <div className="rounded-none border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
    </>
  )
}
