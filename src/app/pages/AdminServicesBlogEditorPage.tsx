import React, { useMemo, useState } from 'react';
import { useEntity } from '@/app/hooks';
import { Loader2, PencilLine, Save, Trash2, Plus } from 'lucide-react';

type BlogPost = {
  id: number;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  read_time: string | null;
  image: string | null;
  published_at: string | null;
};

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Услуги',
  read_time: '7 мин',
  image: '/pictures/hero-section groom room services.jpg',
  published_at: '',
};

export function AdminServicesBlogEditorPage() {
  const { list, loadingList, loadingListError, refetchList, create, update, remove } = useEntity<BlogPost>('blog_posts', {
    fetchListOnMount: true,
    listParams: { limit: 200, category: 'Услуги' },
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const posts = useMemo(
    () => [...list].sort((a, b) => (new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())),
    [list]
  );
  const selected = useMemo(() => posts.find((p) => p.id === selectedId) ?? null, [posts, selectedId]);

  const pickPost = (post: BlogPost) => {
    setSelectedId(post.id);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Услуги',
      read_time: post.read_time || '7 мин',
      image: post.image || '/pictures/hero-section groom room services.jpg',
      published_at: post.published_at ? post.published_at.slice(0, 10) : '',
    });
  };

  const resetForm = () => {
    setSelectedId(null);
    setForm(EMPTY_FORM);
  };

  const onSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Заполните заголовок и содержание статьи.');
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      category: 'Услуги',
      read_time: form.read_time.trim() || '7 мин',
      image: form.image.trim() || null,
      published_at: form.published_at ? new Date(`${form.published_at}T09:00:00`) : new Date(),
    };
    if (selectedId) await update(selectedId, payload);
    else await create(payload);
    setSaving(false);
    await refetchList();
    if (!selectedId) resetForm();
    alert('Сохранено в БД.');
  };

  const onDelete = async () => {
    if (!selectedId) return;
    if (!confirm('Удалить статью из базы данных?')) return;
    await remove(selectedId);
    await refetchList();
    resetForm();
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-[#4A90E2]">Редактор статей услуг</h1>
      <p className="text-gray-500 dark:text-gray-400">Все изменения сохраняются напрямую в БД (`blog_posts`).</p>

      {loadingList ? (
        <div className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Загрузка...</div>
      ) : loadingListError ? (
        <p className="text-red-500">{loadingListError}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold">Статьи</h2>
              <button onClick={resetForm} className="inline-flex items-center gap-1 text-sm px-3 py-1 rounded-lg bg-[#4A90E2] text-white">
                <Plus className="w-4 h-4" /> Новая
              </button>
            </div>
            <div className="space-y-2 max-h-[70vh] overflow-auto">
              {posts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickPost(p)}
                  className={`w-full text-left p-3 rounded-xl border ${selectedId === p.id ? 'border-[#4A90E2] bg-[#4A90E2]/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40'}`}
                >
                  <p className="font-medium line-clamp-2">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.published_at ? new Date(p.published_at).toLocaleDateString('ru-RU') : '—'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg lg:col-span-2 space-y-4">
            <h2 className="font-bold text-xl flex items-center gap-2"><PencilLine className="w-5 h-5" /> {selectedId ? 'Редактирование' : 'Создание'} статьи</h2>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Заголовок" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
            <input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Краткое описание" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={form.read_time} onChange={(e) => setForm({ ...form, read_time: e.target.value })} placeholder="Время чтения (например 7 мин)" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
              <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
            </div>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/pictures/..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900" />
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={18} placeholder="HTML-контент статьи" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-sm" />
            <div className="flex gap-3">
              <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#4A90E2] text-white disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Сохранить
              </button>
              {selectedId ? (
                <button onClick={onDelete} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/20 text-red-600">
                  <Trash2 className="w-4 h-4" /> Удалить
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

