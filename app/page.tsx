import { NavBar } from '/components/nav-bar'

export default function Home() {
  return (
    <div className="content relative isolate min-h-[200vh] overflow-hidden bg-background">
      <NavBar />

      <main className="py-6">
        <h1>Hello</h1>
      </main>
    </div>
  )
}
