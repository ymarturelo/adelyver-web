
import OrderPrice from "./OrderPrice";
import ProductLink from "./ProductLink";
import ProductStatusDetails from "./ProductStatusDetail";

export default function OrderDetails() {
  return (
    <>
      <div className="px-6 w-full max-w-2xl">
        <h1 className="mb-5">Tus pedidos</h1>
        <ProductStatusDetails
          orderStatus="waiting_for_payment"
          createdAt={new Date()}
        />
        <ProductLink></ProductLink>
      </div>
      <OrderPrice></OrderPrice>
    </>
  );
}
