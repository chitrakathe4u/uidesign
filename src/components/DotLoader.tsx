function DotLoader() {
  return (
    <div className="flex z-999 space-x-2 justify-center items-center h-full w-full  bg-gray-100 absolute top-0 left-0">
      <span className="sr-only">Loading...</span>
      <div className="h-6 w-6 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-6 w-6 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-6 w-6 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  );
}

export default DotLoader;
