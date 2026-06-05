import { Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ShelterCard({ shelter, userLocation }) {
    const distance = userLocation
        ? Math.sqrt(
            Math.pow(userLocation[0] - shelter.latitude, 2) +
            Math.pow(userLocation[1] - shelter.longitude, 2)
        ).toFixed(2)
        : null;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between glass p-4 mb-4"
        >
            {/* LEFT */}
            <div>
                <p className="text-xs text-green-400">Verified</p>

                <h3 className="font-semibold text-lg">{shelter.name}</h3>

                <p className="text-gray-400 text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {distance} km • {shelter.capacity} beds
                </p>

                <button className="mt-2 bg-green-500 px-4 py-1 rounded-full flex items-center gap-1 text-sm">
                    <Phone size={14} /> Call
                </button>
            </div>

            {/* RIGHT IMAGE */}
            <img
                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
                className="w-20 h-20 rounded-lg object-cover"
            />
        </motion.div>
    );
}