import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { api } from '@/app/api/client';

type HomeworkRow = {
  id: number;
  user_id: number;
  course_id: number;
  file_path: string;
  student_comment: string | null;
  score_percent: number | null;
  groomer_comment: string | null;
  status: string;
  user_name?: string;
  course_name?: string;
};

export function GroomerTeachingHomeworkPage() {
  const [search] = useSearchParams();
  const courseId = search.get('courseId');
  const userId = search.get('userId');
  const [rows, setRows] = useState<HomeworkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { score: string; comment: string }>>({});

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (courseId) q.set('course_id', courseId);
    if (userId) q.set('user_id', userId);
    return q.toString();
  }, [courseId, userId]);

  const load = async () => {
    setLoading(true);
    const res = await api.get<{ success?: boolean; data?: HomeworkRow[] }>(`/course_homework_submissions/groomer${query ? `?${query}` : ''}`);
    setLoading(false);
    if ('error' in res) return;
    const data = Array.isArray(res.data?.data) ? res.data.data : [];
    setRows(data);
    const next: Record<number, { score: string; comment: string }> = {};
    for (const row of data) {
      next[row.id] = { score: row.score_percent == null ? '' : String(row.score_percent), comment: row.groomer_comment ?? '' };
    }
    setDrafts(next);
  };

  useEffect(() => {
    void load();
  }, [query]);

  const saveReview = async (id: number) => {
    const d = drafts[id];
    if (!d) return;
    setSavingId(id);
    await api.put(`/course_homework_submissions/${id}/review`, {
      score_percent: Number(d.score || 0),
      groomer_comment: d.comment || null,
    });
    setSavingId(null);
    await load();
    window.dispatchEvent(new CustomEvent('homework:reviewed'));
  };

  return (
    <div className="p-6 md:p-8 space-y-4">
      <Link to="/dashboard-groomer/teaching" className="inline-flex items-center gap-2 text-[#40AB40]">
        <ArrowLeft className="w-4 h-4" />
        Назад к обучению
      </Link>
      <h1 className="text-2xl font-bold">Проверка домашних заданий</h1>

      {loading ? (
        <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#40AB40]" /></div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">Нет загруженных домашних заданий.</div>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl bg-white dark:bg-gray-800 p-5 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="text-sm text-gray-500">
                {row.user_name ?? `Пользователь #${row.user_id}`} · {row.course_name ?? `Курс #${row.course_id}`}
              </div>
              <a href={row.file_path} target="_blank" rel="noreferrer" className="text-[#40AB40] underline break-all">
                Открыть документ ученика
              </a>
              <p className="text-sm whitespace-pre-wrap">{row.student_comment || 'Комментарий ученика отсутствует.'}</p>
              <div className="flex gap-3 flex-wrap items-center">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={drafts[row.id]?.score ?? ''}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] ?? { score: '', comment: '' }), score: e.target.value } }))}
                  placeholder="Оценка %"
                  className="w-28 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <input
                  value={drafts[row.id]?.comment ?? ''}
                  onChange={(e) => setDrafts((prev) => ({ ...prev, [row.id]: { ...(prev[row.id] ?? { score: '', comment: '' }), comment: e.target.value } }))}
                  placeholder="Комментарий грумера"
                  className="min-w-[260px] flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => void saveReview(row.id)}
                  disabled={savingId === row.id}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#40AB40] text-white hover:bg-[#359635] disabled:opacity-50"
                >
                  {savingId === row.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Сохранить
                </button>
              </div>
              <p className="text-xs text-gray-500">Статус: {row.status === 'reviewed' ? 'Проверено' : 'Ожидает проверки'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
