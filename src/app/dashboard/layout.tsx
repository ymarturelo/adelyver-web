import { MessageCircleQuestionMarkIcon } from "lucide-react";
import AuthGuard from "../__components/AuthGuard";
import ClientGuard from "../__components/ClientGuard";
import Navbar from "../__components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../__components/ui/dialog";
import { IoLogoWhatsapp, IoLogoInstagram, IoMail } from "react-icons/io5";
import Link from "next/link";
import { Button } from "../__components/ui/button";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const socials = [
    [IoLogoWhatsapp, "+5353539439", "https://wa.me/+5353539439"],
    [
      IoLogoInstagram,
      "@_adelyslauraa",
      "https://www.instagram.com/_adelyslauraa/",
    ],
    [
      IoMail,
      "adelyslauradiazordaz@gmail.com",
      "https://adelyslauradiazordaz@gmail.com",
    ],
  ] as const;

  return (
    <AuthGuard>
      <div className="min-h-dvh flex flex-col">
        <Navbar>
          <Dialog>
            <DialogTrigger className="ml-auto">
              <MessageCircleQuestionMarkIcon />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="text-left">
                <DialogTitle> ¿Tienes alguna duda?</DialogTitle>
                <DialogDescription>
                  {" "}
                  Comunícate con nosotros.{" "}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                {socials.map(([Icon, label, link]) => (
                  <Button className="w-fit" key={link} variant="ghost">
                    <Link href={link} className="flex gap-2 items-center">
                      <Icon className="size-6!" />
                      <span className="pb-1">{label}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </Navbar>
        <ClientGuard>{children}</ClientGuard>
      </div>
    </AuthGuard>
  );
}
