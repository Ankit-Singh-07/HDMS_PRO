const PrescriptionModal = ({ isOpen, onClose, patientName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] shadow-2xl">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Prescription for {patientName}</h2>
        
        <div className="space-y-4">
          <input type="text" placeholder="Medicine Name" className="w-full border p-2 rounded" />
          <select className="w-full border p-2 rounded">
            <option>Dosage: 1-0-1 (Morning & Night)</option>
            <option>Dosage: 1-1-1 (Thrice a day)</option>
            <option>Dosage: 0-0-1 (Only Night)</option>
          </select>
          <textarea placeholder="Special Instructions" className="w-full border p-2 rounded h-24"></textarea>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 border rounded">Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save & Print</button>
        </div>
      </div>
    </div>
  );
};