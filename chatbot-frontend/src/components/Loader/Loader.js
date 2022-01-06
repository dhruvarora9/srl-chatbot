const Loader = () => {
  let circleCommonClasses = "h-3.5 w-3.5 bg-black rounded-full";

  return (
    <div className="w-screen  flex justify-center pt-40">
      <div className="flex h-10  p-5">
        <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
        <div className={`${circleCommonClasses} mr-1 animate-bounce200`}></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
    </div>
  );
};

export default Loader;
