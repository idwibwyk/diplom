import { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, Check } from 'lucide-react';

export function PriceCalculator() {
  const [petType, setPetType] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null);

  const petTypes = [
    { id: 'small-dog', name: 'Маленькая собака', basePrice: 1400 },
    { id: 'medium-dog', name: 'Средняя собака', basePrice: 2000 },
    { id: 'large-dog', name: 'Крупная собака', basePrice: 3500 },
    { id: 'cat', name: 'Кошка', basePrice: 1600 },
    { id: 'rabbit', name: 'Кролик', basePrice: 2000 },
  ];

  const serviceOptions = [
    { id: 'nails', name: 'Стрижка когтей', price: 200 },
    { id: 'aggression', name: 'Доплата за агрессию', price: 300 },
  ];

  const toggleService = (serviceId: string) => {
    setServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  };

  const calculatePrice = () => {
    if (!petType) {
      alert('Пожалуйста, выберите тип питомца');
      return;
    }

    const basePriceObj = petTypes.find((p) => p.id === petType);
    if (!basePriceObj) return;

    const basePrice = basePriceObj.basePrice;
    const servicesPrice = services.reduce((sum, serviceId) => {
      const service = serviceOptions.find((s) => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);

    const totalMin = basePrice + servicesPrice;
    const totalMax = totalMin + Math.round(totalMin * 0.3); // +30% variation

    setEstimatedPrice({ min: totalMin, max: totalMax });
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#4A90E2] to-[#9EC3EF] rounded-full flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold">Калькулятор стоимости</h3>
      </div>

      <div className="space-y-6">
        {/* Pet Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Выберите питомца</label>
          <div className="grid grid-cols-2 gap-3">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setPetType(pet.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  petType === pet.id
                    ? 'border-[#4A90E2] bg-gradient-to-br from-[#4A90E2]/20 to-[#9EC3EF]/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#4A90E2]/50'
                }`}
              >
                <p className="font-medium">{pet.name}</p>
                <p className="text-sm text-gray-500">от {pet.basePrice}₽</p>
              </button>
            ))}
          </div>
        </div>

        {/* Services Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Выберите услуги</label>
          <div className="grid grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                  services.includes(service.id)
                    ? 'border-[#4A90E2] bg-gradient-to-br from-[#4A90E2]/20 to-[#9EC3EF]/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-[#4A90E2]/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    services.includes(service.id)
                      ? 'border-[#4A90E2] bg-[#4A90E2]'
                      : 'border-gray-300'
                  }`}
                >
                  {services.includes(service.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="text-left">
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-gray-500">+{service.price}₽</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculatePrice}
          className="w-full bg-[#4A90E2] hover:bg-[#9EC3EF] text-white py-4 rounded-xl font-bold transition-colors"
        >
          Рассчитать стоимость
        </button>

        {/* Result */}
        {estimatedPrice && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#4A90E2] to-[#9EC3EF] text-white rounded-xl p-6 shadow-lg"
          >
            <p className="text-lg mb-2">Примерная стоимость:</p>
            <p className="text-4xl font-bold mb-4">
              {estimatedPrice.min.toLocaleString()} - {estimatedPrice.max.toLocaleString()} ₽
            </p>
            <p className="text-sm opacity-90">
              * Точную стоимость назовет мастер после консультации и осмотра питомца
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
