import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Clock, BookOpen } from 'lucide-react';

export function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Как выбрать правильную стрижку для вашей собаки',
      excerpt: 'Руководство по выбору стрижки в зависимости от породы, типа шерсти и образа жизни питомца.',
      author: 'Анна Петрова',
      date: '2026-01-15',
      category: 'Уход',
      readTime: '5 мин',
      image: 'https://images.unsplash.com/photo-1648643118660-efb8eb0aea93?w=800',
    },
    {
      id: 2,
      title: '10 советов по уходу за шерстью собаки между визитами к грумеру',
      excerpt: 'Практические советы от наших мастеров о том, как поддерживать шерсть питомца в идеальном состоянии.',
      author: 'Мария Иванова',
      date: '2026-01-10',
      category: 'Советы',
      readTime: '7 мин',
      image: 'https://images.unsplash.com/photo-1728448644193-34eb04460c95?w=800',
    },
    {
      id: 3,
      title: 'Как подготовить щенка к первому визиту к грумеру',
      excerpt: 'Важные рекомендации для владельцев щенков, которые хотят приучить питомца к грумингу.',
      author: 'Елена Смирнова',
      date: '2026-01-05',
      category: 'Обучение',
      readTime: '6 мин',
      image: 'https://images.unsplash.com/photo-1752178407704-6a088ede9ef9?w=800',
    },
    {
      id: 4,
      title: 'Сезонный груминг: что нужно знать о летнем уходе',
      excerpt: 'Особенности ухода за питомцем в жаркое время года и какие процедуры необходимы.',
      author: 'Ольга Козлова',
      date: '2025-12-28',
      category: 'Сезонный уход',
      readTime: '5 мин',
      image: 'https://images.unsplash.com/photo-1653150756437-41454967e9f5?w=800',
    },
    {
      id: 5,
      title: 'Проблемы с кожей у собак: когда обращаться к грумеру',
      excerpt: 'Признаки проблем с кожей, которые можно заметить во время груминга, и как на них реагировать.',
      author: 'Иван Соколов',
      date: '2025-12-20',
      category: 'Здоровье',
      readTime: '8 мин',
      image: 'https://images.unsplash.com/photo-1759134155377-4207d89b39ec?w=800',
    },
    {
      id: 6,
      title: 'История груминга: от древности до наших дней',
      excerpt: 'Интересная экскурсия в историю профессии грумера и как она развивалась на протяжении веков.',
      author: 'Дарья Морозова',
      date: '2025-12-15',
      category: 'История',
      readTime: '10 мин',
      image: 'https://images.unsplash.com/photo-1752021382723-28103aa59245?w=800',
    },
  ];

  const categories = ['Все', 'Уход', 'Советы', 'Обучение', 'Сезонный уход', 'Здоровье', 'История'];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-r from-[#E56E9B] to-[#FFB3BA]">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold mb-6">Блог</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              Полезные статьи и советы от наших специалистов
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  index === 0
                    ? 'bg-[#E56E9B] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-[#E56E9B] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#E56E9B] text-white px-4 py-2 rounded-full text-sm font-bold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <Link
                      to={`/blog/${post.id}`}
                      className="flex items-center gap-2 text-[#E56E9B] font-bold hover:gap-4 transition-all"
                    >
                      Читать
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#E56E9B] to-[#FFB3BA] rounded-2xl p-12 text-center text-white max-w-4xl mx-auto"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Подпишитесь на рассылку</h2>
            <p className="text-xl mb-8 opacity-90">
              Получайте полезные статьи и советы прямо на почту
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#E56E9B] px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                Подписаться
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
