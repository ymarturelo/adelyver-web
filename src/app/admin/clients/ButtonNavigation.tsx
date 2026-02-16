import { ChartLine, House, UserRound } from "lucide-react";
import { Button } from "../../__components/ui/button";

export default function ButtonNavigation() {
  return (
    <div className="border border-line flex justify-between p-2 mt-10 gap-2 ">
      <Button variant={"outline"}>{<House></House>}</Button>
      <Button variant={"outline"}>{<UserRound></UserRound>}</Button>
      <Button variant={"outline"}>{<ChartLine></ChartLine>}</Button>
    </div>
  );
}
