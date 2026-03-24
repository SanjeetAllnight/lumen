export default function BackgroundEffects() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
      <div className="absolute top-[20%] left-[10%] w-[30vw] h-[30vw] bg-primary/5 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-tertiary/5 blur-[180px] rounded-full"></div>
      <div className="absolute top-[40%] right-[5%] w-[20vw] h-[20vw] bg-error/5 blur-[120px] rounded-full"></div>
    </div>
  );
}
