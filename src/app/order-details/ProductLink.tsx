import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";

export default function ProductLink() {
  return (
    <div className="grid grid-cols-[1fr_auto] mt-20 gap-x-4 gap-y-1">
      <h3 className="text-xl font-medium">Chancleta</h3>
      <Link href={""} className="row-span-2 place-self-center">
        <SquareArrowOutUpRight
          size={28}
          className=" text-gray-400 hover:text-primary transition-colors self-start"
        ></SquareArrowOutUpRight>
      </Link>
      <p className="font-light text-sm col-start-1">https:lorem-store</p>

      <h3 className="text-xl font-medium">Chancleta</h3>
      <Link href={""} className="row-span-2 place-self-center">
        <SquareArrowOutUpRight
          size={24}
          className=" text-gray-400 hover:text-primary transition-colors self-start"
        ></SquareArrowOutUpRight>
      </Link>
      <p className="font-light text-sm col-start-1">https:lorem-store</p>

      <h3 className="text-xl font-medium">Chancleta</h3>
      <Link href={""} className="row-span-2 place-self-center">
        <SquareArrowOutUpRight
          size={28}
          className=" text-gray-400 hover:text-primary transition-colors self-start"
        ></SquareArrowOutUpRight>
      </Link>
      <p className="font-light text-sm col-start-1">https:lorem-store</p>
    </div>
  );
}
