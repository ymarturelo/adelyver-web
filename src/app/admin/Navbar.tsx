"use client";
import { BookSearch, LogOutIcon, UserSearch } from "lucide-react";
import Logo from "@/app/__assets/PNG-06.png";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "../__components/ui/toggle-group";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../__components/ui/popover";
import { Button } from "../__components/ui/button";
import { useLogout } from "@/mutations/useLogOut";
import { Spinner } from "../__components/ui/spinner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();

  const activeValue = pathname.includes("/orders") ? "orders" : "clients";

  const handleNavigation = (value: string) => {
    if (!value) return;

    if (value === "orders") {
      router.push("/admin/orders");
    } else {
      router.push("/admin/clients");
    }
  };

  return (
    <div className="sticky gap-4 top-0 bg-background/85 backdrop-blur-sm z-10 flex p-5 items-center mb-5">
      <div className="relative overflow-hidden size-12">
        <Image src={Logo} alt="" className="absolute size-full scale-[6]" />
      </div>
      <ToggleGroup
        className="ml-auto"
        type="single"
        value={activeValue}
        onValueChange={handleNavigation}
      >
        <ToggleGroupItem value="orders" aria-label="Ver pedidos">
          <BookSearch className="size-6" />
        </ToggleGroupItem>
        <ToggleGroupItem value="clients" aria-label="Ver clientes">
          <UserSearch className="size-6" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="aspect-square rounded-full h-full bg-primary p-2 grid place-content-center text-white "
          >
            YM
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit h-fit mr-8">
          <div className="grid gap-4 justify-center">
            <div className="grid gap-1 text-center">
              <div className="aspect-square justify-self-center rounded-full bg-primary p-2 grid w-fit h-fit min-w-[2.5rem] place-content-center text-white">
                YM
              </div>
              <h4 className="leading-none mb-1 font-medium">Yslen Marturelo</h4>
              <p className="text-xs text-muted-foreground">
                yslemarturelo@gmail.com
              </p>
              <p className="text-xs text-muted-foreground">+53 53143133</p>
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
    </div>
  );
}
