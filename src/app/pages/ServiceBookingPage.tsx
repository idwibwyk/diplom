import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { BookingForm } from '@/app/components/BookingForm';
import { useEntity } from '@/app/hooks';

type Service = {
  id: number;
  name: string;
  category?: string | null;
  type?: string | null;
  breed?: string | null;
  duration?: string | null;
  duration_minutes?: number | null;
  duration_slots?: number | null;
  image?: string | null;
};
type Master = { id: number; full_name: string };

export function ServiceBookingPage() {
  const [submitted, setSubmitted] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const masterIdParam = searchParams.get('masterId');

  const { list: servicesList, loadingList: loadingServices, loadingListError: servicesError } = useEntity<Service>('services', { fetchListOnMount: true, listParams: { limit: 100 } });
  const { list: mastersList, loadingList: loadingMasters } = useEntity<Master>('masters', { listParams: { limit: 100 } });

  const serviceId = id ? parseInt(id, 10) : undefined;
  const service = serviceId ? (servicesList.find((s) => s.id === serviceId) as Service | undefined) : undefined;
  const masterId = masterIdParam ? parseInt(masterIdParam, 10) : undefined;
  const master = masterId ? (mastersList.find((m) => m.id === masterId) as Master | undefined) : undefined;
  const loading = loadingServices || loadingMasters;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {servicesError && (
          <div className="mb-4 p-4 bg-amber-50 dark:bg-gray-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
            {servicesError}
          </div>
        )}
        {!submitted && (
          <>
            <h1 className="text-3xl font-bold text-center mb-2">Запись на услугу</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
              Подарите питомцу профессиональный уход уже сегодня.
              <br />
             </p>
          </>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-[#4A90E2]/20"
        >
          <BookingForm
            servicesList={servicesList}
            mastersList={mastersList}
            type="service"
            serviceId={service?.id}
            serviceName={service?.name}
            masterId={master?.id}
            masterName={master?.full_name}
            onSuccess={() => {}}
            onSubmitted={() => setSubmitted(true)}
          />
        </motion.div>
        <div className="text-center mt-6">
          <Link
            to={service ? `/services/${service.id}` : '/services/list'}
            className="inline-flex items-center gap-2 text-[#4A90E2] hover:text-[#9EC3EF] font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            К услугам
          </Link>
        </div>
      </div>
    </div>
  );
}
