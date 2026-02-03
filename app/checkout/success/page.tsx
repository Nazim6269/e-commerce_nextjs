const CheckoutSuccessPage = () => {
  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment successful 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Thank you for your purchase. We&apos;ve received your order and will
          send a confirmation email shortly.
        </p>
      </div>
    </section>
  );
};

export default CheckoutSuccessPage;

