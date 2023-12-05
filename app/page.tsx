import Particles from "$components/particles";

export default function Home() {
  return (
    <div className="content relative isolate min-h-screen overflow-hidden bg-background">
      <Particles className="content-expand absolute inset-0 -z-10 bg-transparent" quantity={100} adopt />
      <div className="my-20">
        <h1>Hello</h1>
      </div>
    </div>
  );
}
