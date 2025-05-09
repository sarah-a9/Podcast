import MainContent from "./components/MainContent/MainContent";

export default function HomePage() {
  return (
    <div className="main-content pl-2 pr-2 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-transparent">
      <main className="flex-1 ">
        <MainContent/>
      </main>
    </div>
  )
}


