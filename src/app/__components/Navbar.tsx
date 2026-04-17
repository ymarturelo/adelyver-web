"use client";
import { LogOutIcon } from "lucide-react";
import Logo from "@/app/__assets/PNG-0006.png";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { useLogout } from "@/mutations/useLogOut";
import { Spinner } from "./ui/spinner";
import { ReactNode } from "react";
import useGetCurrentUserQuery from "@/queries/useGetCurrentUserQuery";

export default function Navbar({ children }: { children: ReactNode }) {
  const logoutMutation = useLogout();
  const userQuery = useGetCurrentUserQuery();

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky gap-4 top-0 bg-background/85 backdrop-blur-sm z-10 flex p-5 items-center mb-5 w-full md:w-xl md:mx-auto">
      <div className="relative h-10 w-32 overflow-hidden">
        <Image
          src={Logo}
          alt=""
          className="absolute object-contain size-full scale-[4]"
        />
      </div>

      {children}

      {!userQuery.isLoading && userQuery.data && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="aspect-square rounded-full min-w-10 h-fit bg-primary p-2 grid place-content-center text-white "
            >
              {userQuery.isLoading ? (
                <Spinner className="size-4" />
              ) : (
                getInitials(userQuery.data?.fullName)
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit h-fit mr-4">
            <div className="grid gap-4 justify-center">
              <div className="grid gap-1 text-center">
                <div className="aspect-square justify-self-center rounded-full bg-primary p-2 grid w-fit h-fit min-w-10 place-content-center text-white">
                  {getInitials(userQuery.data?.fullName)}
                </div>
                <h4 className="leading-none mb-1 font-medium">
                  {userQuery.data?.fullName || "Usuario"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {userQuery.data?.email || "Sin correo"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userQuery.data?.phone || "Sin teléfono"}
                </p>
              </div>
              <Button
                variant={"ghost"}
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="-mx-3 justify-start gap-1 hover:opacity-70 transition-all duration-300 ease-in-out"
              >
                {logoutMutation.isPending ? (
                  <Spinner className="size-4" />
                ) : (
                  <LogOutIcon className="size-4 shrink-0" />
                )}
                <span className="font-semibold">
                  {logoutMutation.isPending ? "Saliendo..." : "Salir"}
                </span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </nav>
  );
}
