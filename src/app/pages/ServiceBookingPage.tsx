import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import { BookingForm } from '@/app/components/BookingForm';
import { useEntity } from '@/app/hooks';

type Service = { id: number; name: string };
type Master = { id: number; full_name: string };

export function ServiceBookingPage() {
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
        <Link
          to={service ? `/services/${service.id}` : '/services/list'}
          className="inline-flex items-center gap-2 text-[#4A90E2] hover:text-[#9EC3EF] mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {service ? 'Назад к услуге' : 'К услугам'}
        </Link>
        <div className="mb-6 p-4 bg-[#4A90E2]/5 rounded-xl border border-[#4A90E2]/20">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Заполните форму — мы свяжемся с вами для подтверждения. Услуга и мастер сохраняются, если вы перешли по кнопке «Записаться».
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-[#4A90E2]/20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-[#4A90E2] rounded-xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Запись на услугу</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {service ? `Услуга: ${service.name}` : 'Выберите услугу'}
              </p>
            </div>
          </div>
          <BookingForm
            servicesList={servicesList}
            mastersList={mastersList}
            type="service"
            serviceId={service?.id}
            serviceName={service?.name}
            masterId={master?.id}
            masterName={master?.full_name}
            onSuccess={() => {}}
          />
        </motion.div>
      </div>
    </div>
  );
}
