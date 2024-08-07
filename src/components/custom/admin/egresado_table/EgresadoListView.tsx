import { Egresado, columns, RawEgresado } from "./EgresadoColumn";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { API_URL } from "@/globals";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import React from "react";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getToastParams } from "@/lib/utils";

export async function loader() {
  const adminJwt = sessionStorage.getItem("jwt");

  let data: Egresado[] = [];

  if (!adminJwt) {
    return redirect("/");
  }

  try {
    const response = await fetch(`${API_URL}/egresado/all/list`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminJwt}`,
      },
    });

    const responseJson = await response.json();

    if (responseJson.status === "error") {
      sessionStorage.removeItem("jwt");
      return redirect("/");
    } else if (responseJson.status === "success") {
      const egresados = responseJson.data;

      data = egresados.map((e: RawEgresado) => {
        return {
          id: e.id,
          fullName: e.nombreCompleto,
          graduationDate: e.fechaGraduacion,
          phoneNumber: e.contactosTelefonicos.at(0) || "N/A",
          currentOccupation: e.cargoActual.posicionActual,
          aprobado: e.aprobado,
          email: e.logInEmail,
        };
      });
    }
  } catch (error) {
    console.error(error);
    return redirect("/");
  }

  return data;
}

export async function approveIds({ request }: { request: Request }) {
  const adminJwt = sessionStorage.getItem("jwt");

  if (!adminJwt) {
    return redirect("/");
  }

  const { ids } = await request.json(); // assuming ids is passed as a JSON object

  try {
    return await fetch(`${API_URL}/egresado/all/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: `Submission failed - ${error}`,
      }),
      {
        status: 500,
        statusText: "INTERNAL SERVER ERROR",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export function EgresadoListView() {
  const navigate = useNavigate();
  const adminJwt = sessionStorage.getItem("jwt");

  if (!adminJwt) {
    navigate("/");
  }

  const { toast } = useToast();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const data = useLoaderData() as Egresado[];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const fetcher = useFetcher();
  const submitIdsForApproval = async () => {
    const ids = table.getFilteredSelectedRowModel().rows.map((row) => {
      return row.original.id;
    });

    if (ids.length <= 0) {
      toast({
        variant: "destructive",
        title: "Empty Selection",
        description: "You need to select one or more rows",
      });
    }

    fetcher.submit(
      {
        ids,
      },
      {
        action: "all/approve",
        method: "POST",
        encType: "application/json",
      },
    );
  };

  useEffect(() => {
    const params = getToastParams(fetcher, fetcher.data?.message);

    if (params) {
      toast(params);
    }
  }, [fetcher.state]);

  useEffect(() => {
    const aprobadoColumn = table.getColumn("aprobado");
    aprobadoColumn?.toggleVisibility(false);
    aprobadoColumn?.setFilterValue(true);
    table.getColumn("select")?.toggleVisibility(false);
  }, [table]);

  const renderApproved = () => {
    const column = table.getColumn("select");
    column?.toggleVisibility(false);
    table.getColumn("aprobado")?.setFilterValue(true);
  };

  const renderNonApproved = () => {
    const column = table.getColumn("select");
    column?.toggleVisibility(true);
    table.getColumn("aprobado")?.setFilterValue(false);
  };

  const isSendingApproveRequest = fetcher.state === "submitting";

  return (
    <Card className="h-full rounded-none">
      <CardHeader>
        <CardTitle className="ml-1">Egresados</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="approved" className="w-[400px] pb-4">
          <TabsList>
            <TabsTrigger
              value="approved"
              onClick={renderApproved}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  renderApproved();
                }
              }}
              onFocus={renderApproved}
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="not-approved"
              onClick={renderNonApproved}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  renderNonApproved();
                }
              }}
              onFocus={renderNonApproved}
            >
              Non Approved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="not-approved">
            <Button
              onClick={submitIdsForApproval}
              className="bg-green text-green-foreground hover:bg-green-active"
              variant="outline"
              disabled={isSendingApproveRequest}
            >
              {isSendingApproveRequest && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSendingApproveRequest ? "Approving" : "Approve All Selected"}
            </Button>
          </TabsContent>
        </Tabs>
        <div>
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter emails..."
              value={
                (table.getColumn("email")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("email")?.setFilterValue(event.target.value);
              }}
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
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
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
                      onClick={() => {}}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-8">
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
  );
}
