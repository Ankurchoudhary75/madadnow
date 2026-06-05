import BottomNav from "../components/BottomNav";

export default function Resources() {
    return (
        <div className="bg-black text-white min-h-screen p-4 pb-20">
            <h2 className="text-xl font-bold mb-4">
                Resources
            </h2>

            {/* 🟦 CATEGORIES */}
            <div className="grid grid-cols-2 gap-3">

                <div className="bg-blue-900/30 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🚑</div>
                    <p className="font-semibold">Medical</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🏠</div>
                    <p className="font-semibold">Shelter</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">💵</div>
                    <p className="font-semibold">Food/Water</p>
                </div>

                <div className="bg-blue-900/30 p-4 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                    <div className="text-4xl mb-3">🆘</div>
                    <p className="font-semibold">Helpline</p>
                </div>

            </div>

            <BottomNav />
        </div>
    );
}