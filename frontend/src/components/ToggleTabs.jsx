export default function ToggleTabs({ active, setActive }) {
    return (
        <div className="flex bg-gray-800 rounded-full p-1 mb-3">
            <button onClick={() => setActive("list")} className={`flex-1 ${active === "list" ? "bg-black" : ""}`}>
                List
            </button>
            <button onClick={() => setActive("map")} className={`flex-1 ${active === "map" ? "bg-black" : ""}`}>
                Map
            </button>
        </div>
    );
}