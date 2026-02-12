export default function OrderPrice() {
  return (
    <div className="grid grid-cols-[auto_1fr] ml-20 gap-x-4">
      <p className="place-self-center">precio del pedido:</p>
      <p className="text-4xl">$20</p>
      <p className="ml-auto col-start-1 place-self-center">precio del envío:</p>
      <p className="text-4xl">$80</p>
    </div>
  );
}
