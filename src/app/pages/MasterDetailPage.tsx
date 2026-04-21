import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { useEntity } from '../hooks';

type MasterRow = { id: number; full_name: string; experience: number | null; specialization: string | null; rating: number | null; image: string | null };
type PortfolioRow = { id: number; master_id: number; title: string; description: string | null; image: string | null; service_id: number | null; breed: string | null; work_date: string | null };

const DEFAULT_MASTER_IMG = '/pictures/Groomer Anna.jpg';

export function MasterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const masterId = id ? parseInt(id, 10) : null;
  const { item: masterData, loadingItem, loadingItemError } = useEntity<MasterRow>('masters', {
    fetchListOnMount: false,
    id: masterId,
    fetchItemOnMount: !!masterId,
    enabled: !!masterId,
  });
  const { list: portfolioList } = useEntity<PortfolioRow>('groomer_portfolio', {
    fetchListOnMount: true,
    listParams: { limit: 50, ...(masterId != null ? { master_id: masterId } : {}) },
  });

  const master = useMemo(() => {
    if (!masterData) return null;
    return {
      id: masterData.id,
      name: masterData.full_name,
      experience: masterData.experience ?? 0,
      specialization: masterData.specialization ?? 'Груминг собак и кошек',
      rating: masterData.rating ?? 0,
      image: masterData.image || DEFAULT_MASTER_IMG,
    };
  }, [masterData]);

  const portfolioItems = useMemo(
    () =>
      portfolioList.map((p) => ({
        id: p.id,
        title: p.title,
        image: p.image || '/pictures/hero-section groom room services.jpg',
        date: p.work_date ? new Date(p.work_date).toLocaleDateString('ru-RU') : '—',
        description: p.description,
      })),
    [portfolioList]
  );

  if (masterId && (loadingItem || !master)) {
    if (loadingItemError) {
      return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{loadingItemError}</p>
            <Link to="/services" className="text-[#4A90E2] hover:underline">Вернуться к услугам</Link>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin" />
      </div>
    );
  }

  if (!master) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Мастер не найден</p>
        <Link to="/services" className="text-[#4A90E2] font-medium hover:underline">Вернуться к услугам</Link>
      </div>
    );
  }

  const defaultPortfolio = portfolioItems.length > 0 ? [] : [
    { id: 0, title: 'Стрижка шпица', image: '/pictures/Gallery services - Pomeranian haircut.jpg', date: '—', description: null },
    { id: 1, title: 'Креативная стрижка пуделя', image: '/pictures/Creative grooming.jpg', date: '—', description: null },
    { id: 2, title: 'Гигиенический уход', image: '/pictures/Cat grooming.jpg', date: '—', description: null },
  ];
  const displayPortfolio = portfolioItems.length > 0 ? portfolioItems : defaultPortfolio;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-[#4A90E2] font-medium hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к услугам
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-12"
        >
          <div className="md:flex">
            <div className="md:w-2/5 relative">
              <img
                src={master.image}
                alt={master.name}
                className="w-full h-80 md:h-full min-h-[320px] object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#4A90E2] text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
                <Star className="w-4 h-4 fill-white" />
                {Number(master.rating).toFixed(1)}
              </div>
            </div>
            <div className="md:w-3/5 p-8 md:p-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] bg-clip-text text-transparent">
                {master.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">{master.specialization}</p>
              <div className="flex items-center gap-2 text-[#4A90E2] font-medium mb-6">
                <Sparkles className="w-5 h-5" />
                <span>Опыт: {master.experience} лет</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Профессионал с многолетним опытом работы в груминге. Работает с породами разных размеров, участвует в выставках и обучает начинающих мастеров.
              </p>
              <Link
                to={`/book/service?masterId=${master.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A90E2] to-[#9EC3EF] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <Calendar className="w-5 h-5" />
                Записаться к мастеру
              </Link>
            </div>
          </div>
        </motion.div>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-[#4A90E2]">Портфолио работ</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPortfolio.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                  <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
