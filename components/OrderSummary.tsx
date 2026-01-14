export type OrderSummaryProps = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
};

const OrderSummary = ({ subtotal, shipping, tax, discount }: OrderSummaryProps) => {
  const total = subtotal + shipping + tax - discount;

  return (
    <div>
      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
        Order summary
      </h4>
      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">Subtotal</dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">Shipping</dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${shipping.toFixed(2)}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 dark:text-gray-400">Tax</dt>
            <dd className="text-base font-medium text-gray-900 dark:text-white">
              ${tax.toFixed(2)}
            </dd>
          </dl>

          {discount > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-gray-400">Discount</dt>
              <dd className="text-base font-medium text-green-600">
                -${discount.toFixed(2)}
              </dd>
            </dl>
          )}
        </div>

        <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
          <dt className="text-lg font-bold text-gray-900 dark:text-white">
            Total
          </dt>
          <dd className="text-lg font-bold text-gray-900 dark:text-white">
            ${total.toFixed(2)}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default OrderSummary;
